import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowRight, ChefHat } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/menu'} replace />;

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/menu', { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to create your account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-76px)] bg-cream px-5 py-12">
      <div className="mx-auto max-w-[460px] rounded-[28px] border border-black/[.06] bg-white p-7 shadow-soft sm:p-10">
        <Link to="/" className="mb-8 inline-flex items-center gap-2 font-display text-xl font-bold text-ink"><ChefHat className="text-green-700" /> foodiehub</Link>
        <p className="text-sm font-bold uppercase tracking-[.16em] text-green-700">Join the table</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-ink">Create your account</h1>
        <p className="mt-2 text-sm leading-6 text-muted">Sign up to browse the canteen and skip the lunch queue.</p>
        {error && <div role="alert" className="alert-error mt-6">{error}</div>}
        <form onSubmit={submit} className="mt-7 space-y-5">
          <label className="form-label">Full name<input required minLength="2" maxLength="80" autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" className="form-input" /></label>
          <label className="form-label">College email<input required type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@college.edu" className="form-input" /></label>
          <label className="form-label">Password<input required minLength="8" type="password" autoComplete="new-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="At least 8 characters" className="form-input" /></label>
          <button disabled={loading} className="button-primary w-full justify-center disabled:opacity-60">{loading ? 'Creating account...' : 'Create account'} <ArrowRight size={17} /></button>
        </form>
        <p className="mt-7 text-center text-sm text-muted">Already have an account? <Link to="/login" className="font-bold text-green-700 hover:underline">Sign in</Link></p>
      </div>
    </main>
  );
}
