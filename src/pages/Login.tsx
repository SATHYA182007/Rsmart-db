import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Sparkles, ArrowRight, Mail, Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

export default function Login() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl border border-border shadow-premium p-8 flex flex-col gap-6"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
            <Sparkles size={16} />
          </div>
          <span className="font-bold text-text-primary text-lg">RSmartDB</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Welcome back</h1>
          <p className="text-sm text-text-secondary mt-1">Sign in to manage admissions</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase mb-1">Email Address</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-3.5 text-text-secondary" />
              <input {...register('email')} type="email" placeholder="alex@college.edu" className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            {errors.email && <p className="text-danger text-xs mt-1">{errors.email.message}</p>}
          </div>
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
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input type="checkbox" {...register('rememberMe')} className="rounded border-border text-primary focus:ring-primary/20" />
              <span className="text-text-secondary">Remember me</span>
            </label>
            <a href="#" className="text-primary font-semibold hover:underline">Forgot password?</a>
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-blue-600 transition flex items-center justify-center gap-2 mt-2">
            {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <>Sign In <ArrowRight size={16} /></>}
          </button>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold text-text-secondary bg-white px-2">Or sign in with</div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button className="py-2.5 border border-border rounded-xl text-xs font-semibold hover:bg-background transition">Google</button>
          <button className="py-2.5 border border-border rounded-xl text-xs font-semibold hover:bg-background transition">Microsoft</button>
        </div>
        <p className="text-center text-xs text-text-secondary mt-2">
          New to RSmartDB? <Link to="/signup" className="text-primary font-semibold hover:underline">Create account</Link>
        </p>
      </motion.div>
    </div>
  );
}
