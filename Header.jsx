'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/store/slices/authSlice';
import { clearAuth } from '@/lib/auth';
import { authService } from '@/lib/firebaseServices';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch(logout());
      clearAuth();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.body.setAttribute('data-theme', isDark ? 'light' : 'dark');
  };

  return (
    <header className="bg-white dark:bg-slate-900 shadow-sm border-b">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-amber-600">🌾 Agrobaz</span>
        </Link>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-gray-700 dark:text-gray-300"
        >
          ☰
        </button>

        <div className={`md:flex gap-6 ${isMenuOpen ? 'flex flex-col absolute top-16 left-0 right-0 bg-white dark:bg-slate-900 p-4' : 'hidden'}`}>
          <Link href="/marketplace" className="text-gray-600 dark:text-gray-300 hover:text-amber-600">
            Marketplace
          </Link>
          {user && user.role === 'seller' && (
            <Link href="/dashboard/seller" className="text-gray-600 dark:text-gray-300 hover:text-amber-600">
              Seller Dashboard
            </Link>
          )}
          {user && user.role === 'affiliate' && (
            <Link href="/dashboard/affiliate" className="text-gray-600 dark:text-gray-300 hover:text-amber-600">
              Affiliate Dashboard
            </Link>
          )}
          <button onClick={toggleTheme} className="text-gray-600 dark:text-gray-300">
            {isDark ? '☀️' : '🌙'}
          </button>

          {user ? (
            <div className="flex gap-3 items-center">
              <span className="text-sm text-gray-700 dark:text-gray-300">{user?.fullName}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link href="/signin" className="px-4 py-2 bg-amber-600 text-white rounded-full hover:bg-amber-700">
              Sign in
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
