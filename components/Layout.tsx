import React from 'react';
import { KredMitraIcon } from './icons/KredMitraIcon';

interface LayoutProps {
  children: React.ReactNode;
  isAuthenticated?: boolean;
  onLogout?: () => void;
  onSignUpClick?: () => void;
  isAdmin?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, isAuthenticated, onLogout, onSignUpClick, isAdmin }) => {
  const bgColor = isAdmin ? 'bg-slate-900' : 'bg-slate-50';
  const textColor = isAdmin ? 'text-slate-300' : 'text-slate-600';
  const headerBg = isAdmin ? 'bg-slate-800/80 border-slate-700/80' : 'bg-white/80 border-slate-200/80';
  const headerText = isAdmin ? 'text-slate-100' : 'text-slate-800';

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${bgColor} ${textColor}`}>
      <header className={`sticky top-0 z-40 backdrop-blur-lg border-b ${headerBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <KredMitraIcon className="h-10 w-auto" />
              <h1 className={`text-2xl font-bold tracking-tight ${headerText}`}>
                {isAdmin ? 'KREDmitra Admin' : 'KredMitra'}
              </h1>
            </div>
            <div>
              {isAuthenticated ? (
                <button 
                  onClick={onLogout}
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              ) : (
                <button 
                  onClick={onSignUpClick}
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 transition-colors"
                >
                  Sign Up
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
