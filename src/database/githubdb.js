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
  connect(config) {
    return new Promise((inResolve, inReject) => {
      try {
        if (!config || !config.config || !config.config.owner || !config.config.repo || !config.config.committer || !config.config.author) {
          const error = { status: false, error: 'GithubDB: Error while connecting. Invalid config.' };
          if (Log.will(Log.ERROR)) Log.error(JSON.stringify(error));
          inReject && inReject(error);
          return;
        }
        this.config = config.config;
        const getOctoKit = () => {
          const appOctokit = new Octokit({ auth: this.token });
          return appOctokit;
        };
        this.client = getOctoKit();
        inResolve && inResolve(this.client);
      } catch (err) {
        const error = { status: false, error: `GithubDB: Error while connecting. General error. ${JSON.stringify(err)}` };
        if (Log.will(Log.ERROR)) Log.error(JSON.stringify(error));
        inReject && inReject(error);
      }
    });
  }

  ping() {
    return new Promise((inResolve, inReject) => {
      if (!this.client) {
        inResolve && inResolve(false);
        return;
      }
      const exists = async () => {
        const result = await this.fileExists('.___');
        inResolve && inResolve(result);
      };
      exists();
    });
  }

  disconnect() {
    return new Promise((inResolve, inReject) => {
      this.client = null;
      inResolve && inResolve(true);
    });
  }

  async lock(path) {
    const lockFileBase = '.___lock_';
    const lockFile = `${lockFileBase}${path}`;
    const startTime = new Date();

    // eslint-disable-next-line no-await-in-loop
    while (await this.fileExists(lockFile)) {
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
    await this.insert(lockFile, lockFile, false);
  }

  async unlock(path) {
    const lockFileBase = '.___lock_';
    await this.delete(`${lockFileBase}${path}`, false);
  }

  sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  collectionExists(path) {
    return this.fileExists(`${path}/.___`);
  }

  /**
   * @param name - The collection name.
   * @returns {Promise}
   */
  createCollection(path) {
    return this.insert(`${path}/.___`, path);
  }

  dropCollection(path) {
    return new Promise((inResolve, inReject) => {
      const drop = async () => {
        try {
          const fileArray = await this.readCollection(path);
          const promises = [];
          for (let fileIndex = 0; fileIndex < fileArray.length; fileIndex++) {
            const file = fileArray[fileIndex];
            // eslint-disable-next-line no-await-in-loop
            const fileExists = await this.fileExists(file.path);
            if (fileExists) {
              promises.push(this.delete(file.path));
            }
          }
          Promise.all(promises)
            .then((values) => {
              inResolve && inResolve({ status: true });
            })
            .catch((err) => {
              const error = { status: false, error: `Error while dropping collection ${path}. ${JSON.stringify(err)}` };
              if (Log.will(Log.ERROR)) Log.error(JSON.stringify(error));
              inReject && inReject(error);
            });
        } catch (err) {
          const error = { status: false, error: `Error while dropping collection ${path}. ${JSON.stringify(err)}` };
          if (Log.will(Log.ERROR)) Log.error(JSON.stringify(error));
          inReject && inReject(error);
        }
      };
      drop();
    });
  }

  readCollection(path) {
    return new Promise((inResolve, inReject) => {
      const getCollectionContent = async () => {
        try {
          const octokit = this.client;
          const { owner, repo } = this.config;
          const content = await octokit.repos.getContent({ owner, repo, path });
          inResolve && inResolve(content.data);
        } catch (err) {
          const error = { status: false, error: `Error while reading collection ${path}. ${JSON.stringify(err)}` };
          if (Log.will(Log.ERROR)) Log.error(JSON.stringify(error));
          inReject && inReject(error);
        }
      };
      getCollectionContent();
    });
  }

  async getSHA(path) {
    const octokit = this.client;
    const { owner, repo } = this.config;
    const content = await octokit.repos.getContent({ owner, repo, path });
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

  insert(path, data, shouldLock) {
    return new Promise((inResolve, inReject) => {
      const createFile = async () => {
        try {
          const octokit = this.client;
          const { owner, repo, committer, author } = this.config;
          const message = 'Inserted';
          const buff = Buffer.from(data, 'utf-8');
          const content = buff.toString('base64');
          await octokit.repos.createOrUpdateFileContents({
            owner, repo, path, message, content, committer, author,
          });
          inResolve && inResolve({ status: true });
        } catch (err) {
          const error = { status: false, error: `Error while inserting data to ${path}. ${JSON.stringify(err)}` };
          if (Log.will(Log.ERROR)) Log.error(JSON.stringify(error));
          inReject && inReject(error);
        }
      };
      createFile();
    });
  }

  async upsert(path, data) {
    const fileExists = await this.fileExists(path);
    if (!fileExists) {
      return this.insert(path, data);
    }
    return this.update(path, data);
  }

  update(path, data) {
    return new Promise((inResolve, inReject) => {
      const updateFile = async () => {
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
          inResolve && inResolve({ status: true });
        } catch (err) {
          const error = { status: false, error: `Error while updating data to ${path}. ${JSON.stringify(err)}` };
          if (Log.will(Log.ERROR)) Log.error(JSON.stringify(error));
          inReject && inReject(error);
        }
      };
      updateFile();
    });
  }

  delete(path, shouldLock) {
    return new Promise((inResolve, inReject) => {
      const deleteFile = async () => {
        try {
          const octokit = this.client;
          const { owner, repo } = this.config;
          const message = 'Deleted';
          const sha = await this.getSHA(path);
          await octokit.repos.deleteFile({
            owner, repo, path, message, sha,
          });
          inResolve && inResolve({ status: true });
        } catch (err) {
          const error = { status: false, error: `Error while deleting data from ${path}. ${JSON.stringify(err)} ${JSON.stringify(err)}` };
          if (Log.will(Log.ERROR)) Log.error(JSON.stringify(error));
          inReject && inReject(error);
        }
      };
      deleteFile();
    });
  }

  read(path) {
    return new Promise((inResolve, inReject) => {
      const getContent = async () => {
        const octokit = this.client;
        const { owner, repo } = this.config;
        const content = await octokit.repos.getContent({ owner, repo, path });
        axios.get(content.data.download_url)
          .then((response) => {
            inResolve && inResolve(response);
            this.unlock(path);
          })
          .catch((err) => {
            const error = { status: false, error: `Error while reading data from ${path}. ${JSON.stringify(err)}` };
            if (Log.will(Log.ERROR)) Log.error(JSON.stringify(error));
            inReject && inReject(error);
            this.unlock(path);
          });
      };
      getContent();
    });
  }

  listCommits(path) {
    return new Promise((inResolve, inReject) => {
      const getContent = async () => {
        try {
          const octokit = this.client;
          const { owner, repo } = this.config;
          const content = await octokit.repos.listCommits({ owner, repo, path });
          inResolve && inResolve(content);
          this.unlock(path);
        } catch (err) {
          const error = { status: false, error: `Error while reading commits from ${path}. ${JSON.stringify(err)}` };
          if (Log.will(Log.ERROR)) Log.error(JSON.stringify(error));
          inReject && inReject(error);
          this.unlock(path);
        }
      };
      getContent();
    });
  }
}

module.exports = GithubDB;
