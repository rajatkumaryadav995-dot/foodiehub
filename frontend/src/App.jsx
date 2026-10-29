import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Menu from './pages/student/Menu';
import Cart from './pages/student/Cart';
import MyOrders from './pages/student/MyOrders';
import Dashboard from './pages/admin/Dashboard';
import ManageMenu from './pages/admin/ManageMenu';
import ManageOrders from './pages/admin/ManageOrders';

function HomeRedirect() {
  const { user } = useAuth();
  return <Navigate to={user ? (user.role === 'admin' ? '/admin' : '/menu') : '/login'} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-cream">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute roles={['student']} />}>
            <Route path="/menu" element={<Menu />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<MyOrders />} />
          </Route>
          <Route element={<ProtectedRoute roles={['admin']} />}>
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/menu" element={<ManageMenu />} />
            <Route path="/admin/orders" element={<ManageOrders />} />
          </Route>
          <Route path="*" element={<HomeRedirect />} />
        </Routes>
        <footer className="border-t border-black/[.06] py-6 text-center text-xs text-muted">Made with care for your campus · FoodieHub</footer>
      </div>
    </BrowserRouter>
  );
}
