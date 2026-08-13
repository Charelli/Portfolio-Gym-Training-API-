function sanitizeUser(user) {
  const { passwordHash, completedExercises, currentWorkout, ...safeFields } = user;
  return {
    ...safeFields,
    hasWorkout: Boolean(currentWorkout),
  };
}

module.exports = {
  sanitizeUser,
};
