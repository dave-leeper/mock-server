/*
  machines.json
  accounts
    index.json       // All emails and usernames used for accounts.
    user1
        account.json
        owned.json
        favorites.json
        cart.json
        toons
            toon1.hero (encrypted)
            toon2.hero (encrypted)

  Account
    username
    password (encrypted)
    email
    firstName
    lastName
    rememberMe
    groups
    authorization
*/

// https://github.com/pbojinov/request-ip
const path = require('path');
const Encrypt = require('../util/encrypt');
const GithubDB = require('../database/githubdb');
const I18n = require('../util/i18n');
const Log = require('../util/log');
const Registry = require('../util/registry');
const Strings = require('../util/strings');

class AddAccount {
  do(params) {
    return new Promise((inResolve, inReject) => {
      const addAccount = async () => {
        const databaseResult = await this.getDatabaseClient();
        if (databaseResult.status !== 200) {
          if (Log.will(Log.ERROR)) Log.error(databaseResult.send);
          inReject && inReject(databaseResult);
          return;
        }
        const databaseClient = databaseResult.client;
        const newAccount = this.buildAccount(params.body);

        const validateResult = await this.validate(databaseClient, newAccount);
        if (validateResult.status !== 200) {
          if (Log.will(Log.ERROR)) Log.error(validateResult.send);
          inReject && inReject(validateResult);
          return;
        }

        const updateEmailResult = await this.updateIndex(databaseClient, newAccount);
        if (updateEmailResult.status !== 200) {
          if (Log.will(Log.ERROR)) Log.error(updateEmailResult.send);
          inReject && inReject(updateEmailResult);
          return;
        }

        const machine = params.req.clientIp;
        const { rememberMe } = params.req;
        const addAccountResult = await this.addAccount(databaseClient, newAccount, machine, rememberMe);
        if (addAccountResult.status !== 200) {
          if (Log.will(Log.ERROR)) Log.error(addAccountResult.send);
          inReject && inReject(addAccountResult);
          return;
        }

        const message = I18n.get(Strings.SUCCESS_MESSAGE_ACCOUNT_ADDED);
        inResolve && inResolve({ status: 200, send: message });
      };

      addAccount();
    });
  }

  async getDatabaseClient() {
    const databaseConnectionManager = Registry.get('DatabaseConnectionManager');
    if (!databaseConnectionManager) {
      const message = Strings.format(I18n.get(Strings.ERROR_MESSAGE_ACCOUNT_ADD_FAILED), 'Could not load database connection manager.');
      if (Log.will(Log.ERROR)) Log.error(message);
      return { status: 500, send: message };
    }
    const githubDB = databaseConnectionManager.getConnection('github');
    if (!githubDB) {
      const message = Strings.format(I18n.get(Strings.ERROR_MESSAGE_ACCOUNT_ADD_FAILED), 'Could not load database client.');
      if (Log.will(Log.ERROR)) Log.error(message);
      return { status: 500, send: message };
    }
    const pingResult = await githubDB.ping();
    if (!pingResult) {
      const message = Strings.format(I18n.get(Strings.ERROR_MESSAGE_ACCOUNT_ADD_FAILED), 'Could not connect to database.');
      if (Log.will(Log.ERROR)) Log.error(message);
      return { status: 500, send: message };
    }
    return { status: 200, client: githubDB };
  }

  buildAccount(body) {
    const newAccount = {
      username: body.username,
      password: body.password,
      groups: [],
    };
    if (body.group1) newAccount.groups.push(body.group1);
    if (body.group2) newAccount.groups.push(body.group2);
    if (body.group3) newAccount.groups.push(body.group3);
    if (body.headername1 || body.headername2 || body.headername3) {
      newAccount.headers = [];
      if (body.headername1) newAccount.headers.push({ header: body.headername1, value: body.headervalue1 });
      if (body.headername2) newAccount.headers.push({ header: body.headername2, value: body.headervalue2 });
      if (body.headername3) newAccount.headers.push({ header: body.headername3, value: body.headervalue3 });
    }
    if (body.cookiename1 || body.cookiename2 || body.cookiename3) {
      newAccount.cookies = [];
      if (body.cookiename1) newAccount.cookies.push(this.makeCookie(body.cookiename1, body.cookievalue1, body.cookieepires1, body.cookiemaxage1));
      if (body.cookiename2) newAccount.cookies.push(this.makeCookie(body.cookiename2, body.cookievalue2, body.cookieepires2, body.cookiemaxage2));
      if (body.cookiename3) newAccount.cookies.push(this.makeCookie(body.cookiename3, body.cookievalue3, body.cookieepires3, body.cookiemaxage3));
    }
    if (body.email) newAccount.email = body.email;
    if (body.firstName) newAccount.firstName = body.firstName;
    if (body.lastName) newAccount.lastName = body.lastName;
    const now = new Date();
    const transactionDate = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
    newAccount.transactionDate = transactionDate;
    return newAccount;
  }

  makeCookie(name, value, expires, maxAge) {
    const cookie = { name, value };
    if (expires) cookie.expires = expires;
    if (maxAge) cookie.maxAge = maxAge;
    return cookie;
  }

