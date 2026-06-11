import { useState } from 'react';
import AppLayout from '../GUIComponents/AppLayout.jsx';
import Button from '../GUIComponents/Button.jsx';
import Card from '../GUIComponents/Card.jsx';
import LabeledInput from '../GUIComponents/LabeledInput.jsx';
import NutriBotClientService from '../services/NutriBotClientService.js';
import { getCurrentUser } from '../UsersManager/UsersService.js';

export default function DailyFoodLog({ setScreen }) {
  const user = getCurrentUser();
  const foods = NutriBotClientService.getFoods();
  const [logs, setLogs] = useState(NutriBotClientService.getFoodLogs(user.id));
  const [form, setForm] = useState({ foodId: foods[0]?.id || '', quantity: 1, date: new Date().toISOString().slice(0, 10), mealType: 'Breakfast' });
  const totals = NutriBotClientService.calculateTotals(user.id);

  const refresh = () => setLogs(NutriBotClientService.getFoodLogs(user.id));
  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const handleSubmit = (event) => {
    event.preventDefault();
    NutriBotClientService.addFoodLog(user.id, form);
    refresh();
  };

  return (
    <AppLayout title="Daily Food Diary" setScreen={setScreen}>
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
        </Card>
        <Card title="Logged foods">
          <div className="space-y-3">
            {logs.map((log) => (
              <div key={log.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                <div>
                  <div className="font-bold">{log.food.name}</div>
                  <div className="text-sm text-slate-500">{log.mealType} · {log.quantity} serving(s)</div>
                </div>
                <button className="text-sm font-bold text-rose-600" onClick={() => { NutriBotClientService.deleteFoodLog(log.id); refresh(); }}>Remove</button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
