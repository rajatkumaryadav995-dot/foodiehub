import { Clock3, Plus } from 'lucide-react';
import { serverUrl } from '../api/axios';
import { useCart } from '../context/CartContext';

export default function MenuCard({ item }) {
  const { addItem, items } = useCart();
  const inCart = items.find((cartItem) => cartItem._id === item._id)?.qty || 0;
  const image = item.image?.startsWith('http') ? item.image : `${serverUrl}${item.image}`;

  return (
    <article className={`group overflow-hidden rounded-[22px] border border-black/[.055] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft ${!item.isAvailable ? 'opacity-75' : ''}`}>
      <div className="relative aspect-[1.35/1] overflow-hidden bg-green-50">
        {item.image ? <img src={image} alt={item.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /> : <div className="grid h-full place-items-center text-5xl" aria-label="Food item">🍽️</div>}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-green-700 backdrop-blur">{item.category}</span>
        {!item.isAvailable && <span className="absolute inset-0 grid place-items-center bg-ink/35"><span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-ink">Sold out</span></span>}
      </div>
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-bold text-ink">{item.name}</h3>
          <span className="whitespace-nowrap font-display text-lg font-bold text-green-700">₹{Number(item.price).toFixed(0)}</span>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs font-medium text-muted"><Clock3 size={14} /> {item.prepTime} min prep</span>
          {item.isAvailable && <button onClick={() => addItem(item)} className="flex items-center gap-1.5 rounded-xl bg-green-50 px-3 py-2 text-sm font-bold text-green-700 transition hover:bg-green-700 hover:text-white" aria-label={`Add ${item.name} to cart`}>
            <Plus size={16} />{inCart ? `Add more (${inCart})` : 'Add'}
          </button>}
        </div>
      </div>
    </article>
  );
}
