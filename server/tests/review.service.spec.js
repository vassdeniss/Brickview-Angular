const chai = require('chai');
const { expect } = chai;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const rewire = require('rewire');
const reviewService = rewire('../services/reviewService');
const minioService = require('../services/minioService');
const Set = require('../models/Set');
const User = require('../models/User');

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
      const findOneStub = sinon.stub(User, 'findOne').returns({
        populate: sinon.stub().resolves({ user: {} }),
      });

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
      expect(findOneStub).to.have.been.calledOnceWith({ refreshToken: token });
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

  describe('editReview', () => {
    let jwtStub;
    let data;
    let set;
    let id;
    let findByIdStub;
    beforeEach(() => {
      jwtStub = {
        decode: sinon
          .stub()
          .returns({ email: 'test@example.com', _id: 'user_id' }),
      };
      reviewService.__set__('jwt', jwtStub);
      data = {
        _id: 'set_id',
        setImages: [],
        content: 'New review content',
      };
      id = 'user_id';
      set = {
        review: 'Old review content',
        setNum: '12345',
        user: { _id: id },
        save: sinon.stub().resolves(),
      };
      findByIdStub = sinon.stub(Set, 'findById').returns({
        select: sinon.stub().returns({
          populate: sinon.stub().resolves(set),
        }),
      });
    });

    it('should edit review and save', async () => {
      // Arrange: test data, stubs
      const deleteReviewImagesStub = sinon.stub(
        minioService,
        'deleteReviewImagesWithoutBucket'
      );
      const saveReviewStub = sinon.stub(minioService, 'saveReview');

      const email = 'testexamplecom';
      data.setImages = [
        'data:image/jpeg;base64,base64data1',
        'data:image/jpeg;base64,base64data2',
      ];

      const findOneStub = sinon.stub(User, 'findOne').returns({
        populate: sinon.stub().resolves({ user: {} }),
      });

      // Act: call the method
      await reviewService.editReview(data, 'token');

      // Assert: methods were called, data is correct
      expect(jwtStub.decode).to.have.been.calledOnceWith('token');
      expect(findByIdStub).to.have.been.calledOnceWith(data._id);
      expect(deleteReviewImagesStub).to.have.been.calledOnceWith(
        email,
        set.setNum
      );
      expect(saveReviewStub).to.have.been.calledOnceWithExactly(
        email,
        set.setNum,
        sinon.match.array.deepEquals([
          Buffer.from('base64data1', 'base64'),
          Buffer.from('base64data2', 'base64'),
        ])
      );
      expect(set.review).to.equal(data.content);
      expect(set.save).to.have.been.calledOnce;
      expect(findOneStub).to.have.been.calledOnceWith({
        refreshToken: 'token',
      });
    });

    it('should throw error if review not found', async () => {
      // Arrange: clear set review
      set.review = null;

      // Act+Assert: call the method, error was thrown
      try {
        await reviewService.editReview(data, 'token');
        expect.fail('Expected an error to be thrown');
      } catch (error) {
        expect(error.message).to.equal('Review not found!');
      }
    });

    it('should throw error if unauthorized to edit review', async () => {
      // Arrange: change set user id
      set.user._id = 'different_user_id';

      // Act+Assert: call the method, error was thrown
      try {
        await reviewService.editReview(data, 'token');
        expect.fail('Expected an error to be thrown');
      } catch (error) {
        expect(error.message).to.equal(
          'You are not authorized to edit this review!'
        );
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
      const findOneStub = sinon.stub(User, 'findOne').returns({
        populate: sinon.stub().resolves({ user: {} }),
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
      expect(findOneStub).to.have.been.calledOnceWith({
        refreshToken: token,
      });
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

  describe('editReview', () => {
    let jwtStub;
    let data;
    beforeEach(() => {
      jwtStub = {
        decode: sinon
          .stub()
          .returns({ email: 'test@example.com', _id: 'user_id' }),
      };
      reviewService.__set__('jwt', jwtStub);

      data = {
        _id: 'set_id',
        setImages: [],
        content: 'New review content',
      };
    });

    it('should edit review and save', async () => {
      // Arrange: test data, stubs
      const deleteReviewImagesStub = sinon.stub(
        minioService,
        'deleteReviewImagesWithoutBucket'
      );
      const saveReviewStub = sinon.stub(minioService, 'saveReview');

      const email = 'testexamplecom';
      const id = 'user_id';
      data.setImages = [
        'data:image/jpeg;base64,base64data1',
        'data:image/jpeg;base64,base64data2',
      ];
      const set = {
        review: 'Old review content',
        setNum: '12345',
        user: { _id: id },
        save: sinon.stub().resolves(),
      };

      const findByIdStub = sinon.stub(Set, 'findById').returns({
        select: sinon.stub().returns({
          populate: sinon.stub().resolves(set),
        }),
      });
      const findOneStub = sinon.stub(User, 'findOne').returns({
        populate: sinon.stub().resolves({ user: {} }),
      });

      // Act: call the method
      await reviewService.editReview(data, 'token');

      // Assert: methods were called, data is correct
      expect(jwtStub.decode).to.have.been.calledOnceWith('token');
      expect(findByIdStub).to.have.been.calledOnceWith(data._id);
      expect(deleteReviewImagesStub).to.have.been.calledOnceWith(
        email,
        set.setNum
      );
      expect(saveReviewStub).to.have.been.calledOnceWithExactly(
        email,
        set.setNum,
        sinon.match.array.deepEquals([
          Buffer.from('base64data1', 'base64'),
          Buffer.from('base64data2', 'base64'),
        ])
      );
      expect(set.review).to.equal(data.content);
      expect(set.save).to.have.been.calledOnce;
      expect(findOneStub).to.have.been.calledOnceWith({
        refreshToken: 'token',
      });
    });

    it('should throw error if review not found', async () => {
      // Arrange: test data, stubs
      const set = {
        review: null,
        setNum: '12345',
        user: { _id: 'user_id' },
      };

      sinon.stub(Set, 'findById').returns({
        select: sinon.stub().returns({
          populate: sinon.stub().resolves(set),
        }),
      });

      // Act+Assert: call the method, error was thrown
      try {
        await reviewService.editReview(data, 'token');
        expect.fail('Expected an error to be thrown');
      } catch (error) {
        expect(error.message).to.equal('Review not found!');
      }
    });

    it('should throw error if unauthorized to edit review', async () => {
      // Arrange: test data, stubs
      const set = {
        review: 'Old review content',
        setNum: '12345',
        user: { _id: 'different_user_id' }, // Different user ID
      };

      sinon.stub(Set, 'findById').returns({
        select: sinon.stub().returns({
          populate: sinon.stub().resolves(set),
        }),
      });

      // Act+Assert: call the method, error was thrown
      try {
        await reviewService.editReview(data, 'token');
        expect.fail('Expected an error to be thrown');
      } catch (error) {
        expect(error.message).to.equal(
          'You are not authorized to edit this review!'
        );
      }
    });
  });
});
