/* eslint-disable no-console */
// @formatter:off


const chai = require('chai');

const { expect } = chai;
const request = require('request');
const Server = require('../../../server.js');

const config = {
  mocks: [
    {
      path: '/ping',
      response: { name: 'My Server', version: '1.0' },
      responseType: 'JSON',
      headers: [{ header: 'MY_HEADER', value: 'MY_HEADER_VALUE' }],
    },
  ],
  microservices: [
    {
      path: '/throw',
      name: 'Throw Exception',
      description: 'A microservice that throws an exception. For testing purposes.',
      serviceFile: 'throw.js',
    },
  ],
};

describe('As a developer, I need the server to continue running when exceptions are thrown.', () => {
  it('should continue running after an exception is thrown', (done) => {
    console.log('=============== throw 1');
    const port = 1337;
    const server = new Server();
    const serverInitCallback = () => {
      console.log('=============== throw 2');
      request(`http://localhost:${port}/throw`, { json: true }, (_err, _res, _body) => {
        console.log('=============== throw 3');
        request(`http://localhost:${port}/ping`, { json: true }, (_err2, _res2, body) => {
          console.log('=============== throw 4');
          expect(body.name).to.be.equal('My Server');
          expect(body.version).to.be.equal('1.0');
          server.stop(() => {
            console.log('=============== throw 5');
            done();
          });
        });
      });
    };
    server.init(port, config, serverInitCallback);
  }).timeout(5000);
});
