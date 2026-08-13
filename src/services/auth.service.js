const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomUUID } = require('crypto');
const db = require('../models/db');
const { sanitizeUser } = require('../models/user.model');
const AppError = require('../errors/AppError');

function generateToken(user) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new AppError(500, 'JWT_SECRET is not defined.');
  }

  return jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn: '24h' });
}

async function register(payload) {
  const { email, password, age, weight, height, objective, experienceLevel, restrictions } = payload;

  if (!email || !password || !age || !weight || !height || !objective || !experienceLevel) {
    throw new AppError(400, 'Email, senha, idade, peso, altura, objetivo e nível de experiência são obrigatórios.');
  }

  const existing = db.users.find((item) => item.email === email.toLowerCase());
  if (existing) {
    throw new AppError(409, 'Um aluno com este email já está registrado.');
  }

  const user = {
    id: randomUUID(),
    email: email.toLowerCase(),
    passwordHash: bcrypt.hashSync(password, 10),
    age,
    weight,
    height,
    objective,
    experienceLevel,
    restrictions: restrictions || 'Nenhuma',
    completedExercises: [],
    currentWorkout: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.users.push(user);
  const safeUser = sanitizeUser(user);
  return safeUser;
}

async function login(payload) {
  const { email, password } = payload;
  if (!email || !password) {
    throw new AppError(400, 'Email e senha são obrigatórios.');
  }

  const user = db.users.find((item) => item.email === email.toLowerCase());
  if (!user) {
    throw new AppError(401, 'Credenciais inválidas.');
  }

  const isValidPassword = bcrypt.compareSync(password, user.passwordHash);
  if (!isValidPassword) {
    throw new AppError(401, 'Credenciais inválidas.');
  }

  const token = generateToken(user);
  return {
    token,
    user: sanitizeUser(user),
  };
}

module.exports = {
  register,
  login,
};
