const chai = require('chai');
const { expect } = chai;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const rewire = require('rewire');
const reviewService = rewire('../services/reviewService');
const minioService = require('../services/minioService');
const Set = require('../models/Set');

chai.use(sinonChai);

const testData = {
  content: 'build experience was great and fun to build the set',
};

describe('Review service methods', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('addReview', () => {
    it('should create a review', async () => {
      // Arrange: mock dependencies and data
      const token = 'sampleToken';
      const setImages = ['file1', 'file2'];
      const setData = { setNum: 'setNum', save: sinon.stub() };

      const jwtDecodeStub = sinon.stub().returns({ email: 'user@example.com' });
      const jwtStub = { decode: jwtDecodeStub };
      reviewService.__set__('jwt', jwtStub);

      const buffers = [
        Buffer.from(setImages[0], 'base64'),
        Buffer.from(setImages[1], 'base64'),
      ];

      const findByIdStub = sinon.stub(Set, 'findById').returns({
        select: sinon.stub().resolves(setData),
      });
      const saveReviewStub = sinon.stub(minioService, 'saveReview').resolves();

      // Act: call the method
      await reviewService.addReview({ ...testData, setImages }, token);

      // Assert: check if methods were called
      expect(jwtDecodeStub).to.have.been.calledOnceWith(token);
      expect(findByIdStub).to.have.been.calledOnceWith(testData._id);
      expect(saveReviewStub).to.have.been.calledOnceWith(
        'userexamplecom',
        'setNum',
        buffers
      );
      expect(setData.review).to.equal(testData.content);
    });
  });

  describe('getReview', () => {
    it('should return the correct review object', async () => {
      // Arrange: test data, stubs
      const setData = {
        _id: 'some-id',
        setNum: '12345',
        name: 'some-name',
        image: 'some-image',
        parts: '20',
        year: '2003',
        minifigCount: '5',
        minifigs: [],
        review: 'some-review-content',
        user: {
          username: 'some-username',
          email: 'someEmail@mail.com',
        },
      };

      const findByIdStub = sinon.stub(Set, 'findById').returns({
        populate: sinon.stub().resolves(setData),
      });

      const images = ['image1.jpg', 'image2.jpg'];
      const getReviewImagesStub = sinon
        .stub(minioService, 'getReviewImages')
        .resolves(images);

      // Act: call the method being tested
      const result = await reviewService.getReview(setData._id);

      // Assert: that the returned result is expected
      expect(result).to.deep.equal({
        _id: setData._id,
        setName: setData.name,
        setImage: setData.image,
        setNumber: setData.setNum,
        setParts: setData.parts,
        setYear: setData.year,
        setMinifigCount: setData.minifigCount,
        setImages: images,
        setMinifigures: [],
        userId: setData.user._id,
        userUsername: setData.user.username,
        content: setData.review,
      });
      expect(findByIdStub).to.be.calledOnceWithExactly(setData._id);
      expect(getReviewImagesStub).to.be.calledOnceWithExactly(
        setData.user.email.replace(/[.@]/g, ''),
        setData.setNum
      );
    });

    it('should throw error if review doesnt exist', async () => {
      // Arrange: test stubs
      const findByIdStub = sinon.stub(Set, 'findById').returns({
        populate: sinon.stub().resolves({}),
      });

      // Act+Assert: call the method, error was thrown
      try {
        await reviewService.getReview('some-id');
        expect.fail('Expected an error to be thrown');
      } catch (error) {
        expect(error.message).to.equal('Review not found!');
        expect(findByIdStub).to.be.calledOnceWith('some-id');
      }
    });
  });

  describe('deleteReview', () => {
    it('should delete the review if the user is authorized', async () => {
      // Arrange: setup mock data, stubs
      const reviewId = '123456';
      const token = 'valid-token';
      const setData = {
        _id: reviewId,
        setNum: '12345',
        review: 'some-content',
        user: { _id: 'user-id' },
        save: sinon.stub().resolves(),
      };

      const findByIdStub = sinon.stub(Set, 'findById').returns({
        populate: sinon.stub().resolves(setData),
      });

      const jwtStub = {
        decode: sinon
          .stub()
          .returns({ email: 'test@example.com', _id: 'user-id' }),
      };
      reviewService.__set__('jwt', jwtStub);

      const deleteReviewImagesStub = sinon
        .stub(minioService, 'deleteReviewImages')
        .resolves();

      // Act: call the serviec method
      await reviewService.deleteReview(reviewId, token);

      // Assert: that the methods were called
      expect(findByIdStub).to.have.been.calledOnceWith(reviewId);
      expect(jwtStub.decode).to.have.been.calledOnceWith(token);
      expect(deleteReviewImagesStub).to.have.been.calledOnceWith(
        'testexamplecom',
        '12345'
      );
      expect(setData.review).to.be.null;
    });

    it('should throw an error if the review is not found', async () => {
      // Arrange: setup mock data, stubs
      const reviewId = '123456';
      const token = 'valid-token';

      const findByIdStub = sinon.stub(Set, 'findById').returns({
        populate: sinon.stub().resolves({}),
      });

      const jwtStub = {
        decode: sinon
          .stub()
          .returns({ email: 'test@example.com', _id: 'user-id' }),
      };
      reviewService.__set__('jwt', jwtStub);

      // Act+Assert: call the method, error was thrown
      try {
        await reviewService.deleteReview(reviewId, token);
        expect.fail('Expected an error to be thrown');
      } catch (error) {
        expect(error.message).to.equal('Review not found!');
        expect(findByIdStub).to.have.been.calledOnceWith(reviewId);
        expect(jwtStub.decode).to.have.been.calledOnceWith(token);
      }
    });

    it('should throw an error if the user is not authorized to delete the review', async () => {
      // Arrange: setup mock data, stubs
      const reviewId = '123456';
      const token = 'valid-token';
      const setData = {
        review: 'some-content',
        user: { _id: 'user-id' },
      };

      const findByIdStub = sinon.stub(Set, 'findById').returns({
        populate: sinon.stub().resolves(setData),
      });

      const jwtStub = {
        decode: sinon
          .stub()
          .returns({ email: 'test@example.com', _id: 'other-user-id' }),
      };
      reviewService.__set__('jwt', jwtStub);

      // Act+Assert: call the method, error was thrown
      try {
        await reviewService.deleteReview(reviewId, token);
        expect.fail('Expected an error to be thrown');
      } catch (error) {
        expect(error.message).to.equal(
          'You are not authorized to delete this review!'
        );
        expect(findByIdStub).to.have.been.calledOnceWith(reviewId);
        expect(jwtStub.decode).to.have.been.calledOnceWith(token);
      }
    });
  });
});
