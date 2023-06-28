const chai = require('chai');
const { expect } = chai;
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const axios = require('axios');

const setService = require('../services/setService');
const { mockedSetData, mockedFigData } = require('./mockedData');

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

      const [set, figs] = await setService.getWithMinifigs(setId);

      expect(set).to.deep.equal(mockedSetData);
      expect(figs).to.deep.equal(mockedFigData);
    });

    it('should throw an error when an invalid setId is provided', async () => {
      const setId = 'invalidId';

      sinon
        .stub(axios, 'get')
        .onFirstCall()
        .rejects(new Error('Invalid setId'))
        .onSecondCall()
        .resolves({ data: mockedFigData });

      await expect(setService.getWithMinifigs(setId)).to.be.rejectedWith(
        'Invalid setId'
      );
    });
  });
});
