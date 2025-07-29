import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../utils/supabaseClient';

interface AuthFormProps {
  onSuccess?: (user: any) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onSuccess }) => {
  const { signUp, signIn, signInWithGoogle, getUser, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user && onSuccess) {
        onSuccess(session.user);
      }
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [onSuccess, getUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let success = false;
    if (mode === 'signin') {
      success = await signIn(email, password);
    } else {
      success = await signUp(email, password);
    }
    if (success && onSuccess) {
      // getUser returns the latest user
      const { data } = await getUser();
      if (data.user) onSuccess(data.user);
    }
  };

  return (
    <div className="max-w-sm mx-auto p-4 border rounded bg-white dark:bg-gray-900">
      <h2 className="text-lg font-bold mb-2">{mode === 'signin' ? 'Sign In' : 'Sign Up'}</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border px-2 py-1"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border px-2 py-1"
          required
        />
        <button type="submit" className="w-full bg-blue-500 text-white py-1 rounded" disabled={loading}>
          {mode === 'signin' ? 'Sign In' : 'Sign Up'}
        </button>
        <button
          type="button"
          className="w-full bg-red-500 text-white py-1 rounded"
          onClick={signInWithGoogle}
          disabled={loading}
        >
          Sign in with Google
        </button>
        {error && <div className="text-red-500">{error}</div>}
      </form>
      <div className="mt-2 text-sm">
        {mode === 'signin' ? (
          <>
            Don't have an account?{' '}
            <button className="text-blue-600" onClick={() => setMode('signup')}>Sign Up</button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button className="text-blue-600" onClick={() => setMode('signin')}>Sign In</button>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthForm; 