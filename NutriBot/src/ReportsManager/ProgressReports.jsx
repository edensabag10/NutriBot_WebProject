import { useEffect, useState } from 'react';
import AppLayout from '../GUIComponents/AppLayout.jsx';
import Card from '../GUIComponents/Card.jsx';
import NutriBotClientService from '../services/NutriBotClientService.js';
import { getCurrentUser } from '../UsersManager/UsersService.js';

const emptyReports = {
  daily: { calories: 0, protein: 0, carbs: 0, fat: 0 },
  weekly: { calories: 0, protein: 0, carbs: 0, fat: 0 },
  monthly: { calories: 0, protein: 0, carbs: 0, fat: 0 },
  goal: null,
};

function MetricBar({ label, value, max }) {
  const percent = Math.min(100, Math.round((value / max) * 100));
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm font-semibold">
        <span>{label}</span>
        <span>{Math.round(value)}</span>
      </div>
      <div className="h-3 rounded-full bg-slate-200">
        <div className="h-3 rounded-full bg-sky-500" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

export default function ProgressReports({ setScreen }) {
  const user = getCurrentUser();
  const [reports, setReports] = useState(emptyReports);
  const [error, setError] = useState('');

  useEffect(() => {
    NutriBotClientService.getReports(user.id)
      .then((nextReports) => {
        setReports(nextReports);
        setError('');
      })
      .catch(() => setError('Unable to load reports'));
  }, [user.id]);

  const targetCalories = reports.goal?.targetCalories || 2000;

  return (
    <AppLayout title="Progress Reports" setScreen={setScreen}>
      {error && <p className="mb-4 text-sm font-semibold text-rose-600">{error}</p>}
      <div className="grid gap-6 lg:grid-cols-3">
        {['daily', 'weekly', 'monthly'].map((type) => (
          <Card key={type} title={`${type[0].toUpperCase()}${type.slice(1)} summary`}>
            <div className="space-y-4">
              <MetricBar label="Calories" value={reports[type].calories} max={type === 'daily' ? targetCalories : targetCalories * (type === 'weekly' ? 7 : 30)} />
              <MetricBar label="Protein" value={reports[type].protein} max={type === 'daily' ? 120 : 120 * (type === 'weekly' ? 7 : 30)} />
              <MetricBar label="Carbs" value={reports[type].carbs} max={type === 'daily' ? 300 : 300 * (type === 'weekly' ? 7 : 30)} />
              <MetricBar label="Fat" value={reports[type].fat} max={type === 'daily' ? 90 : 90 * (type === 'weekly' ? 7 : 30)} />
            </div>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
}
