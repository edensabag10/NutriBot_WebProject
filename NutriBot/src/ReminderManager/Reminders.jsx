import { useCallback, useEffect, useState } from 'react';
import AppLayout from '../GUIComponents/AppLayout.jsx';
import Button from '../GUIComponents/Button.jsx';
import Card from '../GUIComponents/Card.jsx';
import LabeledInput from '../GUIComponents/LabeledInput.jsx';
import NutriBotClientService from '../services/NutriBotClientService.js';
import { getCurrentUser } from '../UsersManager/UsersService.js';

const reminderIcons = {
  'Drink water': '💧',
  'Log meals': '🍽',
  'Healthy meal': '🥗',
  Exercise: '🏃',
  'Follow nutrition goals': '🥗',
};

function getReminderIcon(type) {
  return reminderIcons[type] || '⏰';
}

function sortByTime(reminders) {
  return [...reminders].sort((first, second) => {
    const timeCompare = String(first.time || '').localeCompare(String(second.time || ''));
    if (timeCompare !== 0) return timeCompare;
    return String(first.reminderType || '').localeCompare(String(second.reminderType || ''));
  });
}

export default function Reminders({ setScreen }) {
  const user = getCurrentUser();
  const [reminders, setReminders] = useState([]);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [form, setForm] = useState({ reminderType: 'Log meals', time: '12:00' });
  const sortedReminders = sortByTime(reminders);

  const loadReminders = useCallback(async () => {
    try {
      setReminders(await NutriBotClientService.getReminders(user.id));
      setError('');
    } catch {
      setError('Unable to load reminders');
    }
  }, [user.id]);

  useEffect(() => {
    let isMounted = true;

    async function loadInitialReminders() {
      try {
        const loadedReminders = await NutriBotClientService.getReminders(user.id);

        if (!isMounted) {
          return;
        }

        setReminders(loadedReminders);
        setError('');
      } catch {
        if (isMounted) {
          setError('Unable to load reminders');
        }
      }
    }

    loadInitialReminders();

    return () => {
      isMounted = false;
    };
  }, [user.id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await NutriBotClientService.addReminder(user.id, form);
      await loadReminders();
      setError('');
    } catch {
      setError('Unable to create reminder');
    }
  };

  const handleToggle = async (id) => {
    try {
      setUpdatingId(id);
      const updatedReminder = await NutriBotClientService.toggleReminder(id);
      setReminders((currentReminders) =>
        currentReminders.map((reminder) => (reminder.id === id ? updatedReminder : reminder)),
      );
      setError('');
    } catch {
      setError('Unable to update reminder status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this reminder?');

    if (!confirmed) {
      return;
    }

    try {
      setUpdatingId(id);
      await NutriBotClientService.deleteReminder(id);
      setReminders((currentReminders) => currentReminders.filter((reminder) => reminder.id !== id));
      setError('');
    } catch {
      setError('Unable to delete reminder');
    } finally {
      setUpdatingId(null);
    }
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
          <div className="space-y-4">
            {sortedReminders.map((reminder) => {
              const isActive = Boolean(reminder.isActive);
              const isUpdating = updatingId === reminder.id;

              return (
                <div key={reminder.id} className="flex flex-col gap-4 rounded-lg border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-2xl">
                      {getReminderIcon(reminder.reminderType)}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate font-bold text-slate-900">{reminder.reminderType}</div>
                      <div className="text-sm font-semibold text-slate-500">{reminder.time}</div>
                    </div>
                  </div>

                  <div className="flex w-full shrink-0 items-center justify-between gap-3 sm:w-auto">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                      <span className={`h-2.5 w-2.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      {isActive ? 'Active' : 'Disabled'}
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={isActive}
                      aria-label={`${isActive ? 'Disable' : 'Enable'} ${reminder.reminderType}`}
                      disabled={isUpdating}
                      onClick={() => handleToggle(reminder.id)}
                      className={`relative h-7 w-12 rounded-full transition disabled:opacity-60 ${
                        isActive ? 'bg-emerald-500' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                          isActive ? 'right-1' : 'right-6'
                        }`}
                      />
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete ${reminder.reminderType}`}
                      disabled={isUpdating}
                      onClick={() => handleDelete(reminder.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-rose-100 text-lg text-rose-600 transition hover:bg-rose-50 disabled:opacity-60"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              );
            })}
            {!sortedReminders.length && <p className="text-sm text-slate-500">No reminders configured yet.</p>}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
