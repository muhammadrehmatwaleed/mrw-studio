import { Suspense, lazy, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AnimatedBackground from './components/layout/AnimatedBackground';
import CartDrawer from './components/layout/CartDrawer';
import Loader from './components/ui/Loader';
import ProtectedRoute from './components/ui/ProtectedRoute';
import useDarkMode from './hooks/useDarkMode';

const HomePage = lazy(() => import('./pages/HomePage'));
const ShopPage = lazy(() => import('./pages/ShopPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const OrderConfirmationPage = lazy(() => import('./pages/OrderConfirmationPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const UserDashboardPage = lazy(() => import('./pages/UserDashboardPage'));

const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const ManageProductsPage = lazy(() => import('./pages/admin/ManageProductsPage'));
const ManageOffersPage = lazy(() => import('./pages/admin/ManageOffersPage'));
const ManageCategoriesPage = lazy(() => import('./pages/admin/ManageCategoriesPage'));
const ManageOrdersPage = lazy(() => import('./pages/admin/ManageOrdersPage'));
const ManageUsersPage = lazy(() => import('./pages/admin/ManageUsersPage'));

function App() {
  const { theme, setTheme } = useDarkMode();
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 transition-colors duration-500 dark:bg-slate-950/90 dark:text-slate-100">
      <AnimatedBackground />
      <Navbar theme={theme} setTheme={setTheme} onCartOpen={() => setIsCartOpen(true)} />

      <main className="mx-auto max-w-7xl px-4 pb-10 pt-8 sm:px-6 lg:px-8">
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-confirmation/:id" element={<OrderConfirmationPage />} />
              <Route path="/dashboard" element={<UserDashboardPage />} />
            </Route>

            <Route element={<ProtectedRoute adminOnly />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboardPage />} />
                <Route path="products" element={<ManageProductsPage />} />
                <Route path="offers" element={<ManageOffersPage />} />
                <Route path="categories" element={<ManageCategoriesPage />} />
                <Route path="orders" element={<ManageOrdersPage />} />
                <Route path="users" element={<ManageUsersPage />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}

export default App;
