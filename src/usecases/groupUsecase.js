const Group = require('../entities/Group');
const { throwError } = require('../utils/errors');

function createGroupService() {
  const groups = new Map(); // id -> Group

  function createGroup({ id, name, description }) {
    if (groups.has(id)) throwError('GROUP_EXISTS');
    const group = new Group({ id, name, description });
    groups.set(id, group);
    return group;
  }

  function getGroupById(id) {
    return groups.get(id);
  }

  function listGroups() {
    return Array.from(groups.values());
  }

  function updateGroup(id, data) {
    const group = getGroupById(id);
    if (!group) throwError('GROUP_NOT_FOUND');
    group.update(data);
    return group;
  }

  function removeGroup(id) {
    const group = getGroupById(id);
    if (!group) throwError('GROUP_NOT_FOUND');
    if (group.essential) throwError('GROUP_ESSENTIAL_REMOVE');
    groups.delete(id);
  }

  function attachUserToGroup(groupId, userId) {
    const group = getGroupById(groupId);
    if (!group) throwError('GROUP_NOT_FOUND');
    group.attachUser(userId);
  }

  function detachUserFromGroup(groupId, userId) {
    const group = getGroupById(groupId);
    if (!group) throwError('GROUP_NOT_FOUND');
    group.detachUser(userId);
  }

  function attachUsersToGroup(groupId, userIds) {
    const group = getGroupById(groupId);
    if (!group) throwError('GROUP_NOT_FOUND');
    group.attachUsers(userIds);
  }

  function detachUsersFromGroup(groupId, userIds) {
    const group = getGroupById(groupId);
    if (!group) throwError('GROUP_NOT_FOUND');
    group.detachUsers(userIds);
  }

  function removeAllUsersFromGroup(groupId) {
    const group = getGroupById(groupId);
    if (!group) throwError('GROUP_NOT_FOUND');
    group.removeAllUsers();
  }

  function attachPolicyToGroup(groupId, policyId) {
    const group = getGroupById(groupId);
    if (!group) throwError('GROUP_NOT_FOUND');
    group.attachPolicy(policyId);
  }

  function detachPolicyFromGroup(groupId, policyId) {
    const group = getGroupById(groupId);
    if (!group) throwError('GROUP_NOT_FOUND');
    group.detachPolicy(policyId);
  }

  function attachPoliciesToGroup(groupId, policyIds) {
    const group = getGroupById(groupId);
    if (!group) throwError('GROUP_NOT_FOUND');
    group.attachPolicies(policyIds);
  }

  function detachPoliciesFromGroup(groupId, policyIds) {
    const group = getGroupById(groupId);
    if (!group) throwError('GROUP_NOT_FOUND');
    group.detachPolicies(policyIds);
  }

  function removeAllPoliciesFromGroup(groupId) {
    const group = getGroupById(groupId);
    if (!group) throwError('GROUP_NOT_FOUND');
    group.removeAllPolicies();
  }

  function listGroupUsers(groupId) {
    const group = getGroupById(groupId);
    if (!group) throwError('GROUP_NOT_FOUND');
    return group.listUsers();
  }

  function listGroupPolicies(groupId) {
    const group = getGroupById(groupId);
    if (!group) throwError('GROUP_NOT_FOUND');
    return group.listPolicies();
  }

  function listUserGroups(userId) {
    const userGroups = [];
    for (const group of groups.values()) {
      if (group.hasUser(userId)) {
        userGroups.push(group);
      }
    }
    return userGroups;
  }

  function exportGroup(groupId) {
    const group = getGroupById(groupId);
    if (!group) throwError('GROUP_NOT_FOUND');
    return group.export();
  }

  function importGroup(data) {
    const group = new Group(data);
    groups.set(group.id, group);
  }

  function searchGroups(query) {
    const result = [];
    for (const group of groups.values()) {
      if (group.name.includes(query) || group.description.includes(query)) {
        result.push(group);
      }
    }
    return result;
  }

  function listGroupsWithoutMembers() {
    const result = [];
    for (const group of groups.values()) {
      if (group.userCount === 0) {
        result.push(group);
      }
    }
    return result;
  }

  function listGroupsWithoutPolicies() {
    const result = [];
    for (const group of groups.values()) {
      if (group.policyCount === 0) {
        result.push(group);
      }
    }
    return result;
  }

  function deactivateGroup(id) {
    const group = getGroupById(id);
    if (!group) throwError('GROUP_NOT_FOUND');
    group.deactivate();
  }

  function activateGroup(id) {
    const group = getGroupById(id);
    if (!group) throwError('GROUP_NOT_FOUND');
    group.activate();
  }

  function delegateAdmin(groupId, userId) {
    const group = getGroupById(groupId);
    if (!group) throwError('GROUP_NOT_FOUND');
    group.delegateAdmin(userId);
  }

  function revokeAdmin(groupId, userId) {
    const group = getGroupById(groupId);
    if (!group) throwError('GROUP_NOT_FOUND');
    group.revokeAdmin(userId);
  }

  function __reset() {
    groups.clear();
  }

  return {
    createGroup,
    getGroupById,
    listGroups,
    updateGroup,
    removeGroup,
    attachUserToGroup,
    detachUserFromGroup,
    attachUsersToGroup,
    detachUsersFromGroup,
    removeAllUsersFromGroup,
    attachPolicyToGroup,
    detachPolicyFromGroup,
    attachPoliciesToGroup,
    detachPoliciesFromGroup,
    removeAllPoliciesFromGroup,
    listGroupUsers,
    listGroupPolicies,
    listUserGroups,
    exportGroup,
    importGroup,
    searchGroups,
    listGroupsWithoutMembers,
    listGroupsWithoutPolicies,
    deactivateGroup,
    activateGroup,
    delegateAdmin,
    revokeAdmin,
    __reset,
  };
}

/**
 * Factory para criar o usecase de group.
 * Permite injeção de dependências para testes ou produção.
 */
function createGroupUsecase(deps = {}) {
  // No momento, não há dependências externas, mas pode ser expandido.
  return createGroupService({ ...deps });
}

module.exports = { createGroupUsecase };
