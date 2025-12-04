const { expect } = require('chai');
const sinon = require('sinon');

const axios = require('axios');
const jwt = require('jsonwebtoken');

const Set = require('../models/Set');
const User = require('../models/User');
const minioService = require('../services/minioService');
const setService = require('../services/setService');

describe('setService', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    process.env.REBRICKABLE_API_KEY = 'test-key';
  });

  afterEach(() => {
    sandbox.restore();
  });

  function makeFindQueryStub(result) {
    const populateStub = sandbox.stub().resolves(result);
    const selectStub = sandbox.stub().returns({ populate: populateStub });
    return { selectStub, populateStub, root: { select: selectStub, populate: populateStub } };
  }

  describe('getAllWithReview', () => {
    it('should fetch all sets with reviews (no filter) and attach user images', async () => {
      const setsFromDb = [
        {
          _id: 'set1',
          name: 'Set One',
          image: 'https://img/set1.jpg',
          reviewDate: new Date('2021-01-01'),
          user: {
            username: 'john',
            email: 'john@example.com',
          },
        },
        {
          _id: 'set2',
          name: 'Set Two',
          image: 'https://img/set2.jpg',
          reviewDate: new Date('2021-02-01'),
          user: {
            username: 'john',
            email: 'john@example.com',
          },
        },
      ];

      const { root } = makeFindQueryStub(setsFromDb);
      sandbox.stub(Set, 'find').returns(root);
      const getUserImageStub = sandbox
        .stub(minioService, 'getUserImage')
        .resolves('https://avatar/john.png');

      const result = await setService.getAllWithReview();

      expect(Set.find.calledOnce).to.be.true;
      expect(Set.find.firstCall.args[0]).to.deep.equal({ review: { $ne: null } });

      expect(getUserImageStub.calledOnce).to.be.true;

      expect(result).to.have.length(2);
      expect(result[0]).to.include({
        _id: 'set1',
        name: 'Set One',
        image: 'https://img/set1.jpg',
        username: 'john',
        userImage: 'https://avatar/john.png',
      });
      expect(result[0].reviewDate).to.be.a('string');
    });

    it('should apply setNumber filter when provided', async () => {
      const setsFromDb = [];
      const { root } = makeFindQueryStub(setsFromDb);
      const findStub = sandbox.stub(Set, 'find').returns(root);
      sandbox.stub(minioService, 'getUserImage');

      await setService.getAllWithReview('8091');

      expect(findStub.calledOnce).to.be.true;
      expect(findStub.firstCall.args[0]).to.deep.equal({
        review: { $ne: null },
        setNum: { $regex: '8091' },
      });
    });
  });

  describe('getUserCollection', () => {
    it('should return user collection and user image when user exists', async () => {
      const mockUser = {
        username: 'guest',
        email: 'guest@example.com',
        sets: [{ setNum: '8091-1' }],
      };

      const populateStub = sandbox.stub().resolves(mockUser);
      const findOneStub = sandbox
        .stub(User, 'findOne')
        .returns({ populate: populateStub });

      const getUserImageStub = sandbox
        .stub(minioService, 'getUserImage')
        .resolves('https://avatar/guest.png');

      const result = await setService.getUserCollection('Guest', 'en');

      expect(findOneStub.calledOnce).to.be.true;
      expect(findOneStub.firstCall.args[0]).to.deep.equal({
        normalizedUsername: 'guest',
      });

      expect(getUserImageStub.calledOnceWith('guestexamplecom')).to.be.true;
      expect(result).to.deep.equal({
        user: {
          image: 'https://avatar/guest.png',
          username: 'guest',
        },
        sets: mockUser.sets,
      });
    });

    it('should throw 404 error when user does not exist', async () => {
      const populateStub = sandbox.stub().resolves(null);
      sandbox.stub(User, 'findOne').returns({ populate: populateStub });

      try {
        await setService.getUserCollection('notfound', 'bg');
        throw new Error('Expected error was not thrown');
      } catch (err) {
        expect(err).to.be.instanceOf(Error);
        expect(err.message).to.equal('Потребителят не е намерен!');
        expect(err.statusCode).to.equal(404);
      }
    });
  });

  describe('addSet', () => {
    it('should add a set for a user and return updated user', async () => {
      const setId = '8091';
      const refreshToken = 'refresh-token';
      const language = 'en';

      const foundSetData = {
        set_num: '8091-1',
        name: 'Republic Swamp Speeder',
        year: 2010,
        num_parts: 176,
        set_img_url: 'https://img/8091-1.jpg',
      };

      const figsData = {
        count: 2,
        results: [
          {
            set_name: 'Fig One',
            quantity: 1,
            set_img_url: 'https://img/fig1.jpg',
          },
          {
            set_name: 'Fig Two',
            quantity: 2,
            set_img_url: 'https://img/fig2.jpg',
          },
        ],
      };

      const axiosGetStub = sandbox.stub(axios, 'get');
      axiosGetStub.onCall(0).resolves({ data: foundSetData });
      axiosGetStub.onCall(1).resolves({ data: figsData });

      const user = {
        _id: 'user1',
        username: 'guest',
        email: 'guest@example.com',
        sets: [],
        save: sandbox.stub().resolves(),
      };
      user.sets.push = function () {}; // no-op, avoids weird equals logic

      const populateStub = sandbox.stub().resolves(user);
      sandbox.stub(User, 'findOne').returns({ populate: populateStub });

      const createdSet = {
        _id: 'set1',
        ...foundSetData,
      };
      sandbox.stub(Set, 'create').resolves(createdSet);

      const result = await setService.addSet(setId, refreshToken, language);

      expect(axiosGetStub.calledTwice).to.be.true;
      expect(User.findOne.calledOnce).to.be.true;
      expect(Set.create.calledOnce).to.be.true;

      expect(result.user).to.include({
        _id: 'user1',
        username: 'guest',
        email: 'guest@example.com',
      });
      expect(result.user.sets).to.be.an('array');
    });

    it('should throw 404 when set is not found in external API', async () => {
      const axiosGetStub = sandbox.stub(axios, 'get');
      axiosGetStub.onCall(0).rejects(new Error('Not found'));

      try {
        await setService.addSet('badid', 'refresh', 'en');
        throw new Error('Expected error was not thrown');
      } catch (err) {
        expect(err).to.be.instanceOf(Error);
        expect(err.message).to.equal('Set not found!');
        expect(err.statusCode).to.equal(404);
      }
    });

    it('should throw 404 when user with refreshToken is not found', async () => {
      const foundSetData = {
        set_num: '8091-1',
        name: 'Test Set',
        year: 2010,
        num_parts: 100,
        set_img_url: 'https://img/set.jpg',
      };

      const figsData = { count: 0, results: [] };

      const axiosGetStub = sandbox.stub(axios, 'get');
      axiosGetStub.onCall(0).resolves({ data: foundSetData });
      axiosGetStub.onCall(1).resolves({ data: figsData });

      const populateStub = sandbox.stub().resolves(null);
      sandbox.stub(User, 'findOne').returns({ populate: populateStub });

      try {
        await setService.addSet('8091', 'bad-refresh', 'bg');
        throw new Error('Expected error was not thrown');
      } catch (err) {
        expect(err.message).to.equal('Потребителят не е намерен!');
        expect(err.statusCode).to.equal(404);
      }
    });

    it('should throw 409 when set already exists in user collection', async () => {
      const foundSetData = {
        set_num: '8091-1',
        name: 'Test Set',
        year: 2010,
        num_parts: 100,
        set_img_url: 'https://img/set.jpg',
      };

      const figsData = { count: 0, results: [] };

      const axiosGetStub = sandbox.stub(axios, 'get');
      axiosGetStub.onCall(0).resolves({ data: foundSetData });
      axiosGetStub.onCall(1).resolves({ data: figsData });

      const user = {
        _id: 'user1',
        username: 'guest',
        email: 'guest@example.com',
        sets: [{ setNum: '8091-1' }],
      };
      const populateStub = sandbox.stub().resolves(user);
      sandbox.stub(User, 'findOne').returns({ populate: populateStub });

      try {
        await setService.addSet('8091', 'refresh', 'en');
        throw new Error('Expected error was not thrown');
      } catch (err) {
        expect(err.message).to.equal('Set already exists in collection!');
        expect(err.statusCode).to.equal(409);
      }
    });
  });

  describe('deleteSet', () => {
    it('should delete set and its review images when authorized and has review', async () => {
      const language = 'en';

      const payload = {
        _id: 'user1',
        email: 'user@example.com',
      };
      const token = jwt.sign(payload, 'test-secret');

      const user = {
        _id: 'user1',
        username: 'guest',
        email: 'user@example.com',
        sets: ['set1', 'set2'],
        save: sandbox.stub().resolves(),
        populate: sandbox.stub().callsFake(function () {
          this.sets = this.sets.map((id) => ({
            _id: id,
            review: id === 'set2' ? null : 'Nice set',
            toObject() {
              return { _id: this._id, review: this.review };
            },
          }));
          return Promise.resolve(this);
        }),
      };

      const setDoc = {
        _id: 'set1',
        setNum: '8091-1',
        review: 'Nice set',
        user,
        deleteOne: sandbox.stub().resolves(),
      };

      const populateStub = sandbox.stub().resolves(setDoc);
      sandbox.stub(Set, 'findById').returns({ populate: populateStub });

      const deleteReviewImagesStub = sandbox
        .stub(minioService, 'deleteReviewImages')
        .resolves();

      const result = await setService.deleteSet('set1', token, language);

      expect(Set.findById.calledOnceWith('set1')).to.be.true;
      expect(deleteReviewImagesStub.calledOnce).to.be.true;
      expect(result.user._id).to.equal('user1');
      expect(result.user.sets).to.be.an('array');
      expect(result.user.sets[0]).to.deep.include({ _id: 'set2' });
      expect(result.user.sets[0]).to.have.property('review');
    });

    it('should throw 404 when set is not found', async () => {
      const token = jwt.sign(
        { _id: 'user1', email: 'user@example.com' },
        'test-secret'
      );

      const populateStub = sandbox.stub().resolves(null);
      sandbox.stub(Set, 'findById').returns({ populate: populateStub });

      try {
        await setService.deleteSet('missing-id', token, 'en');
        throw new Error('Expected error was not thrown');
      } catch (err) {
        expect(err.message).to.equal('Set not found!');
        expect(err.statusCode).to.equal(404);
      }
    });

   it('should throw 403 when user is not authorized to delete the set', async () => {
     const token = jwt.sign(
       { _id: 'otheruser', email: 'user@example.com' },
       'test-secret'
     );

      const user = {
        _id: 'ownerid',
        sets: [],
      };

      const setDoc = {
        _id: 'set1',
        setNum: '8091-1',
        user,
      };

      const populateStub = sandbox.stub().resolves(setDoc);
      sandbox.stub(Set, 'findById').returns({ populate: populateStub });

      try {
        await setService.deleteSet('set1', token, 'bg');
        throw new Error('Expected error was not thrown');
      } catch (err) {
        expect(err.message).to.equal('Нямате права да изтриете този сет!');
        expect(err.statusCode).to.equal(403);
      }
    });
  });
});
