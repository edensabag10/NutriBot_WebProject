import { useState } from 'react';
import UsersService from './UsersService.js';
import DarkModel from '../GUIComponents/DarkModel.jsx';

function Register({ setScreen }) {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    age: '',
    height: '',
    weight: '',
    goal: 'Weight loss',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await UsersService.register(formData);

      if (result.error === 'username-taken') {
        setError('Username already exists');
        return;
      }

      if (result.error === 'email-taken') {
        setError('Email already exists');
        return;
      }

      setScreen('login');
    } catch {
      setError('Unable to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-sky-50 dark:bg-slate-900 flex items-center justify-center min-h-screen py-10 font-sans transition-colors duration-200" dir="rtl">
      <div className="bg-white dark:bg-slate-800 p-10 rounded-3xl shadow-2xl w-full max-w-xl border border-sky-100 dark:border-slate-700 relative overflow-hidden transition-colors duration-200">
        
        <div className="absolute top-4 right-4 z-20">
          <DarkModel />
        </div>

        <div className="text-center mb-8 relative z-10">
          <h1 className="text-4xl font-extrabold text-sky-600 dark:text-sky-400 mb-2 flex items-center justify-center gap-2">
            Join NutriBot
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">Create a personal nutrition profile and start tracking</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-2 text-sm">Full name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-5 py-3 rounded-full border border-slate-200 dark:border-slate-600 text-right bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white outline-none transition-colors duration-200"
                placeholder="Enter full name"
                required
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-2 text-sm">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-5 py-3 rounded-full border border-slate-200 dark:border-slate-600 text-right bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white outline-none transition-colors duration-200"
                placeholder="Enter username"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-2 text-sm">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-5 py-3 rounded-full border border-slate-200 dark:border-slate-600 text-right bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white outline-none transition-colors duration-200"
                placeholder="Enter email"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-2 text-sm">Age</label>
              <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full px-5 py-3 rounded-full border border-slate-200 dark:border-slate-600 text-center bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white outline-none transition-colors duration-200" required />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-2 text-sm">Height (cm)</label>
              <input type="number" name="height" value={formData.height} onChange={handleChange} className="w-full px-5 py-3 rounded-full border border-slate-200 dark:border-slate-600 text-center bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white outline-none transition-colors duration-200" required />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-2 text-sm">Weight (kg)</label>
              <input type="number" name="weight" value={formData.weight} onChange={handleChange} className="w-full px-5 py-3 rounded-full border border-slate-200 dark:border-slate-600 text-center bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white outline-none transition-colors duration-200" required />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-2 text-sm">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-5 py-3 rounded-full border border-slate-200 dark:border-slate-600 text-right bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-sky-400 transition-colors duration-200"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sky-600 dark:bg-sky-500 text-white font-bold py-4 rounded-full hover:bg-sky-500 dark:hover:bg-sky-400 shadow-lg transition mt-4 disabled:opacity-60"
          >
            {loading ? 'Saving...' : 'Create account'}
          </button>
          {error && <p className="text-center text-sm font-semibold text-rose-600">{error}</p>}
        </form>
        <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400 relative z-10">
          Already have an account?{' '}
          <button onClick={() => setScreen('login')} className="text-sky-600 dark:text-sky-400 font-bold hover:underline">
            Login here
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;