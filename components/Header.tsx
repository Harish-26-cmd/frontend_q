
import React from 'react';
import { SunIcon, MoonIcon, UserIcon } from './icons';

type View = 'main' | 'about' | 'faq' | 'customerCare' | 'login' | 'signup';
type Theme = 'light' | 'dark';

interface HeaderProps {
    theme: Theme;
    onThemeToggle: () => void;
    isLoggedIn: boolean;
    onNavigate: (view: View, scrollToId?: string) => void;
    onOpenSidePanel: () => void;
    userRole?: 'customer' | 'admin' | null;
}

const Header: React.FC<HeaderProps> = ({ theme, onThemeToggle, isLoggedIn, onNavigate, onOpenSidePanel, userRole }) => {
  return (
    <header className="bg-foreground/80 dark:bg-card/80 backdrop-blur-lg p-4 shadow-md sticky top-0 z-50 border-b border-border-color">
      <div className="container mx-auto flex items-center justify-between">
        <button onClick={() => onNavigate(isLoggedIn ? 'main' : 'about')} className="text-2xl font-bold text-primary tracking-wider transition-transform hover:scale-105">
          Q-Free
        </button>
        <nav>
          <ul className="flex items-center gap-2 md:gap-4">
            <li>
                <button
                    onClick={onThemeToggle}
                    className="p-2 rounded-full text-text-secondary hover:text-primary hover:bg-background dark:hover:bg-foreground transition-colors duration-300"
                    aria-label="Toggle theme"
                >
                    {theme === 'light' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
                </button>
            </li>
            {userRole !== 'admin' && (
              <>
                <li>
                  <button 
                    onClick={() => onNavigate('about', 'about-us-section')}
                    className="font-semibold text-text-secondary hover:text-primary transition-colors duration-300 px-2">
                    About Us
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onNavigate('faq')}
                    className="font-semibold text-text-secondary hover:text-primary transition-colors duration-300 px-2">
                    FAQ's
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onNavigate('customerCare')}
                    className="font-semibold text-text-secondary hover:text-primary transition-colors duration-300 px-2">
                    Customer Care
                  </button>
                </li>
              </>
            )}

            {isLoggedIn ? (
                 <li>
                    <button 
                        onClick={onOpenSidePanel}
                        className="p-2 rounded-full text-text-secondary hover:text-primary hover:bg-background dark:hover:bg-foreground transition-colors duration-300"
                        aria-label="Open user profile"
                    >
                        <UserIcon className="h-6 w-6" />
                    </button>
                 </li>
            ) : (
                <>
                    <li>
                      <button 
                        onClick={() => onNavigate('login')}
                        className="font-semibold text-text-secondary hover:text-primary transition-colors duration-300 px-2">
                        Login
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => onNavigate('signup')}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 px-4 rounded-lg transition-colors duration-300 text-sm md:text-base">
                        Sign Up
                      </button>
                    </li>
                </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;