const STORAGE_KEY = 'nutribot-client-data';

const initialData = {
  nutritionProfiles: [
    { id: 'profile-1', userId: '1', age: 28, weight: 65, height: 168, activityLevel: 'Moderate' },
  ],
  goals: [
    {
      id: 'goal-1',
      userId: '1',
      goalType: 'Balanced nutrition',
      targetCalories: 2000,
      targetProtein: 90,
      targetCarbs: 230,
      targetFat: 65,
    },
  ],
  foods: [
    { id: 'food-1', name: 'Greek yogurt', calories: 120, protein: 18, carbs: 7, fat: 3 },
    { id: 'food-2', name: 'Chicken breast', calories: 165, protein: 31, carbs: 0, fat: 4 },
    { id: 'food-3', name: 'Brown rice', calories: 216, protein: 5, carbs: 45, fat: 2 },
    { id: 'food-4', name: 'Banana', calories: 105, protein: 1, carbs: 27, fat: 0 },
    { id: 'food-5', name: 'Avocado toast', calories: 260, protein: 8, carbs: 28, fat: 14 },
  ],
  foodLogs: [
    { id: 'log-1', userId: '1', foodId: 'food-1', date: new Date().toISOString().slice(0, 10), quantity: 1, mealType: 'Breakfast' },
  ],
  favoriteFoods: [{ id: 'favorite-1', userId: '1', foodId: 'food-1' }],
  reminders: [
    { id: 'reminder-1', userId: '1', reminderType: 'Drink water', time: '10:00', isActive: true },
  ],
  recipes: [
    {
      id: 'recipe-1',
      name: 'Chicken rice bowl',
      ingredients: ['Chicken breast', 'Brown rice', 'Vegetables'],
      calories: 520,
      protein: 42,
      carbs: 58,
      fat: 12,
      estimatedCost: 18,
    },
    {
      id: 'recipe-2',
      name: 'Yogurt banana bowl',
      ingredients: ['Greek yogurt', 'Banana', 'Oats'],
      calories: 360,
      protein: 24,
      carbs: 54,
      fat: 6,
      estimatedCost: 11,
    },
  ],
  deviationRecoveries: [],
};

function loadData() {
  const savedData = localStorage.getItem(STORAGE_KEY);
  return savedData ? JSON.parse(savedData) : initialData;
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return data;
}

function createId(prefix) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function getData() {
  return loadData();
}

function upsertByUser(collectionName, userId, item) {
  const data = loadData();
  const collection = data[collectionName];
  const index = collection.findIndex((entry) => entry.id === item.id || entry.userId === userId);
  const nextItem = { ...item, userId, id: item.id || createId(collectionName) };

  if (index === -1) {
    collection.push(nextItem);
  } else {
    collection[index] = nextItem;
  }

  saveData(data);
  return nextItem;
}

function addToCollection(collectionName, item, prefix) {
  const data = loadData();
  const newItem = { ...item, id: item.id || createId(prefix) };
  data[collectionName].push(newItem);
  saveData(data);
  return newItem;
}

function updateCollectionItem(collectionName, id, updates) {
  const data = loadData();
  data[collectionName] = data[collectionName].map((item) => (item.id === id ? { ...item, ...updates } : item));
  saveData(data);
}

function deleteCollectionItem(collectionName, id) {
  const data = loadData();
  data[collectionName] = data[collectionName].filter((item) => item.id !== id);
  saveData(data);
}

function getNutritionProfile(userId) {
  return loadData().nutritionProfiles.find((profile) => profile.userId === userId) || null;
}

function saveNutritionProfile(userId, profile) {
  return upsertByUser('nutritionProfiles', userId, profile);
}

function getGoal(userId) {
  return loadData().goals.find((goal) => goal.userId === userId) || null;
}

function saveGoal(userId, goal) {
  return upsertByUser('goals', userId, goal);
}

function getFoods() {
  return loadData().foods;
}

