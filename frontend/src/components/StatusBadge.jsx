const styles = {
  Placed: 'bg-orange-50 text-orange-600',
  Preparing: 'bg-amber-50 text-amber-700',
  Ready: 'bg-green-50 text-green-700'
};

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  );
}
