const chai = require('chai');
const { expect } = chai;
const request = require('supertest');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);

const User = require('../models/User');
const userService = require('../services/userService');
const minioService = require('../services/minioService');
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

      const response = await request(app)
        .post('/users/register')
        .send(userData);

      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal(expectedData);
    });

    it('should save image when image is provided', async () => {
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

      const response = await request(app)
        .post('/users/register')
        .send(userData);

      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal(expectedData);
    });

    it('should return status 400 when registration fails', async () => {
      const userData = {
        username: 'test',
        email: 'test@example.com',
        password: 'testtesttest',
        repeatPassword: 'testtesttest',
      };

      sinon
        .stub(userService, 'register')
        .throws(new Error('Registration failed!'));

      const response = await request(app)
        .post('/users/register')
        .send(userData);

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('message');
    });
  });

  describe('POST /login', () => {
    it('should return status 200 when the user has logged in', async () => {
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

      const response = await request(app).post('/users/login').send(loginData);

      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal(expectedData);
    });

    it('should return status 400 when login fails', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'testtesttest',
      };

      sinon.stub(userService, 'login').throws(new Error('Login failed!'));

      const response = await request(app).post('/users/login').send(loginData);

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('message');
    });
  });

  describe('GET /logout', () => {
    it('should return a 204 status when logout succeeds', async () => {
      const logoutStub = sinon.stub(userService, 'logout');
      const refreshHeader = 'some-refresh-token';

      const response = await request(app)
        .get('/users/logout')
        .set('X-Refresh', refreshHeader);

      expect(response.status).to.equal(204);
      expect(logoutStub).to.have.been.calledOnceWith(refreshHeader);
    });
  });

  describe('GET /get-logged-user', () => {
    it('should return status 200 when the user is found', async () => {
      const userData = {
        username: 'test',
        email: 'test@example.com',
      };
      const refreshHeader = 'some-refresh-token';

      sinon.stub(userService, 'getLoggedInUser').resolves(userData);

      const response = await request(app)
        .get('/users/get-logged-user')
        .set('X-Refresh', refreshHeader);

      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal(userData);
    });

    it('should return status 404 when user is not found', async () => {
      const userData = {
        username: 'test',
        email: 'test@example.com',
      };
      const refreshHeader = 'some-refresh-token';

      sinon
        .stub(userService, 'getLoggedInUser')
        .throws(new Error('User not found!'));

      const response = await request(app)
        .get('/users/get-logged-user')
        .set('X-Refresh', refreshHeader);

      expect(response.status).to.equal(404);
      expect(response.body).to.have.property('message');
    });
  });
});
