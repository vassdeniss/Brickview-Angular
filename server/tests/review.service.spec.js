const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const rewire = require('rewire');
const service = rewire('../services/reviewService');

const Review = require('../models/Review');
const Set = require('../models/Set');
const minioService = require('../services/minioService');

chai.use(sinonChai);
const { expect } = chai;

const testData = {
  buildExperience: 'build experience was great and fun to build the set',
  design: 'design',
  minifigures: 'minifigures',
  value: 'value',
  other: 'other',
  verdict: 'verdict',
  set: '612345678912345678901234',
};

describe('Review service methods', () => {
  describe('addReview', () => {
    it('should create a review', async () => {
      // Arrange: mock dependencies and data
      const token = 'sampleToken';
      const email = 'user@example.com';
      const _id = '618165678912345678901234';
      const imageSources = ['file1', 'file2'];

      const jwtDecodeStub = sinon.stub().returns({ email, _id });
      const jwtStub = { decode: jwtDecodeStub };
      service.__set__('jwt', jwtStub);

      const buffers = [
        Buffer.from(imageSources[0], 'base64'),
        Buffer.from(imageSources[1], 'base64'),
      ];

      const getSetNumAndMarkReviewedStub = sinon.stub().resolves('setNum');
      const reset = service.__set__(
        'getSetNumAndMarkReviewed',
        getSetNumAndMarkReviewedStub
      );

      const saveReviewStub = sinon.stub(minioService, 'saveReview').resolves();
      const createStub = sinon.stub(Review, 'create').resolves();

      // Act: call the method
      await service.addReview({ ...testData, imageSources }, token);

      // Assert: check if methods were called
      expect(jwtDecodeStub).to.have.been.calledOnceWith(token);
      expect(getSetNumAndMarkReviewedStub).to.have.been.calledOnceWith(
        testData.set
      );
      expect(saveReviewStub).to.have.been.calledOnceWith(
        'userexamplecom',
        'setNum',
        buffers
      );
      expect(createStub).to.have.been.calledOnceWith({
        buildExperience: testData.buildExperience,
        design: testData.design,
        minifigures: testData.minifigures,
        value: testData.value,
        other: testData.other,
        verdict: testData.verdict,
        set: testData.set,
        user: _id,
      });

      reset();
    });
  });

  describe('getReview', () => {
    it('should return the correct review object', async () => {
      // Arrange: test data, stubs
      const setId = 'someSetId';
      const reviewData = {
        buildExperience: 'Good',
        design: 'Excellent',
        minifigures: 'Average',
        value: 'Great',
        other: 'Nice',
        verdict: 'Recommended',
        set: { setNum: '12345' },
        user: { email: 'user@example.com' },
      };
      const images = ['image1.jpg', 'image2.jpg'];
      const findStub = sinon.stub(Review, 'find').returns({
        populate: sinon.stub().returns({
          populate: sinon.stub().resolves([reviewData]),
        }),
      });
      const getReviewImagesStub = sinon
        .stub(minioService, 'getReviewImages')
        .resolves(images);

      // Act: call the method being tested
      const result = await service.getReview(setId);

      // Assert: that the returned result is expected
      expect(result).to.deep.equal({
        buildExperience: reviewData.buildExperience,
        design: reviewData.design,
        minifigures: reviewData.minifigures,
        value: reviewData.value,
        other: reviewData.other,
        verdict: reviewData.verdict,
        set: reviewData.set,
        user: reviewData.user,
        imageSources: images,
      });
      expect(findStub).to.be.calledOnceWithExactly({ set: setId });
      expect(getReviewImagesStub).to.be.calledOnceWithExactly(
        reviewData.user.email.replace(/[.@]/g, ''),
        reviewData.set.setNum
      );
    });
  });

  describe('getSetNumAndMarkReviewed', () => {
    it('should get setNum and mark set as reviewed', async () => {
      // Arrange: mock data, create stubs
      const setId = 'sampleSetId';
      const setNum = 'sampleSetNum';
      const setInstance = {
        save: sinon.stub().resolves(),
        setNum,
        isReviewed: false,
      };
      const findByIdStub = sinon.stub(Set, 'findById').returns({
        select: sinon.stub().resolves(setInstance),
      });

      // Act: call service method
      const result = await service.__get__('getSetNumAndMarkReviewed')(setId);

      // Assert: that the methods were called and the result is correct
      expect(result).to.equal(setNum);
      expect(findByIdStub).to.have.been.calledOnceWith(setId);
      expect(setInstance.isReviewed).to.be.true;
    });
  });
});
