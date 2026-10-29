import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ArrowRight, ChefHat, LogOut, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 border-b border-black/[.06] bg-cream/90 backdrop-blur-xl">
      <nav className="page-shell flex h-[76px] items-center justify-between">
        <Link to={user?.role === 'admin' ? '/admin' : '/menu'} className="flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-green-700 text-white"><ChefHat size={21} /></span>
          <span className="font-display text-[21px] font-bold tracking-tight text-ink">foodie<span className="text-green-600">hub</span></span>
        </Link>
        <div className="flex items-center gap-1 sm:gap-3">
          {user ? (
            <>
              {user.role === 'student' ? (
                <>
                  <NavLink to="/menu" className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}>Menu</NavLink>
                  <NavLink to="/orders" className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}>My orders</NavLink>
                  <NavLink to="/cart" aria-label="Shopping cart" className="relative ml-1 grid h-10 w-10 place-items-center rounded-xl text-ink hover:bg-white">
                    <ShoppingBag size={19} />
                    {itemCount > 0 && <span className="absolute -right-1 -top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white">{itemCount}</span>}
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}>Overview</NavLink>
                  <NavLink to="/admin/menu" className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}>Menu</NavLink>
                  <NavLink to="/admin/orders" className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}>Orders</NavLink>
                </>
              )}
              <span className="ml-1 hidden border-l border-black/10 pl-4 text-sm font-semibold text-ink md:block">{user.name}</span>
              <button onClick={handleLogout} className="ml-1 grid h-10 w-10 place-items-center rounded-xl text-muted hover:bg-white hover:text-ink" aria-label="Log out"><LogOut size={18} /></button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Log in</Link>
              <Link to="/register" className="button-primary !py-2.5 !px-4 !text-sm">Get started <ArrowRight size={15} /></Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
