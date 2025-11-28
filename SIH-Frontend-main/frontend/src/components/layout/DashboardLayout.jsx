import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@context/AuthContext';
import { useTheme } from '@context/ThemeContext';
import { useLanguage } from '@context/LanguageContext';
import { Button } from '../ui/button';
import { LogOut, Bell, Settings, Menu, X } from 'lucide-react';
import ThemeLanguageSelector from '@components/shared/ThemeLanguageSelector';
import AnimatedBackground from '@components/shared/AnimatedBackground';
import SensEaseLogo from '@components/shared/SensEaseLogo';
import ProfileDropdown from '@components/shared/ProfileDropdown';

const DashboardLayout = ({ children, sidebarContent }) => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const { t, isRTL } = useLanguage();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const navRef = useRef(null);

  const handleLogout = () => {
    logout();
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('goodMorning');
    if (hour < 17) return t('goodAfternoon');
    return t('goodEvening');
  };

  useEffect(() => {
    if (drawerOpen) {
      // When drawer opens, move focus into the nav (close button or first focusable)
      const navEl = navRef.current;
      const closeBtn = navEl?.querySelector('button[aria-label="Close menu"]');
      if (closeBtn && typeof closeBtn.focus === 'function') {
        closeBtn.focus();
      } else {
        const firstFocusable = navEl?.querySelector('a,button,input,select,textarea,[tabindex]:not([tabindex="-1"])');
        if (firstFocusable && typeof firstFocusable.focus === 'function') firstFocusable.focus();
      }
    } else {
      // When drawer closes, return focus to the menu button
      if (menuButtonRef.current && typeof menuButtonRef.current.focus === 'function') {
        menuButtonRef.current.focus();
      }
    }
  }, [drawerOpen]);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.colors.background} relative ${isRTL ? 'rtl' : 'ltr'}`}>
      <AnimatedBackground theme={theme} />
      
      {/* Enhanced Header (static on top - not sticky) */}
      <header className={`${theme.colors.card} border-b border-gray-200/50 px-6 py-4 backdrop-blur-md shadow-lg`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Mobile/iPad hamburger */}
            <button
              aria-label="Open menu"
              onClick={() => setDrawerOpen(true)}
              className="xl:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring"
              ref={menuButtonRef}
            >
              <Menu className="w-6 h-6" />
            </button>
            <SensEaseLogo 
              className="w-12 h-12" 
              showText={false}
              showSubtitle={false}
              textClassName="flex flex-col"
            />
            <div className="hidden xl:block">
              <p className={`text-sm ${theme.colors.muted} capitalize`}>
                {getGreeting()}, {user?.name?.split(' ')[0]}! 👋
              </p>
              <p className={`text-xs ${theme.colors.muted} opacity-75`}>
                {t(user?.role)} {t('dashboard')}
              </p>
            </div>
          </div>
          
            <div className="flex items-center space-x-4">
            <ThemeLanguageSelector />

            {/* Profile Dropdown (contains logout) - visible for all authenticated roles */}
            {user && <ProfileDropdown />}
          </div>
        </div>
      </header>

      <div className="flex relative z-10">
        {/* Enhanced Sidebar */}
        {sidebarContent && (
          <aside className={`hidden xl:block w-72 ${theme.colors.card} border-r border-gray-200/50 min-h-[calc(100vh-89px)] p-6 backdrop-blur-md shadow-lg`}>
            <div className="space-y-2">
              {sidebarContent}
            </div>

          </aside>
        )}

        {/* Mobile Drawer (slide-in) */}
        {sidebarContent && (
          <div
            className={`xl:hidden fixed inset-0 z-50 transition-opacity ${drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            inert={!drawerOpen}
          >
            <div className="absolute inset-0 bg-black/40" onClick={() => setDrawerOpen(false)} />
            <nav
              className={`absolute left-0 top-0 bottom-0 w-72 max-w-[85%] bg-white dark:bg-gray-900 p-5 shadow-xl transform transition-transform ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}
              ref={navRef}
              onClick={(e) => {
                const target = e.target;
                if (target && (target.closest('a') || target.closest('button'))) {
                  setDrawerOpen(false);
                }
              }}
            >
                <div className="flex items-center justify-between mb-4">
                <SensEaseLogo className="w-10 h-10" showText={false} />
                <button aria-label="Close menu" onClick={() => setDrawerOpen(false)} className="p-2 rounded-md hover:bg-gray-100" ref={el => {
                  // Prefer assigning ref to close button when nav mounts
                  if (el && drawerOpen) {
                    // focus will be handled in effect
                  }
                }}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3">
                {sidebarContent}
              </div>
            </nav>
          </div>
        )}
        
        {/* Main Content */}
        <main className={`flex-1 p-6 ${sidebarContent ? '' : 'max-w-full'} min-h-[calc(100vh-89px)] overflow-auto`}>
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;