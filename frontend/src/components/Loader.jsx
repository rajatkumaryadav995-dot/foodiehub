export default function Loader({ label = 'Loading...' }) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 text-muted" role="status">
      <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-green-100 border-t-green-600" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}
