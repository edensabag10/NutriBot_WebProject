import { logout } from '../UsersManager/UsersService.js';
import DarkModel from './DarkModel.jsx';

const navItems = [
  ['dashboard', 'Dashboard'],
  ['nutrition-profile', 'Profile'],
  ['goals', 'Goals'],
  ['food-log', 'Diary'],
  ['food-search', 'Foods'],
  ['favorites', 'Favorites'],
  ['chatbot', 'Chatbot'],
  ['reports', 'Reports'],
  ['reminders', 'Reminders'],
  ['deviation-recovery', 'Recovery'],
  ['recipes', 'Recipes'],
];

export default function AppLayout({ title, setScreen, children }) {
  const handleLogout = () => {
    logout();
    setScreen('login');
  };

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
    </div>
  );
}