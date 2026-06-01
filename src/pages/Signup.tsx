import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/lib/supabase';
const rsmartLogo = '/rsmart-logo.png';

const schema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  mobile: z.string().min(10, 'Mobile must be at least 10 digits'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

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

// Reusable styled input
function FormInput({
  id,
  icon: Icon,
  rightIcon,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  icon?: React.ComponentType<{ size?: number; style?: React.CSSProperties; className?: string }>;
  rightIcon?: React.ReactNode;
}) {
  return (
    <div className="relative">
      {Icon && <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#9CA3AF' }} />}
      <input
        id={id}
        {...props}
        className="w-full py-2.5 rounded-lg text-sm transition-all outline-none"
        style={{
          paddingLeft: Icon ? '2.25rem' : '0.75rem',
          paddingRight: rightIcon ? '2.5rem' : '0.75rem',
          border: '1.5px solid #D1D5DB',
          backgroundColor: '#FFFFFF',
          color: '#111827',
          fontFamily: 'Inter, sans-serif',
          ...(props.style || {}),
        }}
        onFocus={e => (e.target.style.borderColor = '#6C3DFF')}
        onBlur={e => (e.target.style.borderColor = '#D1D5DB')}
      />
      {rightIcon && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {rightIcon}
        </div>
      )}
    </div>
  );
}

export default function Signup() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [signedUp, setSignedUp] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setAuthError('');
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
          phone: data.mobile,
        },
      },
    });
    setLoading(false);
    if (error) {
      setAuthError(error.message);
      return;
    }
    setSignedUp(true);
  };

  const labelStyle: React.CSSProperties = {
    color: '#6B7280',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    fontSize: '0.7rem',
    fontWeight: 600,
    display: 'block',
    marginBottom: '0.375rem',
  };

  // ── Success screen after registration ──
  if (signedUp) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#F1F3F6' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-md"
        >
          <div className="rounded-2xl overflow-hidden text-center px-8 py-10"
            style={{ backgroundColor: '#fff', boxShadow: '0 4px 32px rgba(0,0,0,0.10)' }}>
            <div style={{ height: 5, background: 'linear-gradient(90deg,#6C3DFF,#A855F7,#EC4899,#F97316)', margin: '-2.5rem -2rem 2rem' }} />
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: '#f0fdf4' }}>
              <CheckCircle2 size={28} style={{ color: '#16a34a' }} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Account Created!</h2>
            <p className="text-sm text-gray-500 mb-6">
              We've sent a confirmation link to your email. Please verify your account before signing in.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white"
              style={{ background: 'linear-gradient(135deg,#6C3DFF,#a855f7)' }}
            >
              Go to Sign In
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#F1F3F6' }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-lg"
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
              Create an account
            </h1>
            <p className="text-sm mb-6" style={{ color: '#6B7280' }}>
              Access the Admission Intelligence Platform.
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
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" style={labelStyle}>Full Name</label>
                <FormInput id="fullName" icon={User} autoComplete="off" placeholder="Alex Mercer" {...register('fullName')} />
                {errors.fullName && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.fullName.message}</p>}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="signup-email" style={labelStyle}>Email Address</label>
                <FormInput id="signup-email" icon={Mail} type="email" autoComplete="off" placeholder="enter your mail id" {...register('email')} />
                {errors.email && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.email.message}</p>}
              </div>

              {/* Mobile */}
              <div>
                <label htmlFor="mobile" style={labelStyle}>Mobile</label>
                <FormInput id="mobile" icon={Phone} autoComplete="off" placeholder="9876543210" {...register('mobile')} />
                {errors.mobile && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.mobile.message}</p>}
              </div>

              {/* Password + Confirm */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="signup-password" style={labelStyle}>Password</label>
                  <FormInput
                    id="signup-password"
                    icon={Lock}
                    type={showPass ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="min 8 chars"
                    {...register('password')}
                    rightIcon={
                      <button type="button" onClick={() => setShowPass(!showPass)} style={{ color: '#9CA3AF' }}>
                        {showPass ? <Eye size={15} /> : <EyeOff size={15} />}
                      </button>
                    }
                  />
                  {errors.password && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.password.message}</p>}
                </div>
                <div>
                  <label htmlFor="confirm-password" style={labelStyle}>Confirm</label>
                  <FormInput
                    id="confirm-password"
                    icon={Lock}
                    type={showConfirm ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="repeat password"
                    {...register('confirmPassword')}
                    rightIcon={
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ color: '#9CA3AF' }}>
                        {showConfirm ? <Eye size={15} /> : <EyeOff size={15} />}
                      </button>
                    }
                  />
                  {errors.confirmPassword && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.confirmPassword.message}</p>}
                </div>
              </div>

              {/* Submit */}
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
                  <>Sign Up <ArrowRight size={16} /></>
                )}
              </button>
            </form>

            {/* Separator */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px" style={{ backgroundColor: '#E5E7EB' }} />
              <span className="text-xs font-semibold" style={{ color: '#9CA3AF', letterSpacing: '0.08em' }}>
                OR CONTINUE WITH
              </span>
              <div className="flex-1 h-px" style={{ backgroundColor: '#E5E7EB' }} />
            </div>

            {/* Social buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{ border: '1.5px solid #D1D5DB', backgroundColor: '#FFFFFF', color: '#374151', fontFamily: 'Inter, sans-serif' }}
                onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = '#F9FAFB')}
                onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = '#FFFFFF')}
              >
                <GoogleIcon /> Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{ border: '1.5px solid #D1D5DB', backgroundColor: '#FFFFFF', color: '#374151', fontFamily: 'Inter, sans-serif' }}
                onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = '#F9FAFB')}
                onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = '#FFFFFF')}
              >
                <MicrosoftIcon /> Microsoft
              </button>
            </div>

            {/* Sign in link */}
            <p className="text-center text-sm mt-6" style={{ color: '#6B7280' }}>
              Already have an account?{' '}
              <Link to="/login" className="font-bold hover:underline" style={{ color: '#111827' }}>
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
