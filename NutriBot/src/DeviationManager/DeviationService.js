import NutriBotClientService from '../services/NutriBotClientService.js';

export const createDeviationRecovery = (userId, recovery) =>
  NutriBotClientService.createDeviationRecovery(userId, recovery);
export const getDeviationRecoveries = (userId) => NutriBotClientService.getDeviationRecoveries(userId);
export const updateDeviationRecovery = (id, recovery) =>
  NutriBotClientService.updateDeviationRecovery(id, recovery);
export const deleteDeviationRecovery = (id) => NutriBotClientService.deleteDeviationRecovery(id);
