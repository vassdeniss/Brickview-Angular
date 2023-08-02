const chai = require('chai');
const { expect } = chai;
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const axios = require('axios');
const rewire = require('rewire');

chai.use(sinonChai);

const setService = rewire('../services/setService');
const User = require('../models/User');
const Set = require('../models/Set');
const Review = require('../models/Review');

chai.use(chaiAsPromised);

describe('Set service methods', function () {
  afterEach(() => {
    sinon.restore();
  });

  describe('getLoggedInUserCollection', () => {
    it('should return user collection with valid refresh token', async () => {
      // Arrange: mock dependencies and data
      const user = {
        sets: ['someSet'],
      };
      const refreshToken = 'someToken';
      const populateStub = sinon.stub().returnsThis();
      const selectStub = sinon.stub().resolves(user);
      const findOneStub = sinon.stub(User, 'findOne').returns({
        populate: populateStub,
        select: selectStub,
      });

      // Act: call the method
      const sets = await setService.getLoggedInUserCollection(refreshToken);

      // Assert: check if methods were called
      expect(findOneStub).to.have.been.calledWith({ refreshToken });
      expect(populateStub).to.have.been.calledWith('sets');
      expect(selectStub).to.have.been.calledWith('sets');
      expect(sets).to.deep.equal(user.sets);
    });

    it('should throw error with invalid refresh token', async () => {
      // Arrange: mock dependencies and data
      const refreshToken = 'someToken';
      const populateStub = sinon.stub().returnsThis();
      const selectStub = sinon.stub().resolves(null);
      const findOneStub = sinon.stub(User, 'findOne').returns({
        populate: populateStub,
        select: selectStub,
      });

      // Act: call the method (expect error)
      try {
        await setService.getLoggedInUserCollection(refreshToken);
        expect.fail('Expected an error but none was thrown');
      } catch (error) {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.equal('Invalid refresh token!');
      }

      // Assert: check if methods were called
      expect(findOneStub).to.have.been.calledWith({ refreshToken });
      expect(populateStub).to.have.been.calledWith('sets');
      expect(selectStub).to.have.been.calledWith('sets');
    });
  });

  describe('addSet', () => {
    it('should not add set if already exists', async () => {
      // Arrange: mock dependencies and data
      const axiosGetStub = sinon
        .stub(axios, 'get')
        .onFirstCall()
        .resolves({
          data: {
            set_num: '123',
            name: 'Test Set',
            year: 2023,
            num_parts: 100,
            set_img_url: 'https://example.com/test_set.jpg',
          },
        })
        .onSecondCall()
        .resolves({
          data: {
            count: 3,
            results: [
              { name: 'Fig 1', image_url: 'https://example.com/fig1.jpg' },
              { name: 'Fig 2', image_url: 'https://example.com/fig2.jpg' },
              { name: 'Fig 3', image_url: 'https://example.com/fig3.jpg' },
            ],
          },
        });
      const userFindOneStub = sinon.stub(User, 'findOne').returns({
        populate: sinon.stub().resolves({
          sets: [
            {
              setNum: '123',
            },
          ],
        }),
      });

      const setId = '123';
      const refreshToken = 'test_refresh_token';

      // Act: call the method (expect error)
      try {
        await setService.addSet(setId, refreshToken);
        expect.fail('Expected an error but none was thrown');
      } catch (error) {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.equal('Set already exists in collection!');
      }

      // Assert: check if methods were called
      expect(axiosGetStub).to.have.been.calledTwice;
      expect(userFindOneStub).to.have.been.calledOnce;
    });

    it('should add set to users sets array', async () => {
      // Arrange: mock dependencies and data
      const axiosGetStub = sinon
        .stub(axios, 'get')
        .onFirstCall()
        .resolves({
          data: {
            set_num: '12345',
            name: 'Test Set',
            year: 2023,
            num_parts: 100,
            set_img_url: 'https://example.com/test_set.jpg',
          },
        })
        .onSecondCall()
        .resolves({
          data: {
            count: 3,
            results: [
              { name: 'Fig 1', image_url: 'https://example.com/fig1.jpg' },
              { name: 'Fig 2', image_url: 'https://example.com/fig2.jpg' },
              { name: 'Fig 3', image_url: 'https://example.com/fig3.jpg' },
            ],
          },
        });
      const setCreateStub = sinon.stub(Set, 'create').resolves({
        _id: 'some_fake_id',
        setNum: '12345',
        name: 'Test Set',
        year: 2023,
        parts: 100,
        image: 'https://example.com/test_set.jpg',
        minifigCount: 3,
        minifigs: [
          { name: 'Fig 1', image_url: 'https://example.com/fig1.jpg' },
          { name: 'Fig 2', image_url: 'https://example.com/fig2.jpg' },
          { name: 'Fig 3', image_url: 'https://example.com/fig3.jpg' },
        ],
      });
      const userSaveStub = sinon.stub();
      const userFindOneStub = sinon.stub(User, 'findOne').returns({
        populate: sinon.stub().resolves({
          sets: [],
          save: userSaveStub,
        }),
      });
      const setId = '123';
      const refreshToken = 'test_refresh_token';

      // Act: call the method
      await setService.addSet(setId, refreshToken);

      // Assert: check if methods were called
      expect(axiosGetStub).to.have.been.calledTwice;
      expect(setCreateStub).to.have.been.calledOnce;
      expect(userFindOneStub).to.have.been.calledOnce;
      expect(userSaveStub).to.have.been.calledOnce;
    });
  });

  describe('deleteSet function', () => {
    it('should delete a set and its associated review if authorized', async () => {
      // Arrange: mock the necessary data
      const setId = 'set123';
      const userId = 'user123';
      const token = 'your_test_token';
      const decodedToken = { _id: userId };

      const jwtStub = { decode: sinon.stub().returns(decodedToken) };
      setService.__set__('jwt', jwtStub);

      const set = {
        _id: setId,
        user: { _id: userId, sets: [setId], save: sinon.stub().resolves() },
        deleteOne: sinon.stub(),
      };
      const findByIdStub = sinon.stub(Set, 'findById').returns({
        populate: sinon.stub().resolves(set),
      });

      const reviewId = 'review123';
      const findOneStub = sinon.stub(Review, 'findOne').returns({
        select: sinon.stub().resolves({ _id: reviewId }),
      });

      const deleteReviewStub = sinon.stub().resolves();
      setService.__set__('deleteReview', deleteReviewStub);

      // Act: call the function under test
      await setService.deleteSet(setId, token);

      // Assert: check if the methods were called
      expect(jwtStub.decode).to.have.been.calledOnceWith(token);
      expect(findByIdStub).to.have.been.calledOnceWith(setId);
      expect(findOneStub).to.have.been.calledOnceWith({ set: setId });
      expect(deleteReviewStub).to.have.been.calledOnceWith(reviewId, token);
      expect(set.deleteOne).to.have.been.calledOnce;
      expect(set.user.save).to.have.been.calledOnce;
      expect(set.user.sets).to.not.include(setId);
    });

    it('should delete a set without a review if authorized', async () => {
      // Arrange: mock the necessary data
      const setId = 'set123';
      const userId = 'user123';
      const token = 'your_test_token';
      const decodedToken = { _id: userId };

      const jwtStub = { decode: sinon.stub().returns(decodedToken) };
      setService.__set__('jwt', jwtStub);

      const set = {
        _id: setId,
        user: { _id: userId, sets: [setId], save: sinon.stub().resolves() },
        deleteOne: sinon.stub(),
      };
      const findByIdStub = sinon.stub(Set, 'findById').returns({
        populate: sinon.stub().resolves(set),
      });

      const reviewId = 'review123';
      const findOneStub = sinon.stub(Review, 'findOne').returns({
        select: sinon.stub().resolves(null),
      });

      const deleteReviewStub = sinon.stub().resolves();
      setService.__set__('deleteReview', deleteReviewStub);

      // Act: call the function under test
      await setService.deleteSet(setId, token);

      // Assert: check if the methods were called
      expect(jwtStub.decode).to.have.been.calledOnceWith(token);
      expect(findByIdStub).to.have.been.calledOnceWith(setId);
      expect(findOneStub).to.have.been.calledOnceWith({ set: setId });
      expect(deleteReviewStub).to.have.not.been.called;
      expect(set.deleteOne).to.have.been.calledOnce;
      expect(set.user.save).to.have.been.calledOnce;
      expect(set.user.sets).to.not.include(setId);
    });

    it('should throw an error if the set is not found', async () => {
      // Arrange: mock data, create stubs
      const setId = 'nonexistent_set';
      const token = 'your_test_token';
      sinon.stub(Set, 'findById').returns({
        populate: sinon.stub().resolves(null),
      });

      // Act+Assert: call the method, error was thrown
      try {
        await setService.deleteSet(setId, token);
        expect.fail('Expected an error to be thrown');
      } catch (error) {
        expect(error.message).to.equal('Set not found!');
      }
    });

    it('should throw an error if the user is not authorized to delete the set', async () => {
      // Arrange: mock data, create stubs
      const setId = 'set123';
      const userId = 'user123';
      const token = 'your_test_token';

      const jwtStub = {
        decode: sinon.stub().returns({ _id: 'different_user' }),
      };
      setService.__set__('jwt', jwtStub);
      sinon.stub(Set, 'findById').returns({
        populate: sinon.stub().resolves({ _id: setId, user: { _id: userId } }),
      });

      // Act+Assert: call the method, error was thrown
      try {
        await setService.deleteSet(setId, token);
        expect.fail('Expected an error to be thrown');
      } catch (error) {
        expect(error.message).to.equal(
          'You are not authorized to delete this set!'
        );
      }
    });
  });
});
