// @formatter:off

const chai = require('chai');
const Log = require('../../../src/util/log');
const Registry = require('../../../src/util/registry');

const { expect } = chai;
const MocksMicroservice = require('../../../src/microservices/mocks.js');

const config = {
  mocks: [
    {
      path: '/json',
      response: './server-configure.json',
      responseType: 'JSON',
      headers: [{ header: 'MY_HEADER', value: 'MY_HEADER_VALUE' }],
    },
    {
      path: '/hbs',
      response: 'index.hbs',
      responseType: 'HBS',
      hbsData: { title: 'Index' },
      headers: [{ header: 'MY_HEADER', value: 'MY_HEADER_VALUE' }],
    },
    {
      path: '/text',
      response: './views/index.hbs',
      responseType: 'TEXT',
      headers: [{ header: 'MY_HEADER', value: 'MY_HEADER_VALUE' }],
    },
    {
      path: '/json-junk',
      response: './JUNK.json',
      responseType: 'JSON',
      headers: [{ header: 'MY_HEADER', value: 'MY_HEADER_VALUE' }],
    },
    {
      path: '/text-junk',
      response: './JUNK.tex',
      responseType: 'TEXT',
      headers: [{ header: 'MY_HEADER', value: 'MY_HEADER_VALUE' }],
    },
  ],
};

describe('As a developer, I need need to obtain a list of mocks that are available.', () => {
  before(() => {
  });
  beforeEach(() => {
    Registry.unregisterAll();
  });
  afterEach(() => {
  });
  after(() => {
    Registry.unregisterAll();
  });
  it('should return a list of mock util available.', (done) => {
    const mocksMicroservice = new MocksMicroservice();
    const expectedResponse = Log.stringify([{
      path: '/json',
      response: './server-configure.json',
      responseType: 'JSON',
    },
    {
      path: '/hbs',
      response: 'index.hbs',
      responseType: 'HBS',
    },
    {
      path: '/text',
      response: './views/index.hbs',
      responseType: 'TEXT',
    },
    {
      path: '/json-junk',
      response: './JUNK.json',
      responseType: 'JSON',
    },
    {
      path: '/text-junk',
      response: './JUNK.tex',
      responseType: 'TEXT',
    }]);
    Registry.register(config, 'ServerConfig');
    mocksMicroservice.do({}).then((response) => {
      expect(response.send).to.be.equal(expectedResponse);
      expect(response.status).to.be.equal(200);
      done();
    }, (error) => {
      expect(true).to.be.equal(false);
    });
  });
});
