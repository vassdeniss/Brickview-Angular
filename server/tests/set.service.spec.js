const chai = require('chai');
const { expect } = chai;
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const axios = require('axios');
const rewire = require('rewire');
const setService = rewire('../services/setService');
const minioService = require('../services/minioService');

chai.use(sinonChai);
chai.use(chaiAsPromised);

const User = require('../models/User');
const Set = require('../models/Set');
// const Review = require('../models/Review');

describe('Set service methods', function () {
  afterEach(() => {
    sinon.restore();
  });

  describe('getLoggedInUserCollection', () => {
    it('should return user collection with valid refresh token', async () => {
      // Arrange: mock dependencies and data
      const refreshToken = 'someToken';
      const populateStub = sinon.stub().returnsThis();
      const user = {
        sets: ['someSet'],
      };
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
  });

  describe('addSet', () => {
    let axiosGetStub;
    let setId;
    let refreshToken;
    beforeEach(() => {
      axiosGetStub = sinon
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
      setId = '123';
      refreshToken = 'test_refresh_token';
    });

    it('should not add set if already exists', async () => {
      // Arrange: mock dependencies and data
      const userFindOneStub = sinon.stub(User, 'findOne').returns({
        populate: sinon.stub().resolves({
          sets: [
            {
              setNum: '123',
            },
          ],
        }),
      });

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

      // Act: call the method
      await setService.addSet(setId, refreshToken);

      // Assert: check if methods were called
      expect(axiosGetStub).to.have.been.calledTwice;
      expect(setCreateStub).to.have.been.calledOnce;
      expect(userFindOneStub).to.have.been.calledOnce;
      expect(userSaveStub).to.have.been.calledOnce;
    });

    it('should throw error if set not found', async () => {
      // Arrange: mock dependencies and data
      axiosGetStub.restore();
      axiosGetStub = sinon.stub(axios, 'get').rejects({
        response: {},
      });

      // Act+Assert: call the method, error was thrown
      try {
        await setService.addSet('12345', 'some-refresh-token');
      } catch (error) {
        expect(error.message).to.equal('Set not found!');
        expect(error.statusCode).to.equal(404);
        expect(axiosGetStub).to.have.been.calledOnce;
      }
    });
  });

  describe('deleteSet function', () => {
    it('should delete a set and its associated review if authorized', async () => {
      // Arrange: mock the necessary data
      const setId = 'set123';
      const userId = 'user123';
      const email = 'testemail@gmail.com';
      const token = 'your_test_token';

      const decodedToken = { _id: userId, email };
      const jwtStub = { decode: sinon.stub().returns(decodedToken) };
      setService.__set__('jwt', jwtStub);

      const setData = {
        _id: setId,
        setNum: '12345',
        user: { _id: userId, sets: [setId], save: sinon.stub().resolves() },
        review: 'a',
        deleteOne: sinon.stub(),
      };
      const findByIdStub = sinon.stub(Set, 'findById').returns({
        populate: sinon.stub().resolves(setData),
      });

      const deleteReviewImagesStub = sinon
        .stub(minioService, 'deleteReviewImages')
        .resolves();

      // Act: call the function under test
      await setService.deleteSet(setId, token);

      // Assert: check if the methods were called
      expect(jwtStub.decode).to.have.been.calledOnceWith(token);
      expect(findByIdStub).to.have.been.calledOnceWith(setId);
      expect(setData.user.save).to.have.been.calledOnce;
      expect(setData.user.sets).to.not.include(setId);
      expect(deleteReviewImagesStub).to.have.been.calledOnceWith(
        'testemailgmailcom',
        setData.setNum
      );
    });

    it('should delete a set without a review if authorized', async () => {
      // Arrange: mock the necessary data
      const setId = 'set123';
      const userId = 'user123';
      const email = 'testemail';
      const token = 'your_test_token';

      const decodedToken = { _id: userId, email };
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

      const deleteReviewImagesStub = sinon
        .stub(minioService, 'deleteReviewImages')
        .resolves();

      // Act: call the function under test
      await setService.deleteSet(setId, token);

      // Assert: check if the methods were called
      expect(jwtStub.decode).to.have.been.calledOnceWith(token);
      expect(findByIdStub).to.have.been.calledOnceWith(setId);
      expect(set.user.save).to.have.been.calledOnce;
      expect(set.user.sets).to.not.include(setId);
      expect(deleteReviewImagesStub).to.have.not.been.called;
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
        decode: sinon
          .stub()
          .returns({ _id: 'different_user', email: 'testemail@mail.com' }),
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

  describe('getAllWithReview', () => {
    afterEach(() => {
      sinon.restore();
    });

    it('should return an array of sets with review and user data', async () => {
      // Arrange: mock data and stubs
      const mockSet1 = {
        _id: '123',
        name: 'Set 1',
        image: 'image-url-1',
        user: { username: 'user1', email: 'user1@example.com' },
      };
      const mockSet2 = {
        _id: '456',
        name: 'Set 2',
        image: 'image-url-2',
        user: { username: 'user2', email: 'user2@example.com' },
      };
      const mockSets = [mockSet1, mockSet2];

      sinon.stub(Set, 'find').returns({
        select: sinon.stub().returns({
          populate: sinon.stub().resolves(mockSets),
        }),
      });

      sinon.stub(minioService, 'getUserImage').resolves('user-image-url');

      // Act: call the service
      const result = await setService.getAllWithReview();

      // Assert: verify the result
      expect(result).to.be.an('array').with.lengthOf(2);
      expect(result[0]).to.deep.equal({
        _id: '123',
        name: 'Set 1',
        image: 'image-url-1',
        username: 'user1',
        userImage: 'user-image-url',
      });
      expect(result[1]).to.deep.equal({
        _id: '456',
        name: 'Set 2',
        image: 'image-url-2',
        username: 'user2',
        userImage: 'user-image-url',
      });
    });
  });

  describe('getUserCollection', () => {
    it('should return user collection data', async () => {
      // Arrange: mock data and stubs
      const setsData = [
        { _id: 'set1', name: 'Set 1' },
        { _id: 'set2', name: 'Set 2' },
      ];
      const findOneStub = sinon.stub(User, 'findOne').returns({
        populate: sinon.stub().resolves({
          email: 'test@example.com',
          username: 'TestUser',
          sets: setsData,
        }),
      });
      const getUserImageStub = sinon
        .stub(minioService, 'getUserImage')
        .resolves('user-image-data');

      const username = 'testuser';
      const normalizedUsername = username.toLowerCase();

      // Act: call the service
      const result = await setService.getUserCollection(username);

      // Assert: verify the methods were called
      expect(findOneStub).to.have.been.calledOnceWith({ normalizedUsername });
      expect(getUserImageStub).to.have.been.calledOnceWith('testexamplecom');
      expect(result).to.deep.equal({
        user: {
          image: 'user-image-data', // Replace with expected image data
          username: 'TestUser',
        },
        sets: setsData,
      });
    });

    it('should throw error if user not found', async () => {
      // Arrange: mock data and stubs
      const findOneStub = sinon.stub(User, 'findOne').returns({
        populate: sinon.stub().resolves(null),
      });
      const username = 'nonexistentuser';
      const normalizedUsername = username.toLowerCase();

      // Act+Assert: call the service, error was thrown
      try {
        await setService.getUserCollection(username);
        expect.fail('Expected an error to be thrown');
      } catch (error) {
        expect(error.message).to.equal('User not found!');
        expect(findOneStub).to.have.been.calledOnceWith({ normalizedUsername });
      }
    });
  });
});
