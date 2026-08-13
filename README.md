# Portfolio Gym Training API

API REST para gerenciamento de alunos e treinos de academia com geração de treinos personalizados via Gemini.

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
npm run dev

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

## Observações

- A autenticação protege todas as rotas exceto `POST /auth/register` e `POST /auth/login`.
- O serviço Gemini lê a chave de API a partir de `GEMINI_API_KEY` e não usa chaves hardcoded.
- Erros de integração com a IA retornam status apropriado (por exemplo, `502`) sem quebrar a aplicação.
