import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ClipboardList } from 'lucide-react';
import api from '../../api/axios';
import Loader from '../../components/Loader';
import OrderCard from '../../components/OrderCard';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();

  useEffect(() => {
    api.get('/orders/my')
      .then(({ data }) => setOrders(data))
      .catch((requestError) => setError(requestError.response?.data?.message || 'Could not load your orders.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="page-shell pb-16 pt-9 sm:pt-12">
      <p className="eyebrow">YOUR FOOD, IN MOTION</p><h1 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">My orders</h1>
      {location.state?.success && <div role="status" className="alert-success mt-6">{location.state.success}</div>}
      {error && <div role="alert" className="alert-error mt-6">{error}</div>}
      {loading ? <Loader label="Loading your orders..." /> : orders.length ? (
        <div className="mt-7 grid gap-4 lg:grid-cols-2">{orders.map((order) => <OrderCard key={order._id} order={order} />)}</div>
      ) : <div className="empty-panel mt-8"><span className="grid h-16 w-16 place-items-center rounded-2xl bg-green-50 text-green-700"><ClipboardList size={28} /></span><h2 className="mt-5 font-display text-xl font-bold text-ink">No orders yet</h2><p className="mt-2 text-sm text-muted">Your next canteen favorite is waiting.</p></div>}
    </main>
  );
}
