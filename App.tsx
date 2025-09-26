
import React, { useState, useCallback, useEffect, useRef } from 'react';
import Dashboard from './components/Dashboard';
import QueueView from './components/QueueView';
import Header from './components/Header';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import AboutUs from './components/AboutUs';
import FAQ from './components/FAQ';
import CustomerCare from './components/CustomerCare';
import SidePanel from './components/SidePanel';
import ServiceSelection from './components/ServiceSelection';
import LocationSelection from './components/LocationSelection';
import AdminSidebar from './components/AdminSidebar';
import DepartmentSelection from './components/DepartmentSelection';
import StaffManagement from './components/StaffManagement';
import QueueManagement from './components/QueueManagement';
import ServiceManagement from './components/ServiceManagement';
import type { User, ServiceCategory } from './types';
import { addPersonToQueue, removePersonFromQueue } from './services/queueService';

type View = 'main' | 'about' | 'faq' | 'customerCare' | 'login' | 'signup';
type AdminView = 'dashboard' | 'staffManagement' | 'queueManagement' | 'serviceManagement';
type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const [view, setView] = useState<View>('about');
  const [adminView, setAdminView] = useState<AdminView>('dashboard');
  const [scrollTo, setScrollTo] = useState<string | null>(null);
  const [selectedQueueId, setSelectedQueueId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<Theme>(() => 
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [serviceCategory, setServiceCategory] = useState<ServiceCategory | null>(null);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  
  const mainContentRef = useRef<HTMLElement>(null);

  useEffect(() => {
      const root = window.document.documentElement;
      root.classList.remove(theme === 'dark' ? 'light' : 'dark');
      root.classList.add(theme);
  }, [theme]);

  // Effect to listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
        setTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  const resetCustomerFlow = useCallback(() => {
      setServiceCategory(null);
      setSelectedLocationId(null);
      setSelectedQueueId(null);
  }, []);
  
  const resetAdminFlow = useCallback(() => {
      setServiceCategory(null);
      setSelectedLocationId(null);
      setSelectedQueueId(null);
      setAdminView('dashboard');
  }, []);

  // This effect handles scrolling AFTER a view transition completes.
  useEffect(() => {
    if (scrollTo) {
      // The animation is 500ms, so we wait for a moment for the DOM to be ready.
      const timer = setTimeout(() => {
        const element = document.getElementById(scrollTo);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
        // Reset the scroll state so it doesn't re-trigger
        setScrollTo(null);
      }, 100); 
      
      return () => clearTimeout(timer);
    }
  }, [scrollTo]);

  const handleThemeToggle = useCallback(() => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  }, []);

  const handleViewQueue = useCallback((queueId: string) => {
    setSelectedQueueId(queueId);
  }, []);

  const handleBackToDashboard = useCallback(() => {
    setSelectedQueueId(null);
  }, []);
  
  const handleNavigate = useCallback((targetView: View, scrollToId?: string) => {
    // If we are already on the target page and just want to scroll
    if (view === targetView && scrollToId) {
        const element = document.getElementById(scrollToId);
        element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
    }

    if (targetView === 'main') {
       if(user?.role === 'customer') resetCustomerFlow();
       if(user?.role === 'admin') resetAdminFlow();
    }
    setView(targetView);
    setSelectedQueueId(null);
    if (scrollToId) {
        setScrollTo(scrollToId);
    }
  }, [user, view, resetCustomerFlow, resetAdminFlow]);

  const handleLoginSuccess = useCallback((loggedInUser: User) => {
    setUser({ ...loggedInUser, currentQueueId: null, currentQueueName: null });
    setView('main'); // Go to main flow after login
    if (loggedInUser.role === 'customer') {
      resetCustomerFlow();
    } else {
      resetAdminFlow();
    }
  }, [resetCustomerFlow, resetAdminFlow]);

  const handleLogout = useCallback(() => {
    setUser(null);
    setView('about'); // Go to landing page after logout
    resetCustomerFlow();
    resetAdminFlow();
    setIsSidePanelOpen(false);
  }, [resetCustomerFlow, resetAdminFlow]);

  const handleOpenSidePanel = useCallback(() => {
    setIsSidePanelOpen(true);
  }, []);

  const handleCloseSidePanel = useCallback(() => {
    setIsSidePanelOpen(false);
  }, []);

  const handleSelectService = useCallback((category: ServiceCategory) => {
    setServiceCategory(category);
  }, []);

  const handleSelectLocation = useCallback((locationId: string) => {
    setSelectedLocationId(locationId);
    setAdminView('dashboard');
  }, []);
  
  const handleBackToServiceSelection = useCallback(() => {
    setServiceCategory(null);
    setSelectedLocationId(null);
  }, []);
  
  const handleBackToLocationSelection = useCallback(() => {
    setSelectedLocationId(null);
     setAdminView('dashboard');
  }, []);
  
  const handleAdminNavigate = useCallback((view: AdminView) => {
      setSelectedQueueId(null); // Deselect queue when switching main view
      setAdminView(view);
  }, []);

  const handleJoinQueue = useCallback(async (queueId: string, queueName: string) => {
    if (!user) return;
    const result = await addPersonToQueue(queueId, user.name, user.id);
    if (result && 'error' in result) {
      alert(result.error);
    } else {
      setUser(prevUser => prevUser ? { ...prevUser, currentQueueId: queueId, currentQueueName: queueName } : null);
    }
  }, [user]);

  const handleLeaveQueue = useCallback(async (queueId: string) => {
    if (!user) return;
    await removePersonFromQueue(queueId, user.id);
    setUser(prevUser => prevUser ? { ...prevUser, currentQueueId: null, currentQueueName: null } : null);
  }, [user]);

  const renderContent = () => {
      // Admin View
      if (user?.role === 'admin') {
          if (serviceCategory && selectedLocationId) {
             const mainContent = () => {
                switch(adminView) {
                    case 'staffManagement':
                        return <StaffManagement locationId={selectedLocationId} onBack={handleBackToLocationSelection} />;
                    case 'queueManagement':
                        return <QueueManagement locationId={selectedLocationId} onBack={handleBackToLocationSelection} />;
                    case 'serviceManagement':
                        return <ServiceManagement locationId={selectedLocationId} onBack={handleBackToLocationSelection} />;
                    case 'dashboard':
                    default:
                         return selectedQueueId ? 
                                <QueueView queueId={selectedQueueId} onBack={handleBackToDashboard} user={user} onJoinQueue={handleJoinQueue} onLeaveQueue={handleLeaveQueue} />
                                :
                                <Dashboard user={user} onViewQueue={handleViewQueue} locationId={selectedLocationId} onBack={handleBackToLocationSelection} onJoinQueue={handleJoinQueue} />;
                }
             };

             return (
                <div className="flex flex-col h-screen bg-foreground dark:bg-background">
                    <Header 
                        theme={theme}
                        onThemeToggle={handleThemeToggle}
                        isLoggedIn={!!user}
                        onNavigate={handleNavigate}
                        onOpenSidePanel={handleOpenSidePanel}
                        userRole={user.role}
                    />
                    <div className="flex flex-1 overflow-hidden">
                        <AdminSidebar onNavigateAdminView={handleAdminNavigate} currentAdminView={adminView} />
                        <main className="flex-1 overflow-y-auto p-6 bg-background dark:bg-foreground">
                           <div key={adminView} className="animate-slide-down-fade-in">
                                {mainContent()}
                           </div>
                        </main>
                    </div>
                     <SidePanel 
                        isOpen={isSidePanelOpen} 
                        onClose={handleCloseSidePanel}
                        onLogout={handleLogout}
                        user={user}
                    />
                </div>
              );
          }

          const selectionContent = !serviceCategory ? (
            <ServiceSelection onSelectService={handleSelectService} userName={user.name.split(' ')[0]} userRole={user.role} />
          ) : (
             <DepartmentSelection 
                category={serviceCategory} 
                onSelectLocation={handleSelectLocation}
                onBack={handleBackToServiceSelection} 
             />
          );

          return (
             <div className="min-h-screen">
                <Header 
                    theme={theme}
                    onThemeToggle={handleThemeToggle}
                    isLoggedIn={!!user}
                    onNavigate={handleNavigate}
                    onOpenSidePanel={handleOpenSidePanel}
                    userRole={user.role}
                />
                <main className="container mx-auto p-4 md:p-8 relative z-10">
                    <div key={serviceCategory || 'service'} className="animate-slide-down-fade-in">
                        {selectionContent}
                    </div>
                </main>
                <SidePanel 
                    isOpen={isSidePanelOpen} 
                    onClose={handleCloseSidePanel}
                    onLogout={handleLogout}
                    user={user}
                />
            </div>
          );
      }

    // Public and Customer View
    const pageKey = selectedQueueId ? `${view}-${selectedQueueId}` : view;
    const isOverlayOpen = isSidePanelOpen;

    const pageContent = (() => {
        // Highest priority: view a specific queue
        if (user && selectedQueueId) {
          return <QueueView queueId={selectedQueueId} onBack={handleBackToDashboard} user={user} onJoinQueue={handleJoinQueue} onLeaveQueue={handleLeaveQueue} />;
        }
        
        switch (view) {
            case 'login':
                return <LoginForm onLoginSuccess={handleLoginSuccess} onSwitchToSignUp={() => setView('signup')} />;
            case 'signup':
                return <SignUpForm onLoginSuccess={handleLoginSuccess} onSwitchToLogin={() => setView('login')} />;
            case 'about':
                return <AboutUs onGetStarted={!user ? () => setView('login') : undefined} />;
            case 'faq':
                return <FAQ onBack={() => handleNavigate('about')} />;
            case 'customerCare':
                return <CustomerCare onBack={() => handleNavigate('about')} />;
            case 'main':
                if (!user) {
                    // A logged out user on 'main' view should see the landing page.
                    return <AboutUs onGetStarted={() => setView('login')} />;
                }
            
                if (user.role === 'customer') {
                    if (!serviceCategory) {
                        return <ServiceSelection onSelectService={handleSelectService} userName={user.name.split(' ')[0]} userRole={user.role} />;
                    }
                    if (!selectedLocationId) {
                        return <LocationSelection 
                                category={serviceCategory} 
                                onSelectLocation={handleSelectLocation}
                                onBack={handleBackToServiceSelection} 
                             />;
                    }
                    return <Dashboard user={user} onViewQueue={handleViewQueue} locationId={selectedLocationId} onBack={handleBackToLocationSelection} onJoinQueue={handleJoinQueue} />;
                }
                break;
        }

        // Fallback to about page
        return <AboutUs onGetStarted={!user ? () => setView('login') : undefined} />;
    })();
    
    return (
        <div className="min-h-screen flex flex-col">
             <Header 
                theme={theme}
                onThemeToggle={handleThemeToggle}
                isLoggedIn={!!user}
                onNavigate={handleNavigate}
                onOpenSidePanel={handleOpenSidePanel}
                userRole={user?.role}
              />
              <main ref={mainContentRef} className="container mx-auto p-4 md:p-8 relative z-10 flex-grow" aria-hidden={isOverlayOpen}>
                <div key={pageKey} className="animate-slide-down-fade-in">
                  {pageContent}
                </div>
              </main>
              
              {user && (
                <SidePanel 
                  isOpen={isSidePanelOpen} 
                  onClose={handleCloseSidePanel}
                  onLogout={handleLogout}
                  user={user}
                />
              )}
              
              <footer className="text-center p-4 text-text-secondary text-sm relative z-10" aria-hidden={isOverlayOpen}>
                 <p>&copy; {new Date().getFullYear()} Q-Free. All rights reserved.</p>
              </footer>
        </div>
    );
  }
  
  return renderContent();
};

export default App;