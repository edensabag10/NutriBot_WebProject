export default function Button({ children, type = 'button', variant = 'primary', ...props }) {
  const classes =
    variant === 'secondary'
      ? 'rounded-full border border-slate-300 px-4 py-2 font-bold text-slate-700 hover:bg-slate-100'
      : 'rounded-full bg-sky-600 px-4 py-2 font-bold text-white hover:bg-sky-500';

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}
