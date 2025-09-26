import React, { useState } from 'react';
import type { User } from '../types';

interface LoginFormProps {
  onLoginSuccess: (user: User) => void;
  onSwitchToSignUp: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess, onSwitchToSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'admin'>('customer');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd handle authentication here
    console.log('Logging in as', role, 'with:', { email, password });
    
    // Simulate a successful login and fetching user data
    const mockUser: User = {
      id: role === 'admin' ? 'adm1' : 'u1',
      name: role === 'admin' ? 'Admin User' : 'Demo Customer',
      points: role === 'admin' ? 9999 : 150,
      age: 30,
      status: 'Active',
      photoUrl: `https://placehold.co/100x100/E2E8F0/475569?text=${role === 'admin' ? 'AU' : 'DC'}`,
      role: role,
    };
    onLoginSuccess(mockUser);
  };
  
  const toggleRole = () => {
      setRole(currentRole => currentRole === 'customer' ? 'admin' : 'customer');
  }

  return (
    <div className="flex flex-col items-center justify-start pt-12">
        <div className="w-full max-w-md mx-auto bg-card rounded-2xl shadow-2xl p-8 border border-border-color">
            <h2 className="text-3xl font-bold text-center text-card-foreground mb-2">
                Login
            </h2>
            <p className="text-center text-text-secondary mb-8">
                to your Q-Free Account
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="login-email" className="block text-sm font-medium text-text-secondary mb-1">Email Address</label>
                <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full bg-background dark:bg-foreground border border-border-color rounded-md p-2 text-text-primary placeholder:text-text-secondary/70 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="you@example.com"
                />
            </div>
            <div>
                <label htmlFor="login-password" className="block text-sm font-medium text-text-secondary mb-1">Password</label>
                <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full bg-background dark:bg-foreground border border-border-color rounded-md p-2 text-text-primary placeholder:text-text-secondary/70 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="••••••••"
                />
            </div>
            
            <div className="text-right">
                <button
                    type="button"
                    onClick={toggleRole}
                    className="text-sm text-primary hover:underline focus:outline-none"
                >
                    {role === 'customer' ? "Admin? Login here" : "Customer? Login here"}
                </button>
            </div>

            <button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2.5 px-4 rounded-lg transition-colors duration-300"
            >
                {role === 'customer' ? 'Login' : 'Login as Admin'}
            </button>

            <p className="text-center text-sm text-text-secondary pt-4">
                Don't have an account?{' '}
                <button
                type="button"
                onClick={onSwitchToSignUp}
                className="font-semibold text-primary hover:underline"
                >
                Sign up
                </button>
            </p>
            </form>
        </div>
    </div>
  );
};

export default LoginForm;