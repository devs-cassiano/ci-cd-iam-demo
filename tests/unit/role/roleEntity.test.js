// Testes de entidade Role (entity)
const Role = require('../../../src/entities/Role');
const { ERROR_MESSAGES } = require('../../../src/utils/errors');

describe('Role Entity', () => {
  function createRole(overrides = {}) {
    return new Role({ id: '1', name: 'Admin', description: 'Admin role', ...overrides });
  }

  it('deve criar uma role com id, name e description', () => {
    const role = createRole();
    expect(role.id).toBe('1');
    expect(role.name).toBe('Admin');
    expect(role.description).toBe('Admin role');
    expect(role.createdAt).toBeDefined();
  });

  it('deve atualizar nome e descrição', () => {
    const role = createRole();
    role.update({ name: 'User', description: 'User role' });
    expect(role.name).toBe('User');
    expect(role.description).toBe('User role');
    expect(role.updatedAt).toBeDefined();
    expect(role.history.length).toBeGreaterThan(0);
  });

  it('deve anexar e remover policies', () => {
    const role = createRole();
    role.attachPolicy('policy-1');
    expect(role.attachedPolicies).toContain('policy-1');
    role.detachPolicy('policy-1');
    expect(role.attachedPolicies).not.toContain('policy-1');
  });

  it('não deve permitir anexar a mesma policy duas vezes', () => {
    const role = createRole();
    role.attachPolicy('policy-1');
    expect(() => {
      role.attachPolicy('policy-1');
    }).toThrow(ERROR_MESSAGES.POLICY_ALREADY_ATTACHED);
  });
});
