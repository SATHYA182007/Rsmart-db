import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/lib/supabase';
const rsmartLogo = '/rsmart-logo.png';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

// SVG Icons for social login
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107"/>
    <path d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00"/>
    <path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" fill="#4CAF50"/>
    <path d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2"/>
  </svg>
);

const MicrosoftIcon = () => (
  <svg width="18" height="18" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
    <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
    <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
    <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
  </svg>
);

export default function Login() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setAuthError('');
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    setLoading(false);
    if (error) {
      console.error('Supabase Auth Signin Error:', error);
      if (error.message && error.message.toLowerCase().includes('confirm')) {
        setAuthError(
          'Email not confirmed. Please check your email inbox for the verification link, or disable "Confirm email" in your Supabase Dashboard (Authentication -> Providers -> Email).'
        );
      } else {
        setAuthError(error.message || 'Invalid email or password. Please try again.');
      }
      return;
    }
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#F1F3F6' }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            backgroundColor: '#FFFFFF',
            boxShadow: '0 4px 32px 0 rgba(0,0,0,0.10)',
          }}
        >
          {/* Top gradient accent bar */}
          <div style={{ height: 5, background: 'linear-gradient(90deg, #6C3DFF 0%, #A855F7 40%, #EC4899 70%, #F97316 100%)' }} />

          <div className="px-8 py-8">
            {/* Logo */}
            <div className="mb-6">
              <img
                src={rsmartLogo}
                alt="Raise Smart School of Technology"
                className="h-12 object-contain"
              />
            </div>

            {/* Heading */}
            <h1 className="text-2xl font-bold mb-1" style={{ color: '#111827', fontFamily: 'Inter, sans-serif' }}>
              Welcome back
            </h1>
            <p className="text-sm mb-7" style={{ color: '#6B7280' }}>
              Sign in to manage admissions and candidate intelligence.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Auth error banner */}
              {authError && (
                <div className="flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-sm"
                  style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626' }}>
                  <AlertCircle size={15} className="flex-shrink-0" />
                  {authError}
                </div>
              )}
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold mb-1.5"
                  style={{ color: '#6B7280', letterSpacing: '0.06em', textTransform: 'uppercase' }}
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#9CA3AF' }} />
                  <input
                    id="email"
                    {...register('email')}
                    type="email"
                    autoComplete="off"
                    placeholder="enter your mail id"
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm transition-all outline-none"
                    style={{
                      border: '1.5px solid #D1D5DB',
                      backgroundColor: '#FFFFFF',
                      color: '#111827',
                      fontFamily: 'Inter, sans-serif',
                    }}
                    onFocus={e => (e.target.style.borderColor = '#6C3DFF')}
                    onBlur={e => (e.target.style.borderColor = '#D1D5DB')}
                  />
                </div>
                {errors.email && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="password"
                    className="text-xs font-semibold"
                    style={{ color: '#6B7280', letterSpacing: '0.06em', textTransform: 'uppercase' }}
                  >
                    Password
                  </label>
                  <a href="#" className="text-xs font-semibold hover:underline" style={{ color: '#374151' }}>
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#9CA3AF' }} />
                  <input
                    id="password"
                    {...register('password')}
                    type={showPass ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="enter your password"
                    className="w-full pl-9 pr-10 py-2.5 rounded-lg text-sm transition-all outline-none"
                    style={{
                      border: '1.5px solid #D1D5DB',
                      backgroundColor: '#FFFFFF',
                      color: '#111827',
                      fontFamily: 'Inter, sans-serif',
                    }}
                    onFocus={e => (e.target.style.borderColor = '#6C3DFF')}
                    onBlur={e => (e.target.style.borderColor = '#D1D5DB')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: '#9CA3AF' }}
                  >
                    {showPass ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.password.message}</p>}
              </div>

              {/* Remember me */}
              <div className="flex items-center gap-2">
                <input
                  id="remember"
                  type="checkbox"
                  {...register('rememberMe')}
                  className="w-4 h-4 rounded"
                  style={{ accentColor: '#6C3DFF', border: '1.5px solid #D1D5DB' }}
                />
                <label htmlFor="remember" className="text-sm cursor-pointer select-none" style={{ color: '#374151' }}>
                  Remember my account
                </label>
              </div>

              {/* Sign In button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all mt-1"
                style={{
                  backgroundColor: '#111827',
                  color: '#FFFFFF',
                  fontFamily: 'Inter, sans-serif',
                  letterSpacing: '0.01em',
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
                onMouseEnter={e => !loading && ((e.currentTarget as HTMLButtonElement).style.backgroundColor = '#1F2937')}
                onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = '#111827')}
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>Sign In <ArrowRight size={16} /></>
                )}
              </button>
            </form>

            {/* Separator */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px" style={{ backgroundColor: '#E5E7EB' }} />
              <span className="text-xs font-semibold" style={{ color: '#9CA3AF', letterSpacing: '0.08em' }}>
                OR SIGN IN WITH
              </span>
              <div className="flex-1 h-px" style={{ backgroundColor: '#E5E7EB' }} />
            </div>

            {/* Social buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{
                  border: '1.5px solid #D1D5DB',
                  backgroundColor: '#FFFFFF',
                  color: '#374151',
                  fontFamily: 'Inter, sans-serif',
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = '#F9FAFB')}
                onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = '#FFFFFF')}
              >
                <GoogleIcon /> Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{
                  border: '1.5px solid #D1D5DB',
                  backgroundColor: '#FFFFFF',
                  color: '#374151',
                  fontFamily: 'Inter, sans-serif',
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = '#F9FAFB')}
                onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = '#FFFFFF')}
              >
                <MicrosoftIcon /> Microsoft
              </button>
            </div>

            {/* Sign up link */}
            <p className="text-center text-sm mt-6" style={{ color: '#6B7280' }}>
              New to RSmartDB?{' '}
              <Link to="/signup" className="font-bold hover:underline" style={{ color: '#111827' }}>
                Create account
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
