/* eslint-disable camelcase */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
/* eslint-disable import/order */
const { Octokit } = require('@octokit/rest');
const Encrypt = require('../util/encrypt.js');
const Log = require('../util/log.js');
const Registry = require('../util/registry.js');
const axios = require('axios').default;

// https://octokit.github.io/rest.js/v18#usage
// https://blog.dennisokeeffe.com/blog/2020-06-22-using-octokit-to-create-files/
/**
 * @param name - name of the connection.
 * @constructor
 */
class GithubDB {
  constructor(name) {
    this.name = name;
    this.config = null;
    this.client = null;
    const crypto = Registry.get('Crypto');
    this.token = Encrypt.decrypt('5ee0c6633e795b9eaa9b77fb1988a3a5a5c786994d65be67f4934fd0ec4320e58f80d03b4ba2e240cd21876dc37af152', crypto.iv, crypto.key);
  }

  /**
   * @param config - database config.
   * @constructor
   */
  async connect(config) {
    try {
      if (!config || !config.config || !config.config.owner || !config.config.repo || !config.config.committer || !config.config.author) {
        const error = { status: false, error: 'GithubDB: Error while connecting. Invalid config.' };
        if (Log.will(Log.ERROR)) Log.error(JSON.stringify(error));
        throw error;
      }
      this.config = config.config;
      const getOctoKit = () => {
        const appOctokit = new Octokit({ auth: this.token });
        return appOctokit;
      };
      this.client = getOctoKit();
      return this.client;
    } catch (err) {
      const error = { status: false, error: `GithubDB: Error while connecting. General error. ${JSON.stringify(err)}` };
      if (Log.will(Log.ERROR)) Log.error(JSON.stringify(error));
      throw error;
    }
  }

  async ping() {
    if (!this.client) {
      return false;
    }
    const result = await this.fileExists('.___');
    return result;
  }

  async disconnect() {
    this.client = null;
    return true;
  }

  async lock(path) {
    const lockFileBase = '.___lock_';
    const lockFile = `${lockFileBase}${path}`;
    const startTime = new Date();

    // eslint-disable-next-line no-await-in-loop
    while (await this.isLocked(path)) {
      const now = new Date();
      const beenWaiting = Math.abs(now - startTime);
      const beenWaitingMinutes = (beenWaiting / 1000) / 60;

      if (beenWaitingMinutes < 2) {
        // eslint-disable-next-line no-await-in-loop
        await this.sleep(500);
      } else {
        await this.prototype.unlock(path);
      }
    }
    await this.insert(lockFile, lockFile);
  }

  async isLocked(path) {
    const lockFileBase = '.___lock_';
    const lockExists = await this.fileExists(`${lockFileBase}${path}`);
    return lockExists;
  }

  async unlock(path) {
    const lockExists = await this.isLocked(path);
    if (lockExists) {
      const lockFileBase = '.___lock_';
      await this.delete(`${lockFileBase}${path}`);
    }
  }

  sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  async collectionExists(path) {
    return this.fileExists(`${path}/.___`);
  }

  /**
   * @param name - The collection name.
   * @returns {Promise}
   */
  async createCollection(path) {
    return this.insert(`${path}/.___`, path);
  }

  async dropCollection(path) {
    try {
      const fileArray = await this.readCollection(path);
      for (let fileIndex = 0; fileIndex < fileArray.length; fileIndex++) {
        const file = fileArray[fileIndex];
        // eslint-disable-next-line no-await-in-loop
        const fileExists = await this.fileExists(file.path);
        if (fileExists) {
          // eslint-disable-next-line no-await-in-loop
          await this.delete(file.path);
        }
      }
      return { status: true };
    } catch (err) {
      const error = { status: false, error: `Error while dropping collection ${path}. ${JSON.stringify(err)}` };
      if (Log.will(Log.ERROR)) Log.error(JSON.stringify(error));
      throw error;
    }
  }

