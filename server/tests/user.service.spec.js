const { expect } = require('chai');
const sinon = require('sinon');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const rewire = require('rewire');
const service = rewire('../services/userService');

describe('User service methods', function () {
  const generateTokenStub = sinon.stub().returns({
    accessToken: 'access_token',
    refreshToken: 'refresh_token',
  });

  beforeEach(() => {
    service.__set__('generateToken', generateTokenStub);
  });

  afterEach(() => {
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

      expect(findOneStub.calledOnceWith({ username: userData.username })).to.be
        .true;
      expect(compareStub.calledOnceWith(userData.password, user.password)).to.be
        .true;
      expect(generateTokenStub.calledOnceWith(user)).to.be.true;
      expect(result.accessToken).to.equal('access_token');
      expect(result.refreshToken).to.equal('refresh_token');
    });

    it('should throw an error with invalid username', async () => {
      const userData = {
        username: 'testuser',
        password: 'testpassword',
      };

      sinon.stub(User, 'findOne').resolves(null);

      try {
        await service.login(userData);
        expect.fail('Expected an error to be thrown');
      } catch (error) {
        expect(error.message).to.equal('Invalid username or password!');
      }
    });

    it('should throw an error with invalid password', async () => {
      const userData = {
        username: 'testuser',
        password: 'testpassword',
      };

      sinon.stub(User, 'findOne').resolves(userData);
      sinon.stub(bcrypt, 'compare').resolves(false);

      try {
        await service.login(userData);
        expect.fail('Expected an error to be thrown');
      } catch (error) {
        expect(error.message).to.equal('Invalid username or password!');
      }
    });
  });
});
