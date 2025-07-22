// src/utils/errors.js

const ERROR_MESSAGES = {
  POLICY_EXISTS: 'Policy com id já existe',
  POLICY_NOT_FOUND: 'Policy não encontrada',
  POLICY_VERSION_NOT_FOUND: 'Versão da policy não encontrada',
  POLICY_ALREADY_ATTACHED: 'Policy já associada',
  ROLE_EXISTS: 'Role com id já existe',
  ROLE_NOT_FOUND: 'Role não encontrada',
  ROLE_ALREADY_ATTACHED: 'Role já associada ao usuário',
  USER_NOT_FOUND: 'Usuário não encontrado',
  USERNAME_EXISTS: 'Nome de usuário já existe',
  INVALID_EMAIL: 'E-mail inválido',
  INVALID_ACCESS_KEY_FORMAT: 'Formato de access key inválido',
  ACCESS_KEY_LIMIT_REACHED: 'Limite de access keys atingido',
  INVALID_POLICY_DOCUMENT: 'Documento de policy inválido',
  POLICY_MISSING_VERSION: 'Policy deve ter Version',
  POLICY_MISSING_STATEMENT: 'Policy deve ter Statement',
  POLICY_STATEMENT_NOT_ARRAY: 'Statement deve ser um array',
  GROUP_EXISTS: 'Grupo com id já existe',
  GROUP_NOT_FOUND: 'Grupo não encontrado',
  USER_ALREADY_IN_GROUP: 'Usuário já está no grupo',
  GROUP_MEMBER_LIMIT: 'Limite de membros do grupo atingido',
  GROUP_POLICY_LIMIT: 'Limite de policies do grupo atingido',
  GROUP_ESSENTIAL_REMOVE: 'Não é permitido remover grupo essencial',
  // Adicione outros erros globais aqui conforme necessário
};

function throwError(type, details) {
  let message = ERROR_MESSAGES[type] || 'Erro desconhecido';
  if (details) message += `: ${details}`;
  throw new Error(message);
}

module.exports = { throwError, ERROR_MESSAGES };