  async readCollection(path) {
    try {
      const octokit = this.client;
      const { owner, repo } = this.config;
      const content = await octokit.repos.getContent({ owner, repo, path });
      return content.data;
    } catch (err) {
      const error = { status: false, error: `Error while reading collection ${path}. ${JSON.stringify(err)}` };
      if (Log.will(Log.ERROR)) Log.error(JSON.stringify(error));
      throw error;
    }
  }

  async getSHA(path) {
    const octokit = this.client;
    const { owner, repo } = this.config;
    let content = await octokit.repos.getContent({ owner, repo, path });
    if (typeof content === 'string') {
      content = JSON.parse(content);
    }
    return content.data.sha;
  }

  async fileExists(path) {
    const octokit = this.client;
    try {
      const { owner, repo } = this.config;
      const content = await octokit.repos.getContent({ owner, repo, path });
      return true;
    } catch (e) {
      return false;
    }
  }

  async insert(path, data) {
    try {
      const octokit = this.client;
      const {
        owner, repo, committer, author,
      } = this.config;
      const message = 'Inserted';
      const buff = Buffer.from(data, 'utf-8');
      const content = buff.toString('base64');
      await octokit.repos.createOrUpdateFileContents({
        owner, repo, path, message, content, committer, author,
      });
      return { status: true };
    } catch (err) {
      const error = { status: false, error: `Error while inserting data to ${path}. ${JSON.stringify(err)}` };
      if (Log.will(Log.ERROR)) Log.error(JSON.stringify(error));
      throw error;
    }
  }

  async upsert(path, data) {
    const fileExists = await this.fileExists(path);
    if (!fileExists) {
      return this.insert(path, data);
    }
    return this.update(path, data);
  }

  async update(path, data) {
    try {
      const octokit = this.client;
      const {
        owner, repo, committer, author,
      } = this.config;
      const message = 'Updated';
      const sha = await this.getSHA(path);
      const buff = Buffer.from(data, 'utf-8');
      const content = buff.toString('base64');
      await octokit.repos.createOrUpdateFileContents(
        {
          owner, repo, path, message, sha, content, committer, author,
        },
      );
      return { status: true };
    } catch (err) {
      const error = { status: false, error: `Error while updating data to ${path}. ${JSON.stringify(err)}` };
      if (Log.will(Log.ERROR)) Log.error(JSON.stringify(error));
      throw error;
    }
  }

  async delete(path) {
    try {
      const octokit = this.client;
      const { owner, repo } = this.config;
      const message = 'Deleted';
      const sha = await this.getSHA(path);
      await octokit.repos.deleteFile({
        owner, repo, path, message, sha,
      });
      return { status: true };
    } catch (err) {
      const error = { status: false, error: `Error while deleting data from ${path}. ${JSON.stringify(err)} ${JSON.stringify(err)}` };
      if (Log.will(Log.ERROR)) Log.error(JSON.stringify(error));
      throw error;
    }
  }

  async read(path) {
    try {
      const octokit = this.client;
      const { owner, repo } = this.config;
      const content = await octokit.repos.getContent({ owner, repo, path });
      const response = await axios.get(content.data.download_url);
      return response;
    } catch (err) {
      const error = { status: false, error: `Error while reading data from ${path}. ${JSON.stringify(err)}` };
      if (Log.will(Log.ERROR)) Log.error(JSON.stringify(error));
      throw error;
    }
  }

  async listCommits(path) {
    try {
      const octokit = this.client;
      const { owner, repo } = this.config;
      const content = await octokit.repos.listCommits({ owner, repo, path });
      return content.data;
    } catch (err) {
      const error = { status: false, error: `Error while reading commits from ${path}. ${JSON.stringify(err)}` };
      if (Log.will(Log.ERROR)) Log.error(JSON.stringify(error));
      throw error;
    }
  }
}

module.exports = GithubDB;
