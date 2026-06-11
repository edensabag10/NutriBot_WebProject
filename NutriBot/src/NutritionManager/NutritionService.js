import NutriBotClientService from '../services/NutriBotClientService.js';

export const createNutritionProfile = (profile) =>
  NutriBotClientService.saveNutritionProfile(profile.userId, profile);
export const getNutritionProfiles = () => NutriBotClientService.getNutritionProfiles();
export const updateNutritionProfile = (id, profile) =>
  NutriBotClientService.saveNutritionProfile(profile.userId, { ...profile, id });
export const deleteNutritionProfile = (id) => NutriBotClientService.deleteNutritionProfile(id);

export const createGoal = (goal) => NutriBotClientService.saveGoal(goal.userId, goal);
export const getGoals = () => NutriBotClientService.getGoals();
export const updateGoal = (id, goal) => NutriBotClientService.saveGoal(goal.userId, { ...goal, id });
export const deleteGoal = (id) => NutriBotClientService.deleteGoal(id);

export const createFood = (food) => NutriBotClientService.createFood(food);
export const getFoods = () => NutriBotClientService.getFoods();
export const updateFood = (id, food) => NutriBotClientService.updateFood(id, food);
export const deleteFood = (id) => NutriBotClientService.deleteFood(id);

export const createFoodLog = (log) => NutriBotClientService.addFoodLog(log.userId, log);
export const getFoodLogs = () => NutriBotClientService.getAllFoodLogs();
export const updateFoodLog = (id, log) => NutriBotClientService.updateFoodLog(id, log);
export const deleteFoodLog = (id) => NutriBotClientService.deleteFoodLog(id);

export const createFavoriteFood = (favorite) =>
  NutriBotClientService.toggleFavoriteFood(favorite.userId, favorite.foodId);
export const getFavoriteFoods = () => NutriBotClientService.getAllFavoriteFoods();
export const deleteFavoriteFood = (userId, foodId) =>
  NutriBotClientService.toggleFavoriteFood(userId, foodId);
