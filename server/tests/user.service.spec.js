const { expect } = require('chai');
const sinon = require('sinon');
const jwt = require('../lib/jwt');
const bcrypt = require('bcrypt');

const User = require('../models/User');
const minioService = require('../services/minioService');
const userService = require('../services/userService');

describe('userService', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    process.env.JWT_SECRET = 'test-secret';
  });

  afterEach(() => {
    sandbox.restore();
  });

  function makeSetDoc(fields = {}) {
    return {
      ...fields,
      toObject() {
        return { ...fields };
      },
    };
  }

  describe('register', () => {
    let userData;
    let createdUser;
    let signStub;
    let saveUserImageStub;
    beforeEach(() => {
      userData = {
        username: 'john',
        email: 'john@example.com',
        password: 'hashed',
      };
      createdUser = {
        _id: 'u1',
        username: 'john',
        email: 'john@example.com',
        sets: [makeSetDoc({ setNum: '1', review: null })],
        save: sandbox.stub().resolves(),
      };
      sandbox.stub(User, 'create').resolves(createdUser);
      signStub = sandbox.stub(jwt, 'sign');
      signStub.onCall(0).resolves('access-token');
      signStub.onCall(1).resolves('refresh-token');
      saveUserImageStub = sandbox.stub(minioService, 'saveUserImage').resolves();
    });

    it('should create user, generate tokens, and save image if provided', async () => {
      userData.image = `data:image/png;base64,${Buffer.from('abc').toString('base64')}`;

      const res = await userService.register(userData);

      expect(User.create.calledOnceWith(userData)).to.be.true;
      expect(signStub.calledTwice).to.be.true;
      expect(createdUser.refreshToken).to.equal('refresh-token');
      expect(createdUser.save.calledOnce).to.be.true;
      expect(saveUserImageStub.calledOnce).to.be.true;
      const [key, fileBuf] = saveUserImageStub.firstCall.args;
      expect(key).to.equal('johnexamplecom');
      expect(Buffer.isBuffer(fileBuf)).to.equal(true);
      expect(res).to.deep.equal({
        tokens: { accessToken: 'access-token', refreshToken: 'refresh-token' },
        user: {
          _id: 'u1',
          username: 'john',
          email: 'john@example.com',
          sets: [{ setNum: '1', review: false }], // toPublicUser adds boolean review
        },
      });
    });

    it('should not save image when none provided', async () => {
      const res = await userService.register(userData);

      expect(saveUserImageStub.notCalled).to.be.true;
      expect(res.tokens.accessToken).to.equal('access-token');
    });
  });

  describe('login', () => {
    it('should login successfully, generate tokens, and return user + image', async () => {
      const userDoc = {
        _id: 'u1',
        username: 'john',
        email: 'john@example.com',
        password: 'bcrypt-hash',
        sets: [makeSetDoc({ setNum: '1', review: 'text' })],
        save: sandbox.stub().resolves(),
      };

      const populateStub = sandbox.stub().resolves(userDoc);
      sandbox.stub(User, 'findOne').returns({ populate: populateStub });

      sandbox.stub(bcrypt, 'compare').resolves(true);

      const signStub = sandbox.stub(jwt, 'sign');
      signStub.onCall(0).resolves('access-token');
      signStub.onCall(1).resolves('refresh-token');

      sandbox.stub(minioService, 'getUserImage').resolves('img-data');

      const res = await userService.login(
        { username: 'John', password: 'pass' },
        'en'
      );

      expect(User.findOne.calledOnce).to.be.true;
      expect(User.findOne.firstCall.args[0]).to.deep.equal({
        normalizedUsername: 'john',
      });
      expect(bcrypt.compare.calledOnceWith('pass', userDoc.password)).to.be.true;
      expect(userDoc.refreshToken).to.equal('refresh-token');
      expect(userDoc.save.calledOnce).to.be.true;
      expect(minioService.getUserImage.calledOnceWith('johnexamplecom')).to.be.true;
      expect(res).to.deep.equal({
        tokens: { accessToken: 'access-token', refreshToken: 'refresh-token' },
        user: {
          _id: 'u1',
          username: 'john',
          email: 'john@example.com',
          sets: [{ setNum: '1', review: true }],
        },
        image: 'img-data',
      });
    });

    it('should throw 401 with localized message on invalid creds (user not found)', async () => {
      const populateStub = sandbox.stub().resolves(null);
      sandbox.stub(User, 'findOne').returns({ populate: populateStub });

      const compareStub = sandbox.stub(bcrypt, 'compare').resolves(false);

      try {
        await userService.login({ username: 'Nope', password: 'x' }, 'bg');
        throw new Error('Expected error not thrown');
      } catch (err) {
        expect(err).to.be.instanceOf(Error);
        expect(err.statusCode).to.equal(401);
        expect(err.message).to.equal('Невалидно потребителско име или парола!');
      }

      expect(compareStub.calledOnce).to.be.true;
      const [, hashUsed] = compareStub.firstCall.args;
      expect(hashUsed).to.be.a('string');
    });

    it('should throw 401 with localized message on invalid creds (wrong password)', async () => {
      const userDoc = {
        _id: 'u1',
        username: 'john',
        email: 'john@example.com',
        password: 'bcrypt-hash',
        sets: [],
      };

      const populateStub = sandbox.stub().resolves(userDoc);
      sandbox.stub(User, 'findOne').returns({ populate: populateStub });

      sandbox.stub(bcrypt, 'compare').resolves(false);

      try {
        await userService.login({ username: 'john', password: 'bad' }, 'en');
        throw new Error('Expected error not thrown');
      } catch (err) {
        expect(err.statusCode).to.equal(401);
        expect(err.message).to.equal('Invalid username or password!');
      }
    });
  });

  describe('generateToken (exported)', () => {
    it('should sign access+refresh tokens and persist refreshToken on user', async () => {
      const userDoc = {
        _id: 'u1',
        username: 'john',
        email: 'john@example.com',
        save: sandbox.stub().resolves(),
      };

      const signStub = sandbox.stub(jwt, 'sign');
      signStub.onCall(0).resolves('access-token');
      signStub.onCall(1).resolves('refresh-token');

      const res = await userService.generateToken(userDoc);

      expect(res).to.deep.equal({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });

      expect(userDoc.refreshToken).to.equal('refresh-token');
      expect(userDoc.save.calledOnce).to.be.true;
      expect(signStub.firstCall.args[2]).to.deep.include({ expiresIn: '15m' });
      expect(signStub.secondCall.args[2]).to.deep.include({ expiresIn: '7d' });
    });
  });

  describe('validateRefreshToken', () => {
    it('should return user when refreshToken exists', async () => {
      const userDoc = { _id: 'u1' };
      sandbox.stub(User, 'findOne').resolves(userDoc);

      const res = await userService.validateRefreshToken('rt');

      expect(User.findOne.calledOnceWith({ refreshToken: 'rt' })).to.be.true;
      expect(res).to.equal(userDoc);
    });

    it('should throw when refreshToken is invalid', async () => {
      sandbox.stub(User, 'findOne').resolves(null);

      try {
        await userService.validateRefreshToken('bad');
        throw new Error('Expected error not thrown');
      } catch (err) {
        expect(err).to.be.instanceOf(Error);
        expect(err.message).to.equal('Invalid refresh token!');
      }
    });
  });

  describe('logout', () => {
    it('should clear refreshToken and save user when found', async () => {
      const userDoc = {
        refreshToken: 'rt',
        save: sandbox.stub().resolves('saved'),
      };
      sandbox.stub(User, 'findOne').resolves(userDoc);

      const res = await userService.logout('rt');

      expect(User.findOne.calledOnceWith({ refreshToken: 'rt' })).to.be.true;
      expect(userDoc.refreshToken).to.equal('');
      expect(userDoc.save.calledOnce).to.be.true;
      expect(res).to.equal('saved');
    });

    it('should do nothing when user not found', async () => {
      sandbox.stub(User, 'findOne').resolves(null);

      const res = await userService.logout('rt');

      expect(res).to.equal(undefined);
    });
  });

  describe('editData', () => {
    it('should throw 404 if user not found', async () => {
      const populateStub = sandbox.stub().resolves(null);
      sandbox.stub(User, 'findOne').returns({ populate: populateStub });

      try {
        await userService.editData({ username: 'x' }, 'bad-refresh');
        throw new Error('Expected error not thrown');
      } catch (err) {
        expect(err.statusCode).to.equal(404);
        expect(err.message).to.equal('User not found!');
      }
    });

    it('should delete profile picture when deleteProfilePicture is true', async () => {
      const userDoc = {
        _id: 'u1',
        username: 'old',
        normalizedUsername: 'old',
        email: 'john@example.com',
        sets: [makeSetDoc({ setNum: '1', review: null })],
        save: sandbox.stub().resolves(),
      };

      const populateStub = sandbox.stub().resolves(userDoc);
      sandbox.stub(User, 'findOne').returns({ populate: populateStub });

      const delStub = sandbox.stub(minioService, 'deleteImage').resolves();
      const saveImgStub = sandbox.stub(minioService, 'saveUserImage').resolves();

      const res = await userService.editData(
        { username: 'NewName', deleteProfilePicture: true },
        'rt'
      );

      expect(userDoc.username).to.equal('NewName');
      expect(userDoc.normalizedUsername).to.equal('newname');
      expect(delStub.calledOnce).to.be.true;
      expect(saveImgStub.notCalled).to.be.true;
      expect(res.user.username).to.equal('NewName');
      expect(res).to.have.property('image', undefined);
    });

    it('should save profile picture when provided', async () => {
      const userDoc = {
        _id: 'u1',
        username: 'old',
        normalizedUsername: 'old',
        email: 'john@example.com',
        sets: [makeSetDoc({ setNum: '1', review: null })],
        save: sandbox.stub().resolves(),
      };

      const populateStub = sandbox.stub().resolves(userDoc);
      sandbox.stub(User, 'findOne').returns({ populate: populateStub });

      sandbox.stub(minioService, 'deleteImage').resolves();

      const saveImgStub = sandbox.stub(minioService, 'saveUserImage').resolves();

      const dataUrl = `data:image/png;base64,${Buffer.from('hello').toString('base64')}`;

      const res = await userService.editData(
        { username: 'NewName', profilePicture: dataUrl, deleteProfilePicture: false },
        'rt'
      );

      expect(saveImgStub.calledOnce).to.be.true;
      const [key, buf] = saveImgStub.firstCall.args;
      expect(key).to.equal('johnexamplecom');
      expect(Buffer.isBuffer(buf)).to.equal(true);

      expect(res.image).to.equal(dataUrl);
      expect(res.user.username).to.equal('NewName');
    });
  });
});
