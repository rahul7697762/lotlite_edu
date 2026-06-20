import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './components/layout/Navbar';
import HomeView from './components/HomeView';
import AcademicHub from './components/sections/AcademicHub';
import Footer from './components/layout/Footer';
import StickyBottomBar from './components/layout/StickyBottomBar';
import BlogArticlePage from './components/sections/BlogArticlePage';
import Chatbot from './components/ui/Chatbot';
import InternshipPopup from './components/ui/InternshipPopup';
import AdvisorPopup from './components/ui/AdvisorPopup';
import ApplyNowPopup from './components/ui/ApplyNowPopup';
import DownloadBrochureModal from './components/auth/DownloadBrochureModal';
import DesktopSideMenu from './components/layout/DesktopSideMenu';
import TermsOfUse from './components/sections/TermsOfUse';
import PrivacyPolicy from './components/sections/PrivacyPolicy';
import SEOInjector from './components/SEOInjector';
import { useApp } from './AppContext';

// Extend Window interface for AOS
declare global {
  interface Window {
    AOS: any;
  }
}

export default function App() {
  const {
    isMenuOpen,
    isInternshipOpen,
    isAdvisorPopupOpen,
    isApplyPopupOpen,
    toastMessage,
    setInternshipPanelOpen,
    setAdvisorPopupOpen,
    setApplyPopupOpen,
    clearToast,
    checkLocalAuth,
  } = useApp();

  // Auto-open career internship popup on initial website load
  useEffect(() => {
    const timer = setTimeout(() => {
      setInternshipPanelOpen(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Handle auto close for incoming global toast notifications
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        clearToast();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Dispatch local authentication setup when the website mounts
  useEffect(() => {
    checkLocalAuth();
  }, []);

  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const {
    isMenuOpen,
    isInternshipOpen,
    isAdvisorPopupOpen,
    isApplyPopupOpen,
    toastMessage,
    setInternshipPanelOpen,
    setAdvisorPopupOpen,
    setApplyPopupOpen,
  } = useApp();
  
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  // Re-initialize and refresh AOS when sections change
  useEffect(() => {
    if (window.AOS) {
      const timer = setTimeout(() => {
        try {
          window.AOS.init({
            duration: 800,
            once: true,
            easing: 'ease-out-quad',
          });
          window.AOS.refresh();
        } catch (err) {
          console.error('Error refreshing AOS:', err);
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (window.AOS) {
      window.AOS.init({
        duration: 800,
        once: true,
        easing: 'ease-out-quad',
      });
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-white antialiased selection:bg-wine/10 selection:text-black overflow-x-hidden">
      <SEOInjector />
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" id="app-background-glows">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 20, 0],
            y: [0, -20, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="wine-glow w-[800px] h-[800px] -top-[300px] -left-[300px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, -30, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="green-glow w-[600px] h-[600px] top-[40%] -right-[200px] opacity-10"
        />
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            x: [0, 15, 0]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="wine-glow w-[900px] h-[900px] -bottom-[400px] left-[10%] opacity-[0.1]"
        />
      </div>

      <div className="relative z-10" id="application-container-hub">
        <Navbar />

        <main id="primary-view-body">
          <Routes>
            <Route path="/" element={<HomeView />} />
            <Route path="/blog" element={<Navigate to="/blogs" replace />} />
            <Route path="/blog/:id" element={<BlogArticlePage />} />
            <Route path="/bba" element={<Navigate to="/programs/bba-overview" replace />} />
            <Route path="/mba" element={<Navigate to="/programs/mba-overview" replace />} />
            <Route path="/bca" element={<Navigate to="/programs/bca-overview" replace />} />
            <Route path="/mca" element={<Navigate to="/programs/mca-overview" replace />} />
            <Route path="/programs" element={<Navigate to="/programs/brem" replace />} />
            <Route path="/terms-of-use" element={<TermsOfUse />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/:section" element={
              <div id="workspace-section" className="scroll-mt-24 pt-24 sm:pt-28 md:pt-32 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <AcademicHub />
              </div>
            } />
            <Route path="/:section/:subTab" element={
              <div id="workspace-section" className="scroll-mt-24 pt-24 sm:pt-28 md:pt-32 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <AcademicHub />
              </div>
            } />
          </Routes>
        </main>

        <Footer />

        <StickyBottomBar isMenuOpen={isMenuOpen} />
        <Chatbot />
        <DesktopSideMenu />

        {/* Career & Internship Ad Popup */}
        <InternshipPopup
          isOpen={isInternshipOpen}
          onClose={() => setInternshipPanelOpen(false)}
        />

        {/* Talk to an Advisor Popup */}
        <AdvisorPopup
          isOpen={isAdvisorPopupOpen}
          onClose={() => setAdvisorPopupOpen(false)}
        />

        {/* Apply Now Popup */}
        <ApplyNowPopup
          isOpen={isApplyPopupOpen}
          onClose={() => setApplyPopupOpen(false)}
        />

        {/* Download Brochure Modal */}
        <DownloadBrochureModal />

        {/* Dynamic Redux Custom Toast Notification */}
        <AnimatePresence>
          {toastMessage && toastMessage.show && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50, x: 20 }}
              animate={{ opacity: 1, scale: 1, y: -24, x: -24 }}
              exit={{ opacity: 0, scale: 0.9, y: 50, x: 20 }}
              className="fixed bottom-0 right-0 z-[110] bg-white border border-wine/20 shadow-2xl rounded-2xl p-6 flex items-center gap-4 text-black max-w-sm mr-4"
              id="global-redux-toast-message"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0 ${toastMessage.type === 'error' ? 'bg-red-500/10 text-red-500' : 'bg-wine/10 text-wine'
                }`}>
                {toastMessage.type === 'error' ? '⚠️' : '📄'}
              </div>
              <div>
                <p className="font-bold text-sm leading-tight text-neutral-800">{toastMessage.title}</p>
                <p className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest mt-1">
                  {toastMessage.description}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
