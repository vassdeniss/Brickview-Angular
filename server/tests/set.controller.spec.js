const express = require('express');
const request = require('supertest');
const sinon = require('sinon');
const { expect } = require('chai');

const setService = require('../services/setService');
const router = require('../controllers/setController');
const { mockedSetData } = require('./mockedData');

const app = express();
app.use('/', router);

describe('Set controller routes', function () {
  afterEach(() => {
    sinon.restore();
  });

  describe('GET /:setId', () => {
    it('should return set data and status 200 when a valid setId is provided', async () => {
      const setId = '12345';

      sinon.stub(setService, 'getWithMinifigs').resolves(mockedSetData);

      const response = await request(app).get(`/${setId}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal(mockedSetData);
    });

    it('should return status 404 and "Set not found!" message when setService throws an error', async () => {
      const setId = 'invalidId';

      sinon
        .stub(setService, 'getWithMinifigs')
        .rejects(new Error('Set not found!'));

      const response = await request(app).get(`/${setId}`);

      expect(response.status).to.equal(404);
      expect(response.text).to.equal('Set not found!');
    });
  });
});
