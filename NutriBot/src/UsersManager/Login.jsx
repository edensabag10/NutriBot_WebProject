import { useState } from 'react';
import { login } from './UsersService.js';
import DarkModel from '../GUIComponents/DarkModel.jsx';

function Login({ setScreen }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(username, password);

      if (!user) {
        setError('Username or password is incorrect');
        return;
      }

      setScreen('dashboard');
    } catch {
      setError('Unable to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-sky-50 dark:bg-slate-900 flex items-center justify-center min-h-screen font-sans transition-colors duration-200" dir="rtl">
      <div className="bg-white dark:bg-slate-800 p-10 rounded-3xl shadow-2xl w-full max-w-md border border-sky-100 dark:border-slate-700 relative overflow-hidden transition-colors duration-200">
        
        <div className="absolute top-4 right-4 z-20">
          <DarkModel />
        </div>

        <div className="text-center mb-8 relative z-10">
          <h1 className="text-4xl font-extrabold text-sky-600 dark:text-sky-400 mb-2 flex items-center justify-center gap-2">
            NutriBot
          </h1>
          <p className="text-slate-500 dark:text-slate-400">Your balanced nutrition journey starts here</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-2">Username / Email</label>
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full px-5 py-3 rounded-full border border-slate-200 dark:border-slate-600 outline-none text-right bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white transition-colors duration-200"
              placeholder="Enter username"
              required
            />
          </div>
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full px-5 py-3 rounded-full border border-slate-200 dark:border-slate-600 outline-none text-right bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white transition-colors duration-200"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sky-600 dark:bg-sky-500 text-white font-bold py-3 rounded-full hover:bg-sky-500 dark:hover:bg-sky-400 shadow-lg transform hover:scale-105 transition disabled:opacity-60"
          >
            {loading ? 'Loading...' : 'Login'}
          </button>
          {error && <p className="text-center text-sm font-semibold text-rose-600">{error}</p>}
        </form>
        <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400 relative z-10">
          Do not have an account?{' '}
          <button onClick={() => setScreen('register')} className="text-sky-600 dark:text-sky-400 font-bold hover:underline">
            Register now
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;