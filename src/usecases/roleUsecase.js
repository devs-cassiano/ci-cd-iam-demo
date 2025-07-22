const Role = require('../entities/Role');
const { throwError } = require('../utils/errors');

function createRoleService() {
  const roles = new Map(); // id -> Role

  function createRole({ id, name, description }) {
    if (roles.has(id)) throwError('ROLE_EXISTS');
    const role = new Role({ id, name, description });
    roles.set(id, role);
    return role;
  }

  function getRoleById(id) {
    return roles.get(id);
  }

  function listRoles() {
    return Array.from(roles.values());
  }

  function updateRole(id, data) {
    const role = getRoleById(id);
    if (!role) throwError('ROLE_NOT_FOUND');
    role.update(data);
    return role;
  }

  function removeRole(id) {
    const role = getRoleById(id);
    if (!role) throwError('ROLE_NOT_FOUND');
    roles.delete(id);
  }

  function attachPolicyToRole(roleId, policyId) {
    const role = getRoleById(roleId);
    if (!role) throwError('ROLE_NOT_FOUND');
    role.attachPolicy(policyId);
  }

  function detachPolicyFromRole(roleId, policyId) {
    const role = getRoleById(roleId);
    if (!role) throwError('ROLE_NOT_FOUND');
    role.detachPolicy(policyId);
  }

  function listRolePolicies(roleId) {
    const role = getRoleById(roleId);
    if (!role) throwError('ROLE_NOT_FOUND');
    return role.listPolicies();
  }

  function attachRoleToUser(roleId, userId) {
    const role = getRoleById(roleId);
    if (!role) throwError('ROLE_NOT_FOUND');
    role.attachToUser(userId);
  }

  function detachRoleFromUser(roleId, userId) {
    const role = getRoleById(roleId);
    if (!role) throwError('ROLE_NOT_FOUND');
    role.detachFromUser(userId);
  }

  function listUserRoles(userId) {
    const userRoles = [];
    roles.forEach((role) => {
      if (role.hasUser(userId)) {
        userRoles.push(role);
      }
    });
    return userRoles;
  }

  function listRoleUsers(roleId) {
    const role = getRoleById(roleId);
    if (!role) throwError('ROLE_NOT_FOUND');
    return role.listUsers();
  }

  function __reset() {
    roles.clear();
  }

  return {
    createRole,
    getRoleById,
    listRoles,
    updateRole,
    removeRole,
    attachPolicyToRole,
    detachPolicyFromRole,
    listRolePolicies,
    attachRoleToUser,
    detachRoleFromUser,
    listUserRoles,
    listRoleUsers,
    __reset,
  };
}

/**
 * Factory para criar o usecase de role.
 * Permite injeção de dependências para testes ou produção.
 */
function createRoleUsecase(deps = {}) {
  // No momento, não há dependências externas, mas pode ser expandido.
  return createRoleService({ ...deps });
}

module.exports = { createRoleUsecase };
