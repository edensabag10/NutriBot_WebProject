import { useEffect, useState } from 'react';
import Card from '../GUIComponents/Card.jsx';
import NutriBotClientService from '../services/NutriBotClientService.js';
import { getCurrentUser } from '../UsersManager/UsersService.js';

const formatDateKey = (value) => {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseDateInput = (value) => {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
};

const defaultRange = () => {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 6);
  return {
    start: formatDateKey(start),
    end: formatDateKey(end),
  };
};

export default function ProgressCharts() {
  const user = getCurrentUser();
  const [range, setRange] = useState(defaultRange());
  const [dailyStats, setDailyStats] = useState([]);
  const [goal, setGoal] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user?.id) {
      setDailyStats([]);
      setGoal(null);
      setError('');
      return;
    }

    let isCurrent = true;

    const loadRangeStats = async () => {
      setIsLoading(true);
      setError('');

      const nextGoal = await NutriBotClientService.getGoal(user.id);
      if (!isCurrent) return;
      setGoal(nextGoal);

      const startDate = parseDateInput(range.start) || new Date();
      const endDate = parseDateInput(range.end) || startDate;
      const normalizedStart = startDate <= endDate ? startDate : endDate;
      const normalizedEnd = startDate <= endDate ? endDate : startDate;

      const labels = [];
      const current = new Date(normalizedStart);
      const end = new Date(normalizedEnd);

      while (current <= end) {
        const key = formatDateKey(current);
        const totals = await NutriBotClientService.calculateTotals(user.id, key);

        if (!isCurrent) return;

        labels.push({
          day: current.toLocaleDateString(undefined, { weekday: 'short' }),
          date: key,
          calories: Math.round(totals.calories || 0),
          carbs: Math.round(totals.carbs || 0),
          fat: Math.round(totals.fat || 0),
        });
        current.setDate(current.getDate() + 1);
      }

      if (!isCurrent) return;
      setDailyStats(labels);
      setIsLoading(false);
    };

    loadRangeStats().catch(() => {
      if (isCurrent) {
        setError('Unable to load progress data');
        setIsLoading(false);
      }
    });

    return () => {
      isCurrent = false;
    };
  }, [user?.id, range.start, range.end]);

  const targetCalories = goal?.targetCalories || 2000;
  const maxDailyCalories = Math.max(...dailyStats.map((entry) => entry.calories), targetCalories, 1);
  const maxDailyCarbs = Math.max(...dailyStats.map((entry) => entry.carbs), 200, 1);
  const maxDailyFat = Math.max(...dailyStats.map((entry) => entry.fat), 80, 1);

  const renderLineChart = (values, maxValue, color, unit, label) => {
    if (!values.length) return null;

    const width = 280;
    const height = 180;
    const padding = 20;
    const stepX = values.length > 1 ? (width - padding * 2) / (values.length - 1) : width / 2;
    const safeMax = Math.max(maxValue, 1);
    const points = values.map((entry, index) => {
      const x = padding + stepX * index;
      const y = height - padding - (entry.value / safeMax) * (height - padding * 2);
      return { x, y, value: entry.value, day: entry.day, date: entry.date };
    });

    const pathData = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');

    return (
      <div className="space-y-3">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-48 w-full">
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#cbd5e1" strokeWidth="1" />
          <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#cbd5e1" strokeWidth="1" />
          <path d={pathData} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
          {points.map((point) => (
            <g key={`${label}-${point.date || point.day}`}>
              <circle cx={point.x} cy={point.y} r="4" fill={color} />
              <text x={point.x} y={height - 4} textAnchor="middle" fontSize="10" fill="#64748b">{point.day}</text>
            </g>
          ))}
        </svg>
        <div className="space-y-1 text-xs text-slate-500">
          {points.map((point) => (
            <div key={`${label}-${point.date || point.day}-value`} className="flex justify-between">
              <span>{point.value} {unit}</span>
              <span>{point.day}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {error && <p className="text-sm font-semibold text-rose-600">{error}</p>}

      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-slate-500">Choose a date range to view your nutrition trend.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="text-sm font-medium text-slate-600">
            <span className="mb-1 block">From</span>
            <input
              type="date"
              value={range.start}
              onChange={(event) => setRange((current) => ({ ...current, start: event.target.value }))}
              className="rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="text-sm font-medium text-slate-600">
            <span className="mb-1 block">To</span>
            <input
              type="date"
              value={range.end}
              onChange={(event) => setRange((current) => ({ ...current, end: event.target.value }))}
              className="rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Calories">
          {isLoading ? (
            <p className="text-sm text-slate-500">Loading chart data...</p>
          ) : dailyStats.length === 0 ? (
            <p className="text-sm text-slate-500">No food logs yet. Add meals in your diary to see your progress chart.</p>
          ) : (
            <div className="space-y-4">
              {renderLineChart(
                dailyStats.map((entry) => ({ ...entry, value: entry.calories })),
                maxDailyCalories,
                '#0ea5e9',
                'kcal',
                'calories',
              )}
              <div className="text-sm text-slate-500">Target: {targetCalories} kcal/day</div>
            </div>
          )}
        </Card>

        <Card title="Carbs">
          {isLoading ? (
            <p className="text-sm text-slate-500">Loading chart data...</p>
          ) : dailyStats.length === 0 ? (
            <p className="text-sm text-slate-500">No food logs yet.</p>
          ) : (
            renderLineChart(
              dailyStats.map((entry) => ({ ...entry, value: entry.carbs })),
              maxDailyCarbs,
              '#10b981',
              'g',
              'carbs',
            )
          )}
        </Card>

        <Card title="Fats">
          {isLoading ? (
            <p className="text-sm text-slate-500">Loading chart data...</p>
          ) : dailyStats.length === 0 ? (
            <p className="text-sm text-slate-500">No food logs yet.</p>
          ) : (
            renderLineChart(
              dailyStats.map((entry) => ({ ...entry, value: entry.fat })),
              maxDailyFat,
              '#f59e0b',
              'g',
              'fat',
            )
          )}
        </Card>
      </div>
    </div>
  );
}
