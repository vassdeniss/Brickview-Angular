// const chai = require('chai');
// const sinon = require('sinon');
// const sinonChai = require('sinon-chai');
// const rewire = require('rewire');
// const service = rewire('../services/reviewService');

// const Set = require('../models/Set');
// const minioService = require('../services/minioService');

// chai.use(sinonChai);
// const { expect } = chai;

// const testData = {
//   buildExperience: 'build experience was great and fun to build the set',
//   design: 'design',
//   minifigures: 'minifigures',
//   value: 'value',
//   other: 'other',
//   verdict: 'verdict',
//   set: '612345678912345678901234',
// };

// describe('Review service methods', () => {
//   afterEach(() => {
//     sinon.restore();
//   });

//   describe('addReview', () => {
//     it('should create a review', async () => {
//       // Arrange: mock dependencies and data
//       const token = 'sampleToken';
//       const email = 'user@example.com';
//       const _id = '618165678912345678901234';
//       const imageSources = ['file1', 'file2'];

//       const jwtDecodeStub = sinon.stub().returns({ email, _id });
//       const jwtStub = { decode: jwtDecodeStub };
//       service.__set__('jwt', jwtStub);

//       const buffers = [
//         Buffer.from(imageSources[0], 'base64'),
//         Buffer.from(imageSources[1], 'base64'),
//       ];

//       const getSetNumAndMarkReviewedStub = sinon.stub().resolves('setNum');
//       const reset = service.__set__(
//         'getSetNumAndMarkReviewed',
//         getSetNumAndMarkReviewedStub
//       );

//       const saveReviewStub = sinon.stub(minioService, 'saveReview').resolves();
//       const createStub = sinon.stub(Review, 'create').resolves();

//       // Act: call the method
//       await service.addReview({ ...testData, imageSources }, token);

//       // Assert: check if methods were called
//       expect(jwtDecodeStub).to.have.been.calledOnceWith(token);
//       expect(getSetNumAndMarkReviewedStub).to.have.been.calledOnceWith(
//         testData.set
//       );
//       expect(saveReviewStub).to.have.been.calledOnceWith(
//         'userexamplecom',
//         'setNum',
//         buffers
//       );
//       expect(createStub).to.have.been.calledOnceWith({
//         buildExperience: testData.buildExperience,
//         design: testData.design,
//         minifigures: testData.minifigures,
//         value: testData.value,
//         other: testData.other,
//         verdict: testData.verdict,
//         set: testData.set,
//         user: _id,
//       });

//       reset();
//     });
//   });

//   describe('getReview', () => {
//     it('should return the correct review object', async () => {
//       // Arrange: test data, stubs
//       const setId = 'someSetId';
//       const reviewData = {
//         _id: 'some-id',
//         buildExperience: 'Good',
//         design: 'Excellent',
//         minifigures: 'Average',
//         value: 'Great',
//         other: 'Nice',
//         verdict: 'Recommended',
//         set: { setNum: '12345' },
//         user: { email: 'user@example.com' },
//       };
//       const images = ['image1.jpg', 'image2.jpg'];
//       const findStub = sinon.stub(Review, 'find').returns({
//         populate: sinon.stub().returns({
//           populate: sinon.stub().resolves([reviewData]),
//         }),
//       });
//       const getReviewImagesStub = sinon
//         .stub(minioService, 'getReviewImages')
//         .resolves(images);

//       // Act: call the method being tested
//       const result = await service.getReview(setId);

//       // Assert: that the returned result is expected
//       expect(result).to.deep.equal({
//         _id: reviewData._id,
//         buildExperience: reviewData.buildExperience,
//         design: reviewData.design,
//         minifigures: reviewData.minifigures,
//         value: reviewData.value,
//         other: reviewData.other,
//         verdict: reviewData.verdict,
//         set: reviewData.set,
//         user: reviewData.user,
//         imageSources: images,
//       });
//       expect(findStub).to.be.calledOnceWithExactly({ set: setId });
//       expect(getReviewImagesStub).to.be.calledOnceWithExactly(
//         reviewData.user.email.replace(/[.@]/g, ''),
//         reviewData.set.setNum
//       );
//     });
//   });

