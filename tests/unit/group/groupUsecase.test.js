// Testes de regras de negócio/orquestração para Group (usecase)
const { createGroupUsecase } = require('../../../src/usecases/groupUsecase');

describe('Group Usecase', () => {
  let groupUsecase;
  beforeEach(() => {
    groupUsecase = createGroupUsecase();
    groupUsecase.__reset();
  });

  it('should create and get a group', () => {
    const group = groupUsecase.createGroup({ id: 'g1', name: 'Admins', description: 'desc' });
    expect(groupUsecase.getGroupById('g1')).toEqual(group);
  });

  it('should not create duplicate group', () => {
    groupUsecase.createGroup({ id: 'g1', name: 'Admins', description: '' });
    expect(() => groupUsecase.createGroup({ id: 'g1', name: 'Admins', description: '' })).toThrow();
  });

  it('should update a group', () => {
    groupUsecase.createGroup({ id: 'g1', name: 'Admins', description: '' });
    const updated = groupUsecase.updateGroup('g1', { name: 'SuperAdmins' });
    expect(updated.name).toBe('SuperAdmins');
  });

  it('should remove a group', () => {
    groupUsecase.createGroup({ id: 'g1', name: 'Admins', description: '' });
    groupUsecase.removeGroup('g1');
    expect(groupUsecase.getGroupById('g1')).toBeUndefined();
  });

  it('should attach and detach user', () => {
    groupUsecase.createGroup({ id: 'g1', name: 'Admins', description: '' });
    groupUsecase.attachUserToGroup('g1', 'u1');
    expect(groupUsecase.getGroupById('g1').members).toContain('u1');
    groupUsecase.detachUserFromGroup('g1', 'u1');
    expect(groupUsecase.getGroupById('g1').members).not.toContain('u1');
  });

  it('should attach and detach multiple users', () => {
    groupUsecase.createGroup({ id: 'g1', name: 'Admins', description: '' });
    groupUsecase.attachUsersToGroup('g1', ['u1', 'u2']);
    expect(groupUsecase.getGroupById('g1').members).toEqual(expect.arrayContaining(['u1', 'u2']));
    groupUsecase.detachUsersFromGroup('g1', ['u1']);
    expect(groupUsecase.getGroupById('g1').members).not.toContain('u1');
  });

  it('should remove all users from group', () => {
    groupUsecase.createGroup({ id: 'g1', name: 'Admins', description: '' });
    groupUsecase.attachUsersToGroup('g1', ['u1', 'u2']);
    groupUsecase.removeAllUsersFromGroup('g1');
    expect(groupUsecase.getGroupById('g1').members).toEqual([]);
  });

  it('should attach and detach policy', () => {
    groupUsecase.createGroup({ id: 'g1', name: 'Admins', description: '' });
    groupUsecase.attachPolicyToGroup('g1', 'p1');
    expect(groupUsecase.getGroupById('g1').attachedPolicies).toContain('p1');
    groupUsecase.detachPolicyFromGroup('g1', 'p1');
    expect(groupUsecase.getGroupById('g1').attachedPolicies).not.toContain('p1');
  });

  it('should attach and detach multiple policies', () => {
    groupUsecase.createGroup({ id: 'g1', name: 'Admins', description: '' });
    groupUsecase.attachPoliciesToGroup('g1', ['p1', 'p2']);
    expect(groupUsecase.getGroupById('g1').attachedPolicies).toEqual(expect.arrayContaining(['p1', 'p2']));
    groupUsecase.detachPoliciesFromGroup('g1', ['p1']);
    expect(groupUsecase.getGroupById('g1').attachedPolicies).not.toContain('p1');
  });

  it('should remove all policies from group', () => {
    groupUsecase.createGroup({ id: 'g1', name: 'Admins', description: '' });
    groupUsecase.attachPoliciesToGroup('g1', ['p1', 'p2']);
    groupUsecase.removeAllPoliciesFromGroup('g1');
    expect(groupUsecase.getGroupById('g1').attachedPolicies).toEqual([]);
  });

  it('should deactivate and activate group', () => {
    groupUsecase.createGroup({ id: 'g1', name: 'Admins', description: '' });
    groupUsecase.deactivateGroup('g1');
    expect(groupUsecase.getGroupById('g1').active).toBe(false);
    groupUsecase.activateGroup('g1');
    expect(groupUsecase.getGroupById('g1').active).toBe(true);
  });

  it('should delegate and revoke admin', () => {
    groupUsecase.createGroup({ id: 'g1', name: 'Admins', description: '' });
    groupUsecase.delegateAdmin('g1', 'u1');
    expect(groupUsecase.getGroupById('g1').admins).toContain('u1');
    groupUsecase.revokeAdmin('g1', 'u1');
    expect(groupUsecase.getGroupById('g1').admins).not.toContain('u1');
  });
});
