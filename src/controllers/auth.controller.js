const AuthService = require('../services/auth.service');

async function register(req, res, next) {
  try {
    const student = await AuthService.register(req.body);
    res.status(201).json(student);
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const response = await AuthService.login(req.body);
    res.json(response);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
};
