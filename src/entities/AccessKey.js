const { throwError } = require('../utils/errors');

function isValidAccessKeyFormat(key) {
  return /^AKIA[0-9A-Z]{12}$/.test(key);
}

class AccessKey {
  constructor({ key, active = true, createdAt, expireAt } = {}) {
    if (!isValidAccessKeyFormat(key)) {
      throwError('INVALID_ACCESS_KEY_FORMAT');
    }
    this.key = key;
    this.active = active;
    this.createdAt = createdAt || new Date().toISOString();
    this.expireAt = expireAt;
  }

  disable() {
    this.active = false;
  }

  setExpiration(expireAt) {
    this.expireAt = expireAt;
  }

  isValid() {
    if (!this.active) return false;
    if (this.expireAt && new Date(this.expireAt) < new Date()) return false;
    return true;
  }
}

module.exports = AccessKey;
