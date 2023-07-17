const chai = require('chai');
const { expect } = chai;
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const axios = require('axios');

chai.use(sinonChai);

const setService = require('../services/setService');
const { mockedSetData, mockedFigData } = require('./mockedData');
const User = require('../models/User');

chai.use(chaiAsPromised);

describe('Set service methods', function () {
  afterEach(() => {
    sinon.restore();
  });

  describe('get', async () => {
    it('should return set data', async () => {
      const setId = 12345;

      sinon.stub(axios, 'get').resolves({ data: mockedSetData });

      const result = await setService.get(setId);

      expect(result).to.deep.equal(mockedSetData);
    });

    it('should throw an error when an invalid setId is provided', async () => {
      const setId = 'invalidId';

      sinon.stub(axios, 'get').rejects(new Error('Invalid setId'));

      await expect(setService.get(setId)).to.be.rejectedWith('Invalid setId');
    });
  });

  describe('getWithMinifigs', () => {
    it('should return set data and minifigs data', async () => {
      const setId = 12345;

      sinon
        .stub(axios, 'get')
        .onFirstCall()
        .resolves({ data: mockedSetData })
        .onSecondCall()
        .resolves({ data: mockedFigData });

      const expected = {
        setNum: '12345',
        name: 'Some set',
        year: 2023,
        parts: 4152,
        image: 'i-am-an-image-url',
        minifigCount: 1,
        results: [
          {
            id: 1231,
            set_num: 'fig-851653',
            set_name: 'Some minifig',
            quantity: 1,
            set_img_url: 'i-am-an-image-url',
          },
        ],
      };

      const data = await setService.getWithMinifigs(setId);

      expect(data).to.deep.equal(expected);
    });

    it('should throw an error when an invalid setId is provided', async () => {
      const setId = 'invalidId';

      sinon
        .stub(axios, 'get')
        .onFirstCall()
        .rejects(new Error('Invalid setId'));

      await expect(setService.getWithMinifigs(setId)).to.be.rejectedWith(
        'Invalid setId'
      );
    });
  });

  describe('getLoggedInUserCollection', () => {
    it('should return user collection with valid refresh token', async () => {
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

      const sets = await setService.getLoggedInUserCollection(refreshToken);

      expect(findOneStub).to.have.been.calledWith({ refreshToken });
      expect(populateStub).to.have.been.calledWith('sets');
      expect(selectStub).to.have.been.calledWith('sets');
      expect(sets).to.deep.equal(user.sets);
    });

    it('should throw error with invalid refresh token', async () => {
      const refreshToken = 'someToken';
      const populateStub = sinon.stub().returnsThis();
      const selectStub = sinon.stub().resolves(null);
      const findOneStub = sinon.stub(User, 'findOne').returns({
        populate: populateStub,
        select: selectStub,
      });

      try {
        await setService.getLoggedInUserCollection(refreshToken);
        expect.fail('Expected an error but none was thrown');
      } catch (error) {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.equal('Invalid token');
      }

      expect(findOneStub).to.have.been.calledWith({ refreshToken });
      expect(populateStub).to.have.been.calledWith('sets');
      expect(selectStub).to.have.been.calledWith('sets');
    });
  });
});
