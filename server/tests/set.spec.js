const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const axios = require('axios');
const setService = require('../services/setService');

chai.use(chaiAsPromised);

const { expect } = chai;

describe('Set service methods', function () {
  describe('get', async () => {
    it('should return set data', async () => {
      const setId = 12345;
      const responseData = {
        set_num: '12345',
        name: 'Some set',
        year: 2023,
        theme_id: 231,
        num_parts: 4152,
        set_img_url: 'i-am-an-image-url',
        set_url: 'i-am-a-set-url',
        last_modified_dt: '2023-11-03T10:03:02.689879Z',
      };

      sinon.stub(axios, 'get').resolves({ data: responseData });

      const result = await setService.get(setId);

      expect(result).to.deep.equal(responseData);

      axios.get.restore();
    });

    it('should throw an error when an invalid setId is provided', async () => {
      const setId = 'invalidId';

      sinon.stub(axios, 'get').rejects(new Error('Invalid setId'));

      await expect(setService.get(setId)).to.be.rejectedWith('Invalid setId');

      axios.get.restore();
    });
  });

  describe('getWithMinifigs', () => {
    it('should return set data and minifigs data', async () => {
      const setId = 12345;
      const setResponseData = {
        set_num: '12345',
        name: 'Some set',
        year: 2023,
        theme_id: 231,
        num_parts: 4152,
        set_img_url: 'i-am-an-image-url',
        set_url: 'i-am-a-set-url',
        last_modified_dt: '2023-11-03T10:03:02.689879Z',
      };
      const figsResponseData = {
        count: 1,
        next: null,
        previous: null,
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

      sinon
        .stub(axios, 'get')
        .onFirstCall()
        .resolves({ data: setResponseData })
        .onSecondCall()
        .resolves({ data: figsResponseData });

      const [set, figs] = await setService.getWithMinifigs(setId);

      expect(set).to.deep.equal(setResponseData);
      expect(figs).to.deep.equal(figsResponseData);

      axios.get.restore();
    });

    it('should throw an error when an invalid setId is provided', async () => {
      const setId = 'invalidId';
      const figsResponseData = {
        count: 1,
        next: null,
        previous: null,
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

      sinon
        .stub(axios, 'get')
        .onFirstCall()
        .rejects(new Error('Invalid setId'))
        .onSecondCall()
        .resolves({ data: figsResponseData });

      await expect(setService.getWithMinifigs(setId)).to.be.rejectedWith(
        'Invalid setId'
      );

      axios.get.restore();
    });
  });
});
