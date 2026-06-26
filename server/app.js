const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const dns = require('dns');

dns.setServers(['8.8.8.8', '1.1.1.1']);

const usersRoute = require('./routes/users.route');
const nutritionProfilesRoute = require('./routes/nutritionProfiles.route');
const goalsRoute = require('./routes/goals.route');
const foodsRoute = require('./routes/foods.route');
const foodLogsRoute = require('./routes/foodLogs.route');
const favoriteFoodsRoute = require('./routes/favoriteFoods.route');
const remindersRoute = require('./routes/reminders.route');
const recipesRoute = require('./routes/recipes.route');
const reportsRoute = require('./routes/reports.route');
const deviationRecoveriesRoute = require('./routes/deviationRecoveries.route');

dotenv.config({ path: __dirname + '/.env' });

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  /^http:\/\/localhost:\d+$/,
  /^http:\/\/127\.0\.0\.1:\d+$/,
  'https://nutribot-frontend-one.vercel.app',
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  optionsSuccessStatus: 204,
}));

app.options('*', cors({
  origin: allowedOrigins,
  credentials: true,
  optionsSuccessStatus: 204,
}));
app.use(express.json());

app.get('/api', (req, res) => {
  res.json({
    status: 'ok',
    message: 'NutriBot API is running',
  });
});

app.use('/api/users', usersRoute);
app.use('/api/nutrition-profiles', nutritionProfilesRoute);
app.use('/api/goals', goalsRoute);
app.use('/api/foods', foodsRoute);
app.use('/api/food-logs', foodLogsRoute);
app.use('/api/favorite-foods', favoriteFoodsRoute);
app.use('/api/reminders', remindersRoute);
app.use('/api/recipes', recipesRoute);
app.use('/api/reports', reportsRoute);
app.use('/api/deviation-recoveries', deviationRecoveriesRoute);

if (!process.env.MONGO_URI) {
  console.error('Failed to connect to MongoDB Atlas: MONGO_URI is missing from environment variables');
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 })
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB Atlas:', error.message);
  });

