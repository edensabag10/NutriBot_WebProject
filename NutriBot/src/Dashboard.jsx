import { useEffect, useState } from 'react';
import AppLayout from './GUIComponents/AppLayout.jsx';
import Card from './GUIComponents/Card.jsx';
import NutriBotClientService from './services/NutriBotClientService.js';
import { getCurrentUser, getCurrentUserDashboard } from './UsersManager/UsersService.js';

const featureCards = [
  ['nutrition-profile', 'Nutrition Profile', 'Create and update age, weight, height, and activity level.'],
  ['goals', 'Goal Management', 'Define weight loss, maintenance, muscle gain, or balanced nutrition goals.'],
  ['food-log', 'Daily Food Diary', 'Record foods by quantity, date, and meal type.'],
  ['food-search', 'Food Search', 'Search the food database and save favorites.'],
  ['favorites', 'Favorite Foods', 'Open quick-selection foods.'],
  ['chatbot', 'AI Nutrition Assistant', 'Ask nutrition questions and get recommendation prototypes.'],
  ['reports', 'Reports', 'View daily, weekly, and monthly nutrition summaries.'],
  ['reminders', 'Daily Reminders', 'Configure meal, water, and goal reminders.'],
  ['deviation-recovery', 'Recovery Planning', 'Create a moderate 48-hour deviation recovery plan.'],
  ['recipes', 'Budget Recipes', 'Filter recipe suggestions by estimated cost.'],
];

const emptyTotals = { calories: 0, protein: 0, carbs: 0, fat: 0 };

export default function Dashboard({ setScreen }) {
  const currentUser = getCurrentUser();
  const dashboard = getCurrentUserDashboard();
  const [totals, setTotals] = useState(emptyTotals);
  const [goal, setGoal] = useState(null);
  const [profile, setProfile] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!currentUser || !dashboard) {
      setScreen('login');
    }
  }, [currentUser, dashboard, setScreen]);

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    Promise.all([
      NutriBotClientService.calculateTotals(currentUser.id),
      NutriBotClientService.getGoal(currentUser.id),
      NutriBotClientService.getNutritionProfile(currentUser.id),
      NutriBotClientService.getReminders(currentUser.id),
    ])
      .then(([nextTotals, nextGoal, nextProfile, nextReminders]) => {
        setTotals(nextTotals);
        setGoal(nextGoal);
        setProfile(nextProfile);
        setReminders(nextReminders);
        setError('');
      })
      .catch(() => setError('Unable to load dashboard data'));
  }, [currentUser]);

  if (!currentUser || !dashboard) {
    return null;
  }

  return (
    <AppLayout title={`Welcome, ${currentUser.fullName || currentUser.username}`} setScreen={setScreen}>
      {error && <p className="mb-4 text-sm font-semibold text-rose-600">{error}</p>}
      <div className="grid gap-6 lg:grid-cols-4">
        <Card title="Today">
          <div className="space-y-3">
            <p className="text-4xl font-black text-sky-700">{Math.round(totals.calories)}</p>
            <p className="text-sm font-semibold text-slate-500">calories logged</p>
            <div className="grid grid-cols-3 gap-2 text-center text-sm">
              <div className="rounded-lg bg-rose-50 p-2 font-bold">P {Math.round(totals.protein)}</div>
              <div className="rounded-lg bg-amber-50 p-2 font-bold">C {Math.round(totals.carbs)}</div>
              <div className="rounded-lg bg-emerald-50 p-2 font-bold">F {Math.round(totals.fat)}</div>
            </div>
          </div>
        </Card>

        <Card title="Goal">
          <p className="text-lg font-black text-slate-900">{goal?.goalType || dashboard.profile.mainGoal}</p>
          <p className="mt-2 text-sm text-slate-600">Target calories: {goal?.targetCalories || dashboard.calories.goal}</p>
          <button className="mt-4 font-bold text-sky-700" onClick={() => setScreen('goals')}>Edit goal</button>
        </Card>

        <Card title="Profile">
          <p className="text-sm text-slate-600">Age: {profile?.age || 'Not set'}</p>
          <p className="text-sm text-slate-600">Weight: {profile?.weight || 'Not set'}</p>
          <p className="text-sm text-slate-600">Height: {profile?.height || 'Not set'}</p>
          <p className="text-sm text-slate-600">Activity: {profile?.activityLevel || 'Not set'}</p>
          <button className="mt-4 font-bold text-sky-700" onClick={() => setScreen('nutrition-profile')}>Edit profile</button>
        </Card>

        <Card title="Reminders">
          <p className="text-4xl font-black text-sky-700">{reminders.filter((item) => item.isActive).length}</p>
          <p className="text-sm font-semibold text-slate-500">active reminders</p>
          <button className="mt-4 font-bold text-sky-700" onClick={() => setScreen('reminders')}>Manage reminders</button>
        </Card>
      </div>

      <section className="mt-8">
        <Card title="Feature areas">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {featureCards.map(([screen, title, description]) => (
              <button
                key={screen}
                onClick={() => setScreen(screen)}
                className="rounded-lg border border-slate-200 p-4 text-left transition hover:border-sky-400 hover:bg-sky-50"
              >
                <h3 className="text-lg font-black text-slate-900">{title}</h3>
                <p className="mt-1 text-sm text-slate-600">{description}</p>
              </button>
            ))}
          </div>
        </Card>
      </section>
    </AppLayout>
  );
}
