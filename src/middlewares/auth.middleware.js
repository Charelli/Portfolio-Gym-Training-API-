const jwt = require('jsonwebtoken');
const db = require('../models/db');
const AppError = require('../errors/AppError');

function authenticate(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return next(new AppError(401, 'Authorization header is required.'));
  }

  const [scheme, token] = authorization.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return next(new AppError(401, 'Authorization header must be Bearer token.'));
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = db.users.find((item) => item.id === payload.id);

    if (!user) {
      throw new Error('User not found');
    }

    req.user = { id: user.id, email: user.email };
    next();
  } catch (error) {
    next(new AppError(401, 'Invalid or expired token.'));
  }
}

module.exports = {
  authenticate,
};
