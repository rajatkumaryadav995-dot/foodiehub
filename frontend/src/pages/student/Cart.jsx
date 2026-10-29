import { useState } from 'react';
import { ArrowRight, Clock3, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useCart } from '../../context/CartContext';
import CartItem from '../../components/CartItem';

export default function Cart() {
  const { items, total, updateQuantity, removeItem, clearCart } = useCart();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const placeOrder = async () => {
    setLoading(true);
    setError('');
    try {
      await api.post('/orders', { items: items.map(({ _id, qty }) => ({ menuItem: _id, qty })) });
      clearCart();
      navigate('/orders', { state: { success: 'Order placed! The canteen has received it.' } });
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to place your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!items.length) return (
    <main className="page-shell py-16">
      <div className="empty-panel mx-auto max-w-lg">
        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-green-50 text-green-700"><ShoppingBag size={28} /></span>
        <h1 className="mt-5 font-display text-2xl font-bold text-ink">Your cart is taking a break</h1>
        <p className="mt-2 text-sm text-muted">Head to the menu and add something delicious.</p>
        <Link to="/menu" className="button-primary mt-6">Explore the menu <ArrowRight size={16} /></Link>
      </div>
    </main>
  );

  return (
    <main className="page-shell pb-16 pt-9 sm:pt-12">
      <p className="eyebrow">ALMOST THERE</p><h1 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">Your cart</h1>
      <div className="mt-8 grid gap-7 lg:grid-cols-[1fr_360px]">
        <section className="rounded-[24px] border border-black/[.06] bg-white px-5 shadow-sm sm:px-7">
          {items.map((item) => <CartItem key={item._id} item={item} onQuantityChange={updateQuantity} onRemove={removeItem} />)}
        </section>
        <aside className="h-fit rounded-[24px] border border-black/[.06] bg-white p-6 shadow-sm">
          <h2 className="font-display text-xl font-bold text-ink">Order summary</h2>
          <div className="mt-5 flex justify-between text-sm text-muted"><span>Subtotal</span><span className="font-semibold text-ink">₹{total.toFixed(0)}</span></div>
          <div className="mt-4 flex justify-between border-t border-black/[.07] pt-4 font-display text-lg font-bold text-ink"><span>Total</span><span>₹{total.toFixed(0)}</span></div>
          <div className="mt-5 flex items-start gap-2 rounded-xl bg-green-50 p-3 text-xs leading-5 text-green-700"><Clock3 size={16} className="mt-0.5 shrink-0" />Estimated preparation time is calculated when your order is placed.</div>
          {error && <div role="alert" className="alert-error mt-4">{error}</div>}
          <button onClick={placeOrder} disabled={loading} className="button-primary mt-5 w-full justify-center disabled:opacity-60">{loading ? 'Placing order...' : 'Place order'} <ArrowRight size={16} /></button>
        </aside>
      </div>
    </main>
  );
}
