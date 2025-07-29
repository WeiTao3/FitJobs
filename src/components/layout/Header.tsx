import React from 'react';
import { Plus } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import AuthForm from '../auth/AuthForm';
import { useAuth } from '../../hooks/useAuth';
import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../../utils/supabaseClient';

interface HeaderProps {
  onPostJob: () => void;
}

const Header: React.FC<HeaderProps> = ({ onPostJob }) => {
  const { getUser, signOut } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    getUser().then(({ data }) => setUser(data.user));
  }, [getUser]);

  // Listen for auth state changes (optional, for real-time update)
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event: string, session: Session | null) => {
      setUser(session?.user ?? null);
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center space-x-8">
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">FitJobs</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-xs">
                Browse Jobs
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-xs">
                Companies
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-xs">
                Resources
              </a>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <button 
              onClick={onPostJob}
              className="bg-black dark:bg-white text-white dark:text-black px-3 py-1.5 text-xs font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-3 h-3" />
              <span>Post Job</span>
            </button>
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-700 dark:text-gray-200 font-mono">{user.email || user.id}</span>
                <button
                  onClick={handleSignOut}
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-xs underline"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-xs"
                onClick={() => setShowAuth(true)}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
      {showAuth && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded shadow-lg p-0 relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 dark:hover:text-white text-xl"
              onClick={() => setShowAuth(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <AuthForm onSuccess={(user) => { setUser(user); setShowAuth(false); }} />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;