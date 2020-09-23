// @formatter:off


const fs = require('fs');
const path = require('path');
const chai = require('chai');

const { expect } = chai;
const request = require('request');
const Server = require('../../../server.js');

const config = {
  microservices: [
    {
      path: '/test_download',
      name: 'Test Download',
      description: 'Tests the file download microservice.',
      serviceFile: 'download.js',
    },
    {
      path: '/test_download_with_name/:name',
      name: 'Test Upload',
      description: 'Tests the file upload microservice.',
      serviceFile: 'download.js',
    },
  ],
};
const port = 1337;
const server = new Server();

describe('As a developer, I need to download files from the server. E2E', () => {
  before(() => {
  });
  beforeEach(() => {
  });
  afterEach(() => {
  });
  after(() => {
  });
  it('should download files from the server', (done) => {
    server.init(port, config, () => {
      const sourceFile = path.resolve('./public/files', 'filename');
      fs.writeFileSync(sourceFile, 'TEXT')
      const url = `http://localhost:${port}/test_download`;
      fs.writeFileSync(sourceFile, 'TEXT');
      request(url, (err, res, body) => {
        if (err) expect(true).to.be.equal(false);
        expect(body).to.be.equal('TEXT');
        fs.unlinkSync(sourceFile);
        server.stop(() => {
          done();
        });
      });
    });
  });
  it('should download files with a given name from the server', (done) => {
    server.init(port, config, () => {
      const sourceFile = path.resolve('./public/files', 'named_file');
      const url = `http://localhost:${port}/test_download_with_name/named_file`;
      fs.writeFileSync(sourceFile, 'TEXT');
      request(url, (err, res, body) => {
        if (err) expect(true).to.be.equal(false);
        expect(body).to.be.equal('TEXT');
        fs.unlinkSync(sourceFile);
        server.stop(() => {
          done();
        });
      });
    });
  });
  it('should fail gracefully when a file does not exist on the server', (done) => {
    server.init(port, config, () => {
      const url = `http://localhost:${port}/test_download_with_name/JUNK`;
      request(url, (err, res, body) => {
        if (err) expect(true).to.be.equal(false);
        expect(res.statusCode).to.be.equal(404);
        server.stop(() => {
          done();
        });
      });
    });
  });
});
