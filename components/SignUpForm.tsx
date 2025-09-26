import React, { useState } from 'react';
import type { User } from '../types';

interface SignUpFormProps {
    onLoginSuccess: (user: User) => void;
    onSwitchToLogin: () => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onLoginSuccess, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'admin'>('customer');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    
    // Simulate successful registration and automatic login
    const newUser: User = {
        id: role === 'admin' ? `adm${Date.now()}` : `u${Date.now()}`,
        name: name,
        points: role === 'admin' ? 9999 : 0,
        age: 0, // Placeholder, could be part of signup
        status: 'Active',
        photoUrl: `https://placehold.co/100x100/E2E8F0/475569?text=${name.split(' ').map(n => n[0]).join('').toUpperCase()}`,
        role: role,
    };
    onLoginSuccess(newUser);
  };
  
  const toggleRole = () => {
      setRole(currentRole => currentRole === 'customer' ? 'admin' : 'customer');
  }

  return (
     <div className="flex flex-col items-center justify-start pt-12">
        <div className="w-full max-w-md mx-auto bg-card rounded-2xl shadow-2xl p-8 border border-border-color">
            <h2 className="text-3xl font-bold text-center text-card-foreground mb-2">
                Create Account
            </h2>
            <p className="text-center text-text-secondary mb-8">
                to join Q-Free
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="signup-name" className="block text-sm font-medium text-text-secondary mb-1">Full Name</label>
                <input
                id="signup-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
                className="w-full bg-background dark:bg-foreground border border-border-color rounded-md p-2 text-text-primary placeholder:text-text-secondary/70 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="John Doe"
                />
            </div>
            <div>
                <label htmlFor="signup-email" className="block text-sm font-medium text-text-secondary mb-1">Email Address</label>
                <input
                id="signup-email"
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
                <label htmlFor="signup-password" className="block text-sm font-medium text-text-secondary mb-1">Password</label>
                <input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="w-full bg-background dark:bg-foreground border border-border-color rounded-md p-2 text-text-primary placeholder:text-text-secondary/70 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="••••••••"
                />
            </div>
            <div>
                <label htmlFor="signup-confirm-password" className="block text-sm font-medium text-text-secondary mb-1">Confirm Password</label>
                <input
                id="signup-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
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
                    {role === 'customer' ? "Admin? Sign up here" : "Customer? Sign up here"}
                </button>
            </div>
            
            <button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2.5 px-4 rounded-lg transition-colors duration-300"
            >
                {role === 'customer' ? 'Create Account' : 'Create Admin Account'}
            </button>
             <p className="text-center text-sm text-text-secondary pt-4">
                Already have an account?{' '}
                <button
                    type="button"
                    onClick={onSwitchToLogin}
                    className="font-semibold text-primary hover:underline"
                >
                    Login
                </button>
            </p>
            </form>
        </div>
    </div>
  );
};

export default SignUpForm;