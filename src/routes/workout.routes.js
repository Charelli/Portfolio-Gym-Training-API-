const express = require('express');
const router = express.Router();
const { getCurrentWorkout, recordExercise, getEvolution } = require('../controllers/workout.controller');

router.get('/current', getCurrentWorkout);
router.post('/completed', recordExercise);
router.get('/evolution', getEvolution);

module.exports = router;
