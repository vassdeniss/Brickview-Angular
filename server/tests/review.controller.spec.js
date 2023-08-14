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

  describe('GET /get/:id', () => {
    it('should return status 200 when valid id is provided', async () => {
      // Arrange: create mocks, stubs
      const review = {
        id: 'some_valid_id',
        title: 'Review Title',
        content: 'Review Content',
      };
      const getReviewStub = sinon
        .stub(reviewService, 'getReview')
        .resolves(review);

      // Act: call the endpoint
      const response = await request(app).get('/reviews/get/some_valid_id');

      // Assert: that correct status is returned
      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal(review);
      expect(getReviewStub).to.have.been.calledOnceWith('some_valid_id');
    });

    it('should return status 404 with an error message when invalid id is provided', async () => {
      // Arrange: stub the reviewService.getReview method to throw an error
      const getReviewStub = sinon
        .stub(reviewService, 'getReview')
        .throws(new Error('Review not found'));

      // Act: call the endpoint
      const response = await request(app).get('/reviews/get/invalid_id');

      // Assert: that correct status is returned
      expect(response.status).to.equal(404);
      expect(response.body).to.deep.equal({
        message: 'Review not found',
      });
      expect(getReviewStub).to.have.been.calledOnceWith('invalid_id');
    });
  });

  describe('POST /create', () => {
    let reviewData;
    beforeEach(() => {
      reviewData = {
        content: 'some build experience',
      };
    });

    it('should return status 200 when the review has been created', async () => {
      // Arrange: set up stubs
      sinon.stub(reviewService, 'addReview').resolves({
        user: {},
      });

      // Act: call the endpoint
      const response = await request(app)
        .post('/reviews/create')
        .send(reviewData)
        .set('X-Refresh', 'some-refresh-token');

      // Assert: that correct status is returned
      expect(response.status).to.equal(200);
      expect(response.body.user).to.exist;
    });

    it('should return status 400 when creation fails', async () => {
      // Arrange: set up stubs
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

  describe('DELETE /delete/:id', () => {
    it('should return status 200 when valid id is provided', async () => {
      // Arrange: create stub
      const deleteReviewStub = sinon
        .stub(reviewService, 'deleteReview')
        .resolves({
          user: {},
        });

      // Act: call the endpoint
      const response = await request(app).delete(
        '/reviews/delete/some_valid_id'
      );

      // Assert: that correct status is returned
      expect(response.status).to.equal(200);
      expect(response.body.user).to.exist;
      expect(deleteReviewStub).to.have.been.calledOnceWith('some_valid_id');
    });

    it('should return a 403 status with an error message when user is not the owner', async () => {
      // Arrange: Stub the reviewService.getReview method to throw an error
      const deleteReviewStub = sinon
        .stub(reviewService, 'deleteReview')
        .throws({
          message: 'You are not authorized to delete this review!',
          statusCode: 403,
        });

      // Act: call the endpoint
      const response = await request(app).delete('/reviews/delete/invalid_id');

      // Assert: that correct status is returned
      expect(response.status).to.equal(403);
      expect(response.body).to.deep.equal({
        message: 'You are not authorized to delete this review!',
      });
      expect(deleteReviewStub).to.have.been.calledOnceWith('invalid_id');
    });

    it('should return a 404 status with an error message when invalid id is provided', async () => {
      // Arrange: Stub the reviewService.getReview method to throw an error
      const deleteReviewStub = sinon
        .stub(reviewService, 'deleteReview')
        .throws({
          message: 'Review not found!',
          statusCode: 404,
        });

      // Act: call the endpoint
      const response = await request(app).delete('/reviews/delete/invalid_id');

      // Assert: that correct status is returned
      expect(response.status).to.equal(404);
      expect(response.body).to.deep.equal({
        message: 'Review not found!',
      });
      expect(deleteReviewStub).to.have.been.calledOnceWith('invalid_id');
    });
  });
});
