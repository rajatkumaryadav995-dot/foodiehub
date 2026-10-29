import { useEffect, useState } from 'react';
import { ImagePlus, Pencil, Plus, Trash2, X } from 'lucide-react';
import api from '../../api/axios';
import { serverUrl } from '../../api/axios';
import Loader from '../../components/Loader';

const emptyForm = { name: '', price: '', category: '', prepTime: '', isAvailable: true, image: '' };

export default function ManageMenu() {
  const [menu, setMenu] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadMenu = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/menu');
      setMenu(data);
      setError('');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not load the menu.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { loadMenu(); }, []);

  const resetForm = () => { setForm(emptyForm); setImageFile(null); setEditingId(''); };
  const editItem = (item) => {
    setEditingId(item._id);
    setForm({ name: item.name, price: item.price, category: item.category, prepTime: item.prepTime, isAvailable: item.isAvailable, image: item.image || '' });
    setImageFile(null);
    setMessage('');
  };
  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setSaving(true);
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    if (imageFile) formData.set('image', imageFile);
    try {
      if (editingId) await api.put(`/menu/${editingId}`, formData);
      else await api.post('/menu', formData);
      setMessage(editingId ? 'Menu item updated.' : 'Menu item added.');
      resetForm();
      await loadMenu();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not save this menu item.');
    } finally {
      setSaving(false);
    }
  };
  const removeItem = async (item) => {
    if (!window.confirm(`Delete "${item.name}" from the menu?`)) return;
    setError('');
    try {
      await api.delete(`/menu/${item._id}`);
      setMenu((current) => current.filter((entry) => entry._id !== item._id));
      setMessage('Menu item deleted.');
      if (editingId === item._id) resetForm();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not delete this menu item.');
    }
  };

  return (
    <main className="page-shell pb-16 pt-9 sm:pt-12">
      <p className="eyebrow">MENU MANAGEMENT</p><h1 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">Make it delicious.</h1><p className="mt-2 text-muted">Keep your menu fresh and up to date.</p>
      {error && <div role="alert" className="alert-error mt-6">{error}</div>}
      {message && <div role="status" className="alert-success mt-6">{message}</div>}
      <div className="mt-8 grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_390px]">
        <section className="rounded-[24px] border border-black/[.06] bg-white p-5 shadow-sm sm:p-7">
          <div className="flex items-center justify-between"><h2 className="font-display text-xl font-bold text-ink">Menu items <span className="ml-1 text-sm font-medium text-muted">({menu.length})</span></h2><button onClick={resetForm} className="button-secondary !py-2 !px-3 text-sm"><Plus size={15} /> Add new</button></div>
          {loading ? <Loader label="Loading menu..." /> : menu.length ? <div className="mt-5 divide-y divide-black/[.06]">{menu.map((item) => <article key={item._id} className="flex items-center gap-3 py-4 first:pt-0">
            <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl bg-green-50 text-xl">{item.image ? <img src={`${serverUrl}${item.image}`} alt="" className="h-full w-full object-cover" /> : '🍽️'}</div>
            <div className="min-w-0 flex-1"><h3 className="truncate font-semibold text-ink">{item.name}</h3><p className="mt-1 text-xs text-muted">{item.category} · ₹{item.price} · {item.prepTime} min</p></div>
            <span className={`hidden rounded-full px-2.5 py-1 text-[11px] font-bold sm:inline-flex ${item.isAvailable ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{item.isAvailable ? 'Available' : 'Unavailable'}</span>
            <button onClick={() => editItem(item)} aria-label={`Edit ${item.name}`} className="grid h-9 w-9 place-items-center rounded-lg text-muted hover:bg-green-50 hover:text-green-700"><Pencil size={16} /></button>
            <button onClick={() => removeItem(item)} aria-label={`Delete ${item.name}`} className="grid h-9 w-9 place-items-center rounded-lg text-muted hover:bg-red-50 hover:text-red-600"><Trash2 size={16} /></button>
          </article>)}</div> : <p className="py-12 text-center text-sm text-muted">No menu items. Add your first dish with the form.</p>}
        </section>
        <section className="rounded-[24px] border border-black/[.06] bg-white p-5 shadow-sm sm:p-7">
          <div className="flex items-center justify-between"><div><p className="eyebrow">{editingId ? 'UPDATE THE MENU' : 'FRESH FROM THE KITCHEN'}</p><h2 className="mt-1 font-display text-xl font-bold text-ink">{editingId ? 'Edit item' : 'Add a menu item'}</h2></div>{editingId && <button onClick={resetForm} aria-label="Cancel editing" className="grid h-9 w-9 place-items-center rounded-lg hover:bg-gray-100"><X size={18} /></button>}</div>
          <form onSubmit={submit} className="mt-5 space-y-4">
            <label className="form-label">Item name<input required maxLength="100" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Paneer tikka wrap" className="form-input" /></label>
            <div className="grid grid-cols-2 gap-3">
              <label className="form-label">Price (₹)<input required type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="80" className="form-input" /></label>
              <label className="form-label">Prep (min)<input required type="number" min="1" step="1" value={form.prepTime} onChange={(e) => setForm({ ...form, prepTime: e.target.value })} placeholder="10" className="form-input" /></label>
            </div>
            <label className="form-label">Category<input required maxLength="50" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Snacks, Drinks..." className="form-input" /></label>
            <label className="form-label">Image<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="form-input file:mr-3 file:rounded-lg file:border-0 file:bg-green-50 file:px-3 file:py-1 file:text-xs file:font-bold file:text-green-700" /><span className="mt-1 block text-xs font-normal text-muted">Optional · JPEG, PNG, WebP or GIF · max 5 MB</span></label>
            <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-gray-50 p-3 text-sm font-semibold text-ink"><input type="checkbox" checked={form.isAvailable} onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })} className="h-4 w-4 accent-green-700" /> Available to order</label>
            <button disabled={saving} className="button-primary w-full justify-center disabled:opacity-60">{saving ? 'Saving...' : editingId ? 'Save changes' : 'Add to menu'} <ImagePlus size={16} /></button>
          </form>
        </section>
      </div>
    </main>
  );
}
