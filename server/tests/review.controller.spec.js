const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');

const reviewService = require('../services/reviewService');
const authMiddleware = require('../middlewares/auth');

let app;

describe('Review controller routes', function () {
  beforeEach(() => {
    sinon.stub(authMiddleware, 'mustBeAuth').callsFake((req, res, next) => {
      next();
    });

    app = require('../server');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('POST /create', () => {
    it('should return status 204 when the review has been created', async () => {
      // Arrange: set up data, stubs
      const reviewData = {
        buildExperience: 'some build experience',
      };

      sinon.stub(reviewService, 'addReview').resolves();

      // Act: call the endpoint
      const response = await request(app)
        .post('/reviews/create')
        .send(reviewData)
        .set('X-Refresh', 'some-refresh-token');

      // Assert: that correct status is returned
      expect(response.status).to.equal(204);
    });

    it('should return status 400 when creation fails', async () => {
      // Arrange: set up data, stubs
      const reviewData = {
        buildExperience: 'some build experience',
      };

      sinon
        .stub(reviewService, 'addReview')
        .throws(new Error('Creation failed!'));

      // Act: call the endpoint
      const response = await request(app)
        .post('/reviews/create')
        .send(reviewData)
        .set('X-Refresh', 'some-refresh-token');

      // Assert: that correct status is returned
      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('message');
    });
  });
});
