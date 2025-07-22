const { throwError } = require('../utils/errors');

function Role({ id, name, description }) {
  this.id = id;
  this.name = name;
  this.description = description;
  this.createdAt = new Date().toISOString();
  this.attachedPolicies = [];
  this.history = [];
}

Role.prototype.update = function({ name, description }) {
  let updated = false;
  if (!this.history) this.history = [];
  if (name !== undefined || description !== undefined) {
    this.history.push({ name: this.name, description: this.description, updatedAt: this.updatedAt || this.createdAt });
  }
  if (name !== undefined) {
    this.name = name;
    updated = true;
  }
  if (description !== undefined) {
    this.description = description;
    updated = true;
  }
  if (updated) {
    this.updatedAt = new Date().toISOString();
  }
};

Role.prototype.attachPolicy = function(policyId) {
  if (this.attachedPolicies.includes(policyId)) {
    throwError('POLICY_ALREADY_ATTACHED');
  }
  this.attachedPolicies.push(policyId);
};

Role.prototype.detachPolicy = function(policyId) {
  this.attachedPolicies = this.attachedPolicies.filter(id => id !== policyId);
};

module.exports = Role;
