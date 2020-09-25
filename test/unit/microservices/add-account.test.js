/* eslint-disable strict */
/* eslint-disable lines-around-directive */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-unresolved */
/* eslint-disable global-require */
// @formatter:off
const chai = require('chai');
const Files = require('@util/files');
const Registry = require('@sutil/registry');
const Authentication = require('@private/users/authentication.json');

const { expect } = chai;
const AddAccountMicroservice = require('@src/microservices/add-account.js');
const DeleteAccountMicroservice = require('@src/microservices/delete-account.js');

describe('As a developer, I need need to obtain a list of endpoints that are available.', () => {
  before(() => {
  });
  beforeEach(() => {
    Registry.unregisterAll();
    Registry.register(Authentication, 'Accounts');
  });
  afterEach(() => {
  });
  after(() => {
    Registry.unregisterAll();
  });

  it('should add a user and remember their machine (when that option is set)', (done) => {
    const addAccountMicroservice = new AddAccountMicroservice();
    const reqInfo = {
      clientIp: 'test',
      body: {
        username: 'TestingUser',
        password: 'Password',
        group1: 'users',
        email: 'test@test.com',
        firstName: 'Joe',
        lastName: 'User',
        rememberMe: true,
      },
    };
    addAccountMicroservice.do(reqInfo).then((response) => {
      expect(Files.existsSync(`${AddAccountMicroservice.userPath}/${reqInfo.body.username}`)).to.be.equal(true);

      const userAccount = Registry.getUserAccount(reqInfo.body.username);
      expect(!!userAccount).to.be.equal(true);
      expect(userAccount.username).to.be.equal(reqInfo.body.username);

      const newAuthentication = require('@private/users/authentication.json');
      let found = false;
      for (let accountIndex = 0; accountIndex < newAuthentication.accounts.length; accountIndex++) {
        const account = newAuthentication.accounts[accountIndex];
        if (account.username === reqInfo.body.username) {
          found = true;
          break;
        }
      }
      expect(found).to.be.equal(true);

      found = false;
      const machines = require('@private/machines/machines.json');
      for (let i = machines.length - 1; i >= 0; i--) {
        if (reqInfo.body.username.toUpperCase() === machines[i].username.toUpperCase()) {
          found = true;
        }
      }
      expect(found).to.be.equal(true);
      const deleteAccountMicroservice = new DeleteAccountMicroservice();
      deleteAccountMicroservice.do(reqInfo).then(() => { done(); });
    }, (error) => {
      expect(true).to.be.equal(false);
    });
  });

  it('should add a user and not remember their machine (when that option is not set)', (done) => {
    const addAccountMicroservice = new AddAccountMicroservice();
    const reqInfo = {
      clientIp: 'test',
      body: {
        username: 'TestingUser',
        password: 'Password',
        group1: 'users',
        email: 'test@test.com',
        firstName: 'Joe',
        lastName: 'User',
        rememberMe: false,
      },
    };
    addAccountMicroservice.do(reqInfo).then((response) => {
      expect(Files.existsSync(`${AddAccountMicroservice.userPath}/${reqInfo.body.username}`)).to.be.equal(true);

      const userAccount = Registry.getUserAccount(reqInfo.body.username);
      expect(!!userAccount).to.be.equal(true);
      expect(userAccount.username).to.be.equal(reqInfo.body.username);

      const newAuthentication = require('@private/users/authentication.json');
      let found = false;
      for (let accountIndex = 0; accountIndex < newAuthentication.accounts.length; accountIndex++) {
        const account = newAuthentication.accounts[accountIndex];
        if (account.username === reqInfo.body.username) {
          found = true;
          break;
        }
      }
      expect(found).to.be.equal(true);

      found = false;
      const machines = require('@private/machines/machines.json');
      for (let i = machines.length - 1; i >= 0; i--) {
        if (reqInfo.body.username.toUpperCase() === machines[i].username.toUpperCase()) {
          found = true;
        }
      }
      expect(found).to.be.equal(false);
      const deleteAccountMicroservice = new DeleteAccountMicroservice();
      deleteAccountMicroservice.do(reqInfo).then(() => { done(); });
    }, (error) => {
      expect(true).to.be.equal(false);
    });
  });

  it('should not add an account that already exists.', (done) => {
    const addAccountMicroservice = new AddAccountMicroservice();
    const reqInfo = {
      clientIp: 'test',
      body: {
        username: 'TestingUser',
        password: 'Password',
        group1: 'users',
        email: 'test@test.com',
        firstName: 'Joe',
        lastName: 'User',
        rememberMe: false,
      },
    };
    try {
      addAccountMicroservice.do(reqInfo).then((response) => {
        expect(response.status).to.be.equal(200);

        addAccountMicroservice.do(reqInfo).then((response2) => {
          expect(response.status).to.be.equal(400);

          const deleteAccountMicroservice = new DeleteAccountMicroservice();
          deleteAccountMicroservice.do(reqInfo).then(() => { done(); });
        });
      });
    } catch (error) {
      expect(true).to.be.equal(false);
    }
  });
});
