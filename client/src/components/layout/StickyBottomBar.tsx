import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';
import { Phone, Video, MapPin } from 'lucide-react';
import { useApp } from '../../AppContext';

interface StickyBottomBarProps {
  isMenuOpen: boolean;
}

export default function StickyBottomBar({ isMenuOpen }: StickyBottomBarProps) {
  const { setAdvisorPopupOpen } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleModalStateChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && typeof customEvent.detail.isOpen === 'boolean') {
        setIsModalOpen(customEvent.detail.isOpen);
      }
    };

    window.addEventListener('modal-state-change', handleModalStateChange);
    return () => {
      window.removeEventListener('modal-state-change', handleModalStateChange);
    };
  }, []);

  return (
    <AnimatePresence>
      {!isMenuOpen && !isModalOpen && (
        <div className="fixed bottom-0 left-0 right-0 z-[60] md:hidden p-4 pb-3 pointer-events-none">
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="bg-wine rounded-full flex items-center justify-between p-2 sm:p-2.5 pr-5 sm:pr-7 shadow-[0_10px_40px_rgba(128,0,32,0.3)] pointer-events-auto border border-white/10"
          >
            {/* APPLY NOW Button */}
            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent('switch-tab', { detail: 'apply_form' }));
              }}
              className="bg-white text-wine flex-1 mr-4 sm:mr-6 py-3.5 sm:py-4 rounded-full font-bold text-[11px] sm:text-[13px] uppercase tracking-widest hover:bg-gray-100 active:scale-95 transition-all shadow-md"
            >
              Apply Now
            </button>

            {/* Icons */}
            <div className="flex items-center gap-3.5 sm:gap-5">
              {/* Phone */}
              <button onClick={() => setAdvisorPopupOpen(true)} className="w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center cursor-pointer text-white hover:text-white/80 transition-colors">
                <Phone fill="currentColor" size={20} />
              </button>
              {/* WhatsApp */}
              <a href="https://wa.me/917219877473?text=hii" target="_blank" rel="noopener noreferrer" className="w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center cursor-pointer text-white hover:text-white/80 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
                </svg>
              </a>

              {/* Map Pin */}
              <a href="https://maps.app.goo.gl/HfDLvejmHQTizR1v7" target="_blank" rel="noopener noreferrer" className="w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center cursor-pointer text-white hover:text-white/80 transition-colors">
                <MapPin size={22} />
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
