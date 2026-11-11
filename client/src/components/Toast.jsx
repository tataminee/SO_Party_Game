const styles = {
  error: "bg-brand-red text-white",
  success: "bg-brand-green text-brand-dark",
  info: "bg-brand-dark text-white",
};

export default function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div
      role="status"
      className={`fixed left-1/2 top-4 z-50 -translate-x-1/2 rounded-xl border-2 border-white px-4 py-2 text-sm font-bold ${styles[toast.type]}`}
    >
      {toast.message}
    </div>
  );
}