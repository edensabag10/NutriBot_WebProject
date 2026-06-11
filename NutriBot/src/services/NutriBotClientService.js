import { apiRequest } from './apiClient.js';

const today = () => new Date().toISOString().slice(0, 10);

function byUserId(userId) {
  return (item) => String(item.userId) === String(userId);
}

function toNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

async function getData() {
  const [
    nutritionProfiles,
    goals,
    foods,
    foodLogs,
    favoriteFoods,
    reminders,
    recipes,
    reports,
    deviationRecoveries,
  ] = await Promise.all([
    getNutritionProfiles(),
    getGoals(),
    getFoods(),
    getAllFoodLogs(),
    getAllFavoriteFoods(),
    getAllReminders(),
    getRecipes(),
    getAllReports(),
    getAllDeviationRecoveries(),
  ]);

  return {
    nutritionProfiles,
    goals,
    foods,
    foodLogs,
    favoriteFoods,
    reminders,
    recipes,
    reports,
    deviationRecoveries,
  };
}

async function getNutritionProfiles() {
  return apiRequest('/nutrition-profiles');
}

async function getNutritionProfile(userId) {
  const profiles = await getNutritionProfiles();
  return profiles.find(byUserId(userId)) || null;
}

async function saveNutritionProfile(userId, profile) {
  const existingProfile = await getNutritionProfile(userId);
  const payload = {
    ...profile,
    userId,
    age: toNumber(profile.age),
    weight: toNumber(profile.weight),
    height: toNumber(profile.height),
  };

  if (existingProfile?.id) {
    return apiRequest(`/nutrition-profiles/${existingProfile.id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  return apiRequest('/nutrition-profiles', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

async function deleteNutritionProfile(id) {
  return apiRequest(`/nutrition-profiles/${id}`, { method: 'DELETE' });
}

async function getGoals() {
  return apiRequest('/goals');
}

async function getGoal(userId) {
  const goals = await getGoals();
  return goals.find(byUserId(userId)) || null;
}

async function saveGoal(userId, goal) {
  const existingGoal = await getGoal(userId);
  const payload = {
    ...goal,
    userId,
    targetCalories: toNumber(goal.targetCalories),
    targetProtein: toNumber(goal.targetProtein),
    targetCarbs: toNumber(goal.targetCarbs),
    targetFat: toNumber(goal.targetFat),
  };

  if (existingGoal?.id) {
    return apiRequest(`/goals/${existingGoal.id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  return apiRequest('/goals', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

async function deleteGoal(id) {
  return apiRequest(`/goals/${id}`, { method: 'DELETE' });
}

async function getFoods() {
  return apiRequest('/foods');
}

async function createFood(food) {
  return apiRequest('/foods', {
    method: 'POST',
    body: JSON.stringify(food),
  });
}

async function updateFood(id, food) {
  return apiRequest(`/foods/${id}`, {
    method: 'PUT',
    body: JSON.stringify(food),
  });
}

async function deleteFood(id) {
  return apiRequest(`/foods/${id}`, { method: 'DELETE' });
}

async function getAllFavoriteFoods() {
  return apiRequest('/favorite-foods');
}

async function getFavoriteFoods(userId) {
  const [favorites, foods] = await Promise.all([getAllFavoriteFoods(), getFoods()]);
  const favoriteFoodIds = favorites.filter(byUserId(userId)).map((favorite) => String(favorite.foodId));
  return foods.filter((food) => favoriteFoodIds.includes(String(food.id)));
}

async function toggleFavoriteFood(userId, foodId) {
  const favorites = await getAllFavoriteFoods();
  const existingFavorite = favorites.find(
    (favorite) => String(favorite.userId) === String(userId) && String(favorite.foodId) === String(foodId),
  );

  if (existingFavorite?.id) {
    await apiRequest(`/favorite-foods/${existingFavorite.id}`, { method: 'DELETE' });
    return { removed: true };
  }

  return apiRequest('/favorite-foods', {
    method: 'POST',
    body: JSON.stringify({ userId, foodId }),
  });
}

async function getAllFoodLogs() {
  return apiRequest('/food-logs');
}

async function getFoodLogs(userId) {
  const [logs, foods] = await Promise.all([getAllFoodLogs(), getFoods()]);

  return logs
    .filter(byUserId(userId))
    .map((log) => ({
      ...log,
      food: foods.find((food) => String(food.id) === String(log.foodId)),
    }))
    .filter((log) => log.food);
}

async function addFoodLog(userId, log) {
  return apiRequest('/food-logs', {
    method: 'POST',
    body: JSON.stringify({
      ...log,
      userId,
      quantity: toNumber(log.quantity, 1),
      date: log.date || today(),
    }),
  });
}

async function updateFoodLog(id, log) {
  return apiRequest(`/food-logs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(log),
  });
}

async function deleteFoodLog(id) {
  return apiRequest(`/food-logs/${id}`, { method: 'DELETE' });
}

async function calculateTotals(userId) {
  const logs = await getFoodLogs(userId);

  return logs.reduce(
    (totals, log) => {
      const quantity = toNumber(log.quantity, 1);
      return {
        calories: totals.calories + toNumber(log.food.calories) * quantity,
        protein: totals.protein + toNumber(log.food.protein) * quantity,
        carbs: totals.carbs + toNumber(log.food.carbs) * quantity,
        fat: totals.fat + toNumber(log.food.fat) * quantity,
      };
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );
}

async function getAllReminders() {
  return apiRequest('/reminders');
}

async function getReminders(userId) {
  const reminders = await getAllReminders();
  return reminders.filter(byUserId(userId));
}

async function addReminder(userId, reminder) {
  return apiRequest('/reminders', {
    method: 'POST',
    body: JSON.stringify({ ...reminder, userId, isActive: true }),
  });
}

async function toggleReminder(id) {
  const reminders = await getAllReminders();
  const reminder = reminders.find((item) => String(item.id) === String(id));

  if (!reminder) {
    return null;
  }

  return apiRequest(`/reminders/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ ...reminder, isActive: !reminder.isActive }),
  });
}

async function deleteReminder(id) {
  return apiRequest(`/reminders/${id}`, { method: 'DELETE' });
}

async function getRecipes(maxCost = Infinity) {
  const recipes = await apiRequest('/recipes');
  return recipes.filter((recipe) => toNumber(recipe.estimatedCost) <= Number(maxCost || Infinity));
}

async function createRecipe(recipe) {
  return apiRequest('/recipes', {
    method: 'POST',
    body: JSON.stringify(recipe),
  });
}

async function updateRecipe(id, recipe) {
  return apiRequest(`/recipes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(recipe),
  });
}

async function deleteRecipe(id) {
  return apiRequest(`/recipes/${id}`, { method: 'DELETE' });
}

async function getAllReports() {
  return apiRequest('/reports');
}

async function createReport(report) {
  return apiRequest('/reports', {
    method: 'POST',
    body: JSON.stringify(report),
  });
}

async function getReports(userId) {
  const [totals, goal] = await Promise.all([calculateTotals(userId), getGoal(userId)]);

  return {
    daily: totals,
    weekly: {
      calories: totals.calories * 7,
      protein: totals.protein * 7,
      carbs: totals.carbs * 7,
      fat: totals.fat * 7,
    },
    monthly: {
      calories: totals.calories * 30,
      protein: totals.protein * 30,
      carbs: totals.carbs * 30,
      fat: totals.fat * 30,
    },
    goal,
  };
}

async function getAllDeviationRecoveries() {
  return apiRequest('/deviation-recoveries');
}

async function getDeviationRecoveries(userId) {
  const recoveries = await getAllDeviationRecoveries();
  return recoveries.filter(byUserId(userId));
}

async function createDeviationRecovery(userId, deviation) {
  const extraCalories = toNumber(deviation.extraCalories);

  return apiRequest('/deviation-recoveries', {
    method: 'POST',
    body: JSON.stringify({
      ...deviation,
      userId,
      extraCalories,
      adjustedCaloriesPerDay: Math.max(0, Math.round(extraCalories / 2)),
      recoveryStartDate: today(),
      recoveryEndDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    }),
  });
}

async function updateDeviationRecovery(id, recovery) {
  return apiRequest(`/deviation-recoveries/${id}`, {
    method: 'PUT',
    body: JSON.stringify(recovery),
  });
}

async function deleteDeviationRecovery(id) {
  return apiRequest(`/deviation-recoveries/${id}`, { method: 'DELETE' });
}

async function getBotReply(message, userId) {
  const [goal, totals] = await Promise.all([getGoal(userId), calculateTotals(userId)]);
  return `Based on your ${goal?.goalType || 'nutrition'} goal, you logged ${Math.round(totals.calories)} calories today. Tip: ${message.toLowerCase().includes('protein') ? 'add yogurt, eggs, or chicken to raise protein.' : 'choose a balanced meal with protein, carbs, vegetables, and water.'}`;
}

const NutriBotClientService = {
  getData,
  getNutritionProfiles,
  getNutritionProfile,
  saveNutritionProfile,
  deleteNutritionProfile,
  getGoals,
  getGoal,
  saveGoal,
  deleteGoal,
  getFoods,
  createFood,
  updateFood,
  deleteFood,
  getAllFavoriteFoods,
  getFavoriteFoods,
  toggleFavoriteFood,
  getAllFoodLogs,
  getFoodLogs,
  addFoodLog,
  updateFoodLog,
  deleteFoodLog,
  calculateTotals,
  getAllReminders,
  getReminders,
  addReminder,
  toggleReminder,
  deleteReminder,
  getRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getAllReports,
  createReport,
  getReports,
  getAllDeviationRecoveries,
  createDeviationRecovery,
  updateDeviationRecovery,
  deleteDeviationRecovery,
  getDeviationRecoveries,
  getBotReply,
};

export default NutriBotClientService;
