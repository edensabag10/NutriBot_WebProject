import NutriBotClientService from '../services/NutriBotClientService.js';

export const createRecipe = (recipe) => NutriBotClientService.createRecipe(recipe);
export const getRecipes = (maxCost) => NutriBotClientService.getRecipes(maxCost);
export const updateRecipe = (id, recipe) => NutriBotClientService.updateRecipe(id, recipe);
export const deleteRecipe = (id) => NutriBotClientService.deleteRecipe(id);
