export default function Card({ title, children }) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm transition-colors duration-200">
      {title && <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">{title}</h2>}
      <div className="text-slate-900 dark:text-slate-100">
        {children}
      </div>
    </div>
  );
}