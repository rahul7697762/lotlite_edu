import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, Video, MapPin } from 'lucide-react';
import { useApp } from '../../AppContext';

export default function DesktopSideMenu() {
  const { setAdvisorPopupOpen } = useApp();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="hidden md:flex fixed bottom-[104px] right-8 z-[85] items-center shadow-2xl rounded-sm overflow-hidden border border-border dark:border-white/10 bg-white dark:bg-zinc-900 h-12">
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-12 h-12 bg-black text-white dark:bg-white dark:text-black flex items-center justify-center shrink-0 cursor-pointer hover:bg-black/90 dark:hover:bg-white/90 transition-colors z-10"
        aria-label="Toggle quick menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24" height="24" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          className={`transition-transform duration-300 ${!isExpanded ? 'rotate-180' : ''}`}
        >
          <line x1="4" y1="7" x2="12" y2="7"></line>
          <line x1="4" y1="12" x2="12" y2="12"></line>
          <line x1="4" y1="17" x2="12" y2="17"></line>
          <polyline points="18 7 13 12 18 17"></polyline>
        </svg>
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 144, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex items-center h-12 bg-white dark:bg-zinc-900"
            style={{ overflow: 'hidden' }}
          >
            <div className="flex items-center h-full w-[144px]">
              {/* Phone */}
              <button onClick={() => setAdvisorPopupOpen(true)} title="Talk to an Advisor" className="w-12 h-12 bg-white dark:bg-zinc-900 flex items-center justify-center border-l border-border dark:border-white/10 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-wine dark:hover:text-rose-400 transition-colors cursor-pointer text-black dark:text-zinc-300 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="hover:scale-110 transition-transform">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </button>
              {/* WhatsApp */}
              <a href="https://wa.me/917219877473?text=Hii" target="_blank" rel="noopener noreferrer" title="WhatsApp" className="w-12 h-12 bg-white dark:bg-zinc-900 flex items-center justify-center border-l border-border dark:border-white/10 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-wine dark:hover:text-rose-400 transition-colors cursor-pointer text-black dark:text-zinc-300 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="hover:scale-110 transition-transform">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
                </svg>
              </a>
              {/* Map Pin */}
              <a href="https://maps.app.goo.gl/HfDLvejmHQTizR1v7" target="_blank" rel="noopener noreferrer" title="Location" className="w-12 h-12 bg-white dark:bg-zinc-900 flex items-center justify-center border-l border-border dark:border-white/10 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-wine dark:hover:text-rose-400 transition-colors cursor-pointer text-black dark:text-zinc-300 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="hover:scale-110 transition-transform">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                  <path d="M12 22s-8-6-8-12a8 8 0 0 1 16 0c0 6-8 12-8 12Z" fill="transparent" />
                </svg>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
