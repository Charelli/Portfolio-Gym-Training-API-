const WorkoutService = require('../services/workout.service');

async function getCurrentWorkout(req, res, next) {
  try {
    const workout = await WorkoutService.getCurrentWorkout(req.user.id);
    res.json(workout);
  } catch (error) {
    next(error);
  }
}

async function recordExercise(req, res, next) {
  try {
    const record = await WorkoutService.recordExercise(req.user.id, req.body);
    res.status(201).json(record);
  } catch (error) {
    next(error);
  }
}

async function getEvolution(req, res, next) {
  try {
    const evolution = await WorkoutService.getEvolution(req.user.id);
    res.json(evolution);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getCurrentWorkout,
  recordExercise,
  getEvolution,
};
