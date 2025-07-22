const AccessKey = require('../entities/AccessKey');
const { throwError } = require('../utils/errors');

// Serviço responsável por gerenciar access keys de um usuário

class AccessKeyService {
  constructor(keys = []) {
    this.keys = Array.isArray(keys) ? keys.map(k => new AccessKey(k)) : [];
  }

  addKey(key) {
    if (this.keys.length >= 2) {
      throwError('ACCESS_KEY_LIMIT_REACHED');
    }
    this.keys.push(new AccessKey({ key }));
  }

  removeKey(key) {
    this.keys = this.keys.filter(k => k.key !== key);
  }

  disableKey(key) {
    const found = this.keys.find(k => k.key === key);
    if (found) found.disable();
  }

  setKeyExpiration(key, expireAt) {
    const found = this.keys.find(k => k.key === key);
    if (found) found.setExpiration(expireAt);
  }

  rotateKey(oldKey, newKey) {
    this.disableKey(oldKey);
    this.addKey(newKey);
  }

  isKeyValid(key) {
    const found = this.keys.find(k => k.key === key);
    return found ? found.isValid() : false;
  }

  getKeysWithStatus() {
    return this.keys.map(k => ({
      key: k.key,
      active: k.active,
      createdAt: k.createdAt,
      expireAt: k.expireAt,
    }));
  }
}

/**
 * Factory para criar o usecase de accessKey.
 * Permite injeção de dependências para testes ou produção.
 */
function createAccessKeyUsecase(deps = {}) {
  // No momento, não há dependências externas, mas pode ser expandido.
  return new AccessKeyService({ ...deps });
}

module.exports = { createAccessKeyUsecase };
