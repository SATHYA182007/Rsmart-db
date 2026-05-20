import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Sparkles, ArrowRight, Mail, Lock, User, Phone } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  mobile: z.string().min(10, 'Mobile must be at least 10 digits'),
  role: z.enum(['Admission Admin', 'Reviewer', 'Staff']),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

export default function Signup() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'Admission Admin' },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-white rounded-2xl border border-border shadow-premium p-8 md:p-10 flex flex-col md:flex-row gap-8"
      >
        <div className="flex-1 space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
              <Sparkles size={16} />
            </div>
            <span className="font-bold text-text-primary text-lg">RSmartDB</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Create an account</h1>
            <p className="text-sm text-text-secondary mt-1">Access the Admission Intelligence Platform</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase mb-1">Full Name</label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-3.5 text-text-secondary" />
                <input {...register('fullName')} placeholder="Alex Mercer" className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              {errors.fullName && <p className="text-danger text-xs mt-1">{errors.fullName.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase mb-1">Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-3.5 text-text-secondary" />
                <input {...register('email')} type="email" placeholder="alex@college.edu" className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              {errors.email && <p className="text-danger text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase mb-1">Mobile</label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3 top-3.5 text-text-secondary" />
                  <input {...register('mobile')} placeholder="9876543210" className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                {errors.mobile && <p className="text-danger text-xs mt-1">{errors.mobile.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase mb-1">Role</label>
                <select {...register('role')} className="w-full px-3 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="Admission Admin">Admission Admin</option>
                  <option value="Reviewer">Reviewer</option>
                  <option value="Staff">Staff</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase mb-1">Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-3.5 text-text-secondary" />
                  <input {...register('password')} type={showPass ? 'text' : 'password'} className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3.5 text-text-secondary hover:text-text-primary">
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.password && <p className="text-danger text-xs mt-1">{errors.password.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase mb-1">Confirm</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-3.5 text-text-secondary" />
                  <input {...register('confirmPassword')} type={showConfirm ? 'text' : 'password'} className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-3.5 text-text-secondary hover:text-text-primary">
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-danger text-xs mt-1">{errors.confirmPassword.message}</p>}
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-blue-600 transition flex items-center justify-center gap-2 mt-4">
              {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <>Sign Up <ArrowRight size={16} /></>}
            </button>
          </form>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold text-text-secondary bg-white px-2">Or continue with</div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button className="py-2 border border-border rounded-xl text-xs font-semibold hover:bg-background transition">Google</button>
            <button className="py-2 border border-border rounded-xl text-xs font-semibold hover:bg-background transition">Microsoft</button>
          </div>
          <p className="text-center text-xs text-text-secondary mt-4">
            Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Sign In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
