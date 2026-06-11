export default function Card({ title, children }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      {title && <h2 className="mb-4 text-xl font-bold text-slate-900">{title}</h2>}
      {children}
    </section>
  );
}
