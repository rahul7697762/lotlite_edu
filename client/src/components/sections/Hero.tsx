import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play } from 'lucide-react';
import { useApp } from '../../AppContext';

const phrases = [
  "Real estate focused curriculum.",
  "Business and PropTech learning.",
  "Industry oriented projects.",
  "Career focused mentorship."
];

export default function Hero() {
  const { setApplyPopupOpen, setAdvisorPopupOpen, setDownloadBrochureOpen } = useApp();
  const [isPlaying, setIsPlaying] = useState(false);
  const [index, setIndex] = useState(0);
  const [subText, setSubText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const currentPhrase = phrases[index];
      if (!isDeleting) {
        setSubText(currentPhrase.substring(0, subText.length + 1));
        if (subText.length === currentPhrase.length) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setSubText(currentPhrase.substring(0, subText.length - 1));
        if (subText.length === 0) {
          setIsDeleting(false);
          setIndex((index + 1) % phrases.length);
        }
      }
    }, isDeleting ? 40 : 80);

    return () => clearTimeout(timeout);
  }, [subText, isDeleting, index]);

  return (
    <section className="relative pt-28 pb-10 md:pt-36 lg:pt-48 md:pb-12 overflow-hidden border-b border-black/5" id="hero">
      {/* Background Layer with Red-and-White Gradient & Buildings Background */}
      <div className="absolute inset-0 z-0 bg-white transition-colors duration-500" />
      <div 
        className="absolute inset-0 z-[1] bg-cover bg-center opacity-30 pointer-events-none transition-opacity duration-500"
        style={{
          backgroundImage: `url('/images/hero_background.png')`
        }}
      />
      <div className="absolute inset-0 z-[2] bg-gradient-to-br from-white via-white/80 via-40% to-[#C21A22]/40 to-100% pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center border-box">
          
          {/* Left Column (Content & Action Buttons) */}
          <div data-aos="fade-up" className="md:col-span-6 lg:col-span-6 text-center md:text-left space-y-4">
            <span className="text-wine text-[10px] font-bold uppercase tracking-[0.4em] block mb-2">Lotlite Edu</span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl text-black font-serif font-light leading-[1.15] text-balance">
              Real Estate and PropTech <br className="hidden md:block"/>
              <span className="text-wine">Business Education for the Next Generation</span>
            </h1>
            
            <div className="h-8">
              <p className="text-sm md:text-base text-muted italic font-serif">
                "{subText}"
              </p>
            </div>

            <p className="text-[11px] sm:text-xs text-muted font-medium leading-relaxed max-w-lg">
              Build a future ready career in real estate, business management, sales, marketing, investments, CRM, RERA, REIT, and property technology with Lotlite Edu.
            </p>
 
            <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-4">
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById('programs');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="bg-wine hover:bg-wine-hover text-white border border-transparent px-6 py-3 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all text-center cursor-pointer shadow-sm"
              >
                Explore Programmes
              </button>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  setDownloadBrochureOpen(true);
                }}
                className="border border-border text-black bg-white px-6 py-3 rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-black hover:text-white transition-all cursor-pointer text-center"
              >
                Download Brochure
              </button>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  setAdvisorPopupOpen(true);
                }}
                className="bg-zinc-800 hover:bg-black text-white border border-transparent px-6 py-3 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all cursor-pointer text-center shadow-xs"
              >
                Talk to Counsellor
              </button>
            </div>
            <p className="text-[9.5px] font-medium text-muted/80 max-w-sm mx-auto md:mx-0 pt-2 leading-relaxed">
              Designed for students who want more than regular management education. They want direction, practical skills, and industry exposure.
            </p>
          </div>
 
          {/* Right Column (Expanded Video Player) */}
          <div className="w-full relative md:pl-6 md:col-span-6 lg:col-span-6" data-aos="fade-up" data-aos-delay="100">
            <div className="w-full bg-white/45 backdrop-blur-md border border-neutral-100 dark:border-zinc-800/80 rounded-3xl shadow-2xl overflow-hidden p-5 md:p-6 lg:p-7">
              <div className="flex flex-col gap-5">
                <div 
                  className={`w-full aspect-video bg-offwhite rounded-2xl flex items-center justify-center border border-border relative overflow-hidden shrink-0 group ${!isPlaying ? 'cursor-pointer' : ''}`}
                  onClick={() => !isPlaying && setIsPlaying(true)}
                >
                  {isPlaying ? (
                    <iframe
                      className="w-full h-full"
                      src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                      title="Lotlite Startup Film"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-wine/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="w-14 h-14 bg-wine rounded-full flex items-center justify-center shadow-lg relative z-10 transition-transform group-hover:scale-110">
                         <Play className="fill-white text-white w-5 h-5 ml-0.5" />
                      </div>
                    </>
                  )}
                </div>
                <div className="text-left flex-1 min-w-0 pt-2 border-t border-neutral-100/60 dark:border-zinc-800/60">
                  <span className="text-wine text-[9px] font-black uppercase tracking-widest block mb-1">Lotlite Masterclass Film</span>
                  <h3 className="text-lg font-bold text-black leading-snug mb-1">Karan Mehta · Masterclass</h3>
                  <p className="text-muted text-xs leading-relaxed">Discover why modern, specialized real estate management, asset valuation, and PropTech strategies command absolute premium compensation in Indian and international realty boards.</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Dynamic partners row positioned discreetly at the bottom */}
        <div className="mt-8 pt-4 border-t border-black/5 flex flex-wrap items-center justify-center lg:justify-between gap-4">
          <p className="text-muted text-[8px] uppercase tracking-[0.3em] font-bold text-center lg:text-left">Strategic Endorsement Credentials</p>
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-2 opacity-30 grayscale text-[10px] font-bold uppercase tracking-widest text-black">
            {["RICS Standard", "NAREDCO", "HIRANANDANI", "LODHA", "99acres"].map((logo) => (
              <span key={logo}>{logo}</span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
