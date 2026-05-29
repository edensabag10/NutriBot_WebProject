import { useState } from 'react'
import { login } from './UsersService.js'

function Login({ setScreen }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    const user = login(username, password)

    if (!user) {
      setError('שם המשתמש או הסיסמה אינם נכונים')
      return
    }

    setError('')
    setScreen('dashboard')
  }

  return (
    <div className="bg-sky-50 flex items-center justify-center min-h-screen font-sans" dir="rtl">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border border-sky-100 relative overflow-hidden">
        <div className="text-center mb-8 relative z-10">
          <h1 className="text-4xl font-extrabold text-sky-600 mb-2 flex items-center justify-center gap-2">
            NutriBot
          </h1>
          <p className="text-slate-500">הדרך שלך לתזונה מאוזנת מתחילה כאן</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div>
            <label className="block text-slate-700 font-semibold mb-2">שם משתמש / אימייל</label>
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full px-5 py-3 rounded-full border border-slate-200 outline-none text-right bg-slate-50"
              placeholder="הקלידי שם משתמש"
              required
            />
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-2">סיסמה</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full px-5 py-3 rounded-full border border-slate-200 outline-none text-right bg-slate-50"
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className="w-full bg-sky-600 text-white font-bold py-3 rounded-full hover:bg-sky-500 shadow-lg transform hover:scale-105 transition">
            כניסה למערכת
          </button>
          {error && <p className="text-center text-sm font-semibold text-rose-600">{error}</p>}
        </form>
        <div className="mt-8 text-center text-sm text-slate-500 relative z-10">
          עדיין אין לך חשבון?{' '}
          <button onClick={() => setScreen('register')} className="text-sky-600 font-bold hover:underline">
            הירשמ/י עכשיו
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
