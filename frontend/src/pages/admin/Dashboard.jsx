import { useEffect, useState } from 'react';
import { ArrowUpRight, ClipboardList, CookingPot, UtensilsCrossed } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import Loader from '../../components/Loader';
import StatusBadge from '../../components/StatusBadge';

export default function Dashboard() {
  const [data, setData] = useState({ menu: [], orders: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    Promise.all([api.get('/menu'), api.get('/orders')])
      .then(([menu, orders]) => setData({ menu: menu.data, orders: orders.data }))
      .catch((requestError) => setError(requestError.response?.data?.message || 'Could not load dashboard data.'))
      .finally(() => setLoading(false));
  }, []);

  const today = new Date().toDateString();
  const todayOrders = data.orders.filter((order) => new Date(order.createdAt).toDateString() === today);
  const cards = [
    { label: 'Orders today', value: todayOrders.length, icon: ClipboardList, tone: 'bg-orange-50 text-orange-600' },
    { label: 'Menu items', value: data.menu.length, icon: UtensilsCrossed, tone: 'bg-green-50 text-green-700' },
    { label: 'Preparing now', value: data.orders.filter((order) => order.status === 'Preparing').length, icon: CookingPot, tone: 'bg-amber-50 text-amber-700' }
  ];

  return (
    <main className="page-shell pb-16 pt-9 sm:pt-12">
      <p className="eyebrow">CANTEEN CONTROL CENTER</p><h1 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">Good day, chef.</h1><p className="mt-2 text-muted">Here's what's happening at your canteen today.</p>
      {error && <div role="alert" className="alert-error mt-6">{error}</div>}
      {loading ? <Loader label="Loading dashboard..." /> : <>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">{cards.map(({ label, value, icon: Icon, tone }) => <article key={label} className="rounded-[22px] border border-black/[.06] bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><span className={`grid h-11 w-11 place-items-center rounded-2xl ${tone}`}><Icon size={20} /></span><ArrowUpRight size={17} className="text-muted" /></div><p className="mt-5 font-display text-3xl font-bold text-ink">{value}</p><p className="mt-1 text-sm text-muted">{label}</p></article>)}</div>
        <section className="mt-8 rounded-[24px] border border-black/[.06] bg-white p-5 shadow-sm sm:p-7">
          <div className="flex items-center justify-between gap-4"><div><p className="eyebrow">LIVE QUEUE</p><h2 className="mt-1 font-display text-xl font-bold text-ink">Recent orders</h2></div><Link to="/admin/orders" className="text-sm font-bold text-green-700 hover:underline">View all <span aria-hidden="true">→</span></Link></div>
          {data.orders.length ? <div className="mt-5 divide-y divide-black/[.06]">{data.orders.slice(0, 5).map((order) => <div key={order._id} className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0"><div><p className="font-semibold text-ink">{order.user?.name || 'Student'} <span className="font-normal text-muted">· #{String(order._id).slice(-6).toUpperCase()}</span></p><p className="mt-1 text-xs text-muted">{order.items.map((item) => `${item.qty}× ${item.name}`).join(', ')}</p></div><div className="flex items-center gap-4"><span className="font-semibold text-ink">₹{order.totalPrice.toFixed(0)}</span><StatusBadge status={order.status} /></div></div>)}</div> : <p className="py-12 text-center text-sm text-muted">No orders yet. New orders will show up here.</p>}
        </section>
      </>}
    </main>
  );
}
