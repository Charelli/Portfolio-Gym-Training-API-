# Portfolio Gym Training API

API REST para gerenciamento de alunos e treinos de academia, com geração de treinos personalizados via Gemini.

## Recursos implementados

- `POST /auth/register` - registro de aluno com dados e objetivos
- `POST /auth/login` - autenticação e geração de JWT
- `GET /profile` - consulta do perfil do aluno autenticado
- `PATCH /profile` - atualização de dados e objetivos do aluno
- `GET /workout/current` - consulta do treino atual com geração/renovação automática
- `POST /workout/completed` - registro de exercício realizado
- `GET /workout/evolution` - consulta da evolução do aluno
- `GET /api-docs` - renderiza a documentação Swagger

## Estrutura do projeto

- `src/routes` - roteamento REST
- `src/controllers` - controle de requisições e respostas
- `src/services` - lógica de negócio e integração com Gemini
- `src/models` - banco de dados em memória e modelos
- `src/middlewares` - autenticação JWT e tratamento de erros
- `resources/swagger.yaml` - documentação OpenAPI
- `test_manual/` - casos de teste manuais em Gherkin (BDD)
- `test_automatizados/` - testes automatizados (Mocha + Chai + Supertest)

## Configuração

1. Instale as dependências:
```bash
npm install
```

2. Copie `.env.example` para `.env` e configure as variáveis:
```powershell
copy .env.example .env
```

### Variáveis de ambiente

- `PORT` - porta do servidor (padrão `3000`)
- `JWT_SECRET` - segredo usado para assinar tokens JWT
- `GEMINI_API_KEY` - chave da API Gemini
- `GEMINI_API_URL` - URL do endpoint da Gemini
- `GEMINI_MODEL` - modelo Gemini a ser usado

3. Inicie a API:
```bash
npm start
```

Ou, para rodar com reinício automático a cada alteração no código:
```bash
npm run dev
```

## Como funciona a renovação do treino

A cada consulta em `GET /workout/current`, a API verifica se o treino vigente está presente e se já completou 45 dias desde sua geração. Se o treino estiver ausente ou expirado, a API chama a camada de serviço Gemini para gerar uma nova ficha de treino personalizada usando:

- especificações do aluno
- histórico de exercícios realizados
- treino anterior, quando existir

Essa lógica fica implementada no serviço de treino e não depende de um job agendado.

## Swagger

A documentação completa está disponível em:
```text
http://localhost:3000/api-docs
```

## Testes

O projeto conta com três frentes de teste, documentadas em detalhe na [Wiki do projeto](../../wiki):

- **Casos de teste manuais (Gherkin/BDD)** em `test_manual/`, cobrindo cenários de sucesso e falha de cada endpoint
- **Testes automatizados** em `test_automatizados/`, usando Mocha + Chai + Supertest, cobrindo os fluxos críticos (autenticação e geração de treino via IA)
- **Sessões de teste exploratório** usando a heurística VADER (Verbs, Authorization, Data, Errors, Responsiveness), com achados registrados como [Issues](../../issues) do repositório

Para rodar os testes automatizados:
```bash
npm test
```

Consulte as páginas [Estratégia de Testes](../../wiki/Estrategia-de-Testes) e [Decisões Técnicas](../../wiki/Decisoes-Tecnicas) na Wiki para entender o raciocínio por trás das escolhas de ferramentas e arquitetura.

## Observações

- A autenticação protege todas as rotas exceto `POST /auth/register` e `POST /auth/login`.
- O serviço Gemini lê a chave de API a partir de `GEMINI_API_KEY` e não usa chaves hardcoded.
- Erros de integração com a IA retornam status apropriado (por exemplo, `502`) sem quebrar a aplicação.

## Limitações conhecidas e próximos passos

- **Banco em memória**: os dados são perdidos a cada reinício do servidor. Essa escolha foi consciente, para simplificar a execução do projeto sem depender de infraestrutura externa (ver [Decisões Técnicas](../../wiki/Decisoes-Tecnicas)).
- **Perfil único (aluno)**: o projeto não contempla um perfil de instrutor. Um segundo perfil, com permissões distintas, é uma evolução possível.
- **Cobertura de automação parcial**: nem todos os cenários documentados em Gherkin estão automatizados ainda a priorização seguiu o critério de criticidade de fluxo (ver [Estratégia de Testes](../../wiki/Estrategia-de-Testes)).
- **Bugs em aberto**: achados de sessões de teste exploratório estão documentados como [Issues](../../issues) do repositório, incluindo status de investigação e severidade.