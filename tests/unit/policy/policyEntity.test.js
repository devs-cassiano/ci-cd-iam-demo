// Testes de entidade Policy (model/entity)
const Policy = require('../../../src/entities/Policy');
const { throwError } = require('../../../src/utils/errors');

describe('Policy Entity', () => {
  const validDoc = { Version: '2025-07-21', Statement: [] };

  it('should create a policy with valid document', () => {
    const policy = new Policy({ id: 'p1', name: 'Test', description: 'desc', document: validDoc });
    expect(policy.id).toBe('p1');
    expect(policy.name).toBe('Test');
    expect(policy.description).toBe('desc');
    expect(policy.document).toEqual(validDoc);
    expect(policy.versions.length).toBe(1);
    expect(policy.defaultVersionId).toBeDefined();
  });

  it('should throw on invalid document', () => {
    expect(() => new Policy({ id: 'p2', name: 'Test', description: '', document: null })).toThrow();
    expect(() => new Policy({ id: 'p2', name: 'Test', description: '', document: {} })).toThrow();
    expect(() => new Policy({ id: 'p2', name: 'Test', description: '', document: { Version: 'v' } })).toThrow();
  });

  it('should update name, description and document', () => {
    const policy = new Policy({ id: 'p1', name: 'Test', description: 'desc', document: validDoc });
    policy.update({ name: 'NewName', description: 'newdesc' });
    expect(policy.name).toBe('NewName');
    expect(policy.description).toBe('newdesc');
    const newDoc = { Version: '2025-07-21', Statement: [{ Effect: 'Allow' }] };
    policy.update({ document: newDoc });
    expect(policy.document).toEqual(newDoc);
    expect(policy.versions.length).toBe(2);
  });

  it('should create and list versions', () => {
    const policy = new Policy({ id: 'p1', name: 'Test', description: '', document: validDoc });
    const doc2 = { Version: '2025-07-21', Statement: [{ Effect: 'Deny' }] };
    const v2 = policy.createVersion(doc2);
    expect(policy.versions.length).toBe(2);
    expect(policy.listVersions()).toEqual(policy.versions);
    expect(v2.document).toEqual(doc2);
  });

  it('should set default version', () => {
    const policy = new Policy({ id: 'p1', name: 'Test', description: '', document: validDoc });
    const doc2 = { Version: '2025-07-21', Statement: [{ Effect: 'Deny' }] };
    const v2 = policy.createVersion(doc2);
    policy.setDefaultVersion(v2.versionId);
    expect(policy.defaultVersionId).toBe(v2.versionId);
    expect(policy.document).toEqual(doc2);
  });

  it('should throw if setting non-existent version', () => {
    const policy = new Policy({ id: 'p1', name: 'Test', description: '', document: validDoc });
    expect(() => policy.setDefaultVersion('v999')).toThrow();
  });
});
