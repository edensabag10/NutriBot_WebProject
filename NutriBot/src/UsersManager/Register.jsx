import { useState } from 'react';
import UsersService from './UsersService.js';

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
    <div className="bg-sky-50 flex items-center justify-center min-h-screen py-10 font-sans" dir="rtl">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-xl border border-sky-100 relative overflow-hidden">
        <div className="text-center mb-8 relative z-10">
          <h1 className="text-4xl font-extrabold text-sky-600 mb-2 flex items-center justify-center gap-2">
            Join NutriBot
          </h1>
          <p className="text-slate-500 text-lg">Create a personal nutrition profile and start tracking</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-2 text-sm">Full name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-5 py-3 rounded-full border text-right bg-slate-50"
                placeholder="Enter full name"
                required
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-2 text-sm">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-5 py-3 rounded-full border text-right bg-slate-50"
                placeholder="Enter username"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-slate-700 font-semibold mb-2 text-sm">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-5 py-3 rounded-full border text-right bg-slate-50"
                placeholder="Enter email"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-2 text-sm">Age</label>
              <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full px-5 py-3 rounded-full border text-center bg-slate-50" required />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-2 text-sm">Height (cm)</label>
              <input type="number" name="height" value={formData.height} onChange={handleChange} className="w-full px-5 py-3 rounded-full border text-center bg-slate-50" required />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-2 text-sm">Weight (kg)</label>
              <input type="number" name="weight" value={formData.weight} onChange={handleChange} className="w-full px-5 py-3 rounded-full border text-center bg-slate-50" required />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-2 text-sm">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-5 py-3 rounded-full border text-right bg-slate-50 outline-none focus:ring-2 focus:ring-sky-400 transition"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sky-600 text-white font-bold py-4 rounded-full hover:bg-sky-500 shadow-lg transition mt-4 disabled:opacity-60"
          >
            {loading ? 'Saving...' : 'Create account'}
          </button>
          {error && <p className="text-center text-sm font-semibold text-rose-600">{error}</p>}
        </form>
        <div className="mt-6 text-center text-sm text-slate-500 relative z-10">
          Already have an account?{' '}
          <button onClick={() => setScreen('login')} className="text-sky-600 font-bold hover:underline">
            Login here
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;
