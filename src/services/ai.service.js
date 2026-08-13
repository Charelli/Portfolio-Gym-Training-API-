const fetch = require('node-fetch');
const AppError = require('../errors/AppError');

const API_KEY = process.env.GEMINI_API_KEY;
const API_URL = process.env.GEMINI_API_URL || 'https://api.openai.com/v1/responses';
const MODEL = process.env.GEMINI_MODEL || 'gemini-1.0';

function buildPrompt(userSpec, history) {
  return `Crie uma ficha de treino completa em JSON para um aluno com as seguintes informações:\n
- Idade: ${userSpec.age}\n- Peso: ${userSpec.weight}\n- Altura: ${userSpec.height}\n- Objetivo: ${userSpec.objective}\n- Nível de experiência: ${userSpec.experienceLevel}\n- Restrições físicas: ${userSpec.restrictions || 'Nenhuma'}\n
Use o histórico de exercícios completados e a ficha anterior para ajustar o plano se for necessário:\n${JSON.stringify(history)}\n
O retorno deve ser um objeto JSON com as propriedades: objective, durationWeeks, split, exercises, recommendations. Não inclua texto adicional fora de JSON.`;
}

function extractPlan(responseBody) {
  let rawText = null;

  if (responseBody.output?.[0]?.content?.[0]?.text) {
    rawText = responseBody.output[0].content[0].text;
  } else if (responseBody.choices?.[0]?.message?.content) {
    rawText = responseBody.choices[0].message.content;
  } else if (typeof responseBody === 'string') {
    rawText = responseBody;
  }

  if (!rawText) {
    throw new AppError(502, 'Resposta da Gemini não contém conteúdo válido.');
  }

  const jsonMatch = rawText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new AppError(502, 'Não foi possível encontrar JSON válido na resposta da Gemini.');
  }

  try {
    const plan = JSON.parse(jsonMatch[0]);
    if (!plan.exercises || !Array.isArray(plan.exercises)) {
      throw new Error('Plano inválido');
    }
    return plan;
  } catch (error) {
    throw new AppError(502, 'Falha ao interpretar o JSON retornado pela Gemini.');
  }
}

async function generateWorkout(userSpec, history) {
  if (!API_KEY) {
    throw new AppError(500, 'GEMINI_API_KEY não está configurada.');
  }

  const prompt = buildPrompt(userSpec, history);
  const payload = {
    model: MODEL,
    input: prompt,
  };

  let response;
  try {
    response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    throw new AppError(502, 'Erro de rede ao conectar com a Gemini.');
  }

  if (!response.ok) {
    const body = await response.text();
    throw new AppError(response.status, `Gemini respondeu com erro: ${body}`);
  }

  const responseBody = await response.json();
  return extractPlan(responseBody);
}

module.exports = {
  generateWorkout,
};
