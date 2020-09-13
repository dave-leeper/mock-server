/* eslint-disable import/order */
import { Octokit } from '@octokit/rest';

import { will, ERROR, error as _error, stringify } from '../util/log';
import { decrypt } from '../util/encrypt';
import { get } from '../util/registry';

const axios = require('axios').default;

// https://octokit.github.io/rest.js/v18#usage
// https://blog.dennisokeeffe.com/blog/2020-06-22-using-octokit-to-create-files/
/**
 * @param name - name of the connection.
 * @constructor
 */
function GithubDB(name) {
  this.name = name;
  this.config = null;
  this.client = null;
  const crypto = get('Crypto');
  this.token = decrypt('5ee0c6633e795b9eaa9b77fb1988a3a5a5c786994d65be67f4934fd0ec4320e58f80d03b4ba2e240cd21876dc37af152', crypto.iv, crypto.key);
}

/**
 * @param config - database config.
 * @constructor
 */
GithubDB.prototype.connect = function (config) {
  return new Promise((inResolve, inReject) => {
    try {
      if (!config || !config.url || !config.db) {
        const error = { status: false, error: 'Error while connecting.' };
        if (will(ERROR)) _error(stringify(error));
        inReject && inReject(error);
        return;
      }
      this.config = config;
      const getOctoKit = () => {
        const appOctokit = new Octokit({ auth: this.token });
        return appOctokit;
      };
      this.client = getOctoKit();
      inResolve && inResolve(this.client);
    } catch (err) {
      const error = { status: false, error: 'Error while connecting.' };
      if (will(ERROR)) _error(stringify(error));
      inReject && inReject(error);
    }
  });
};

GithubDB.prototype.ping = function () {
  return new Promise((inResolve, inReject) => {
    if (!this.client) {
      inResolve && inResolve(false);
      return;
    }
    const exists = async () => {
      let result = await this.fileExists('.___')
      inResolve && inResolve(result);
    }
    exists();
  });
};

GithubDB.prototype.disconnect = function () {
  this.client = null;
};

GithubDB.prototype.collectionExists = function (path) {
  return this.fileExists(`${path}/.___`);
};

/**
 * @param name - The collection name.
 * @returns {Promise}
 */
GithubDB.prototype.createCollection = function (path) {
  return this.insert(`${path}/.___`, path);
};

GithubDB.prototype.dropCollection = function (path) {
  return new Promise((inResolve, inReject) => {
    this.readCollection(path).then((fileArray) => {
      let promises = []
      for (let fileIndex = 0; fileIndex < fileArray.length; fileIndex++) {
        const file = fileArray[fileIndex];
        promises.push(this.delete(file.path));
      }
      Promise.all(promises)
        .then((values) => {
          inResolve && inResolve({ status: true });
        })
        .catch(err) {
          const error = { status: false, error: 'Error while dropping collection.' };
          if (will(ERROR)) _error(stringify(error));
          inReject && inReject(error);
        }
    }).catch((err) => {
      const error = { status: false, error: 'Error while dropping collection.' };
      if (will(ERROR)) _error(stringify(error));
      inReject && inReject(error);
    });
  });
};

GithubDB.prototype.readCollection = function (path) {
  return new Promise((inResolve, inReject) => {
    const getCollectionContent = async () => {
      try {
        const octokit = this.client;
        const { owner } = this.config;
        const { repo } = this.config;
        const content = await octokit.repos.getContent({ owner, repo, path });
        inResolve && inResolve(content.data);
      } catch (err) {
        const error = { status: false, error: 'Error while reading collection.' };
        if (will(ERROR)) _error(stringify(error));
        inReject && inReject(error);
      }
    };
    getCollectionContent();
  });
};

GithubDB.prototype.getSHA = async function (path) {
  const octokit = this.client;
  const { owner } = this.config;
  const { repo } = this.config;
  const content = await octokit.repos.getContent({ owner, repo, path });
  return content.data.sha;
};

GithubDB.prototype.fileExists = async function (path) {
  const octokit = this.client;
  try {
    const { owner, repo } = this.config;
    const content = await octokit.repos.getContent({ owner, repo, path });
    return true;
  } catch (e) {
    return false;
  }
};

GithubDB.prototype.insert = function (path, data) {
  return new Promise((inResolve, inReject) => {
    const createFile = async () => {
      try {
        const octokit = this.client;
        const { owner, repo, committer, author } = this.config;
        const message = 'Inserted';
        const buff = Buffer.from(data, 'utf-8');
        const content = buff.toString('base64');
        await octokit.repos.createOrUpdateFileContents(
          { owner, repo, path, message, content, committer, author }
        );
        inResolve && inResolve({ status: true });
      } catch (err) {
        const error = { status: false, error: 'Error while inserting data.' };
        if (will(ERROR)) _error(stringify(error));
        inReject && inReject(error);
      }
    };
    createFile();
  });
};

GithubDB.prototype.update = function (path, data) {
  return new Promise((inResolve, inReject) => {
    const updateFile = async () => {
      try {
        const octokit = this.client;
        const { owner, repo, committer, author } = this.config;
        const message = 'Updated';
        const sha = await this.getSHA(path);
        const buff = Buffer.from(data, 'utf-8');
        const content = buff.toString('base64');
        await octokit.repos.createOrUpdateFileContents(
          { owner, repo, path, message, sha, content, committer, author }
        );
        inResolve && inResolve({ status: true });
      } catch (err) {
        const error = { status: false, error: 'Error while updating data.' };
        if (will(ERROR)) _error(stringify(error));
        inReject && inReject(error);
      }
    };
    updateFile();
  });
};

GithubDB.prototype.delete = function (path) {
  return new Promise((inResolve, inReject) => {
    const deleteFile = async () => {
      try {
        const octokit = this.client;
        const { owner, repo } = this.config;
        const message = 'Deleted';
        const sha = await this.getSHA(name);
        await octokit.repos.deleteFile({ owner, repo, path, message, sha });
        inResolve && inResolve({ status: true });
      } catch (err) {
        const error = { status: false, error: 'Error while deleting data.' };
        if (will(ERROR)) _error(stringify(error));
        inReject && inReject(error);
      }
    };
    deleteFile();
  });
};

GithubDB.prototype.read = function (path) {
  return new Promise((inResolve, inReject) => {
    const getContent = async () => {
      const octokit = this.client;
      const { owner, repo } = this.config;
      const content = await octokit.repos.getContent({ owner, repo, path });
      axios.get(content.data.download_url)
        .then((response) => {
          inResolve && inResolve(response);
        })
        .catch((err) => {
          const error = { status: false, error: 'Error while querying data.' };
          if (will(ERROR)) _error(stringify(error));
          inReject && inReject(error);
        });
    };
    getContent();
  });
};

export default GithubDB;
