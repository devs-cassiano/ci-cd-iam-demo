const { throwError } = require('../utils/errors');

// Model User: apenas estrutura e métodos do próprio usuário

function isValidEmail(email) {
  return typeof email === 'string' && email.includes('@') && email.includes('.') && /^\S+@\S+\.\S+$/.test(email);
}

function throwIf(condition, messageType) {
  if (condition) {
    throwError(messageType);
  }
}


function User({ id, name, email, phone, metadata, status }) {
  throwIf(!isValidEmail(email), 'INVALID_EMAIL');
  this.id = id;
  this.name = name;
  this.email = email;
  this.status = status;
  this.loginCount = 0;
  this.metadata = metadata;
  this.mfaEnabled = false;
  this.phone = phone;
  this.createdAt = new Date().toISOString();
  this.attachedPolicies = [];
  this.roles = [];
}

User.prototype.update = function({ name, email, phone, metadata, status }) {
  let updated = false;
  if (email !== undefined) {
    throwIf(!isValidEmail(email), 'INVALID_EMAIL');
    this.email = email;
    updated = true;
  }
  if (name !== undefined) {
    this.name = name;
    updated = true;
  }
  if (phone !== undefined) {
    this.phone = phone;
    updated = true;
  }
  if (metadata !== undefined) {
    this.metadata = metadata;
    updated = true;
  }
  if (status !== undefined) {
    this.status = status;
    updated = true;
  }
  if (updated) {
    this.updatedAt = new Date().toISOString();
  }
};

User.prototype.remove = function() {
  this.removed = true;
};

User.prototype.registerLogin = function() {
  this.lastLoginAt = new Date().toISOString();
  this.loginCount = (this.loginCount || 0) + 1;
};

User.prototype.enableMFA = function() {
  this.mfaEnabled = true;
};

User.prototype.disableMFA = function() {
  this.mfaEnabled = false;
};

User.prototype.attachPolicy = function(policyId) {
  if (!this.attachedPolicies) this.attachedPolicies = [];
  if (this.attachedPolicies.includes(policyId)) {
    throwError('POLICY_ALREADY_ATTACHED');
  }
  this.attachedPolicies.push(policyId);
};

User.prototype.detachPolicy = function(policyId) {
  if (!this.attachedPolicies) this.attachedPolicies = [];
  this.attachedPolicies = this.attachedPolicies.filter(id => id !== policyId);
};

User.prototype.listAttachedPolicies = function() {
  return this.attachedPolicies ? [...this.attachedPolicies] : [];
};

User.prototype.attachRole = function(roleId) {
  if (!this.roles) this.roles = [];
  if (this.roles.includes(roleId)) throwError('ROLE_ALREADY_ATTACHED');
  this.roles.push(roleId);
};

User.prototype.detachRole = function(roleId) {
  if (!this.roles) this.roles = [];
  this.roles = this.roles.filter(id => id !== roleId);
};

User.prototype.listRoles = function() {
  return this.roles ? [...this.roles] : [];
};

module.exports = User;