//   describe('getSetNumAndMarkReviewed', () => {
//     it('should get setNum and mark set as reviewed', async () => {
//       // Arrange: mock data, create stubs
//       const setId = 'sampleSetId';
//       const setNum = 'sampleSetNum';
//       const setInstance = {
//         save: sinon.stub().resolves(),
//         setNum,
//         isReviewed: false,
//       };
//       const findByIdStub = sinon.stub(Set, 'findById').returns({
//         select: sinon.stub().resolves(setInstance),
//       });

//       // Act: call service method
//       const result = await service.__get__('getSetNumAndMarkReviewed')(setId);

//       // Assert: that the methods were called and the result is correct
//       expect(result).to.equal(setNum);
//       expect(findByIdStub).to.have.been.calledOnceWith(setId);
//       expect(setInstance.isReviewed).to.be.true;
//     });
//   });

//   describe('deleteReview', () => {
//     it('should delete the review if the user is authorized', async () => {
//       // Arrange: setup mock data, stubs
//       const reviewId = '123456';
//       const token = 'valid-token';
//       const review = {
//         _id: reviewId,
//         user: { _id: 'user-id' },
//         set: {
//           setNum: '12345',
//           isReviewed: true,
//           save: sinon.stub().resolves(),
//         },
//         deleteOne: sinon.stub().resolves(),
//       };

//       const findByIdStub = sinon.stub(Review, 'findById').returns({
//         populate: sinon.stub().returns({
//           populate: sinon.stub().resolves(review),
//         }),
//       });
//       const jwtStub = {
//         decode: sinon
//           .stub()
//           .returns({ email: 'test@example.com', _id: 'user-id' }),
//       };
//       service.__set__('jwt', jwtStub);
//       const deleteReviewImagesStub = sinon
//         .stub(minioService, 'deleteReviewImages')
//         .resolves();

//       // Act: call the serviec method
//       await service.deleteReview(reviewId, token);

//       // Assert: that the methods were called
//       expect(findByIdStub).to.have.been.calledOnceWith(reviewId);
//       expect(jwtStub.decode).to.have.been.calledOnceWith(token);
//       expect(deleteReviewImagesStub).to.have.been.calledOnceWith(
//         'testexamplecom',
//         '12345'
//       );
//       expect(review.set.isReviewed).to.be.false;
//       expect(review.set.save.calledOnce).to.be.true;
//       expect(review.deleteOne.calledOnce).to.be.true;
//     });

//     it('should throw an error if the review is not found', async () => {
//       // Arrange: setup mock data, stubs
//       const reviewId = 'non-existent-id';
//       const token = 'valid-token';
//       const findByIdStub = sinon.stub(Review, 'findById').returns({
//         populate: sinon.stub().returns({
//           populate: sinon.stub().resolves(null),
//         }),
//       });

//       const jwtStub = {
//         decode: sinon
//           .stub()
//           .returns({ email: 'test@example.com', _id: 'user-id' }),
//       };
//       service.__set__('jwt', jwtStub);

//       // Act: call the service method
//       try {
//         await service.deleteReview(reviewId, token);
//         expect.fail('Expected an error but none was thrown');
//       } catch (error) {
//         expect(error.message).to.equal('Review not found!');
//       }

//       // Assert: that the methods were called
//       expect(findByIdStub).to.have.been.calledOnceWith(reviewId);
//       expect(jwtStub.decode).to.have.been.calledOnceWith(token);
//     });

//     it('should throw an error if the user is not authorized to delete the review', async () => {
//       // Arrange: setup mock data, stubs
//       const reviewId = 'valid-review-id';
//       const token = 'invalid-token';
//       const review = { _id: reviewId, user: { _id: 'user-id' } };
//       const findByIdStub = sinon.stub(Review, 'findById').returns({
//         populate: sinon.stub().returns({
//           populate: sinon.stub().resolves(review),
//         }),
//       });

//       const jwtStub = {
//         decode: sinon
//           .stub()
//           .returns({ email: 'test@example.com', _id: 'different-user-id' }),
//       };
//       service.__set__('jwt', jwtStub);

//       // Act: call the service method
//       try {
//         await service.deleteReview(reviewId, token);
//         expect.fail('Expected an error but none was thrown');
//       } catch (error) {
//         expect(error.message).to.equal(
//           'You are not authorized to delete this review'
//         );
//       }

//       // Assert: that the methods were called
//       expect(findByIdStub).to.have.been.calledOnceWith(reviewId);
//       expect(jwtStub.decode).to.have.been.calledOnceWith(token);
//     });
//   });
// });
