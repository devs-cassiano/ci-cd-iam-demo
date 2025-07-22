// Testes de regras de negócio/orquestração para Policy (service/usecase)
const { createPolicyUsecase } = require('../../../src/usecases/policyUsecase');

describe('Policy Usecase', () => {
  let policyUsecase;
  const validDoc = { Version: '2025-07-21', Statement: [] };
  beforeEach(() => {
    policyUsecase = createPolicyUsecase();
    policyUsecase.__reset();
  });

  it('should create and get a policy', () => {
    const policy = policyUsecase.createPolicy({ id: 'p1', name: 'Test', description: '', document: validDoc });
    expect(policyUsecase.getPolicyById('p1')).toEqual(policy);
  });

  it('should not create duplicate policy', () => {
    policyUsecase.createPolicy({ id: 'p1', name: 'Test', description: '', document: validDoc });
    expect(() => policyUsecase.createPolicy({ id: 'p1', name: 'Test', description: '', document: validDoc })).toThrow();
  });

  it('should update a policy', () => {
    policyUsecase.createPolicy({ id: 'p1', name: 'Test', description: '', document: validDoc });
    const updated = policyUsecase.updatePolicy('p1', { name: 'NewName' });
    expect(updated.name).toBe('NewName');
  });

  it('should remove a policy', () => {
    policyUsecase.createPolicy({ id: 'p1', name: 'Test', description: '', document: validDoc });
    policyUsecase.removePolicy('p1');
    expect(policyUsecase.getPolicyById('p1')).toBeUndefined();
  });

  it('should create and list policy versions', () => {
    policyUsecase.createPolicy({ id: 'p1', name: 'Test', description: '', document: validDoc });
    const doc2 = { Version: '2025-07-21', Statement: [{ Effect: 'Allow' }] };
    const v2 = policyUsecase.createPolicyVersion('p1', doc2);
    const versions = policyUsecase.listPolicyVersions('p1');
    expect(versions.length).toBe(2);
    expect(versions[1]).toEqual(v2);
  });

  it('should set default policy version', () => {
    policyUsecase.createPolicy({ id: 'p1', name: 'Test', description: '', document: validDoc });
    const doc2 = { Version: '2025-07-21', Statement: [{ Effect: 'Allow' }] };
    const v2 = policyUsecase.createPolicyVersion('p1', doc2);
    policyUsecase.setDefaultPolicyVersion('p1', v2.versionId);
    const policy = policyUsecase.getPolicyById('p1');
    expect(policy.defaultVersionId).toBe(v2.versionId);
    expect(policy.document).toEqual(doc2);
  });

  it('should throw if updating or removing non-existent policy', () => {
    expect(() => policyUsecase.updatePolicy('notfound', { name: 'x' })).toThrow();
    expect(() => policyUsecase.removePolicy('notfound')).toThrow();
  });

  it('should throw if creating version for non-existent policy', () => {
    expect(() => policyUsecase.createPolicyVersion('notfound', validDoc)).toThrow();
  });

  it('should throw if setting default version for non-existent policy', () => {
    expect(() => policyUsecase.setDefaultPolicyVersion('notfound', 'v1')).toThrow();
  });
});
