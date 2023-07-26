const chai = require('chai');
const { expect } = chai;
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const axios = require('axios');

chai.use(sinonChai);

const setService = require('../services/setService');
const User = require('../models/User');
const Set = require('../models/Set');

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
});
