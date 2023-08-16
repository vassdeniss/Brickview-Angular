const chai = require('chai');
const { expect } = chai;
const request = require('supertest');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const dbHandler = require('./db-handler');
require('dotenv').config();

chai.use(sinonChai);

//const User = require('../models/User');
const minioService = require('../../services/minioService');
//const authMiddleware = require('../middlewares/auth');

let app;

describe('User API', function () {
  before(async () => {
    await dbHandler.connect();
    // sinon.stub(authMiddleware, 'mustBeAuth').callsFake((req, res, next) => {
    //   next();
    // });
    app = require('../../server');
  });

  afterEach(async () => {
    await dbHandler.clearDatabase();
    sinon.restore();
  });

  this.afterAll(async () => {
    await dbHandler.closeDatabase();
  });

  describe('POST /register', () => {
    let userData;

    beforeEach(() => {
      userData = {
        username: 'test',
        email: 'test@example.com',
        password: 'testtesttest',
        repeatPassword: 'testtesttest',
      };
    });

    it('should return status 200 when the user has been registered', async () => {
      // Arrange:

      // Act: call endpoint
      const response = await request(app)
        .post('/users/register')
        .send(userData);

      // Assert: that correct status and data is returned
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('tokens');
      expect(response.body.tokens).to.have.property('accessToken');
      expect(response.body.tokens).to.have.property('refreshToken');
      expect(response.body).to.have.property('user');
      expect(response.body.user).to.have.property('_id');
      expect(response.body.user).to.have.property('username');
      expect(response.body.user).to.have.property('email');
      expect(response.body.user).to.have.property('sets');
    });

    it('should save image when image is provided', async () => {
      // Arrange: create user image, stub minio
      userData.image = 'data:image/png;base64,base64String';
      const saveUserImageStub = sinon
        .stub(minioService, 'saveUserImage')
        .resolves();

      // Act: call endpoint
      const response = await request(app)
        .post('/users/register')
        .send(userData);

      // Assert: that correct status is returned
      expect(saveUserImageStub).to.have.been.calledOnceWith(
        userData.email.replace(/[.@]/g, ''),
        Buffer.from('base64String', 'base64')
      );
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('tokens');
      expect(response.body.tokens).to.have.property('accessToken');
      expect(response.body.tokens).to.have.property('refreshToken');
      expect(response.body).to.have.property('user');
      expect(response.body.user).to.have.property('_id');
      expect(response.body.user).to.have.property('username');
      expect(response.body.user).to.have.property('email');
      expect(response.body.user).to.have.property('sets');
    });

    it('should return status 400 when registration fails', async () => {
      // Arrange: create invalid user data
      userData.repeatPassword = '';

      // Act: call endpoint
      const response = await request(app)
        .post('/users/register')
        .send(userData);

      // Assert: that correct status is returned
      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('message');
    });
  });

  describe('POST /login', () => {
    let guest;
    let loginData;

    beforeEach(async () => {
      guest = {
        username: 'guest',
        email: 'guest@mail.com',
        password: '123456789',
        repeatPassword: '123456789',
      };
      loginData = {
        username: guest.username,
        password: guest.password,
      };

      await request(app).post('/users/register').send(guest);
    });

    it('should return status 200 when the user has logged in', async () => {
      // Arrange: create minio stub
      const getUserImageStub = sinon
        .stub(minioService, 'getUserImage')
        .resolves({
          image: 'image',
        });

      // Act: call endpoint
      const response = await request(app).post('/users/login').send(loginData);

      // Assert: that correct status is returned
      expect(getUserImageStub).to.have.been.calledOnceWith(
        guest.email.replace(/[.@]/g, '')
      );
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('tokens');
      expect(response.body.tokens).to.have.property('accessToken');
      expect(response.body.tokens).to.have.property('refreshToken');
      expect(response.body).to.have.property('user');
      expect(response.body.user).to.have.property('_id');
      expect(response.body.user).to.have.property('username');
      expect(response.body.user).to.have.property('email');
      expect(response.body.user).to.have.property('sets');
      expect(response.body).to.have.property('image');
    });

    it('should return status 400 when login fails', async () => {
      // Arrange: create invalid login
      loginData.password = 'wrongpassword';

      // Act: call endpoint
      const response = await request(app).post('/users/login').send(loginData);

      // Assert: that correct status is returned
      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.equal('Invalid username or password!');
    });
  });

  describe('GET /logout', () => {
    let guest;
    let accessToken;
    let refreshToken;

    beforeEach(async () => {
      guest = {
        username: 'guest',
        email: 'guest@mail.com',
        password: '123456789',
        repeatPassword: '123456789',
      };

      const response = await request(app).post('/users/register').send(guest);
      accessToken = response.body.tokens.accessToken;
      refreshToken = response.body.tokens.refreshToken;
    });

    it('should return a 204 status when logout succeeds', async () => {
      // Arrange:

      // Act: call endpoint
      const response = await request(app)
        .get('/users/logout')
        .set('X-Authorization', accessToken)
        .set('X-Refresh', refreshToken);

      // Assert: that correct status is returned
      expect(response.status).to.equal(204);
    });

    it('should return a 401 status when not authorized', async () => {
      // Arrange: delete access token
      accessToken = '';

      // Act: call endpoint
      const response = await request(app)
        .get('/users/logout')
        .set('X-Authorization', accessToken);

      // Assert: that correct status is returned
      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.equal('You are not authorized!');
    });
  });
});