  async validate(databaseClient, newAccount) {
    if (!newAccount.username) return { status: 400, send: Strings.format(I18n.get(Strings.ERROR_MESSAGE_INCORRECT_USER_NAME), newAccount.username) };
    if (!newAccount.password) return { status: 400, send: Strings.format(I18n.get(Strings.ERROR_MESSAGE_INCORRECT_PASSWORD), newAccount.username) };
    if (!newAccount.group1 && !newAccount.group2 && !newAccount.group3) return { status: 400, send: Strings.format(I18n.get(Strings.ERROR_MESSAGE_INCORRECT_GROUP), newAccount.username) };
    const emailAndUserNameStatus = await this.validateEmailAndUserName(databaseClient, newAccount);
    if (emailAndUserNameStatus.status !== 200) return emailAndUserNameStatus;
    const passwordStatus = await this.validatePassword(newAccount);
    return passwordStatus;
  }

  async validateEmailAndUserName(databaseClient, newAccount) {
    if (!newAccount.email
    || newAccount.email.length < 5
    || newAccount.email.indexOf('@') === -1
    || newAccount.email.indexOf('.') === -1) {
      return { status: 400, send: Strings.format(I18n.get(Strings.ERROR_MESSAGE_INCORRECT_EMAIL), newAccount.email) };
    }
    if ((!newAccount.username)
    || (newAccount.username.length === 0)
    || (newAccount.username.length < 5)
    || (!/[a-zA-Z0-9-_]/.test(newAccount.username))) {
      return { status: 400, send: Strings.format(I18n.get(Strings.ERROR_MESSAGE_INCORRECT_USER_NAME), newAccount.username) };
    }

    const accounts = await databaseClient.read('index.json');
    for (let i = 0; i < accounts.length; i++) {
      if (newAccount.email === accounts[i].email) {
        return { status: 400, send: Strings.format(I18n.get(Strings.ERROR_MESSAGE_INCORRECT_EMAIL), newAccount.email) };
      }
      if (newAccount.username === accounts[i].username) {
        return { status: 400, send: Strings.format(I18n.get(Strings.ERROR_MESSAGE_INCORRECT_USER_NAME), newAccount.username) };
      }
    }
    return { status: 200 };
  }

  async validatePassword(newAccount) {
    if ((!newAccount.password)
    || (newAccount.password.length === 0)
    || (newAccount.password.length < 5)
    || (!/[a-zA-Z0-9-_]/.test(newAccount.username))) {
      return { status: 400, send: I18n.get(Strings.ERROR_MESSAGE_INCORRECT_PASSWORD) };
    }
    return { status: 200 };
  }

  async updateIndex(databaseClient, newAccount) {
    try {
      let emailsData = await databaseClient.read('index.json');
      const emails = JSON.parse(emailsData);
      emails.push({ email: newAccount.email, username: newAccount.username });
      emailsData = JSON.stringify(emails);
      databaseClient.update('index.json', emailsData);
      return { status: 200 };
    } catch (err) {
      const message = Strings.format(I18n.get(Strings.ERROR_MESSAGE_ACCOUNT_ADD_FAILED), 'Could not update email/username information.');
      if (Log.will(Log.ERROR)) Log.error(message);
      return { status: 500, send: message };
    }
  }

  async addAccount(databaseClient, newAccount, machine, rememberMe) {
    const newUserPath = `accounts/${newAccount.username}`;
    const userExists = await databaseClient.collectionExists(newUserPath);
    if (userExists) {
      const message = I18n.get(Strings.ERROR_MESSAGE_ACCOUNT_ALREADY_EXISTS);
      if (Log.will(Log.ERROR)) Log.error(message);
      return { status: 500, send: message };
    }

    try {
      await databaseClient.createCollection(newUserPath);
    } catch (err) {
      const message = I18n.get(Strings.ERROR_MESSAGE_ACCOUNT_ADD_FAILED);
      if (Log.will(Log.ERROR)) Log.error(message);
      return { status: 500, send: message };
    }

    const newUserToonPath = `${newUserPath}/toon`;
    try {
      await databaseClient.createCollection(newUserToonPath);
    } catch (err) {
      const message = I18n.get(Strings.ERROR_MESSAGE_ACCOUNT_ADD_FAILED);
      if (Log.will(Log.ERROR)) Log.error(message);
      return { status: 500, send: message };
    }

    const crypto = Registry.get('Crypto');
    const account = Encrypt.encryptAccount(newAccount, crypto.iv, crypto.key);
    try {
      await databaseClient.upsert(`${newUserPath}/account.json`, account);
    } catch (err) {
      const message = I18n.get(Strings.ERROR_MESSAGE_ACCOUNT_ADD_FAILED);
      if (Log.will(Log.ERROR)) Log.error(message);
      return { status: 500, send: message };
    }

    if (rememberMe) {
      try {
        let machinesData = await databaseClient.read('machines.json');
        const machines = JSON.parse(machinesData);
        machines.push({ machine, username: newAccount.username });
        machinesData = JSON.stringify(machines);
        await databaseClient.update('machines.json', machinesData);
      } catch (err) {
        const message = I18n.get(Strings.ERROR_MESSAGE_ACCOUNT_ADD_FAILED);
        if (Log.will(Log.ERROR)) Log.error(message);
        return { status: 500, send: message };
      }
    }

    try {
      await databaseClient.upsert(`${newUserPath}/owned.json`, '[]');
      await databaseClient.upsert(`${newUserPath}/favorites.json`, '[]');
      await databaseClient.upsert(`${newUserPath}/cart.json`, '[]');
    } catch (err) {
      const message = I18n.get(Strings.ERROR_MESSAGE_ACCOUNT_ADD_FAILED);
      if (Log.will(Log.ERROR)) Log.error(message);
      return { status: 500, send: message };
    }
    return { status: 200 };
  }
}
module.exports = AddAccount;
