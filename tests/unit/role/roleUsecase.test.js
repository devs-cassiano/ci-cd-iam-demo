// Testes de regras de negócio/orquestração para Role (usecase)
const { createRoleUsecase } = require('../../../src/usecases/roleUsecase');
const { ERROR_MESSAGES } = require('../../../src/utils/errors');

describe('Role Usecase', () => {
  let roleUsecase;
  function createRole(overrides = {}) {
    return roleUsecase.createRole({ id: '1', name: 'Admin', description: 'Admin role', ...overrides });
  }

  beforeEach(() => {
    roleUsecase = createRoleUsecase();
    roleUsecase.__reset && roleUsecase.__reset();
  });
  afterEach(() => {
    roleUsecase.__reset && roleUsecase.__reset();
  });

  it('deve criar uma role com dados válidos', () => {
    const role = createRole();
    expect(role.id).toBe('1');
    expect(role.name).toBe('Admin');
    expect(role.description).toBe('Admin role');
  });

  it('não deve permitir criar duas roles com o mesmo id', () => {
    createRole();
    expect(() => {
      createRole();
    }).toThrow(ERROR_MESSAGES.ROLE_EXISTS);
  });

  it('deve atualizar uma role existente', () => {
    const role = createRole();
    roleUsecase.updateRole(role.id, { name: 'User', description: 'User role' });
    expect(role.name).toBe('User');
    expect(role.description).toBe('User role');
  });

  it('deve remover uma role existente', () => {
    const role = createRole();
    roleUsecase.removeRole(role.id);
    expect(roleUsecase.getRoleById(role.id)).toBeUndefined();
  });

  it('deve lançar erro ao atualizar/remover role inexistente', () => {
    expect(() => {
      roleUsecase.updateRole('notfound', { name: 'X' });
    }).toThrow(ERROR_MESSAGES.ROLE_NOT_FOUND);
    expect(() => {
      roleUsecase.removeRole('notfound');
    }).toThrow(ERROR_MESSAGES.ROLE_NOT_FOUND);
  });

  it('deve anexar e remover policies', () => {
    const role = createRole();
    roleUsecase.attachPolicyToRole(role.id, 'policy-1');
    expect(role.attachedPolicies).toContain('policy-1');
    roleUsecase.detachPolicyFromRole(role.id, 'policy-1');
    expect(role.attachedPolicies).not.toContain('policy-1');
  });

  it('não deve permitir anexar a mesma policy duas vezes', () => {
    const role = createRole();
    roleUsecase.attachPolicyToRole(role.id, 'policy-1');
    expect(() => {
      roleUsecase.attachPolicyToRole(role.id, 'policy-1');
    }).toThrow(ERROR_MESSAGES.POLICY_ALREADY_ATTACHED);
  });
});
