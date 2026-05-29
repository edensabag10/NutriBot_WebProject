function Settings({ setScreen }) {
  return (
    <div className="bg-sky-50 min-h-screen pb-12 font-sans" dir="rtl">
      <nav className="bg-sky-600 text-white shadow-md p-4 mb-8 rounded-b-2xl">
        <div className="container mx-auto flex justify-between items-center">
          <h1
            className="text-2xl font-bold italic flex items-center gap-2 cursor-pointer"
            onClick={() => setScreen('dashboard')}
          >
            NutriBot
          </h1>
          <div className="flex gap-4">
            <button onClick={() => setScreen('dashboard')} className="hover:underline font-medium text-sm">
              חזרה למסך הראשי
            </button>
            <button onClick={() => setScreen('login')} className="hover:underline font-medium text-sm text-sky-200">
              התנתקות
            </button>
          </div>
        </div>
      </nav>
      <main className="container mx-auto max-w-3xl p-4">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-sky-100">
          <div className="bg-sky-600 p-8 text-white">
            <h2 className="text-3xl font-extrabold mb-2">הגדרת הפרופיל שלך</h2>
            <p className="text-sky-100">עדכני את המטרות כדי ש-Nia תוכל לדייק את ההמלצות.</p>
          </div>
          <form
            onSubmit={(event) => {
              event.preventDefault()
              alert('הפרופיל עודכן!')
              setScreen('dashboard')
            }}
            className="p-8 space-y-6"
          >
            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="text-slate-600 text-sm">משקל (ק"ג)</label>
                <input type="number" defaultValue="65" className="w-full px-4 py-3 rounded-2xl border text-right bg-slate-50" />
              </div>
              <div>
                <label className="text-slate-600 text-sm">גובה (ס"מ)</label>
                <input type="number" defaultValue="168" className="w-full px-4 py-3 rounded-2xl border text-center bg-slate-50" />
              </div>
              <div>
                <label className="text-slate-600 text-sm">גיל</label>
                <input type="number" defaultValue="26" className="w-full px-4 py-3 rounded-2xl border text-center bg-slate-50" />
              </div>
            </div>
            <button type="submit" className="w-full bg-sky-600 text-white font-bold py-4 rounded-full shadow-lg hover:bg-sky-500 transition">
              שמירת שינויים ועדכון Nia
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}

export default Settings
