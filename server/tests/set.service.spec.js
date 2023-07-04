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
});
