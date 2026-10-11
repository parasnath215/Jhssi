'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Building, BookOpen, Shield, Award } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'AUTHOR', // 'AUTHOR' or 'REVIEWER'
    institution: '',
    fieldOfStudy: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          institution: formData.institution,
          fieldOfStudy: formData.fieldOfStudy,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create account');
        setLoading(false);
        return;
      }

      // Auto login after registration
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        router.push('/login');
      } else {
        router.refresh();
        if (formData.role === 'REVIEWER') {
          window.location.href = '/reviewer/dashboard';
        } else {
          window.location.href = '/author/dashboard';
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Column - Scholarly Academic Visual */}
        <div className="lg:w-1/2 relative h-64 lg:h-auto">
          <Image
            src="/photos/img2.jpeg"
            alt="Academic Study Background"
            fill
            className="object-cover object-left"
            priority
            style={{ objectPosition: '60% center' }}
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
              Join the JHSSI Scholarly Community
            </h2>
            <p className="text-white/80 max-w-md text-xs sm:text-sm leading-relaxed">
              Register as an Author to submit research papers and track peer review, or join our academic review board as a Peer Reviewer.
            </p>
          </motion.div>
        </div>

        {/* Right Column - Registration Form */}
        <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white overflow-y-auto">
          <motion.div
            className="w-full max-w-md py-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {/* Header */}
            <div className="text-center mb-6">
              <Link href="/" className="inline-flex items-center justify-center w-12 h-12 bg-[#F6F1E8] rounded-full border border-[#E6DDCF] shadow-sm mb-3">
                <span className="text-xl text-[#6B4A2E] font-serif font-bold">J</span>
              </Link>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#3F2A1D]">
                Create Academic Account
              </h1>
              <div className="h-0.5 w-16 bg-[#C8A45D] mx-auto my-2.5" />
              <p className="text-xs text-[#6B4A2E]">
                Select your academic role and enter institutional profile details
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-5 rounded-xl bg-red-50 border border-red-200 p-3.5 text-xs text-red-800">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role Selector */}
              <div>
                <label className="block text-xs font-bold text-[#3F2A1D] uppercase tracking-wider mb-1.5">
                  Academic Role *
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, role: 'AUTHOR' }))}
                    className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 ${
                      formData.role === 'AUTHOR'
                        ? 'border-[#6B4A2E] bg-[#F6F1E8] text-[#3F2A1D] font-bold shadow-xs'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <BookOpen className={`w-4 h-4 ${formData.role === 'AUTHOR' ? 'text-[#6B4A2E]' : 'text-gray-400'}`} />
                    <div>
                      <span className="text-xs block">Author</span>
                      <span className="text-[10px] opacity-75">Submit Papers</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, role: 'REVIEWER' }))}
                    className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 ${
                      formData.role === 'REVIEWER'
                        ? 'border-blue-700 bg-blue-50 text-blue-950 font-bold shadow-xs'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <Shield className={`w-4 h-4 ${formData.role === 'REVIEWER' ? 'text-blue-700' : 'text-gray-400'}`} />
                    <div>
                      <span className="text-xs block">Peer Reviewer</span>
                      <span className="text-[10px] opacity-75">Review Blind Papers</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-[#3F2A1D] uppercase tracking-wider mb-1">
                  {formData.role === 'REVIEWER' ? 'Reviewer Name *' : 'Author Name *'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#6B4A2E]/60 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-[#E6DDCF] rounded-xl focus:ring-2 focus:ring-[#C8A45D] outline-hidden text-[#3F2A1D]"
                    placeholder="e.g. Dr. Jane Smith"
                    required
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-[#3F2A1D] uppercase tracking-wider mb-1">
                  Email ID *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#6B4A2E]/60 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-[#E6DDCF] rounded-xl focus:ring-2 focus:ring-[#C8A45D] outline-hidden text-[#3F2A1D]"
                    placeholder="e.g. author@jhssi.com"
                    required
                  />
                </div>
              </div>

              {/* Institution & Field of Study */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#3F2A1D] uppercase tracking-wider mb-1">
                    Institution / University
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-[#6B4A2E]/60 absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type="text"
                      name="institution"
                      value={formData.institution}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 text-sm bg-white border border-[#E6DDCF] rounded-xl focus:ring-2 focus:ring-[#C8A45D] outline-hidden text-[#3F2A1D]"
                      placeholder="e.g. Oxford University"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3F2A1D] uppercase tracking-wider mb-1">
                    Field of Study
                  </label>
                  <input
                    type="text"
                    name="fieldOfStudy"
                    value={formData.fieldOfStudy}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#E6DDCF] rounded-xl focus:ring-2 focus:ring-[#C8A45D] outline-hidden text-[#3F2A1D]"
                    placeholder="e.g. Social Sciences"
                  />
                </div>
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#3F2A1D] uppercase tracking-wider mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#E6DDCF] rounded-xl focus:ring-2 focus:ring-[#C8A45D] outline-hidden text-[#3F2A1D]"
                      placeholder="Min 6 characters"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3F2A1D] uppercase tracking-wider mb-1">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#E6DDCF] rounded-xl focus:ring-2 focus:ring-[#C8A45D] outline-hidden text-[#3F2A1D]"
                      placeholder="Re-enter password"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-gray-600"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 mt-2 bg-[#6B4A2E] hover:bg-[#523720] text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : `Register as ${formData.role === 'REVIEWER' ? 'Peer Reviewer' : 'Author'}`}
              </button>
            </form>

            <div className="text-center mt-5 text-xs text-[#4A4036]">
              Already registered?{' '}
              <Link href="/login" className="text-[#C8A45D] font-bold hover:underline">
                Sign in to your account
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}