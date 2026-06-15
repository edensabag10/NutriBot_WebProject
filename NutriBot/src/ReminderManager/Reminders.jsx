import { useEffect, useState } from 'react';
import AppLayout from '../GUIComponents/AppLayout.jsx';
import Button from '../GUIComponents/Button.jsx';
import Card from '../GUIComponents/Card.jsx';
import LabeledInput from '../GUIComponents/LabeledInput.jsx';
import NutriBotClientService from '../services/NutriBotClientService.js';
import { getCurrentUser } from '../UsersManager/UsersService.js';

export default function Reminders({ setScreen }) {
  const user = getCurrentUser();
  const [reminders, setReminders] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ reminderType: 'Log meals', time: '12:00' });

  const loadReminders = async () => {
    try {
      setReminders(await NutriBotClientService.getReminders(user.id));
      setError('');
    } catch {
      setError('Unable to load reminders');
    }
  };

  useEffect(() => {
    loadReminders();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await NutriBotClientService.addReminder(user.id, form);
    await loadReminders();
  };

  const handleToggle = async (id) => {
    await NutriBotClientService.toggleReminder(id);
    await loadReminders();
  };

  return (
    <AppLayout title="Daily Reminders" setScreen={setScreen}>
      {error && <p className="mb-4 text-sm font-semibold text-rose-600">{error}</p>}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Create reminder">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <label>
              <span className="mb-1 block text-sm font-semibold text-slate-600">Reminder type</span>
              <select value={form.reminderType} onChange={(event) => setForm({ ...form, reminderType: event.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2">
                <option>Log meals</option>
                <option>Drink water</option>
                <option>Follow nutrition goals</option>
              </select>
            </label>
            <LabeledInput label="Time" type="time" value={form.time} onChange={(event) => setForm({ ...form, time: event.target.value })} />
            <Button type="submit">Add Reminder</Button>
          </form>
        </Card>
        <Card title="Configured reminders">
          <div className="space-y-3">
            {reminders.map((reminder) => (
              <div key={reminder.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                <div>
                  <div className="font-bold">{reminder.reminderType}</div>
                  <div className="text-sm text-slate-500">{reminder.time}</div>
                </div>
                <Button variant="secondary" onClick={() => handleToggle(reminder.id)}>
                  {reminder.isActive ? 'Enabled' : 'Disabled'}
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
