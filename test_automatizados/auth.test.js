/**
 * Testes automatizados - Autenticação (POST /auth/register e POST /auth/login)
 *
 * ATENÇÃO - AJUSTE ANTES DE RODAR:
 * 1. O caminho de import abaixo ("../src/app") precisa apontar pro arquivo
 *    onde seu app Express é criado e EXPORTADO (não onde ele é iniciado
 *    com app.listen). Se seu server.js faz tudo junto, você provavelmente
 *    vai precisar separar em app.js (export) e server.js (listen), ou
 *    exportar o app de dentro do server.js mesmo.
 * 2. Ajuste os nomes dos campos se o seu request/response usar nomes
 *    diferentes dos que estão no Swagger que você me mandou.
 */

const request = require('supertest');
const { expect } = require('chai');
const app = require('../src/app'); // <-- ajuste este caminho conforme seu projeto

describe('Auth - POST /auth/register', () => {
    const validPayload = {
        email: `aluno_${Date.now()}@teste.com`, // email único a cada execução, evita 409 falso
        password: 'senha123',
        age: 28,
        weight: 75,
        height: 178,
        objective: 'hipertrofia',
        experienceLevel: 'iniciante',
    };

    it('deve registrar um aluno com sucesso e retornar 201', async () => {
        const response = await request(app)
            .post('/auth/register')
            .send(validPayload);

        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('email', validPayload.email);
        expect(response.body).to.have.property('hasWorkout', false);
    });

    it('deve retornar 400 quando o campo "email" estiver ausente', async () => {
        const { email, ...payloadSemEmail } = validPayload;

        const response = await request(app)
            .post('/auth/register')
            .send(payloadSemEmail);

        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message');
    });

    it('deve retornar 400 quando o campo "password" estiver ausente', async () => {
        const { password, ...payloadSemPassword } = validPayload;

        const response = await request(app)
            .post('/auth/register')
            .send(payloadSemPassword);

        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message');
    });

    it('deve retornar 400 quando o "email" tiver formato inválido', async () => {
        const response = await request(app)
            .post('/auth/register')
            .send({ ...validPayload, email: 'email-invalido-sem-arroba' });

        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message');
    });

    it('deve retornar 409 ao tentar registrar um email já existente', async () => {
        // Primeiro registro
        await request(app).post('/auth/register').send(validPayload);

        // Segundo registro com o mesmo email
        const response = await request(app)
            .post('/auth/register')
            .send(validPayload);

        expect(response.status).to.equal(409);
        expect(response.body).to.have.property('message');
    });
});

describe('Auth - POST /auth/login', () => {
    const credentials = {
        email: `login_${Date.now()}@teste.com`,
        password: 'senha123',
    };

    before(async () => {
        // Cria o usuário que será usado nos testes de login
        await request(app)
            .post('/auth/register')
            .send({
                ...credentials,
                age: 30,
                weight: 80,
                height: 175,
                objective: 'emagrecimento',
                experienceLevel: 'intermediario',
            });
    });

    it('deve autenticar com sucesso e retornar token + user (200)', async () => {
        const response = await request(app)
            .post('/auth/login')
            .send(credentials);

        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('token');
        expect(response.body).to.have.property('user');
        expect(response.body.user).to.have.property('email', credentials.email);
    });

    it('deve retornar 401 com senha incorreta', async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({ email: credentials.email, password: 'senhaErrada' });

        expect(response.status).to.equal(401);
        expect(response.body).to.have.property('message');
    });

    it('deve retornar 401 com email não cadastrado', async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({ email: 'naoexiste@teste.com', password: 'qualquerSenha' });

        expect(response.status).to.equal(401);
        expect(response.body).to.have.property('message');
    });

    it('deve retornar 400 quando o campo "email" estiver ausente no login', async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({ password: credentials.password });

        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message');
    });

    it('deve retornar 400 quando o campo "password" estiver ausente no login', async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({ email: credentials.email });

        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message');
    });
});
