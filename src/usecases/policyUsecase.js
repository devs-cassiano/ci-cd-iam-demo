const Policy = require('../entities/Policy');
const { throwError, ERROR_MESSAGES } = require('../utils/errors');

function createPolicyService() {
  const policies = new Map(); // id -> Policy

  function createPolicy({ id, name, description, document }) {
    if (policies.has(id)) throwError('POLICY_EXISTS');
    const policy = new Policy({ id, name, description, document });
    policies.set(id, policy);
    return policy;
  }

  function getPolicyById(id) {
    return policies.get(id);
  }

  function listPolicies() {
    return Array.from(policies.values());
  }

  function updatePolicy(id, data) {
    const policy = getPolicyById(id);
    if (!policy) throwError('POLICY_NOT_FOUND');
    policy.update(data);
    return policy;
  }

  function removePolicy(id) {
    const policy = getPolicyById(id);
    if (!policy) throwError('POLICY_NOT_FOUND');
    policies.delete(id);
  }

  function createPolicyVersion(id, document) {
    const policy = getPolicyById(id);
    if (!policy) throwError('POLICY_NOT_FOUND');
    return policy.createVersion(document);
  }

  function listPolicyVersions(id) {
    const policy = getPolicyById(id);
    if (!policy) throwError('POLICY_NOT_FOUND');
    return policy.listVersions();
  }

  function setDefaultPolicyVersion(id, versionId) {
    const policy = getPolicyById(id);
    if (!policy) throwError('POLICY_NOT_FOUND');
    policy.setDefaultVersion(versionId);
  }

  function evaluateUserPolicy(user, policyId) {
    const policy = getPolicyById(policyId);
    if (!policy) throwError('POLICY_NOT_FOUND');
    return policy.evaluate(user);
  }

  function __reset() {
    policies.clear();
  }

  return {
    createPolicy,
    getPolicyById,
    listPolicies,
    updatePolicy,
    removePolicy,
    createPolicyVersion,
    listPolicyVersions,
    setDefaultPolicyVersion,
    evaluateUserPolicy,
    __reset,
  };
}

/**
 * Factory para criar o usecase de policy.
 * Permite injeção de dependências para testes ou produção.
 */
function createPolicyUsecase(deps = {}) {
  // No momento, não há dependências externas, mas pode ser expandido.
  return createPolicyService({ ...deps });
}

module.exports = { createPolicyUsecase };
