import { useState } from 'react';
import LoginModal from '../components/LoginModal';
import RegisterModal from '../components/RegisterModal';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import Footer from '../components/Footer';

interface LandingPageProps {
  onLoginSuccess: () => void;
}

const LandingPage = ({ onLoginSuccess }: LandingPageProps) => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleLoginSuccess = () => {
    setShowLogin(false);
    onLoginSuccess();
  };

  const handleRegisterSuccess = () => {
    setShowRegister(false);
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar 
        onLoginClick={() => setShowLogin(true)}
        onRegisterClick={() => setShowRegister(true)}
      />
      
      <HeroSection 
        onGetStartedClick={() => setShowRegister(true)}
      />
      
      <FeaturesSection />
      
      <Footer />

      {/* Modals */}
      <LoginModal 
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSwitchToRegister={() => {
          setShowLogin(false);
          setShowRegister(true);
        }}
        onLoginSuccess={handleLoginSuccess}
      />
      
      <RegisterModal 
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        onSwitchToLogin={() => {
          setShowRegister(false);
          setShowLogin(true);
        }}
        onRegisterSuccess={handleRegisterSuccess}
      />
    </div>
  );
};

export default LandingPage; 