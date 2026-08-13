const db = require('../models/db');
const AiService = require('./ai.service');
const AppError = require('../errors/AppError');

const WORKOUT_DURATION_MS = 45 * 24 * 60 * 60 * 1000;

function isWorkoutExpired(workout) {
  if (!workout || !workout.generatedAt) {
    return true;
  }

  const generatedAt = new Date(workout.generatedAt).getTime();
  return Date.now() - generatedAt >= WORKOUT_DURATION_MS;
}

async function getCurrentWorkout(userId) {
  const user = db.users.find((item) => item.id === userId);
  if (!user) {
    throw new AppError(404, 'Aluno não encontrado.');
  }

  if (!user.currentWorkout || isWorkoutExpired(user.currentWorkout)) {
    const workoutPlan = await AiService.generateWorkout(
      {
        age: user.age,
        weight: user.weight,
        height: user.height,
        objective: user.objective,
        experienceLevel: user.experienceLevel,
        restrictions: user.restrictions,
      },
      {
        completedExercises: user.completedExercises,
        currentWorkout: user.currentWorkout,
      }
    );

    user.currentWorkout = {
      plan: workoutPlan,
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    currentWorkout: user.currentWorkout,
  };
}

async function recordExercise(userId, payload) {
  const user = db.users.find((item) => item.id === userId);
  if (!user) {
    throw new AppError(404, 'Aluno não encontrado.');
  }

  const { exerciseName, date, sets, reps, weight, notes } = payload;

  if (!exerciseName || !date || sets === undefined || reps === undefined) {
    throw new AppError(400, 'Nome do exercício, data, séries e repetições são obrigatórios.');
  }

  const entry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    exerciseName,
    date: new Date(date).toISOString(),
    sets,
    reps,
    weight: weight || null,
    notes: notes || null,
  };

  user.completedExercises.push(entry);
  return entry;
}

function getEvolution(userId) {
  const user = db.users.find((item) => item.id === userId);
  if (!user) {
    throw new AppError(404, 'Aluno não encontrado.');
  }

  if (!user.currentWorkout) {
    throw new AppError(404, 'Nenhum treino vigente encontrado. Consulte /workout/current para gerar o treino.');
  }

  const planExercises = user.currentWorkout.plan.exercises || [];
  const completed = user.completedExercises;

  const exerciseDetails = planExercises.map((planExercise) => {
    const logs = completed.filter((record) => record.exerciseName.toLowerCase() === planExercise.name.toLowerCase());
    const completedSessions = logs.length;
    const averageWeight = logs.reduce((sum, record) => sum + (record.weight || 0), 0) / (completedSessions || 1);

    return {
      name: planExercise.name,
      plannedSets: planExercise.sets,
      plannedReps: planExercise.reps,
      completedSessions,
      averageWeight: completedSessions ? Number(averageWeight.toFixed(1)) : null,
      lastCompletion: logs.length ? logs[logs.length - 1].date : null,
    };
  });

  const plannedCount = planExercises.length;
  const completedCount = exerciseDetails.filter((item) => item.completedSessions > 0).length;
  const completionRate = plannedCount ? Math.round((completedCount / plannedCount) * 100) : 0;

  return {
    summary: {
      plannedExercises: plannedCount,
      exercisesPerformed: completedCount,
      completionRate: `${completionRate}%`,
      lastWorkoutGeneratedAt: user.currentWorkout.generatedAt,
    },
    exerciseDetails,
  };
}

module.exports = {
  getCurrentWorkout,
  recordExercise,
  getEvolution,
};
