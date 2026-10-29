import { useEffect, useMemo, useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import api from '../../api/axios';
import Loader from '../../components/Loader';
import MenuCard from '../../components/MenuCard';

export default function Menu() {
  const [menu, setMenu] = useState([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/menu')
      .then(({ data }) => setMenu(data))
      .catch((requestError) => setError(requestError.response?.data?.message || 'Could not load the menu. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => ['All', ...new Set(menu.map((item) => item.category))], [menu]);
  const filtered = menu.filter((item) =>
    (category === 'All' || item.category === category) &&
    item.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <main className="page-shell pb-16">
      <section className="menu-hero mt-8 sm:mt-10">
        <div className="relative z-10 max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold text-white"><Sparkles size={14} /> YOUR CAMPUS, SERVED</span>
          <h1 className="mt-5 font-display text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">Good food.<br /><span className="text-orange-300">Zero waiting.</span></h1>
          <p className="mt-4 max-w-md text-sm leading-6 text-white/75 sm:text-base">Order ahead from your campus canteen. We'll have it ready when you are.</p>
        </div>
        <div className="menu-hero-deco" aria-hidden="true">🥗</div>
      </section>
      <section className="mt-10">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div><p className="eyebrow">MADE FRESH ON CAMPUS</p><h2 className="mt-2 font-display text-3xl font-bold text-ink">Today's menu</h2></div>
          <label className="relative block w-full sm:max-w-[270px]"><Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Find something tasty..." className="form-input !pl-10" aria-label="Search menu" /></label>
        </div>
        <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
          {categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`category-pill ${item === category ? 'category-pill-active' : ''}`}>{item}</button>)}
        </div>
        {error && <div role="alert" className="alert-error mt-5">{error}</div>}
        {loading ? <Loader label="Loading today's menu..." /> : filtered.length ? (
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((item) => <MenuCard key={item._id} item={item} />)}
          </div>
        ) : <div className="empty-panel mt-5"><span className="text-4xl">🍽️</span><h3 className="mt-4 font-display text-xl font-bold text-ink">Nothing on the menu just yet</h3><p className="mt-2 text-sm text-muted">Try another search or check back soon.</p></div>}
      </section>
    </main>
  );
}
