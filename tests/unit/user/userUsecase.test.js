// Testes de regras de negócio/orquestração para User (usecase)
const { createUserUsecase } = require('../../../src/usecases/userUsecase');
const { ERROR_MESSAGES } = require('../../../src/utils/errors');

describe('User Usecase', () => {
  let userUsecase;
  function createUser(overrides = {}) {
    return userUsecase.createUser({ id: '1', name: 'Alice', email: 'alice@example.com', ...overrides });
  }

  beforeEach(() => {
    userUsecase = createUserUsecase();
    userUsecase.__reset && userUsecase.__reset();
  });
  afterEach(() => {
    userUsecase.__reset && userUsecase.__reset();
  });

  describe('Criação e unicidade', () => {
    it('deve criar um usuário com dados válidos', () => {
      const user = createUser();
      expect(user.id).toBe('1');
      expect(user.name).toBe('Alice');
      expect(user.email).toBe('alice@example.com');
    });
    it('não deve permitir criar dois usuários com o mesmo nome', () => {
      createUser();
      expect(() => {
        createUser();
      }).toThrow(ERROR_MESSAGES.USERNAME_EXISTS);
    });
    it('deve verificar se um username existe', () => {
      createUser();
      expect(userUsecase.exists('Alice')).toBe(true);
      expect(userUsecase.exists('OutroNome')).toBe(false);
    });
  });

  describe('Update e remoção', () => {
    it('deve permitir atualizar nome e e-mail válidos', () => {
      const user = createUser();
      userUsecase.updateUser(user.id, { name: 'Caroline', email: 'caroline@example.com' });
      expect(user.name).toBe('Caroline');
      expect(user.email).toBe('caroline@example.com');
    });
    it('deve lançar erro ao tentar atualizar para e-mail inválido', () => {
      const user = createUser();
      expect(() => {
        userUsecase.updateUser(user.id, { email: 'email-invalido' });
      }).toThrow(ERROR_MESSAGES.INVALID_EMAIL);
    });
    it('deve lançar erro ao atualizar para nome já existente', () => {
      createUser();
      const user2 = userUsecase.createUser({ id: '2', name: 'Bob', email: 'bob@example.com' });
      expect(() => {
        userUsecase.updateUser(user2.id, { name: 'Alice' });
      }).toThrow(ERROR_MESSAGES.USERNAME_EXISTS);
    });
  });

  describe('Remoção', () => {
    it('deve remover um usuário existente', () => {
      const user = createUser();
      userUsecase.removeUser(user.id);
      expect(userUsecase.getUserById(user.id)).toBeUndefined();
    });
    it('deve lançar erro ao remover usuário inexistente', () => {
      expect(() => {
        userUsecase.removeUser('notfound');
      }).toThrow(ERROR_MESSAGES.USER_NOT_FOUND);
    });
  });

  describe('Recuperação', () => {
    it('deve recuperar usuário por id', () => {
      const user = createUser();
      const found = userUsecase.getUserById(user.id);
      expect(found).toBeDefined();
      expect(found.id).toBe(user.id);
    });
    it('deve retornar undefined para usuário inexistente', () => {
      expect(userUsecase.getUserById('notfound')).toBeUndefined();
    });
  });

  describe('Policies', () => {
    it('deve anexar e remover policies do usuário', () => {
      const user = createUser();
      userUsecase.attachPolicyToUser(user.id, 'policy-1');
      expect(user.attachedPolicies).toContain('policy-1');
      userUsecase.detachPolicyFromUser(user.id, 'policy-1');
      expect(user.attachedPolicies).not.toContain('policy-1');
    });
    it('deve listar policies do usuário', () => {
      const user = createUser();
      userUsecase.attachPolicyToUser(user.id, 'policy-1');
      userUsecase.attachPolicyToUser(user.id, 'policy-2');
      const policies = userUsecase.listUserPolicies(user.id);
      expect(policies).toContain('policy-1');
      expect(policies).toContain('policy-2');
    });
  });

  describe('AccessKey (mock)', () => {
    it('deve chamar addUserAccessKey sem erro', () => {
      const user = createUser();
      expect(() => userUsecase.addUserAccessKey(user.id, 'AKIA123456789012')).not.toThrow();
    });
    it('deve lançar erro ao manipular accessKey de usuário inexistente', () => {
      expect(() => userUsecase.addUserAccessKey('notfound', 'AKIA123456789012')).toThrow(ERROR_MESSAGES.USER_NOT_FOUND);
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

  describe('Roles', () => {
    it('deve anexar e remover roles do usuário', () => {
      const user = createUser();
      user.attachRole('role-1');
      expect(user.roles).toContain('role-1');
      user.attachRole('role-2');
      expect(user.roles).toContain('role-2');
      user.detachRole('role-1');
      expect(user.roles).not.toContain('role-1');
    });
    it('não deve permitir anexar a mesma role duas vezes', () => {
      const user = createUser();
      user.attachRole('role-1');
      expect(() => user.attachRole('role-1')).toThrow();
    });
    it('deve listar roles do usuário', () => {
      const user = createUser();
      user.attachRole('role-1');
      user.attachRole('role-2');
      expect(user.listRoles()).toEqual(expect.arrayContaining(['role-1', 'role-2']));
    });
  });

  // Adicione outros testes de regras de negócio do usecase conforme necessário
});