function getFavoriteFoods(userId) {
  const data = loadData();
  const favoriteIds = data.favoriteFoods.filter((favorite) => favorite.userId === userId).map((favorite) => favorite.foodId);
  return data.foods.filter((food) => favoriteIds.includes(food.id));
}

function toggleFavoriteFood(userId, foodId) {
  const data = loadData();
  const favorite = data.favoriteFoods.find((item) => item.userId === userId && item.foodId === foodId);

  if (favorite) {
    data.favoriteFoods = data.favoriteFoods.filter((item) => item.id !== favorite.id);
  } else {
    data.favoriteFoods.push({ id: createId('favorite'), userId, foodId });
  }

  saveData(data);
}

function getFoodLogs(userId) {
  const data = loadData();
  return data.foodLogs
    .filter((log) => log.userId === userId)
    .map((log) => ({ ...log, food: data.foods.find((food) => food.id === log.foodId) }))
    .filter((log) => log.food);
}

function addFoodLog(userId, log) {
  return addToCollection('foodLogs', { ...log, userId, quantity: Number(log.quantity) || 1 }, 'log');
}

function deleteFoodLog(id) {
  deleteCollectionItem('foodLogs', id);
}

function calculateTotals(userId) {
  return getFoodLogs(userId).reduce(
    (totals, log) => {
      const quantity = Number(log.quantity) || 1;
      return {
        calories: totals.calories + log.food.calories * quantity,
        protein: totals.protein + log.food.protein * quantity,
        carbs: totals.carbs + log.food.carbs * quantity,
        fat: totals.fat + log.food.fat * quantity,
      };
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );
}

function getReminders(userId) {
  return loadData().reminders.filter((reminder) => reminder.userId === userId);
}

function addReminder(userId, reminder) {
  return addToCollection('reminders', { ...reminder, userId, isActive: true }, 'reminder');
}

function toggleReminder(id) {
  const data = loadData();
  const reminder = data.reminders.find((item) => item.id === id);
  if (reminder) {
    updateCollectionItem('reminders', id, { isActive: !reminder.isActive });
  }
}

function getRecipes(maxCost = Infinity) {
  return loadData().recipes.filter((recipe) => recipe.estimatedCost <= Number(maxCost || Infinity));
}

function getReports(userId) {
  const totals = calculateTotals(userId);
  const goal = getGoal(userId);
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

function createDeviationRecovery(userId, deviation) {
  const extraCalories = Number(deviation.extraCalories) || 0;
  const adjustedCaloriesPerDay = Math.max(0, Math.round(extraCalories / 2));
  return addToCollection(
    'deviationRecoveries',
    {
      ...deviation,
      userId,
      extraCalories,
      adjustedCaloriesPerDay,
      recoveryStartDate: new Date().toISOString().slice(0, 10),
      recoveryEndDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    },
    'recovery',
  );
}

function getDeviationRecoveries(userId) {
  return loadData().deviationRecoveries.filter((recovery) => recovery.userId === userId);
}

function getBotReply(message, userId) {
  const goal = getGoal(userId);
  const totals = calculateTotals(userId);
  return `Based on your ${goal?.goalType || 'nutrition'} goal, you logged ${Math.round(totals.calories)} calories today. Tip: ${message.toLowerCase().includes('protein') ? 'add yogurt, eggs, or chicken to raise protein.' : 'choose a balanced meal with protein, carbs, vegetables, and water.'}`;
}

const NutriBotClientService = {
  getData,
  getNutritionProfile,
  saveNutritionProfile,
  getGoal,
  saveGoal,
  getFoods,
  getFavoriteFoods,
  toggleFavoriteFood,
  getFoodLogs,
  addFoodLog,
  deleteFoodLog,
  calculateTotals,
  getReminders,
  addReminder,
  toggleReminder,
  getRecipes,
  getReports,
  createDeviationRecovery,
  getDeviationRecoveries,
  getBotReply,
};

export default NutriBotClientService;
