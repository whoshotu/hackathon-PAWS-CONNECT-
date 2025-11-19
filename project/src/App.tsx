import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/Auth/LoginForm';
import { SignUpForm } from './components/Auth/SignUpForm';
import { ForgotPasswordForm } from './components/Auth/ForgotPasswordForm';
import { Header } from './components/Layout/Header';
import { Feed } from './components/Feed/Feed';
import { ServiceFinder } from './components/Services/ServiceFinder';
import { Community } from './components/Community/Community';
import { PetsManager } from './components/Pets/PetsManager';
import { ProfileSettings } from './components/Profile/ProfileSettings';
import { Settings } from './components/Settings/Settings';
import { Loader2, PawPrint } from 'lucide-react';

function AuthScreen() {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {mode === 'login' && (
          <LoginForm
            onToggleForm={() => setMode('signup')}
            onForgotPassword={() => setMode('forgot')}
          />
        )}
        {mode === 'signup' && (
          <SignUpForm onToggleForm={() => setMode('login')} />
        )}
        {mode === 'forgot' && (
          <ForgotPasswordForm onBack={() => setMode('login')} />
        )}
      </div>
    </div>
  );
}

function Dashboard() {
  const [activeTab, setActiveTab] = useState('feed');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'feed' && <Feed />}
        {activeTab === 'services' && <ServiceFinder />}
        {activeTab === 'community' && <Community />}
        {activeTab === 'pets' && <PetsManager />}
        {activeTab === 'profile' && <ProfileSettings />}
        {activeTab === 'settings' && <Settings />}
      </main>

      <footer className="mt-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <PawPrint className="w-6 h-6 text-blue-600" />
              <span className="font-bold text-gray-900">Pawz-Connect</span>
            </div>
            <p className="text-sm text-gray-600">
              © 2025 Pawz-Connect. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading Pawz-Connect...</p>
        </div>
      </div>
    );
  }

  return user ? <Dashboard /> : <AuthScreen />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
