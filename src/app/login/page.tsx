'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, User, AlertCircle, Shield, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://bannotes-backend.onrender.com';
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      
      const res = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || (isLogin ? '404 User Not Found' : 'Registration Failed'));
        setIsLoading(false);
        return;
      }

      if (!isLogin) {
        // Automatically login after successful registration
        setIsLogin(true);
        setError('Registration successful! Please login.');
        setIsLoading(false);
        return;
      }

      // Store JWT (in production, use http-only cookies)
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      router.push('/dashboard');
    } catch (err) {
      setError('Server Authentication Failed');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[#0f172a]" />
      <div className="absolute top-1/4 left-1/4 w-[30vw] h-[30vw] bg-blue-600/20 rounded-full mix-blend-multiply filter blur-[80px]" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-dark p-8 md:p-10 rounded-3xl w-full max-w-md relative z-10 border border-white/10"
      >
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center">
            <Shield className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-center mb-2">{isLogin ? 'Student Portal' : 'New User Registration'}</h2>
        <p className="text-center text-slate-400 mb-8 text-sm">{isLogin ? 'Enter your enrollment credentials' : 'Create your unique ID and Password'}</p>

        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-400 text-sm"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </motion.div>
        )}

        <form onSubmit={handleAuth} className="space-y-5">
          <div className="space-y-1">
            <label className="text-sm text-slate-300 font-medium ml-1">Username / ID</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-slate-500 w-5 h-5" />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-900/50 border border-white/10 py-2.5 pl-11 pr-4 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-white"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm text-slate-300 font-medium ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-500 w-5 h-5" />
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900/50 border border-white/10 py-2.5 pl-11 pr-12 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-white"
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 transition"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold tracking-wide transition-all shadow-lg disabled:opacity-50 mt-4"
          >
            {isLoading ? 'Processing...' : isLogin ? 'Secure Access' : 'Register Account'}
          </button>

          <p className="text-center text-sm text-slate-400 mt-4">
            {isLogin ? "Don't have an account? " : "Already registered? "}
            <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-blue-400 font-bold hover:underline">
              {isLogin ? "Register Here" : "Login Here"}
            </button>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
