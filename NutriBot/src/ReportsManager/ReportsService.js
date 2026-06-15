import NutriBotClientService from '../services/NutriBotClientService.js';

export const createReport = (report) => NutriBotClientService.createReport(report);
export const getStoredReports = () => NutriBotClientService.getAllReports();
export const getReports = (userId) => NutriBotClientService.getReports(userId);
