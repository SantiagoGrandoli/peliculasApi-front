import { useToastStore } from "../store/toastStore";

export default function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`toast ${t.type === "error" ? "toast-error" : "toast-success"}`}
          onClick={() => dismiss(t.id)}
          role="alert"
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
