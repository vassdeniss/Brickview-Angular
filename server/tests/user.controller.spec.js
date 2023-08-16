const chai = require('chai');
const { expect } = chai;
const request = require('supertest');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);

const User = require('../models/User');
const userService = require('../services/userService');
const authMiddleware = require('../middlewares/auth');

let app;

describe('User controller routes', function () {
  beforeEach(() => {
    sinon.stub(authMiddleware, 'mustBeAuth').callsFake((req, res, next) => {
      next();
    });

    app = require('../server');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('POST /register', () => {
    it('should return status 200 when the user has been registered', async () => {
      // Arrange: create user data
      const userData = {
        username: 'test',
        email: 'test@example.com',
        password: 'testtesttest',
        repeatPassword: 'testtesttest',
      };

      const user = new User(userData);
      const expectedData = {
        _id: user._id.toString(),
        email: user.email,
        username: user.username,
        accessToken: 'aToken',
        refreshToken: 'rToken',
      };

      sinon.stub(userService, 'register').resolves(expectedData);

      // Act: make request
      const response = await request(app)
        .post('/users/register')
        .send(userData);

      // Assert: that correct status is returned
      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal(expectedData);
    });

    it('should save image when image is provided', async () => {
      // Arrange: create user data
      const userData = {
        username: 'test',
        email: 'test@example.com',
        password: 'testtesttest',
        repeatPassword: 'testtesttest',
        image: 'data:image/png;base64,base64String',
      };

      const user = new User(userData);
      const expectedData = {
        _id: user._id.toString(),
        email: user.email,
        username: user.username,
        accessToken: 'aToken',
        refreshToken: 'rToken',
        image: 'image',
      };

      sinon.stub(userService, 'register').resolves(expectedData);

      // Act: make request
      const response = await request(app)
        .post('/users/register')
        .send(userData);

      // Assert: that correct status is returned
      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal(expectedData);
    });

    it('should return status 400 when registration fails', async () => {
      // Arrange: create user data
      const userData = {
        username: 'test',
        email: 'test@example.com',
        password: 'testtesttest',
        repeatPassword: 'testtesttest',
      };

      sinon
        .stub(userService, 'register')
        .throws(new Error('Registration failed!'));

      // Act: make request
      const response = await request(app)
        .post('/users/register')
        .send(userData);

      // Assert: that correct status is returned
      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('message');
    });
  });

  describe('POST /login', () => {
    it('should return status 200 when the user has logged in', async () => {
      // Arrange: create login data
      const loginData = {
        email: 'test@example.com',
        password: 'testtesttest',
      };

      const expectedData = {
        _id: 'someId',
        email: 'test@example.com',
        username: 'someUsername',
        accessToken: 'aToken',
        refreshToken: 'rToken',
      };

      sinon.stub(userService, 'login').returns(expectedData);

      // Act: make request
      const response = await request(app).post('/users/login').send(loginData);

      // Assert: that correct status is returned
      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal(expectedData);
    });

    it('should return status 400 when login fails', async () => {
      // Arrange: create login data
      const loginData = {
        email: 'test@example.com',
        password: 'testtesttest',
      };

      sinon.stub(userService, 'login').throws(new Error('Login failed!'));

      // Act: make request
      const response = await request(app).post('/users/login').send(loginData);

      // Assert: that correct status is returned
      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('message');
    });
  });

  describe('GET /logout', () => {
    it('should return a 204 status when logout succeeds', async () => {
      // Arrange: create stubs
      const logoutStub = sinon.stub(userService, 'logout');
      const refreshHeader = 'some-refresh-token';

      // Act: make request
      const response = await request(app)
        .get('/users/logout')
        .set('X-Refresh', refreshHeader);

      // Assert: that correct status is returned
      expect(response.status).to.equal(204);
      expect(logoutStub).to.have.been.calledOnceWith(refreshHeader);
    });
  });
});
