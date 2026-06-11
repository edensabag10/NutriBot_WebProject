import { useState } from 'react'
import Dashboard from './Dashboard.jsx'
import Settings from './Settings.jsx'
import ChatBot from './BotManager/ChatBot.jsx'
import DeviationRecovery from './DeviationManager/DeviationRecovery.jsx'
import DailyFoodLog from './NutritionManager/DailyFoodLog.jsx'
import FavoriteFoods from './NutritionManager/FavoriteFoods.jsx'
import FoodSearch from './NutritionManager/FoodSearch.jsx'
import Goals from './NutritionManager/Goals.jsx'
import NutritionProfile from './NutritionManager/NutritionProfile.jsx'
import BudgetRecipeFilter from './RecipeManager/BudgetRecipeFilter.jsx'
import Reminders from './ReminderManager/Reminders.jsx'
import ProgressReports from './ReportsManager/ProgressReports.jsx'
import Login from './UsersManager/Login.jsx'
import ManageUsers from './UsersManager/ManageUsers.jsx'
import Profile from './UsersManager/Profile.jsx'
import Register from './UsersManager/Register.jsx'

function App() {
  const [currentScreen, setCurrentScreen] = useState('login')

  if (currentScreen === 'login') {
    return <Login setScreen={setCurrentScreen} />
  }

  if (currentScreen === 'register') {
    return <Register setScreen={setCurrentScreen} />
  }

  if (currentScreen === 'settings') {
    return <Settings setScreen={setCurrentScreen} />
  }

  if (currentScreen === 'profile') return <Profile setScreen={setCurrentScreen} />
  if (currentScreen === 'manage-users') return <ManageUsers setScreen={setCurrentScreen} />
  if (currentScreen === 'nutrition-profile') return <NutritionProfile setScreen={setCurrentScreen} />
  if (currentScreen === 'goals') return <Goals setScreen={setCurrentScreen} />
  if (currentScreen === 'food-log') return <DailyFoodLog setScreen={setCurrentScreen} />
  if (currentScreen === 'food-search') return <FoodSearch setScreen={setCurrentScreen} />
  if (currentScreen === 'favorites') return <FavoriteFoods setScreen={setCurrentScreen} />
  if (currentScreen === 'chatbot') return <ChatBot setScreen={setCurrentScreen} />
  if (currentScreen === 'reports') return <ProgressReports setScreen={setCurrentScreen} />
  if (currentScreen === 'reminders') return <Reminders setScreen={setCurrentScreen} />
  if (currentScreen === 'deviation-recovery') return <DeviationRecovery setScreen={setCurrentScreen} />
  if (currentScreen === 'recipes') return <BudgetRecipeFilter setScreen={setCurrentScreen} />

  return <Dashboard setScreen={setCurrentScreen} />
}

export default App
