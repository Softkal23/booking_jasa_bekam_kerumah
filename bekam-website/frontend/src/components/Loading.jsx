export default function Loading({ label = "Memproses pesanan..." }) {
  return (
    <div className="loading" role="status" aria-live="polite">
      <span className="loading__spinner" />
      <span>{label}</span>
    </div>
  );
}
