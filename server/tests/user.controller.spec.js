const { expect } = require('chai');
const request = require('supertest');
const express = require('express');
const sinon = require('sinon');

const User = require('../models/User');
const userService = require('../services/userService');
const router = require('../controllers/userController');

const app = express();
app.use(express.json());
app.use('/', router);

describe('User controller routes', function () {
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

      sinon.stub(userService, 'register').returns(expectedData);

      const response = await request(app).post('/register').send(userData);

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

      const response = await request(app).post('/register').send(userData);

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

      const response = await request(app).post('/login').send(loginData);

      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal(expectedData);
    });

    it('should return status 400 when login fails', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'testtesttest',
      };

      sinon.stub(userService, 'login').throws(new Error('Login failed!'));

      const response = await request(app).post('/login').send(loginData);

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('message');
    });
  });
});
