const { throwError } = require('../utils/errors');

function Group({ id, name, description }) {
  this.id = id;
  this.name = name;
  this.description = description;
  this.createdAt = new Date().toISOString();
  this.members = [];
  this.attachedPolicies = [];
  this.active = true;
  this.admins = [];
  this.essential = false;
}

Group.prototype.update = function({ name, description }) {
  let updated = false;
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

Group.prototype.attachUser = function(userId) {
  if (this.members.includes(userId)) {
    throwError('USER_ALREADY_IN_GROUP');
  }
  this.members.push(userId);
};

Group.prototype.detachUser = function(userId) {
  this.members = this.members.filter(id => id !== userId);
};

Group.prototype.attachPolicy = function(policyId) {
  if (this.attachedPolicies.includes(policyId)) {
    throwError('POLICY_ALREADY_ATTACHED');
  }
  this.attachedPolicies.push(policyId);
};

Group.prototype.detachPolicy = function(policyId) {
  this.attachedPolicies = this.attachedPolicies.filter(id => id !== policyId);
};

Group.prototype.attachUsers = function(userIds) {
  for (const userId of userIds) {
    if (!this.members.includes(userId)) this.members.push(userId);
  }
};
Group.prototype.detachUsers = function(userIds) {
  this.members = this.members.filter(id => !userIds.includes(id));
};
Group.prototype.removeAllUsers = function() {
  this.members = [];
};
Group.prototype.attachPolicies = function(policyIds) {
  for (const pid of policyIds) {
    if (!this.attachedPolicies.includes(pid)) this.attachedPolicies.push(pid);
  }
};
Group.prototype.detachPolicies = function(policyIds) {
  this.attachedPolicies = this.attachedPolicies.filter(id => !policyIds.includes(id));
};
Group.prototype.removeAllPolicies = function() {
  this.attachedPolicies = [];
};
Group.prototype.deactivate = function() {
  this.active = false;
};
Group.prototype.activate = function() {
  this.active = true;
};
Group.prototype.delegateAdmin = function(userId) {
  if (!this.admins.includes(userId)) this.admins.push(userId);
};
Group.prototype.revokeAdmin = function(userId) {
  this.admins = this.admins.filter(id => id !== userId);
};

module.exports = Group;
