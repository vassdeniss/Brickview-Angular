const request = require('supertest');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chai = require('chai');
const { expect } = chai;

chai.use(sinonChai);

const setService = require('../services/setService');
const authMiddleware = require('../middlewares/auth');

let app;

describe('Set controller routes', function () {
  beforeEach(() => {
    sinon.stub(authMiddleware, 'mustBeAuth').callsFake((req, res, next) => {
      next();
    });

    app = require('../server');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('GET /logged-user-collection', () => {
    it('should return 200 with the user collection', async () => {
      sinon
        .stub(setService, 'getLoggedInUserCollection')
        .resolves({ mockData: 'collection' });

      const response = await request(app)
        .get('/sets/logged-user-collection')
        .set('X-Refresh', 'mockRefreshToken');

      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal({ mockData: 'collection' });
    });

    it('should return 404 if an error occurs', async () => {
      sinon
        .stub(setService, 'getLoggedInUserCollection')
        .throws(new Error('mockError'));

      const response = await request(app)
        .get('/sets/logged-user-collection')
        .set('X-Refresh', 'mockRefreshToken');

      expect(response.status).to.equal(404);
      expect(response.body.message).to.equal('mockError');
    });
  });

  describe('POST /add-set', () => {
    it('should return 204 if set is added successfully', async () => {
      sinon.stub(setService, 'addSet');

      const response = await request(app)
        .post('/sets/add-set')
        .set('X-Refresh', 'mockRefreshToken')
        .send({ setId: 'mockSetId' });

      expect(response.status).to.equal(204);
    });

    it('should return 404 if the set is not found', async () => {
      sinon.stub(setService, 'addSet').throws(new Error('Set not found!'));

      const response = await request(app)
        .post('/sets/add-set')
        .set('X-Refresh', 'mockRefreshToken')
        .send({ setId: 'mockSetId' });

      expect(response.status).to.equal(404);
      expect(response.body.message).to.equal('Set not found!');
    });
  });
});
