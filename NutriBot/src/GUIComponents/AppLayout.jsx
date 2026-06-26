import { useEffect, useRef, useState } from 'react';
import NutriBotClientService from '../services/NutriBotClientService.js';
import { getCurrentUser, logout } from '../UsersManager/UsersService.js';
import DarkModel from './DarkModel.jsx';

const navItems = [
  ['dashboard', 'Dashboard'],
  ['nutrition-profile', 'Profile'],
  ['goals', 'Goals'],
  ['food-log', 'Diary'],
  ['food-search', 'Foods'],
  ['favorites', 'Favorites'],
  ['chatbot', 'Chatbot'],
  ['reminders', 'Reminders'],
  ['deviation-recovery', 'Recovery'],
  ['recipes', 'Recipes'],
];

export default function AppLayout({ title, setScreen, children }) {
  const currentUser = getCurrentUser();
  const [reminders, setReminders] = useState([]);
  const [activePopup, setActivePopup] = useState(null);
  const lastTriggeredRef = useRef(new Set());
  const currentDayRef = useRef('');

  const handleLogout = () => {
    logout();
    setScreen('login');
  };

  useEffect(() => {
    if (!currentUser?.id) {
      setReminders([]);
      return undefined;
    }

    let isCurrent = true;

    const loadReminders = async () => {
      try {
        const nextReminders = await NutriBotClientService.getReminders(currentUser.id);
        if (!isCurrent) {
          return;
        }
        setReminders(nextReminders.filter((item) => item.isActive));
      } catch {
        if (isCurrent) {
          setReminders([]);
        }
      }
    };

    loadReminders();
    const intervalId = window.setInterval(loadReminders, 15000);

    return () => {
      isCurrent = false;
      window.clearInterval(intervalId);
    };
  }, [currentUser?.id]);

  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return;
    }

    if (Notification.permission === 'default') {
      Notification.requestPermission().catch(() => undefined);
    }
  }, [currentUser?.id]);

  useEffect(() => {
    if (!currentUser?.id) {
      return undefined;
    }

    const checkForDueReminders = () => {
      const now = new Date();
      const dayKey = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
      if (currentDayRef.current !== dayKey) {
        currentDayRef.current = dayKey;
        lastTriggeredRef.current.clear();
      }

      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const currentMinute = `${hours}:${minutes}`;

      reminders.forEach((reminder) => {
        const reminderKey = `${dayKey}:${reminder.id}:${reminder.time}`;
        if (lastTriggeredRef.current.has(reminderKey)) {
          return;
        }

        const [reminderHours, reminderMinutes] = (reminder.time || '00:00').split(':');
        const reminderMinute = `${reminderHours.padStart(2, '0')}:${reminderMinutes.padStart(2, '0')}`;
        if (currentMinute !== reminderMinute) {
          return;
        }

        lastTriggeredRef.current.add(reminderKey);
        const popup = {
          title: 'Reminder time',
          body: `${reminder.reminderType} is due at ${reminder.time}`,
        };

        setActivePopup(popup);

        if (typeof window !== 'undefined') {
          try {
            const audio = new Audio('/notification.mp3');
            audio.volume = 0.35;
            audio.play().catch(() => undefined);
          } catch {
            // Ignore audio playback errors.
          }
        }

        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
          new Notification('NutriBot Reminder', { body: popup.body });
        }
      });
    };

    checkForDueReminders();
    const intervalId = window.setInterval(checkForDueReminders, 5000);

    return () => window.clearInterval(intervalId);
  }, [currentUser?.id, reminders]);

  useEffect(() => {
    if (!activePopup) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setActivePopup(null), 8000);
    return () => window.clearTimeout(timeoutId);
  }, [activePopup]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-200" dir="ltr">
      <nav className="bg-sky-700 dark:bg-slate-800 text-white shadow transition-colors duration-200">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <button className="text-left text-2xl font-black tracking-tight" onClick={() => setScreen('dashboard')}>
              NutriBot
            </button>
            <div className="flex flex-wrap items-center gap-2">
              {navItems.map(([screen, label]) => (
                <button
                  key={screen}
                  onClick={() => setScreen(screen)}
                  className="rounded-full bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/20"
                >
                  {label}
                </button>
              ))}
              <button onClick={handleLogout} className="rounded-full bg-rose-500 px-3 py-2 text-sm font-bold hover:bg-rose-400 mr-2">
                Logout
              </button>
              
              <DarkModel />
            </div>
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-6 text-3xl font-black text-slate-900 dark:text-white">{title}</h1>
        {children}
      </main>

      {activePopup && (
        <div className="fixed right-4 top-4 z-50 max-w-sm rounded-2xl border border-sky-200 bg-white p-4 shadow-2xl dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-black text-slate-900 dark:text-white">{activePopup.title}</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{activePopup.body}</p>
            </div>
            <button
              onClick={() => setActivePopup(null)}
              className="text-lg font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}