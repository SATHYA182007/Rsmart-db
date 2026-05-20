import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, GraduationCap, Sparkles, Building, LayoutDashboard } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      console.log('Login Data:', data);
      navigate('/');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Side Panel - Same as Signup for consistency */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary-gradientStart to-primary-gradientEnd p-12 flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 text-white mb-16"
          >
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <GraduationCap size={32} className="text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">RSmart Admin</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white space-y-6 max-w-md"
          >
            <h1 className="text-5xl font-bold leading-tight">
              Welcome Back to <br/> RSmart.
            </h1>
            <p className="text-blue-100 text-lg leading-relaxed">
              Log in to continue managing admissions, reviewing evaluations, and accessing analytics.
            </p>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="grid grid-cols-2 gap-6 relative z-10 mt-12"
        >
          {[
            { icon: LayoutDashboard, title: "Smart Dashboard", desc: "Real-time analytics" },
            { icon: Sparkles, title: "AI Evaluation", desc: "Automated insights" },
            { icon: Building, title: "Multi-branch", desc: "Enterprise scalable" }
          ].map((feature, i) => (
            <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
              <div className="p-2 bg-white/20 rounded-lg">
                <feature.icon className="text-white" size={20} />
              </div>
              <div>
                <h3 className="text-white font-medium">{feature.title}</h3>
                <p className="text-blue-100 text-sm">{feature.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl mix-blend-overlay"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/4 w-[500px] h-[500px] bg-blue-400/30 rounded-full blur-3xl mix-blend-overlay"></div>
      </div>

      {/* Right Side Form */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-12 lg:p-16 relative">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md bg-white rounded-3xl shadow-premium p-8 border border-border"
        >
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-text-primary mb-2">Login to your account</h2>
            <p className="text-text-secondary">Enter your credentials to access the dashboard.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="john@college.edu" {...register('email')} />
              {errors.email && <p className="text-danger text-sm">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5 relative">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="••••••••" 
                  {...register('password')} 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-danger text-sm">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="rememberMe" 
                  className="rounded border-border text-primary focus:ring-primary w-4 h-4"
                  {...register('rememberMe')}
                />
                <label htmlFor="rememberMe" className="text-sm font-medium leading-none text-text-secondary">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm font-medium text-primary hover:underline">
                Forgot password?
              </a>
            </div>

            <Button type="submit" className="w-full mt-2" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Login'}
            </Button>
          </form>

          <div className="mt-8 flex items-center justify-center space-x-4">
            <div className="flex-1 border-t border-border"></div>
            <span className="text-sm text-text-secondary">Or continue with</span>
            <div className="flex-1 border-t border-border"></div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <Button variant="outline" className="w-full flex items-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </Button>
            <Button variant="outline" className="w-full flex items-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 21 21">
                <path d="M10 0H0v10h10V0z" fill="#f25022"/><path d="M21 0H11v10h10V0z" fill="#7fba00"/><path d="M10 11H0v10h10V-11z" fill="#00a4ef"/><path d="M21 11H11v10h10V-11z" fill="#ffb900"/>
              </svg>
              Microsoft
            </Button>
          </div>

          <p className="mt-8 text-center text-sm text-text-secondary">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
