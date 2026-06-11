const dns = require('dns');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const User = require('./models/UserSchema');
const NutritionProfile = require('./models/NutritionProfileSchema');
const Goal = require('./models/GoalSchema');
const Food = require('./models/FoodSchema');
const FoodLog = require('./models/FoodLogSchema');
const FavoriteFood = require('./models/FavoriteFoodSchema');
const Reminder = require('./models/ReminderSchema');
const Recipe = require('./models/RecipeSchema');
const Report = require('./models/ReportSchema');
const DeviationRecovery = require('./models/DeviationRecoverySchema');

dotenv.config();
dns.setServers(['8.8.8.8', '1.1.1.1']);

function dashboardFor(user) {
  return {
    calories: { consumed: 0, goal: 2100, percent: 0 },
    macros: { carbs: '230 g', protein: '130 g', fat: '70 g' },
    profile: {
      mainGoal: 'Balanced nutrition',
      rule: 'Track protein with every meal',
      cookingStyle: 'Simple meal prep',
    },
    chat: {
      botMessage: `Hello ${user.fullName}! Ready to plan a balanced day?`,
      userMessage: 'Yes, show me what to eat today.',
    },
    meals: [],
  };
}

async function upsertFood(food) {
  return Food.findOneAndUpdate(
    { name: food.name },
    { $set: food },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );
}

async function seed() {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is missing from server/.env');
  }

  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });
  console.log('Connected to MongoDB Atlas for seeding');

  const demoUserData = {
    username: 'demo_user',
    email: 'demo@nutribot.com',
    password: '123456',
    fullName: 'Demo User',
  };

  const demoUser = await User.findOneAndUpdate(
    { email: demoUserData.email },
    { $set: { ...demoUserData, dashboard: dashboardFor(demoUserData) } },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );

  await NutritionProfile.findOneAndUpdate(
    { userId: demoUser._id },
    { $set: { userId: demoUser._id, age: 28, weight: 72, height: 176, activityLevel: 'Moderate' } },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );

  await Goal.findOneAndUpdate(
    { userId: demoUser._id },
    {
      $set: {
        userId: demoUser._id,
        goalType: 'Balanced nutrition',
        targetCalories: 2100,
        targetProtein: 130,
        targetCarbs: 230,
        targetFat: 70,
      },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );

  const foods = await Promise.all([
    upsertFood({ name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 4 }),
    upsertFood({ name: 'Rice', calories: 206, protein: 4, carbs: 45, fat: 0.4 }),
    upsertFood({ name: 'Egg', calories: 78, protein: 6, carbs: 0.6, fat: 5 }),
    upsertFood({ name: 'Banana', calories: 105, protein: 1.3, carbs: 27, fat: 0.3 }),
    upsertFood({ name: 'Greek Yogurt', calories: 120, protein: 18, carbs: 7, fat: 3 }),
    upsertFood({ name: 'Tuna', calories: 132, protein: 28, carbs: 0, fat: 1 }),
    upsertFood({ name: 'Oats', calories: 154, protein: 6, carbs: 27, fat: 3 }),
  ]);

  const [chicken, rice, egg, banana, greekYogurt, tuna, oats] = foods;

  await FoodLog.findOneAndUpdate(
    { userId: demoUser._id, foodId: greekYogurt._id, mealType: 'Breakfast' },
    {
      $set: {
        userId: demoUser._id,
        foodId: greekYogurt._id,
        date: new Date(),
        quantity: 1,
        mealType: 'Breakfast',
      },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );

  await FoodLog.findOneAndUpdate(
    { userId: demoUser._id, foodId: chicken._id, mealType: 'Lunch' },
    {
      $set: {
        userId: demoUser._id,
        foodId: chicken._id,
        date: new Date(),
        quantity: 1,
        mealType: 'Lunch',
      },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );

  await FavoriteFood.findOneAndUpdate(
    { userId: demoUser._id, foodId: chicken._id },
    { $set: { userId: demoUser._id, foodId: chicken._id } },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );

  await FavoriteFood.findOneAndUpdate(
    { userId: demoUser._id, foodId: greekYogurt._id },
    { $set: { userId: demoUser._id, foodId: greekYogurt._id } },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );

  await Reminder.findOneAndUpdate(
    { userId: demoUser._id, reminderType: 'Log meals' },
    { $set: { userId: demoUser._id, reminderType: 'Log meals', time: '12:00', isActive: true } },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );

  await Reminder.findOneAndUpdate(
    { userId: demoUser._id, reminderType: 'Drink water' },
    { $set: { userId: demoUser._id, reminderType: 'Drink water', time: '10:00', isActive: true } },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );

  await Recipe.findOneAndUpdate(
    { name: 'Chicken Rice Bowl' },
    {
      $set: {
        name: 'Chicken Rice Bowl',
        ingredients: [chicken.name, rice.name, 'Vegetables'],
        calories: 520,
        protein: 42,
        carbs: 58,
        fat: 12,
        estimatedCost: 18,
      },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );

  await Recipe.findOneAndUpdate(
    { name: 'Yogurt Banana Oats Bowl' },
    {
      $set: {
        name: 'Yogurt Banana Oats Bowl',
        ingredients: [greekYogurt.name, banana.name, oats.name],
        calories: 360,
        protein: 24,
        carbs: 54,
        fat: 6,
        estimatedCost: 11,
      },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );

  await Recipe.findOneAndUpdate(
    { name: 'Tuna Egg Plate' },
    {
      $set: {
        name: 'Tuna Egg Plate',
        ingredients: [tuna.name, egg.name, 'Fresh salad'],
        calories: 340,
        protein: 38,
        carbs: 10,
        fat: 14,
        estimatedCost: 16,
      },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );

  await Report.findOneAndUpdate(
    { userId: demoUser._id, reportType: 'daily' },
    {
      $set: {
        userId: demoUser._id,
        reportType: 'daily',
        startDate: new Date(),
        endDate: new Date(),
        totalCalories: 285,
        totalProtein: 49,
        totalCarbs: 7,
        totalFat: 7,
      },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );

  await DeviationRecovery.findOneAndUpdate(
    { userId: demoUser._id, description: 'Weekend restaurant meal' },
    {
      $set: {
        userId: demoUser._id,
        description: 'Weekend restaurant meal',
        deviationDate: new Date(),
        extraCalories: 600,
        recoveryStartDate: new Date(),
        recoveryEndDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        adjustedCaloriesPerDay: 300,
        notes: 'Keep recovery moderate and continue protein intake.',
      },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );

  console.log('Seed data inserted or updated successfully');
  console.log('Demo login: demo_user / 123456');
}

if (require.main === module) {
  seed()
    .catch((error) => {
      console.error('Seed failed:', error.message);
      process.exitCode = 1;
    })
    .finally(async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed');
    });
}

module.exports = seed;
