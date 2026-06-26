import { useEffect, useState } from 'react';
import AppLayout from '../GUIComponents/AppLayout.jsx';
import Button from '../GUIComponents/Button.jsx';
import Card from '../GUIComponents/Card.jsx';
import LabeledInput from '../GUIComponents/LabeledInput.jsx';
import NutriBotClientService from '../services/NutriBotClientService.js';
import { getCurrentUser } from '../UsersManager/UsersService.js';

const emptyTotals = { calories: 0, protein: 0, carbs: 0, fat: 0 };

export default function DailyFoodLog({ setScreen }) {
  const user = getCurrentUser();
  const [foods, setFoods] = useState([]);
  const [logs, setLogs] = useState([]);
  const [totals, setTotals] = useState(emptyTotals);
  const [goal, setGoal] = useState(null);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [form, setForm] = useState({
    foodId: '',
    quantity: 1,
    date: new Date().toISOString().slice(0, 10),
    mealType: 'Breakfast',
  });

  const loadData = async (date = selectedDate) => {
    if (!user?.id) return;

    try {
      const [nextFoods, nextLogs, nextTotals, nextGoal] = await Promise.all([
        NutriBotClientService.getFoods(),
        NutriBotClientService.getFoodLogs(user.id, date),
        NutriBotClientService.calculateTotals(user.id, date),
        NutriBotClientService.getGoal(user.id),
      ]);

      setFoods(nextFoods);
      setLogs(nextLogs);
      setTotals(nextTotals);
      setGoal(nextGoal);
      setError('');
      setForm((currentForm) => ({
        ...currentForm,
        date,
        foodId: currentForm.foodId || nextFoods[0]?.id || '',
      }));
      setSelectedDate(date);
    } catch {
      setError('Unable to load food diary data');
    }
  };

  useEffect(() => {
    loadData(selectedDate);
  }, [user?.id, selectedDate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    const nextForm = { ...form, [name]: value };
    setForm(nextForm);

    if (name === 'date') {
      setSelectedDate(value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user?.id || !form.foodId) return;

    const payload = {
      ...form,
      userId: user.id,
      foodId: form.foodId,
      quantity: Number(form.quantity) || 1,
      date: selectedDate,
      mealType: form.mealType || 'Breakfast',
    };

    await NutriBotClientService.addFoodLog(user.id, payload);
    await loadData(selectedDate);
  };

  const handleDelete = async (id) => {
    await NutriBotClientService.deleteFoodLog(id);
    await loadData(selectedDate);
  };

  const targetCalories = goal?.targetCalories || 2000;
  const targetProtein = goal?.targetProtein || 120;
  const targetCarbs = goal?.targetCarbs || 300;
  const targetFat = goal?.targetFat || 90;

  const progressMetrics = [
    { label: 'Calories', value: totals.calories, target: targetCalories, unit: 'kcal' },
    { label: 'Protein', value: totals.protein, target: targetProtein, unit: 'g' },
    { label: 'Carbs', value: totals.carbs, target: targetCarbs, unit: 'g' },
    { label: 'Fat', value: totals.fat, target: targetFat, unit: 'g' },
  ];

  return (
    <AppLayout title="Daily Food Diary" setScreen={setScreen}>
      {error && <p className="mb-4 text-sm font-semibold text-rose-600">{error}</p>}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Add food">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <label>
              <span className="mb-1 block text-sm font-semibold text-slate-600">Food item</span>
              <select name="foodId" value={form.foodId} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-3 py-2">
                {foods.map((food) => (
                  <option key={food.id} value={food.id}>{food.name}</option>
                ))}
              </select>
            </label>
            <LabeledInput label="Quantity" name="quantity" type="number" min="1" value={form.quantity} onChange={handleChange} />
            <LabeledInput label="Date" name="date" type="date" value={form.date} onChange={handleChange} />
            <label>
              <span className="mb-1 block text-sm font-semibold text-slate-600">Meal type</span>
              <select name="mealType" value={form.mealType} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-3 py-2">
                <option>Breakfast</option>
                <option>Lunch</option>
                <option>Dinner</option>
                <option>Snack</option>
              </select>
            </label>
            <Button type="submit">Add Entry</Button>
          </form>
        </Card>
        <Card title="Today totals">
          <div className="grid grid-cols-2 gap-3 text-sm">
            {Object.entries(totals).map(([key, value]) => (
              <div key={key} className="rounded-lg bg-slate-100 p-3">
                <div className="font-bold capitalize">{key}</div>
                <div className="text-2xl font-black text-sky-700">{Math.round(value)}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-3">
            {progressMetrics.map((metric) => {
              const percent = Math.min(100, Math.round((metric.value / metric.target) * 100));
              return (
                <div key={metric.label}>
                  <div className="mb-1 flex items-center justify-between text-sm font-semibold text-slate-700">
                    <span>{metric.label}</span>
                    <span>{Math.round(metric.value)} / {metric.target} {metric.unit}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200">
                    <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
        <Card title="Logged foods">
          <div className="space-y-3">
            {logs.map((log) => (
              <div key={log.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                <div>
                  <div className="font-bold">{log.food.name}</div>
                  <div className="text-sm text-slate-500">{log.mealType} - {log.quantity} serving(s)</div>
                </div>
                <button className="text-sm font-bold text-rose-600" onClick={() => handleDelete(log.id)}>Remove</button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
