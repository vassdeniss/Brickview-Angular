const { expect } = require('chai');
const sinon = require('sinon');
const bcrypt = require('bcrypt');
const jwt = require('../lib/jwt');
const User = require('../models/User');

const rewire = require('rewire');
const service = rewire('../services/userService');

describe('User service methods', function () {
  let generateTokenStubResetter;
  const generateTokenStub = sinon.stub().returns({
    accessToken: 'access_token',
    refreshToken: 'refresh_token',
  });

  beforeEach(() => {
    generateTokenStubResetter = service.__set__(
      'generateToken',
      generateTokenStub
    );
  });

  afterEach(() => {
    generateTokenStubResetter();
    generateTokenStub.resetHistory();
    sinon.restore();
  });

  describe('register', () => {
    it('should create a new user and return a token', async () => {
      const userData = {
        username: 'testuser',
        password: 'testpassword',
      };

      const user = new User(userData);

      const createStub = sinon.stub(User, 'create').resolves(user);

      const result = await service.register(userData);

      expect(createStub.calledOnceWith(userData)).to.be.true;
      expect(generateTokenStub.calledOnceWith(user)).to.be.true;
      expect(result.accessToken).to.equal('access_token');
      expect(result.refreshToken).to.equal('refresh_token');
    });
  });

  describe('login', () => {
    it('should login with valid credentials and return a token', async () => {
      const userData = {
        username: 'testuser',
        password: 'testpassword',
      };

      const user = new User(userData);

      const findOneStub = sinon.stub(User, 'findOne').resolves(user);
      const compareStub = sinon.stub(bcrypt, 'compare').resolves(true);

      const result = await service.login(userData);

      expect(findOneStub.calledOnceWith({ email: userData.email })).to.be.true;
      expect(compareStub.calledOnceWith(userData.password, user.password)).to.be
        .true;
      expect(generateTokenStub.calledOnceWith(user)).to.be.true;
      expect(result.accessToken).to.equal('access_token');
      expect(result.refreshToken).to.equal('refresh_token');
    });

    it('should throw an error with non-existant email', async () => {
      const userData = {
        email: 'testEmail@email.com',
        password: 'testpassword',
      };

      sinon.stub(User, 'findOne').resolves(null);

      try {
        await service.login(userData);
        expect.fail('Expected an error to be thrown');
      } catch (error) {
        expect(error.message).to.equal('Invalid email or password!');
      }
    });

    it('should throw an error with invalid password', async () => {
      const userData = {
        email: 'testEmail@email.com',
        password: 'testpassword',
      };

      sinon.stub(User, 'findOne').resolves(userData);
      sinon.stub(bcrypt, 'compare').resolves(false);

      try {
        await service.login(userData);
        expect.fail('Expected an error to be thrown');
      } catch (error) {
        expect(error.message).to.equal('Invalid email or password!');
      }
    });
  });

  describe('generateToken', () => {
    it('should return a token for the user', async () => {
      generateTokenStubResetter();

      const userData = {
        username: 'testusername',
        email: 'testEmail@email.com',
        password: 'testpassword',
        repeatPassword: 'testpassword',
      };

      const user = new User(userData);

      const createStub = sinon.stub(User, 'create').resolves(user);
      const signStub = sinon
        .stub(jwt, 'sign')
        .onFirstCall()
        .resolves('access_token')
        .onSecondCall()
        .resolves('refresh_token');
      const saveStub = sinon.stub(user, 'save').resolves(true);

      const result = await service.register(userData);

      expect(createStub.calledOnceWith(userData)).to.be.true;
      expect(signStub.calledTwice).to.be.true;
      expect(saveStub.calledOnce).to.be.true;
      expect(result.accessToken).to.equal('access_token');
      expect(result.refreshToken).to.equal('refresh_token');
      expect(result._id).to.exist;
      expect(result.username).to.equal(user.username);
      expect(user.refreshToken).to.exist;
    });
  });
});
