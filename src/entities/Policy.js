const { throwError } = require('../utils/errors');
let versionCounter = 1;

function validatePolicyDocument(document) {
  if (!document || typeof document !== 'object') throwError('INVALID_POLICY_DOCUMENT');
  if (!document.Version) throwError('POLICY_MISSING_VERSION');
  if (!document.Statement) throwError('POLICY_MISSING_STATEMENT');
  if (!Array.isArray(document.Statement)) throwError('POLICY_STATEMENT_NOT_ARRAY');
}

function Policy({ id, name, description, document }) {
  validatePolicyDocument(document);
  this.id = id;
  this.name = name;
  this.description = description;
  this.createdAt = new Date().toISOString();
  this.versions = [];
  const versionId = 'v' + versionCounter++;
  this.versions.push({ versionId, document, createdAt: this.createdAt });
  this.defaultVersionId = versionId;
  this.document = document; // Mantém compatibilidade para .document
}

Policy.prototype.update = function({ name, description, document }) {
  let updated = false;
  if (name !== undefined) {
    this.name = name;
    updated = true;
  }
  if (description !== undefined) {
    this.description = description;
    updated = true;
  }
  if (document !== undefined) {
    validatePolicyDocument(document);
    // Cria nova versão ao atualizar documento
    const versionId = 'v' + versionCounter++;
    this.versions.push({ versionId, document, createdAt: new Date().toISOString() });
    this.defaultVersionId = versionId;
    this.document = document; // Atualiza o campo document
    updated = true;
  }
  if (updated) {
    this.updatedAt = new Date().toISOString();
  }
};

Policy.prototype.createVersion = function(document) {
  validatePolicyDocument(document);
  const versionId = 'v' + versionCounter++;
  const version = { versionId, document, createdAt: new Date().toISOString() };
  this.versions.push(version);
  return version;
};

Policy.prototype.listVersions = function() {
  return [...this.versions];
};

Policy.prototype.setDefaultVersion = function(versionId) {
  const version = this.versions.find(v => v.versionId === versionId);
  if (!version) throwError('POLICY_VERSION_NOT_FOUND');
  this.defaultVersionId = versionId;
  this.document = version.document;
};

module.exports = Policy;
