// Serviço de Usuário: regras de negócio e orquestração
const User = require('../entities/User');
const { throwError, ERROR_MESSAGES } = require('../utils/errors');

function createUserService({ accessKeyService }) {
  // Simulação de persistência em memória
  const users = new Map(); // id -> User
  const usernames = new Set(); // nomes únicos

  function isUsernameTaken(name) {
    return usernames.has(name);
  }

  function createUser({ id, name, email, ...rest }) {
    if (isUsernameTaken(name)) {
      throwError('USERNAME_EXISTS');
    }
    const user = new User({ id, name, email, ...rest });
    users.set(id, user);
    usernames.add(name);
    return user;
  }

  function getUserById(id) {
    return users.get(id);
  }

  function updateUser(id, data) {
    const user = getUserById(id);
    if (!user) throwError('USER_NOT_FOUND');
    if (data.name && data.name !== user.name && isUsernameTaken(data.name)) {
      throwError('USERNAME_EXISTS');
    }
    if (data.name && data.name !== user.name) {
      usernames.delete(user.name);
      usernames.add(data.name);
    }
    user.update(data);
    return user;
  }

  function removeUser(id) {
    const user = getUserById(id);
    if (!user) throwError('USER_NOT_FOUND');
    user.remove && user.remove();
    usernames.delete(user.name);
    users.delete(id);
  }

  function exists(name) {
    return isUsernameTaken(name);
  }

  // Métodos de access key usando a dependência injetada
  function addUserAccessKey(userId, key) {
    const user = getUserById(userId);
    if (!user) throwError('USER_NOT_FOUND');
    const aks = new accessKeyService(user.accessKeys);
    aks.addKey(key);
    user.accessKeys = aks.getKeysWithStatus();
    return user;
  }

  function removeUserAccessKey(userId, key) {
    const user = getUserById(userId);
    if (!user) throwError('USER_NOT_FOUND');
    const aks = new accessKeyService(user.accessKeys);
    aks.removeKey(key);
    user.accessKeys = aks.getKeysWithStatus();
    return user;
  }

  function disableUserAccessKey(userId, key) {
    const user = getUserById(userId);
    if (!user) throwError('USER_NOT_FOUND');
    const aks = new accessKeyService(user.accessKeys);
    aks.disableKey(key);
    user.accessKeys = aks.getKeysWithStatus();
    return user;
  }

  function isUserAccessKeyValid(userId, key) {
    const user = getUserById(userId);
    if (!user) throwError('USER_NOT_FOUND');
    const aks = new accessKeyService(user.accessKeys);
    return aks.isKeyValid(key);
  }

  function setUserAccessKeyExpiration(userId, key, expirationDate) {
    const user = getUserById(userId);
    if (!user) throwError('USER_NOT_FOUND');
    const aks = new accessKeyService(user.accessKeys);
    aks.setKeyExpiration(key, expirationDate);
    user.accessKeys = aks.getKeysWithStatus();
    return user;
  }

  function rotateUserAccessKey(userId, oldKey, newKey) {
    const user = getUserById(userId);
    if (!user) throwError('USER_NOT_FOUND');
    const aks = new accessKeyService(user.accessKeys);
    aks.rotateKey(oldKey, newKey);
    user.accessKeys = aks.getKeysWithStatus();
    return user;
  }

  function attachPolicyToUser(userId, policy) {
    const user = getUserById(userId);
    if (!user) throwError('USER_NOT_FOUND');
    user.attachPolicy(policy);
    return user;
  }

  function detachPolicyFromUser(userId, policy) {
    const user = getUserById(userId);
    if (!user) throwError('USER_NOT_FOUND');
    user.detachPolicy(policy);
    return user;
  }

  function listUserPolicies(userId) {
    const user = getUserById(userId);
    if (!user) throwError('USER_NOT_FOUND');
    return user.listAttachedPolicies();
  }

  function __reset() {
    users.clear();
    usernames.clear();
  }

  return {
    createUser,
    getUserById,
    updateUser,
    removeUser,
    exists,
    __reset,
    addUserAccessKey,
    removeUserAccessKey,
    disableUserAccessKey,
    isUserAccessKeyValid,
    setUserAccessKeyExpiration,
    rotateUserAccessKey,
    attachPolicyToUser,
    detachPolicyFromUser,
    listUserPolicies,
    // ...outros métodos...
  };
}

/**
 * Factory para criar o usecase de usuário, permitindo injeção de dependências.
 * Por padrão, utiliza um mock de accessKeyService para facilitar testes.
 * Para produção, injete a implementação real via parâmetro.
 */
function createUserUsecase(deps = {}) {
  return createUserService({
    accessKeyService: deps.accessKeyService || class {
      addKey() {}
      getKeysWithStatus() { return []; }
      removeKey() {}
      disableKey() {}
      isKeyValid() { return true; }
      setKeyExpiration() {}
      rotateKey() {}
    },
    ...deps,
  });
}

module.exports = { createUserUsecase };
