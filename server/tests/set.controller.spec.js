const request = require('supertest');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chai = require('chai');
const { expect } = chai;

chai.use(sinonChai);

const setService = require('../services/setService');
const authMiddleware = require('../middlewares/auth');

let app;

describe('Set controller routes', function () {
  beforeEach(() => {
    sinon.stub(authMiddleware, 'mustBeAuth').callsFake((req, res, next) => {
      next();
    });

    app = require('../server');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('GET /logged-user-collection', () => {
    it('should return 200 with the user collection', async () => {
      // Arrange: set up stub
      sinon
        .stub(setService, 'getLoggedInUserCollection')
        .resolves({ mockData: 'collection' });

      // Act: call the endpoint
      const response = await request(app)
        .get('/sets/logged-user-collection')
        .set('X-Refresh', 'mockRefreshToken');

      // Assert: that correct status is returned
      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal({ mockData: 'collection' });
    });
  });

  describe('POST /add-set', () => {
    it('should return 204 if set is added successfully', async () => {
      // Arrange: set up stub
      sinon.stub(setService, 'addSet');

      // Act: call the endpoint
      const response = await request(app)
        .post('/sets/add-set')
        .set('X-Refresh', 'mockRefreshToken')
        .send({ setId: 'mockSetId' });

      // Assert: that correct status is returned
      expect(response.status).to.equal(204);
    });

    it('should return 404 if the set is not found', async () => {
      // Arrange: set up stub
      sinon.stub(setService, 'addSet').throws({
        statusCode: 404,
        message: 'Set not found!',
      });

      // Act: call the endpoint
      const response = await request(app)
        .post('/sets/add-set')
        .set('X-Refresh', 'mockRefreshToken')
        .send({ setId: 'mockSetId' });

      // Assert: that correct status is returned
      expect(response.status).to.equal(404);
      expect(response.body.message).to.equal('Set not found!');
    });
  });
});
