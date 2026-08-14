/**
 * Testes automatizados - GET /workout/current
 *
 * ATENÇÃO - AJUSTE ANTES DE RODAR:
 * 1. Mesmo ajuste de caminho do "../src/app" do outro arquivo de teste.
 * 2. O teste de sucesso na geração via IA (2º teste) faz uma chamada REAL
 *    ao Gemini se você não mockar o service. Isso pode:
 *      a) gastar sua cota gratuita da API,
 *      b) deixar o teste mais lento e instável (depende de rede).
 *    O ideal é mockar a função do seu service de IA com Sinon, para o
 *    teste não depender da internet nem da chave de API. Deixei um
 *    exemplo comentado abaixo mostrando como fazer isso - você só
 *    precisa ajustar o caminho para o arquivo real do seu service.
 * 3. O teste de erro 502 (Gemini indisponível) SÓ funciona se você
 *    mockar o service para forçar uma falha - não dá pra simular isso
 *    de fora sem mock, e por isso ele já vem pronto usando Sinon.
 */

const request = require('supertest');
const { expect } = require('chai');
const sinon = require('sinon');
const app = require('../src/app'); // <-- ajuste este caminho conforme seu projeto

// Ajuste este caminho para o arquivo real do seu service de IA
const aiService = require('../src/services/ai.service');

describe('Workout - GET /workout/current', () => {
    let token;

    before(async () => {
        const credentials = {
            email: `workout_${Date.now()}@teste.com`,
            password: 'senha123',
            age: 25,
            weight: 70,
            height: 170,
            objective: 'hipertrofia',
            experienceLevel: 'iniciante',
        };

        await request(app).post('/auth/register').send(credentials);

        const loginResponse = await request(app)
            .post('/auth/login')
            .send({ email: credentials.email, password: credentials.password });

        token = loginResponse.body.token;
    });

    afterEach(() => {
        // Restaura qualquer mock feito no service após cada teste
        sinon.restore();
    });

    it('deve retornar 401 ao consultar o treino sem token', async () => {
        const response = await request(app).get('/workout/current');

        expect(response.status).to.equal(401);
        expect(response.body).to.have.property('message');
    });

    it('deve retornar 401 com token inválido', async () => {
        const response = await request(app)
            .get('/workout/current')
            .set('Authorization', 'Bearer token-invalido-qualquer-coisa');

        expect(response.status).to.equal(401);
        expect(response.body).to.have.property('message');
    });

    it('deve gerar um novo treino via Gemini na primeira consulta (200)', async () => {
        // Mock do service de IA - evita chamada real ao Gemini
        sinon.stub(aiService, 'generateWorkout').resolves({
            objective: 'hipertrofia',
            durationWeeks: 6,
            split: 'ABC',
            recommendations: 'Foco em progressão de carga',
            exercises: [
                {
                    name: 'Supino reto',
                    muscleGroup: 'Peito',
                    sets: 4,
                    reps: 10,
                    weightRange: '20-40kg',
                    frequencyPerWeek: '2x',
                    notes: 'Manter cadência controlada',
                },
            ],
        });

        const response = await request(app)
            .get('/workout/current')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).to.equal(200);
        expect(response.body).to.have.nested.property('currentWorkout.plan.objective', 'hipertrofia');
        expect(response.body.currentWorkout.plan.exercises).to.be.an('array').that.is.not.empty;
        expect(response.body.currentWorkout).to.have.property('generatedAt');
    });

    it('deve retornar 502 quando o serviço Gemini falhar', async () => {
        // Usa um aluno novo, sem treino em cache, para garantir que a API
        // realmente tente gerar (e falhe) ao invés de retornar um treino já salvo
        const credentials = {
            email: `workout_fail_${Date.now()}@teste.com`,
            password: 'senha123',
            age: 25,
            weight: 70,
            height: 170,
            objective: 'hipertrofia',
            experienceLevel: 'iniciante',
        };

        await request(app).post('/auth/register').send(credentials);

        const loginResponse = await request(app)
            .post('/auth/login')
            .send({ email: credentials.email, password: credentials.password });

        const failToken = loginResponse.body.token;

        sinon.stub(aiService, 'generateWorkout').rejects(new Error('Gemini indisponível'));

        const response = await request(app)
            .get('/workout/current')
            .set('Authorization', `Bearer ${failToken}`);

        expect(response.status).to.equal(502);
        expect(response.body).to.have.property('message');

    });
});
