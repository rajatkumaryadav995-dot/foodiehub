import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, ChefHat } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/menu'} replace />;
  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const loggedIn = await login(form);
      navigate(location.state?.from?.pathname || (loggedIn.role === 'admin' ? '/admin' : '/menu'), { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to log in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <section className="auth-visual">
        <div className="relative z-10 max-w-md">
          <div className="mb-12 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/90"><span className="h-2 w-2 rounded-full bg-orange-400" /> Your campus kitchen, reimagined</div>
          <p className="mb-4 text-sm font-bold uppercase tracking-[.18em] text-green-100">Good food. No queue.</p>
          <h1 className="font-display text-5xl font-bold leading-[1.08] tracking-tight text-white sm:text-6xl">Lunch plans?<br />Already <span className="text-orange-300">handled.</span></h1>
          <p className="mt-6 max-w-sm text-base leading-7 text-white/70">Pre-order your campus favorites, beat the rush, and make every break a little better.</p>
        </div>
        <div className="relative z-10 mt-16 flex gap-8 text-white/75"><span><strong className="block font-display text-2xl text-white">Fresh</strong>made on campus</span><span><strong className="block font-display text-2xl text-white">Fast</strong>ready when you are</span></div>
        <div className="auth-orb auth-orb-one" /><div className="auth-orb auth-orb-two" />
      </section>
      <section className="flex items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-[420px]">
          <Link to="/" className="mb-10 inline-flex items-center gap-2 font-display text-xl font-bold text-ink lg:hidden"><ChefHat className="text-green-700" /> foodiehub</Link>
          <p className="text-sm font-bold uppercase tracking-[.16em] text-green-700">Welcome back</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink">Sign in to FoodieHub</h2>
          <p className="mt-2 text-muted">Your next favorite meal is just a few clicks away.</p>
          {error && <div role="alert" className="alert-error mt-6">{error}</div>}
          <form onSubmit={submit} className="mt-8 space-y-5">
            <label className="form-label">Email address<input required type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@college.edu" className="form-input" /></label>
            <label className="form-label">Password<input required type="password" autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Enter your password" className="form-input" /></label>
            <button disabled={loading} className="button-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-60">{loading ? 'Signing in...' : 'Sign in'} <ArrowRight size={17} /></button>
          </form>
          <p className="mt-7 text-center text-sm text-muted">New to FoodieHub? <Link to="/register" className="font-bold text-green-700 hover:underline">Create an account</Link></p>
        </div>
      </section>
    </div>
  );
}
