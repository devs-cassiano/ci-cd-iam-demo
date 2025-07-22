# IAM Demo (Node.js Clean Architecture)

Este projeto é uma demonstração de microsserviço IAM (Identity and Access Management) inspirado no AWS IAM, implementado em Node.js seguindo Clean Architecture, TDD, SOLID e MSC. O sistema é preparado para CI/CD, Docker e integração incremental.

## Funcionalidades
- **Usuários**: CRUD, MFA, login, associação de policies e roles, chaves de acesso.
- **Roles**: CRUD, associação de policies e usuários.
- **Policies**: CRUD, versionamento, avaliação, associação a usuários, roles e grupos.
- **Grupos**: CRUD, associação de usuários e policies, operações em lote.
- **Access Keys**: CRUD, rotação, expiração, desativação, validação.
- **Testes unitários**: Cobertura completa para entities e usecases.
- **Arquitetura limpa**: Separação clara entre entities, usecases e adapters.

## Estrutura do Projeto
```
├── src/
│   ├── entities/         # Domínio (User, Role, Policy, Group, AccessKey)
│   ├── usecases/         # Regras de negócio (userUsecase, roleUsecase, ...)
│   └── utils/            # Utilitários e helpers
├── tests/
│   └── unit/             # Testes unitários por domínio
│       └── ...
├── package.json
└── README.md
```

## Como rodar localmente
1. **Instale as dependências:**
   ```bash
   npm install
   ```
2. **Execute os testes:**
   ```bash
   npm test
   ```
3. **(Opcional) Rode em Docker:**
   ```bash
   docker build -t iam-demo .
   docker run --rm iam-demo
   ```

## Padrões e práticas
- **Clean Architecture**: Entities (domínio) independentes, usecases orquestram regras, fácil de testar e evoluir.
- **TDD**: Testes unitários para cada entidade e usecase.
- **SOLID**: Código desacoplado, fácil de manter.
- **MSC**: Separação clara Model-Service-Controller (adaptado para Clean Architecture).
- **CI/CD Ready**: Estrutura pronta para pipelines automatizados.

## Como contribuir
1. Fork este repositório
2. Crie uma branch: `git checkout -b feature/nome-da-feature`
3. Faça commits atômicos e com mensagens claras
4. Garanta que todos os testes passam
5. Abra um Pull Request

## Roadmap sugerido
- Integração com banco de dados real
- API REST/GraphQL
- Auditoria e histórico de eventos
- Testes de integração e E2E
- Autenticação real (JWT, OAuth, etc)

---

Projeto para fins didáticos e demonstração de boas práticas de arquitetura e testes em Node.js.
