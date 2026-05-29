import { useEffect } from 'react'
import { getCurrentUser, getCurrentUserDashboard, logout } from './UsersManager/UsersService.js'

function Dashboard({ setScreen }) {
  const currentUser = getCurrentUser()
  const dashboard = getCurrentUserDashboard()

  useEffect(() => {
    if (!currentUser || !dashboard) {
      setScreen('login')
    }
  }, [currentUser, dashboard, setScreen])

  if (!currentUser || !dashboard) {
    return null
  }

  const handleLogout = () => {
    logout()
    setScreen('login')
  }

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen font-sans" dir="rtl">
      <nav className="bg-sky-600 text-white shadow-md p-4 rounded-b-2xl">
        <div className="container mx-auto flex justify-between items-center">
          <h1
            className="text-3xl font-extrabold flex items-center gap-2 tracking-tight cursor-pointer"
            onClick={() => setScreen('dashboard')}
          >
            NutriBot
          </h1>
          <ul className="ml-4 flex items-center gap-6 font-medium text-lg">
            <li>
              <button onClick={() => setScreen('settings')} className="hover:text-sky-100 transition">
                מדדים אישיים
              </button>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="hover:text-sky-100 transition"
                aria-label="התנתקות"
                title="התנתקות"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" x2="9" y1="12" y2="12" />
                </svg>
              </button>
            </li>
          </ul>
        </div>
      </nav>

      <main className="container mx-auto mt-10 p-4 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-1 space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
            <h2 className="text-2xl font-bold mb-6 text-sky-600 border-b-2 border-sky-100 pb-2">
              סיכום יומי <span className="text-xs text-slate-400 font-normal">(נתוני דוגמה)</span>
            </h2>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2 items-center">
                  <span className="text-lg font-medium text-slate-700">קלוריות</span>
                  <span className="text-2xl font-bold text-sky-600">
                    {dashboard.calories.consumed.toLocaleString()}{' '}
                    <span className="text-sm font-normal text-slate-500">
                      / {dashboard.calories.goal.toLocaleString()}
                    </span>
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-4 shadow-inner">
                  <div
                    className="bg-sky-400 h-4 rounded-full shadow"
                    style={{ width: `${dashboard.calories.percent}%` }}
                  ></div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-sky-50 p-4 rounded-2xl shadow-sm border border-sky-200">
                  <p className="text-sky-600 font-bold text-xl">{dashboard.macros.carbs}</p>
                  <p className="text-sm text-sky-900">פחמימות</p>
                </div>
                <div className="bg-rose-50 p-4 rounded-2xl shadow-sm border border-rose-200">
                  <p className="text-rose-700 font-bold text-xl">{dashboard.macros.protein}</p>
                  <p className="text-sm text-rose-900">חלבון</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-2xl shadow-sm border border-amber-200">
                  <p className="text-amber-700 font-bold text-xl">{dashboard.macros.fat}</p>
                  <p className="text-sm text-amber-900">שומן</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100">
            <h2 className="text-xl font-bold mb-2 text-slate-800">הפרופיל של {currentUser.fullName}</h2>
            <p className="text-sm text-slate-500 mb-5">הגדרות אישיות לליווי מותאם</p>
            <ul className="space-y-3">
              <li className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="text-slate-600">יעד מרכזי:</span>
                <span className="bg-sky-50 text-sky-600 font-bold px-3 py-1 rounded-full text-sm">
                  {dashboard.profile.mainGoal}
                </span>
              </li>
              <li className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="text-slate-600">כלל ברזל:</span>
                <span className="bg-rose-100 text-rose-800 font-bold px-3 py-1 rounded-full text-sm">
                  {dashboard.profile.rule}
                </span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-slate-600">העדפת בישול:</span>
                <span className="bg-amber-100 text-amber-900 font-bold px-3 py-1 rounded-full text-sm">
                  {dashboard.profile.cookingStyle}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="md:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl shadow-xl flex flex-col h-112.5 border border-slate-100 overflow-hidden">
            <div className="bg-slate-100 p-5 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-sky-400 rounded-full animate-pulse shadow"></div>
                <span className="font-bold text-lg text-slate-800">Nia - המאמנת האישית שלך (בינה מלאכותית)</span>
              </div>
              <span className="text-xs text-slate-400">זמינה תמיד</span>
            </div>
            <div className="flex-1 p-6 overflow-y-auto space-y-5 bg-slate-50 flex flex-col">
              <div className="flex justify-start">
                <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-br-none shadow-sm max-w-[75%] text-slate-800">
                  {dashboard.chat.botMessage}
                </div>
              </div>
              <div className="flex justify-end mt-2">
                <div className="bg-sky-600 text-white p-4 rounded-2xl rounded-bl-none shadow-md max-w-[75%] font-medium">
                  {dashboard.chat.userMessage}
                </div>
              </div>
            </div>
            <div className="p-5 border-t border-slate-100 flex gap-3 bg-white">
              <input
                type="text"
                placeholder="הקלידי הודעה..."
                className="flex-1 border border-slate-200 bg-slate-50 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white"
              />
              <button className="bg-sky-600 text-white px-8 py-3 rounded-full hover:bg-sky-500 font-bold shadow">
                שלח
              </button>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
            <h2 className="text-2xl font-bold mb-6 text-slate-800">יומן אכילה - היום</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-100 text-slate-500 text-sm">
                    <th className="py-3 px-2">שעה</th>
                    <th className="py-3 px-2">מאכל</th>
                    <th className="py-3 px-2">קלוריות</th>
                    <th className="py-3 px-2">חלבון</th>
                  </tr>
                </thead>
                <tbody className="text-lg">
                  {dashboard.meals.map((meal) => (
                    <tr key={meal.id} className="border-b border-slate-100 hover:bg-sky-50 transition">
                      <td className="py-4 px-2 text-slate-500 text-sm">{meal.time}</td>
                      <td className="py-4 px-2 font-semibold text-slate-800">{meal.name}</td>
                      <td className="py-4 px-2 font-bold text-sky-600">{meal.cals} קלוריות</td>
                      <td className="py-4 px-2 text-rose-700 font-extrabold">{meal.protein}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
