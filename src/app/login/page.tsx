'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Shield, User, Award } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      // Fetch active session to direct to appropriate role workspace
      const response = await fetch('/api/auth/session');
      const session = await response.json();

      if (session?.user?.role === 'SUPER_ADMIN') {
        router.push('/super-admin/dashboard');
      } else if (session?.user?.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else if (session?.user?.role === 'REVIEWER') {
        router.push('/reviewer/dashboard');
      } else {
        router.push('/author/dashboard');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = (email: string, pass: string = 'password123') => {
    setFormData({
      email,
      password: pass,
      rememberMe: true,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Column - Scholarly Academic Visual */}
        <div className="lg:w-1/2 relative h-64 lg:h-auto">
          <Image
            src="/photos/img5.jpeg"
            alt="Academic Library Background"
            fill
            className="object-cover object-left"
            priority
            style={{ objectPosition: '70% center' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#3F2A1D]/90 via-[#3F2A1D]/60 to-transparent lg:bg-gradient-to-r lg:from-[#3F2A1D]/90 lg:to-transparent" />

          <motion.div
            className="absolute bottom-8 left-8 lg:left-12 lg:bottom-12 text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center font-serif text-2xl font-bold mb-4 shadow-lg">
              J
            </div>
            <h2 className="font-serif text-2xl lg:text-3xl font-bold mb-3 leading-snug">
              Journal of Humanities and<br />Social Sciences Invention
            </h2>
            <p className="text-white/80 max-w-md text-xs sm:text-sm leading-relaxed">
              International peer-reviewed open access journal. Submit original manuscripts, conduct double-blind evaluations, and access scholarly research.
            </p>
          </motion.div>
        </div>

        {/* Right Column - Login Form */}
        <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white">
          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <Link href="/" className="inline-flex items-center justify-center w-14 h-14 bg-[#F6F1E8] rounded-full border border-[#E6DDCF] shadow-sm mb-4">
                <span className="text-2xl text-[#6B4A2E] font-serif font-bold">J</span>
              </Link>

              <h1 className="font-serif text-3xl font-bold text-[#3F2A1D]">
                Academic Portal Sign In
              </h1>
              <div className="h-0.5 w-16 bg-[#C8A45D] mx-auto my-3" />
              <p className="text-xs text-[#6B4A2E]">
                Enter credentials to access your Author, Reviewer, or Editorial workspace
              </p>
            </div>

            {/* Quick Demo Credentials Switcher */}
            <div className="mb-6 p-3.5 bg-[#FBF9F5] border border-[#E6DDCF] rounded-2xl">
              <p className="text-[11px] font-bold text-[#6B4A2E] uppercase tracking-wider mb-2 text-center">
                One-Click Demo Accounts (Fast Testing)
              </p>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('author@jhssi.com')}
                  className="py-1.5 px-2 bg-white hover:bg-[#F6F1E8] border border-[#E6DDCF] rounded-lg text-center font-medium text-[#3F2A1D] transition active:scale-95"
                >
                  <span className="block font-bold text-[#6B4A2E]">Author</span>
                  <span className="text-[10px] text-gray-500">Dr. Rostova</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('reviewer@jhssi.com')}
                  className="py-1.5 px-2 bg-white hover:bg-[#F6F1E8] border border-[#E6DDCF] rounded-lg text-center font-medium text-[#3F2A1D] transition active:scale-95"
                >
                  <span className="block font-bold text-blue-800">Reviewer</span>
                  <span className="text-[10px] text-gray-500">Prof. Chen</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('admin@jhssi.com')}
                  className="py-1.5 px-2 bg-white hover:bg-[#F6F1E8] border border-[#E6DDCF] rounded-lg text-center font-medium text-[#3F2A1D] transition active:scale-95"
                >
                  <span className="block font-bold text-emerald-800">Admin</span>
                  <span className="text-[10px] text-gray-500">Dr. Evans</span>
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4 text-xs text-red-800 flex items-center gap-2">
                <span>{error}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#3F2A1D] uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#6B4A2E]/60 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E6DDCF] rounded-xl focus:ring-2 focus:ring-[#C8A45D] outline-hidden text-sm text-[#3F2A1D]"
                    placeholder="scholar@university.edu"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3F2A1D] uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#6B4A2E]/60 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-10 py-2.5 bg-white border border-[#E6DDCF] rounded-xl focus:ring-2 focus:ring-[#C8A45D] outline-hidden text-sm text-[#3F2A1D]"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#6B4A2E]/60 hover:text-[#6B4A2E]"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center text-[#4A4036] cursor-pointer">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 text-[#C8A45D] focus:ring-[#C8A45D] border-[#E6DDCF] rounded"
                  />
                  <span className="ml-2">Remember this device</span>
                </label>
                <span className="text-[#C8A45D] hover:underline cursor-pointer">
                  Forgot credentials?
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#6B4A2E] hover:bg-[#523720] text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : 'Sign In to Workspace'}
              </button>
            </form>

            <div className="text-center mt-6 text-xs text-[#4A4036]">
              Don't have an academic account?{' '}
              <Link href="/register" className="text-[#C8A45D] font-bold hover:underline">
                Register as Author or Reviewer
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}