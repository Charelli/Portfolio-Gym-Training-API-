const UserService = require('../services/user.service');

async function getProfile(req, res, next) {
  try {
    const profile = UserService.getProfile(req.user.id);
    res.json(profile);
  } catch (error) {
    next(error);
  }
}

async function updateProfile(req, res, next) {
  try {
    const updated = await UserService.updateProfile(req.user.id, req.body);
    res.json(updated);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProfile,
  updateProfile,
};
