import { useEffect, useState } from 'react';
import { Clock3, RefreshCw } from 'lucide-react';
import api from '../../api/axios';
import Loader from '../../components/Loader';
import StatusBadge from '../../components/StatusBadge';

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/orders');
      setOrders(data);
      setError('');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not load orders.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { loadOrders(); }, []);

  const advanceOrder = async (order) => {
    const nextStatus = order.status === 'Placed' ? 'Preparing' : 'Ready';
    setUpdating(order._id);
    setError('');
    setMessage('');
    try {
      const { data } = await api.put(`/orders/${order._id}/status`, { status: nextStatus });
      setOrders((current) => current.map((item) => item._id === data._id ? data : item));
      setMessage(`Order #${String(order._id).slice(-6).toUpperCase()} marked ${nextStatus.toLowerCase()}.`);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not update order status.');
    } finally {
      setUpdating('');
    }
  };

  return (
    <main className="page-shell pb-16 pt-9 sm:pt-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="eyebrow">THE CANTEEN QUEUE</p><h1 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">Order management</h1><p className="mt-2 text-muted">See what's cooking and keep everyone in the loop.</p></div>
        <button onClick={loadOrders} disabled={loading} className="button-secondary"><RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh</button>
      </div>
      {error && <div role="alert" className="alert-error mt-6">{error}</div>}
      {message && <div role="status" className="alert-success mt-6">{message}</div>}
      {loading ? <Loader label="Loading orders..." /> : orders.length ? <div className="mt-7 grid gap-4 xl:grid-cols-2">
        {orders.map((order) => <article key={order._id} className="rounded-[22px] border border-black/[.06] bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-black/[.06] pb-4">
            <div><p className="font-display text-lg font-bold text-ink">Order #{String(order._id).slice(-6).toUpperCase()}</p><p className="mt-1 text-sm text-muted">{order.user?.name || 'Student'} · {order.user?.email || 'No email'}</p><p className="mt-1 text-xs text-muted">{new Date(order.createdAt).toLocaleString()}</p></div>
            <StatusBadge status={order.status} />
          </div>
          <div className="space-y-2 py-4">{order.items.map((item, index) => <div key={`${item.menuItem}-${index}`} className="flex justify-between gap-4 text-sm"><span>{item.qty} × {item.name}</span><span className="font-medium">₹{(item.price * item.qty).toFixed(0)}</span></div>)}</div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-black/[.06] pt-4">
            <div><p className="font-display text-lg font-bold text-ink">₹{order.totalPrice.toFixed(0)}</p><p className="mt-1 flex items-center gap-1 text-xs text-muted"><Clock3 size={13} /> Est. {order.estimatedTime} min</p></div>
            {order.status !== 'Ready' && <button onClick={() => advanceOrder(order)} disabled={updating === order._id} className="button-primary !py-2.5 !px-4 text-sm disabled:opacity-60">{updating === order._id ? 'Updating...' : order.status === 'Placed' ? 'Start preparing' : 'Mark ready'} <span aria-hidden="true">→</span></button>}
          </div>
        </article>)}
      </div> : <div className="empty-panel mt-8"><span className="text-4xl">✨</span><h2 className="mt-4 font-display text-xl font-bold text-ink">Queue is all clear</h2><p className="mt-2 text-sm text-muted">New student orders will appear here.</p></div>}
    </main>
  );
}
