import { useState } from 'react';
import AppLayout from '../GUIComponents/AppLayout.jsx';
import Button from '../GUIComponents/Button.jsx';
import Card from '../GUIComponents/Card.jsx';
import LabeledInput from '../GUIComponents/LabeledInput.jsx';
import NutriBotClientService from '../services/NutriBotClientService.js';
import { getCurrentUser } from '../UsersManager/UsersService.js';

export default function Goals({ setScreen }) {
  const user = getCurrentUser();
  const existingGoal = NutriBotClientService.getGoal(user?.id);
  const [goal, setGoal] = useState(
    existingGoal || {
      goalType: 'Balanced nutrition',
      targetCalories: 2000,
      targetProtein: 90,
      targetCarbs: 230,
      targetFat: 65,
    },
  );

  const handleChange = (event) => setGoal({ ...goal, [event.target.name]: event.target.value });
  const handleSubmit = (event) => {
    event.preventDefault();
    NutriBotClientService.saveGoal(user.id, goal);
    setScreen('dashboard');
  };

  return (
    <AppLayout title="Goal Management" setScreen={setScreen}>
      <Card title="Nutrition goal">
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <label>
            <span className="mb-1 block text-sm font-semibold text-slate-600">Goal type</span>
            <select name="goalType" value={goal.goalType} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-3 py-2">
              <option>Weight loss</option>
              <option>Weight maintenance</option>
              <option>Muscle gain</option>
              <option>Balanced nutrition</option>
            </select>
          </label>
          <LabeledInput label="Target calories" name="targetCalories" type="number" value={goal.targetCalories} onChange={handleChange} />
          <LabeledInput label="Target protein" name="targetProtein" type="number" value={goal.targetProtein} onChange={handleChange} />
          <LabeledInput label="Target carbs" name="targetCarbs" type="number" value={goal.targetCarbs} onChange={handleChange} />
          <LabeledInput label="Target fat" name="targetFat" type="number" value={goal.targetFat} onChange={handleChange} />
          <div className="md:col-span-2">
            <Button type="submit">Save Goal</Button>
          </div>
        </form>
      </Card>
    </AppLayout>
  );
}
