require('dotenv').config();
const path = require('path');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const workoutRoutes = require('./routes/workout.routes');
const { authenticate } = require('./middlewares/auth.middleware');
const { errorHandler } = require('./middlewares/error.middleware');

const app = express();
const swaggerDocument = YAML.load(path.join(__dirname, '..', 'resources', 'swagger.yaml'));

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/auth', authRoutes);
app.use('/profile', authenticate, userRoutes);
app.use('/workout', authenticate, workoutRoutes);
app.use(errorHandler);

module.exports = app;