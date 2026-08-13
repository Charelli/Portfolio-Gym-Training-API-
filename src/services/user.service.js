const db = require('../models/db');
const { sanitizeUser } = require('../models/user.model');
const AppError = require('../errors/AppError');

async function updateProfile(userId, payload) {
  const user = db.users.find((item) => item.id === userId);
  if (!user) {
    throw new AppError(404, 'Aluno não encontrado.');
  }

  const fields = ['age', 'weight', 'height', 'objective', 'experienceLevel', 'restrictions'];
  let profileChanged = false;

  fields.forEach((field) => {
    if (payload[field] !== undefined) {
      user[field] = payload[field];
      profileChanged = true;
    }
  });

  if (profileChanged) {
    user.currentWorkout = null;
    user.updatedAt = new Date().toISOString();
  }

  return sanitizeUser(user);
}

function getProfile(userId) {
  const user = db.users.find((item) => item.id === userId);
  if (!user) {
    throw new AppError(404, 'Aluno não encontrado.');
  }

  return sanitizeUser(user);
}

module.exports = {
  getProfile,
  updateProfile,
};
