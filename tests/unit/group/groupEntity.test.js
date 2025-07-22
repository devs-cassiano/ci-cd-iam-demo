// Testes de entidade Group (model/entity)
const Group = require('../../../src/entities/Group');
const { throwError } = require('../../../src/utils/errors');

describe('Group Entity', () => {
  it('should create a group with default values', () => {
    const group = new Group({ id: 'g1', name: 'Admins', description: 'Admin group' });
    expect(group.id).toBe('g1');
    expect(group.name).toBe('Admins');
    expect(group.description).toBe('Admin group');
    expect(group.members).toEqual([]);
    expect(group.attachedPolicies).toEqual([]);
    expect(group.active).toBe(true);
    expect(group.admins).toEqual([]);
    expect(group.essential).toBe(false);
  });

  it('should update name and description', () => {
    const group = new Group({ id: 'g1', name: 'Admins', description: 'Admin group' });
    group.update({ name: 'SuperAdmins', description: 'Super admin group' });
    expect(group.name).toBe('SuperAdmins');
    expect(group.description).toBe('Super admin group');
    expect(group.updatedAt).toBeDefined();
  });

  it('should attach and detach users', () => {
    const group = new Group({ id: 'g1', name: 'Admins', description: '' });
    group.attachUser('u1');
    expect(group.members).toContain('u1');
    group.detachUser('u1');
    expect(group.members).not.toContain('u1');
  });

  it('should not attach the same user twice', () => {
    const group = new Group({ id: 'g1', name: 'Admins', description: '' });
    group.attachUser('u1');
    expect(() => group.attachUser('u1')).toThrow();
  });

  it('should attach and detach policies', () => {
    const group = new Group({ id: 'g1', name: 'Admins', description: '' });
    group.attachPolicy('p1');
    expect(group.attachedPolicies).toContain('p1');
    group.detachPolicy('p1');
    expect(group.attachedPolicies).not.toContain('p1');
  });

  it('should not attach the same policy twice', () => {
    const group = new Group({ id: 'g1', name: 'Admins', description: '' });
    group.attachPolicy('p1');
    expect(() => group.attachPolicy('p1')).toThrow();
  });

  it('should attach and detach multiple users', () => {
    const group = new Group({ id: 'g1', name: 'Admins', description: '' });
    group.attachUsers(['u1', 'u2']);
    expect(group.members).toEqual(expect.arrayContaining(['u1', 'u2']));
    group.detachUsers(['u1']);
    expect(group.members).not.toContain('u1');
  });

  it('should remove all users', () => {
    const group = new Group({ id: 'g1', name: 'Admins', description: '' });
    group.attachUsers(['u1', 'u2']);
    group.removeAllUsers();
    expect(group.members).toEqual([]);
  });

  it('should attach and detach multiple policies', () => {
    const group = new Group({ id: 'g1', name: 'Admins', description: '' });
    group.attachPolicies(['p1', 'p2']);
    expect(group.attachedPolicies).toEqual(expect.arrayContaining(['p1', 'p2']));
    group.detachPolicies(['p1']);
    expect(group.attachedPolicies).not.toContain('p1');
  });

  it('should remove all policies', () => {
    const group = new Group({ id: 'g1', name: 'Admins', description: '' });
    group.attachPolicies(['p1', 'p2']);
    group.removeAllPolicies();
    expect(group.attachedPolicies).toEqual([]);
  });

  it('should activate and deactivate group', () => {
    const group = new Group({ id: 'g1', name: 'Admins', description: '' });
    group.deactivate();
    expect(group.active).toBe(false);
    group.activate();
    expect(group.active).toBe(true);
  });

  it('should delegate and revoke admin', () => {
    const group = new Group({ id: 'g1', name: 'Admins', description: '' });
    group.delegateAdmin('u1');
    expect(group.admins).toContain('u1');
    group.revokeAdmin('u1');
    expect(group.admins).not.toContain('u1');
  });
});
