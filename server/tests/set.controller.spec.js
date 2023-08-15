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

  describe('POST /add-set', () => {
    it('should return 200 with user if set is added successfully', async () => {
      // Arrange: set up stub
      sinon.stub(setService, 'addSet').resolves({
        user: {},
      });

      // Act: call the endpoint
      const response = await request(app)
        .post('/sets/add-set')
        .set('X-Refresh', 'mockRefreshToken')
        .send({ setId: 'mockSetId' });

      // Assert: that correct status is returned
      expect(response.status).to.equal(200);
      expect(response.body.user).to.exist;
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

    it('should return 409 if the set already exists', async () => {
      // Arrange: set up stub
      sinon.stub(setService, 'addSet').throws({
        statusCode: 409,
        message: 'Set already exists in collection!',
      });

      // Act: call the endpoint
      const response = await request(app)
        .post('/sets/add-set')
        .set('X-Refresh', 'mockRefreshToken')
        .send({ setId: 'mockSetId' });

      // Assert: that correct status is returned
      expect(response.status).to.equal(409);
      expect(response.body.message).to.equal(
        'Set already exists in collection!'
      );
    });
  });
});
