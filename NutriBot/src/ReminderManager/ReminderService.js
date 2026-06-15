import NutriBotClientService from '../services/NutriBotClientService.js';

export const createReminder = (reminder) => NutriBotClientService.addReminder(reminder.userId, reminder);
export const getReminders = () => NutriBotClientService.getAllReminders();
export const updateReminder = (id) => NutriBotClientService.toggleReminder(id);
export const deleteReminder = (id) => NutriBotClientService.deleteReminder(id);
