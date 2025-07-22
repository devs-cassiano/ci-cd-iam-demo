// Testes de entidade User (entity)
const User = require('../../../src/entities/User');
const { ERROR_MESSAGES } = require('../../../src/utils/errors');

describe('User Entity', () => {
  function createUser(overrides = {}) {
    return new User({ id: '1', name: 'Alice', email: 'alice@example.com', ...overrides });
  }

  describe('Criação e validação', () => {
    it('deve criar um usuário simples com id, name e email', () => {
      const user = createUser();
      expect(user.id).toBe('1');
      expect(user.name).toBe('Alice');
      expect(user.email).toBe('alice@example.com');
      expect(user.createdAt).toBeDefined();
    });
    it('deve lançar erro se o e-mail for inválido', () => {
      expect(() => {
        createUser({ email: 'email-invalido' });
      }).toThrow(ERROR_MESSAGES.INVALID_EMAIL);
    });
  });

  describe('Atualização', () => {
    it('deve permitir atualizar nome e e-mail válidos', () => {
      const user = createUser();
      user.update({ name: 'Caroline', email: 'caroline@example.com' });
      expect(user.name).toBe('Caroline');
      expect(user.email).toBe('caroline@example.com');
      expect(user.updatedAt).toBeDefined();
    });
    it('deve lançar erro ao tentar atualizar para e-mail inválido', () => {
      const user = createUser();
      expect(() => {
        user.update({ email: 'email-invalido' });
      }).toThrow(ERROR_MESSAGES.INVALID_EMAIL);
    });
  });

  describe('Remoção', () => {
    it('deve marcar o usuário como removido', () => {
      const user = createUser();
      expect(user.removed).toBeUndefined();
      user.remove();
      expect(user.removed).toBe(true);
    });
  });

  describe('Login', () => {
    it('deve registrar login e incrementar loginCount', () => {
      const user = createUser();
      expect(user.loginCount).toBe(0);
      user.registerLogin();
      expect(user.loginCount).toBe(1);
      expect(user.lastLoginAt).toBeDefined();
      user.registerLogin();
      expect(user.loginCount).toBe(2);
    });
  });

  describe('MFA', () => {
    it('deve ativar e desativar MFA', () => {
      const user = createUser();
      expect(user.mfaEnabled).toBe(false);
      user.enableMFA();
      expect(user.mfaEnabled).toBe(true);
      user.disableMFA();
      expect(user.mfaEnabled).toBe(false);
    });
  });

  describe('Policies', () => {
    it('deve anexar, listar e remover policies', () => {
      const user = createUser();
      user.attachPolicy('policy-1');
      user.attachPolicy('policy-2');
      expect(user.listAttachedPolicies()).toEqual(expect.arrayContaining(['policy-1', 'policy-2']));
      user.detachPolicy('policy-1');
      expect(user.listAttachedPolicies()).not.toContain('policy-1');
    });
    it('não deve permitir anexar a mesma policy duas vezes', () => {
      const user = createUser();
      user.attachPolicy('policy-1');
      expect(() => user.attachPolicy('policy-1')).toThrow();
    });
  });

  describe('Roles', () => {
    it('deve anexar, listar e remover roles', () => {
      const user = createUser();
      user.attachRole('role-1');
      user.attachRole('role-2');
      expect(user.listRoles()).toEqual(expect.arrayContaining(['role-1', 'role-2']));
      user.detachRole('role-1');
      expect(user.listRoles()).not.toContain('role-1');
    });
    it('não deve permitir anexar a mesma role duas vezes', () => {
      const user = createUser();
      user.attachRole('role-1');
      expect(() => user.attachRole('role-1')).toThrow();
    });
  });

  // Adicione outros testes de métodos da entity User conforme necessário
});
