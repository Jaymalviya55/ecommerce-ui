import { useState } from 'react';
import axios from 'axios';
import axiosClient from '../api/axiosClient';
import { useAuthStore } from '../store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { GoogleLogin } from '@react-oauth/google';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setTokens, setUser } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        const response = await axiosClient.post('/auth/login', { email, password });
        setTokens(response.data.accessToken, response.data.refreshToken);
        setUser(email);
        onClose();
        toast.success(`Welcome back!`);
      } else {
        await axiosClient.post('/auth/register', { email, password });
        setIsLogin(true);
        toast.success('Registration successful! Please check your email to verify your account.', { duration: 5000 });
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data) {
        setError(typeof err.response.data === 'string' ? err.response.data : JSON.stringify(err.response.data));
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setError('');
      setIsLoading(true);
      const res = await axiosClient.post('/auth/google-login', { idToken: credentialResponse.credential });
      setTokens(res.data.accessToken, res.data.refreshToken);
      
      // Basic decoding of the payload part of the JWT to extract the email
      const payload = JSON.parse(atob(credentialResponse.credential.split('.')[1]));
      setUser(payload.email || 'Google User');
      
      onClose();
      toast.success('Successfully logged in with Google!');
    } catch (err: any) {
      setError('Failed to authenticate with backend using Google token.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 dark:bg-slate-900/60 backdrop-blur-xl" 
            onClick={onClose}
          />

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-white/90 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/20 dark:border-slate-700/50 shadow-2xl rounded-3xl overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-indigo-400"></div>
            
            <div className="p-8">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                    {isLogin ? 'Enter your details to access your account.' : 'Join us for a premium shopping experience.'}
                  </p>
                </div>
                <button
                  type="button"
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/50 p-2 rounded-full transition-colors"
                  onClick={onClose}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`p-4 rounded-xl text-sm font-medium flex items-center space-x-2 ${
                        error.includes('successful') 
                          ? 'bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                          : 'bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      <ShieldCheck size={18} className="flex-shrink-0" />
                      <span>{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail size={18} className="text-slate-400 dark:text-slate-500" />
                    </div>
                    <input
                      type="email"
                      required
                      className="block w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock size={18} className="text-slate-400 dark:text-slate-500" />
                    </div>
                    <input
                      type="password"
                      required
                      minLength={8}
                      className="block w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  {!isLogin && <p className="text-xs text-slate-500 mt-2 font-medium">Must be at least 8 characters with 1 number.</p>}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center space-x-2 py-4 px-4 rounded-xl text-sm font-bold text-white bg-primary hover:bg-primary-dark transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-primary/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-primary disabled:opacity-50 mt-4 group"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <span>{isLogin ? 'Sign In Securely' : 'Create Account'}</span>
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                <div className="mt-6 relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm font-medium">
                    <span className="px-4 bg-white/90 dark:bg-slate-900/80 text-slate-500">or continue with</span>
                  </div>
                </div>

                <div className="mt-6 flex justify-center w-full">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => setError('Google Login Failed')}
                    theme="outline"
                    size="large"
                    width="100%"
                  />
                </div>
              </form>

              <div className="mt-8 text-center text-sm font-medium">
                <span className="text-slate-600 dark:text-slate-500">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                </span>
                <button
                  type="button"
                  className="text-primary hover:text-primary-dark transition-colors"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                  }}
                >
                  {isLogin ? 'Create one now' : 'Sign in instead'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
