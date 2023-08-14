const { expect } = require('chai');
const sinon = require('sinon');
const bcrypt = require('bcrypt');
const jwt = require('../lib/jwt');
const User = require('../models/User');
const minioService = require('../services/minioService');

const rewire = require('rewire');
const service = rewire('../services/userService');

describe('User service methods', function () {
  afterEach(() => {
    sinon.restore();
  });

  describe('register', () => {
    it('should create a new user and return a token (with image)', async () => {
      // Arrange: mock data, create stubs
      const userData = {
        username: 'testuser',
        email: 'testuser@mail.com',
        password: 'testpassword',
        repeatPassword: 'testpassword',
        image: 'data:image/png;base64,base64String',
      };
      const user = new User(userData);
      const createStub = sinon.stub(User, 'create').resolves(user);
      const generateTokenStub = sinon.stub().resolves({
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
      });
      const generateTokenStubResetter = service.__set__(
        'generateToken',
        generateTokenStub
      );
      const saveUserImageStub = sinon.stub(minioService, 'saveUserImage');

      const result = await service.register(userData);

      // Assert: check if methods were called
      expect(createStub.calledOnceWith(userData)).to.be.true;
      expect(generateTokenStub.calledOnceWith(user)).to.be.true;
      expect(
        saveUserImageStub.calledOnceWith(
          'testusermailcom',
          Buffer.from('base64String', 'base64')
        )
      ).to.be.true;
      expect(result.tokens.accessToken).to.equal('access_token');
      expect(result.tokens.refreshToken).to.equal('refresh_token');
      expect(result.user).to.deep.equal({
        _id: user._id,
        username: user.username,
        email: user.email,
        sets: user.sets,
      });

      generateTokenStubResetter();
    });

    it('should create a new user and return a token (no image)', async () => {
      // Arrange: mock data, create stubs
      const userData = {
        username: 'testuser',
        email: 'testuser@mail.com',
        password: 'testpassword',
        repeatPassword: 'testpassword',
      };
      const user = new User(userData);
      const createStub = sinon.stub(User, 'create').resolves(user);
      const generateTokenStub = sinon.stub().resolves({
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
      });
      const generateTokenStubResetter = service.__set__(
        'generateToken',
        generateTokenStub
      );

      // Act: call the method
      const result = await service.register(userData);

      // Assert: check if methods were called
      expect(createStub.calledOnceWith(userData)).to.be.true;
      expect(generateTokenStub.calledOnceWith(user)).to.be.true;
      expect(result.tokens.accessToken).to.equal('access_token');
      expect(result.tokens.refreshToken).to.equal('refresh_token');
      expect(result.user).to.deep.equal({
        _id: user._id,
        username: user.username,
        email: user.email,
        sets: user.sets,
      });

      generateTokenStubResetter();
    });
  });

  describe('login', () => {
    let userData;
    let findOneStub;
    beforeEach(() => {
      userData = {
        _id: 'some-id',
        username: 'testuser',
        email: 'testuser@mail.com',
        sets: [],
        password: 'testpassword',
      };
      findOneStub = sinon.stub(User, 'findOne').returns({
        populate: sinon.stub().resolves(userData),
      });
    });

    it('should login with valid credentials and return a token (with image)', async () => {
      // Arrange: create stubs
      const compareStub = sinon.stub(bcrypt, 'compare').resolves(true);
      const generateTokenStub = sinon.stub().returns({
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
      });
      const generateTokenStubResetter = service.__set__(
        'generateToken',
        generateTokenStub
      );
      const getUserImageStub = sinon
        .stub(minioService, 'getUserImage')
        .resolves('data:image/png;base64,image');

      // Act: call the method
      const result = await service.login(userData);

      // Assert: check if methods were called
      expect(
        findOneStub.calledOnceWith({
          normalizedUsername: userData.username.toLowerCase(),
        })
      ).to.be.true;
      expect(compareStub.calledOnceWith(userData.password, userData.password))
        .to.be.true;
      expect(generateTokenStub.calledOnceWith(userData)).to.be.true;
      expect(getUserImageStub.calledOnceWith('testusermailcom')).to.be.true;
      expect(result.tokens.accessToken).to.equal('access_token');
      expect(result.tokens.refreshToken).to.equal('refresh_token');
      expect(result.user).to.deep.equal({
        _id: userData._id,
        username: userData.username,
        email: userData.email,
        sets: userData.sets,
      });
      expect(result.image).to.equal('data:image/png;base64,image');

      generateTokenStubResetter();
    });

    it('should login with valid credentials and return a token (no image)', async () => {
      // Arrange: create stubs
      const compareStub = sinon.stub(bcrypt, 'compare').resolves(true);
      const generateTokenStub = sinon.stub().returns({
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
      });
      const generateTokenStubResetter = service.__set__(
        'generateToken',
        generateTokenStub
      );
      const getUserImageStub = sinon
        .stub(minioService, 'getUserImage')
        .resolves(null);

      // Act: call the method
      const result = await service.login(userData);

      // Assert: check if methods were called
      expect(
        findOneStub.calledOnceWith({
          normalizedUsername: userData.username.toLowerCase(),
        })
      ).to.be.true;
      expect(compareStub.calledOnceWith(userData.password, userData.password))
        .to.be.true;
      expect(generateTokenStub.calledOnceWith(userData)).to.be.true;
      expect(getUserImageStub.calledOnceWith('testusermailcom')).to.be.true;
      expect(result.tokens.accessToken).to.equal('access_token');
      expect(result.tokens.refreshToken).to.equal('refresh_token');
      expect(result.user).to.deep.equal({
        _id: userData._id,
        username: userData.username,
        email: userData.email,
        sets: userData.sets,
      });
      expect(result.image).to.be.null;

      generateTokenStubResetter();
    });

    it('should throw an error with non-existant email', async () => {
      // Arrange: reate stubs
      findOneStub.restore();
      sinon.stub(User, 'findOne').returns({
        populate: sinon.stub().resolves(null),
      });

      // Act+Assert: call the method, error was thrown
      try {
        await service.login(userData);
        expect.fail('Expected an error to be thrown');
      } catch (error) {
        expect(error.message).to.equal('Invalid username or password!');
      }
    });

    it('should throw an error with invalid password', async () => {
      // Arrange: create stubs
      sinon.stub(bcrypt, 'compare').resolves(false);

      // Act+Assert: call the method, error was thrown
      try {
        await service.login(userData);
        expect.fail('Expected an error to be thrown');
      } catch (error) {
        expect(error.message).to.equal('Invalid username or password!');
      }
    });
  });

  describe('logout', () => {
    it('should clear the refreshToken field and save the user', async () => {
      // Arrange: mock data, create stubs
      const user = {
        refreshToken: 'oldRefreshToken',
        save: sinon.stub().resolves({ refreshToken: '' }),
      };
      const findOneStub = sinon.stub(User, 'findOne').resolves(user);

      // Act: call the method
      const result = await service.logout('oldRefreshToken');

      // Assert: check if methods were called
      expect(findOneStub.calledOnceWith({ refreshToken: 'oldRefreshToken' })).to
        .be.true;
      expect(user.refreshToken).to.equal('');
      expect(user.save.calledOnce).to.be.true;
      expect(result).to.deep.equal({ refreshToken: '' });
    });

    it('should return if user is not found', async () => {
      // Arrange: mock data, create stubs
      const findOneStub = sinon.stub(User, 'findOne').resolves(null);

      // Act: call the method
      const result = await service.logout('oldRefreshToken');

      // Assert: check if methods were called
      expect(findOneStub.calledOnceWith({ refreshToken: 'oldRefreshToken' })).to
        .be.true;
      expect(result).to.be.undefined;
    });
  });

  describe('generateToken', () => {
    it('should return a token for the user', async () => {
      // Arrange: mock data, create stubs
      const userData = {
        username: 'testusername',
        email: 'testEmail@email.com',
        password: 'testpassword',
        repeatPassword: 'testpassword',
      };
      const user = new User(userData);
      const signStub = sinon
        .stub(jwt, 'sign')
        .onFirstCall()
        .resolves('access_token')
        .onSecondCall()
        .resolves('refresh_token');
      const saveStub = sinon.stub(user, 'save').resolves(true);

      // Act: call the method
      const result = await service.generateToken(user);

      // Assert: check if methods were called
      expect(signStub.calledTwice).to.be.true;
      expect(saveStub.calledOnce).to.be.true;
      expect(result.accessToken).to.equal('access_token');
      expect(result.refreshToken).to.equal('refresh_token');
      expect(user.refreshToken).to.exist;
      expect(user.refreshToken).to.equal('refresh_token');
    });
  });

  describe('validateRefreshToken', () => {
    it('should return the user if the refresh token is valid', async () => {
      // Arrange: mock data, create stubs
      const mockUser = {
        name: 'John Doe',
        refreshToken: 'valid-refresh-token',
      };
      const findOneStub = sinon.stub(User, 'findOne').resolves(mockUser);

      // Act: call the method
      const result = await service.validateRefreshToken('valid-refresh-token');

      // Assert: check if methods were called
      expect(
        findOneStub.calledOnceWith({ refreshToken: 'valid-refresh-token' })
      ).to.be.true;
      expect(result).to.equal(mockUser);
    });

    it('should throw an error if the refresh token is invalid', async () => {
      // Arrange: mock data, create stubs
      sinon.stub(User, 'findOne').resolves(null);
      const refreshToken = 'invalid-refresh-token';

      // Act+Assert: call the method, error was thrown
      try {
        await service.validateRefreshToken(refreshToken);
        expect.fail('Expected an error to be thrown');
      } catch (error) {
        expect(error).to.be.instanceOf(Error);
        expect(error.message).to.equal('Invalid refresh token!');
      }
    });
  });

  describe('editData', () => {
    let findOneStub;
    let deleteImageStub;
    let saveUserImageStub;
    let refreshToken;
    let profileData;

    beforeEach(() => {
      findOneStub = sinon.stub(User, 'findOne').returns({
        populate: sinon.stub().resolves({
          email: 'test@example.com',
          save: sinon.stub().resolves(),
        }),
      });
      deleteImageStub = sinon.stub(minioService, 'deleteImage');
      saveUserImageStub = sinon.stub(minioService, 'saveUserImage');
      refreshToken = 'refreshToken';
      profileData = {
        username: 'newUsername',
        profilePicture: 'data:image/jpeg;base64,base64data',
        deleteProfilePicture: false,
      };
    });

    it('should edit user data and save', async () => {
      // Arrange:

      // Act: call the method
      await service.editData(profileData, refreshToken);

      // Assert: check if methods were called
      expect(findOneStub).to.have.been.calledOnceWith({ refreshToken });
      expect(deleteImageStub).to.have.not.been.called;
      expect(saveUserImageStub).to.have.been.calledOnceWith('testexamplecom');
    });

    it('should delete profile picture', async () => {
      // Arrange: change delete profile pic to true
      profileData.deleteProfilePicture = true;

      // Act: call the method
      await service.editData(profileData, refreshToken);

      // Assert: check if methods were called
      expect(findOneStub).to.have.been.calledOnceWith({ refreshToken });
      expect(saveUserImageStub).to.have.not.been.called;
      expect(deleteImageStub).to.have.been.calledOnceWith('testexamplecom');
    });
  });
});
