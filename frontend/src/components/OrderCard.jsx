import { Clock3, ReceiptText } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function OrderCard({ order }) {
  return (
    <article className="rounded-[22px] border border-black/[.06] bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-black/[.06] pb-4">
        <div>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted"><ReceiptText size={14} /> Order #{String(order._id).slice(-6).toUpperCase()}</p>
          <p className="mt-2 text-sm text-muted">{new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>
      <div className="space-y-2 py-4">
        {order.items.map((item, index) => <div key={`${item.menuItem}-${index}`} className="flex justify-between gap-4 text-sm">
          <span className="text-ink">{item.qty} × {item.name}</span>
          <span className="font-semibold text-ink">₹{(item.price * item.qty).toFixed(0)}</span>
        </div>)}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-black/[.06] pt-4">
        <span className="flex items-center gap-1.5 text-sm font-medium text-muted"><Clock3 size={15} /> Est. {order.estimatedTime} min</span>
        <span className="font-display text-lg font-bold text-ink">₹{order.totalPrice.toFixed(0)}</span>
      </div>
    </article>
  );
}
