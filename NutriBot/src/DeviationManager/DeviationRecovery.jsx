import { useState } from 'react';
import AppLayout from '../GUIComponents/AppLayout.jsx';
import Button from '../GUIComponents/Button.jsx';
import Card from '../GUIComponents/Card.jsx';
import LabeledInput from '../GUIComponents/LabeledInput.jsx';
import NutriBotClientService from '../services/NutriBotClientService.js';
import { getCurrentUser } from '../UsersManager/UsersService.js';

export default function DeviationRecovery({ setScreen }) {
  const user = getCurrentUser();
  const [form, setForm] = useState({ description: '', extraCalories: 400, deviationDate: new Date().toISOString().slice(0, 10), notes: '' });
  const [plans, setPlans] = useState(NutriBotClientService.getDeviationRecoveries(user.id));

  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const handleSubmit = (event) => {
    event.preventDefault();
    NutriBotClientService.createDeviationRecovery(user.id, form);
    setPlans(NutriBotClientService.getDeviationRecoveries(user.id));
  };

  return (
    <AppLayout title="Deviation Recovery Planning" setScreen={setScreen}>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Report deviation">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <LabeledInput label="Description" name="description" value={form.description} onChange={handleChange} placeholder="Unexpected meal or overeating..." />
            <LabeledInput label="Extra calories estimate" name="extraCalories" type="number" value={form.extraCalories} onChange={handleChange} />
            <LabeledInput label="Date" name="deviationDate" type="date" value={form.deviationDate} onChange={handleChange} />
            <LabeledInput label="Notes" name="notes" value={form.notes} onChange={handleChange} />
            <Button type="submit">Create 48h Plan</Button>
          </form>
        </Card>
        <Card title="Recovery plans">
          <div className="space-y-3">
            {plans.map((plan) => (
              <div key={plan.id} className="rounded-lg border border-slate-200 p-4">
                <h3 className="font-black">{plan.description || 'Nutrition deviation'}</h3>
                <p className="text-sm text-slate-600">{plan.recoveryStartDate} to {plan.recoveryEndDate}</p>
                <p className="mt-2 font-bold text-sky-700">Moderate adjustment: reduce about {plan.adjustedCaloriesPerDay} calories per day for 48 hours.</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
