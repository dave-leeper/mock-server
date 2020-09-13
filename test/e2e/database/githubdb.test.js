/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
/* eslint-disable no-undef */
/* eslint-disable no-console */
// @formatter:off

const fs = require('fs');
const path = require('path');
const chai = require('chai');

const { expect } = chai;
const request = require('request');
const GithubDB = require('../../../src/database/githubdb.js');
const Server = require('../../../server.js');
const Registry = require('../../../src/util/registry.js');

const githubdb = new GithubDB();
const testCollection = 'testCollection';
const port = 1337;
const server = new Server();
const config = {
  databaseConnections: [
    {
      name: 'github',
      description: 'Github service.',
      databaseConnector: 'githubdb.js',
      generateConnectionAPI: false,
      generateIndexAPI: false,
      generateDataAPI: false,
      config: {
        owner: 'dave-leeper',
        repo: 'HERO-server-db',
        committer: { name: 'dave-leeper', email: 'magicjtv@gmail.com' },
        author: { name: 'dave-leeper', email: 'magicjtv@gmail.com' },
      },
    },
  ],
};
const data = {
  title: 'my title',
  content: 'my content',
  suggest: 'my suggest',
};
const updateData = {
  title: 'my updated title',
  content: 'my updated content',
  suggest: 'my updated suggest',
};
describe('As a developer, I need to connect, ping, and disconnect to/from mongodb.', () => {
  before(() => {
  });
  beforeEach(() => {
    Registry.unregisterAll();
  });
  afterEach(() => {
  });
  after(() => {
  });
  it('should be able to connect, ping, and disconnect the connection', (done) => {
    githubdb.connect(configInfo.config).then(() => {
      githubdb.ping().then((pingResult) => {
        expect(pingResult).to.be.equal(true);
        githubdb.disconnect().then(() => {
          githubdb.ping().then((pingResult2) => {
            expect(pingResult2).to.be.equal(false);
            done();
          });
        }).catch((err) => {
          console.log(`Test of githubdb.disconnect() failed. Error: ${JSON.stringify(err)}`);
          expect(false).to.be.equal(true);
        });
      });
    });
  });
});

describe('As a developer, I need to create, check for the existence of, and drop githubdb collections.', () => {
  before((done) => {
    githubdb.connect(configInfo.config).then(() => {
      done();
    });
  });
  beforeEach((done) => {
    Registry.unregisterAll();
    githubdb.collectionExists(testCollection).then((exits) => {
      if (!exits) done();
      else {
        githubdb.dropCollection(testCollection).then(() => {
          done();
        });
      }
    });
  });
  afterEach(() => {
  });
  after((done) => {
    githubdb.disconnect().then(() => {
      done();
    });
  });

  it('should create collections (tables).', (done) => {
    githubdb.createCollection(testCollection).then((createResult) => {
      expect(createResult.status).to.be.equal(true);
      done();
    }, (error) => {
      expect(false).to.be.equal(true);
    });
  });

  it('should be able to to tell when a collection exists.', (done) => {
    githubdb.createCollection(testCollection).then((createResult) => {
      expect(createResult.status).to.be.equal(true);
      githubdb.collectionExists(testCollection).then((existsResult) => {
        expect(existsResult).to.be.equal(true);
        done();
      });
    }, (error) => {
      expect(false).to.be.equal(true);
    });
  });

  it('should be able to to tell when a collection does not exist.', (done) => {
    githubdb.collectionExists('JUNK').then((existsResult) => {
      expect(existsResult).to.be.equal(false);
      done();
    });
  });

  it('should drop collections.', (done) => {
    githubdb.createCollection(testCollection).then((createResult) => {
      expect(createResult.status).to.be.equal(true);
      githubdb.dropCollection(testCollection).then((dropResult) => {
        expect(dropResult.status).to.be.equal(true);
        done();
      }, (error) => {
        expect(false).to.be.equal(true);
      });
    });
  });

  it('should not drop collections that dont exist.', (done) => {
    githubdb.dropCollection('JUNK').then((dropResult) => {
      expect(false).to.be.equal(true);
    }, (error) => {
      expect(error.status).to.be.equal(false);
      done();
    });
  });
});

describe('As a developer, I need to perform CRUD operations on the githubdb database.', () => {
  before((done) => {
    githubdb.connect(configInfo.config).then(() => {
      done();
    });
  });
  beforeEach((done) => {
    Registry.unregisterAll();
    githubdb.collectionExists(testCollection).then((exits) => {
      if (exits) return done();
      githubdb.createCollection(testCollection).then(() => {
        done();
      });
    });
  });
  afterEach((done) => {
    githubdb.collectionExists(testCollection).then((exits) => {
      if (!exits) return done();
      githubdb.dropCollection(testCollection).then(() => {
        done();
      });
    });
  });
  after((done) => {
    githubdb.disconnect().then(() => {
      done();
    });
  });
  it('should be able to insert records into the database.', (done) => {
    githubdb.insert(testCollection, data).then((result) => {
      expect(result.status).to.be.equal(true);
      done();
    }, (error) => {
      expect(true).to.be.equal(false);
    });
  });
  it('should be able to read records in the database.', (done) => {
    githubdb.insert(testCollection, data).then((result) => {
      githubdb.read(testCollection).then((result) => {
        expect(result).to.not.be.null;
        expect(result.title).to.be.equal('my title');
        expect(result.content).to.be.equal('my content');
        expect(result.suggest).to.be.equal('my suggest');
        done();
      }, (error) => {
        expect(true).to.be.equal(false);
      });
    }, (error) => {
      expect(true).to.be.equal(false);
    });
  });
  it('should be able to update records in the database.', (done) => {
    githubdb.insert(testCollection, data).then((result) => {
      githubdb.update(testCollection, query, updateData).then((result) => {
        expect(result.status).to.be.equal(true);
        done();
      }, (error) => {
        expect(true).to.be.equal(false);
      });
    }, (error) => {
      expect(true).to.be.equal(false);
    });
  });
  it('should be able to delete records in the database.', (done) => {
    githubdb.insert(testCollection, data).then((result) => {
      githubdb.delete(testCollection, data).then((result) => {
        expect(result.status).to.be.equal(true);
        done();
      }, (error) => {
        expect(true).to.be.equal(false);
      });
    }, (error) => {
      expect(true).to.be.equal(false);
    });
  });
});
