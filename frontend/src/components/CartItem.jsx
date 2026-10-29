import { Minus, Plus, Trash2 } from 'lucide-react';

export default function CartItem({ item, onQuantityChange, onRemove }) {
  return (
    <div className="flex items-center gap-4 border-b border-black/[.06] py-5 last:border-0">
      <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-green-50 text-2xl">🍴</div>
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-display font-bold text-ink">{item.name}</h3>
        <p className="mt-1 text-sm font-semibold text-green-700">₹{Number(item.price).toFixed(0)}</p>
      </div>
      <div className="flex items-center gap-2 rounded-xl border border-black/10 p-1">
        <button onClick={() => onQuantityChange(item._id, item.qty - 1)} aria-label={`Decrease ${item.name} quantity`} className="grid h-7 w-7 place-items-center rounded-lg hover:bg-gray-100"><Minus size={14} /></button>
        <span className="w-5 text-center text-sm font-bold">{item.qty}</span>
        <button onClick={() => onQuantityChange(item._id, item.qty + 1)} aria-label={`Increase ${item.name} quantity`} className="grid h-7 w-7 place-items-center rounded-lg hover:bg-gray-100"><Plus size={14} /></button>
      </div>
      <button onClick={() => onRemove(item._id)} aria-label={`Remove ${item.name}`} className="grid h-9 w-9 place-items-center rounded-lg text-muted hover:bg-red-50 hover:text-red-600"><Trash2 size={16} /></button>
    </div>
  );
}
