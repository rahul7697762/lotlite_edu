import { Linkedin, Instagram, Twitter } from 'lucide-react';
import Logo from '../ui/Logo';

const WhatsAppIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    fill="currentColor"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);


import { useNavigate, Link } from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();
  const programLinks = [
    { label: "BBA Programme", section: "programs", subTab: "bba-overview" },
    { label: "BCA Programme", section: "programs", subTab: "bca-overview" },
    { label: "MBA Programme", section: "programs", subTab: "mba-overview" },
    { label: "MCA Programme", section: "programs", subTab: "mca-overview" },
    { label: "Admission Process", section: "admissions", subTab: "" },
  ];

  const exploreLinks = [
    { label: "Why Lotlite?", section: "about", subTab: "why-ssi" },
    { label: "Our Founders", section: "about", subTab: "founders" },
    { label: "Academic Board & Faculty", section: "about", subTab: "all" },
    { label: "Intellectual Papers", section: "about", subTab: "research" },
    { label: "Sprint Chronicles", section: "blogs", subTab: "insights" },
  ];

  const navigateTo = (section: string, subTab: string) => {
    navigate(`/${section}/${subTab}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white dark:bg-zinc-950 pt-16 pb-24 md:pb-12 text-black dark:text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-black/5 dark:bg-white/10" />
      <div className="wine-glow -bottom-40 -left-40 w-[800px] h-[800px] blur-[150px] opacity-[0.03]" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20" data-aos="fade-up">
          <div className="lg:col-span-1" data-aos="fade-up" data-aos-delay="0">
            <div className="flex items-center gap-3 mb-8">
              <Logo className="h-10 sm:h-12 w-auto" />
            </div>
            <p className="text-black/40 dark:text-zinc-400 text-sm leading-relaxed mb-8 font-medium">
              Building India's Next Generation of Real Estate Leaders
            </p>
            <div className="space-y-4 text-sm text-black/60 dark:text-zinc-300 font-medium">
              <div>
                <p className="text-[9px] uppercase tracking-widest text-[#a3a3a3] mb-1 font-semibold">Campus Address</p>
                <p className="text-xs text-muted dark:text-zinc-400 leading-relaxed font-semibold">Unit No 1, VTP Aethereus Commercial, Commercial 1, Mahalunge, Pune, Maharashtra 411045</p>
              </div>
              <p>Email: <a href="mailto:admissions@lotlite.co" className="text-wine transition-opacity hover:opacity-80">admissions@lotlite.co</a></p>
            </div>
          </div>

          <div data-aos="fade-up" data-aos-delay="100">
            <h4 className="text-wine uppercase tracking-[0.2em] text-[10px] font-bold mb-8">Academic Programs</h4>
            <ul className="space-y-4 text-sm text-black/40 dark:text-zinc-400 font-medium">
              {programLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => navigateTo(link.section, link.subTab)}
                    className="hover:text-wine text-left transition-colors cursor-pointer text-black/40 dark:text-zinc-400 dark:hover:text-wine hover:text-wine font-medium text-sm block"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div data-aos="fade-up" data-aos-delay="200">
            <h4 className="text-wine uppercase tracking-[0.2em] text-[10px] font-bold mb-8">Explore Campus</h4>
            <ul className="space-y-4 text-sm text-black/40 dark:text-zinc-400 font-medium">
              {exploreLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => navigateTo(link.section, link.subTab)}
                    className="hover:text-wine text-left transition-colors cursor-pointer text-black/40 dark:text-zinc-400 dark:hover:text-wine hover:text-wine font-medium text-sm block"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div data-aos="fade-up" data-aos-delay="300">
            <h4 className="text-wine uppercase tracking-[0.2em] text-[10px] font-bold mb-8">Get In Touch</h4>
            <p className="text-black/40 dark:text-zinc-400 text-sm mb-6 leading-relaxed mb-8 font-medium">
              Ready to transform your career? Connect with our team of specialists.
            </p>
            <div className="flex gap-4 mb-6">
              {[
                { icon: <Linkedin size={18} />, href: "#" },
                { icon: <Instagram size={18} />, href: "#" },
                { icon: <Twitter size={18} />, href: "#" },
                { icon: <WhatsAppIcon size={18} />, href: "https://wa.me/917219877473?text=hii" }
              ].map((social, idx) => (
                <a key={idx} href={social.href} className="w-10 h-10 rounded-lg border border-black/5 dark:border-white/10 flex items-center justify-center text-black/40 dark:text-zinc-400 hover:border-[#C21A22] hover:text-[#C21A22] dark:hover:border-[#E3262F] dark:hover:text-[#E3262F] transition-all shadow-sm hover:-translate-y-1 bg-white dark:bg-zinc-900" target={social.href.startsWith('http') ? '_blank' : undefined} rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}>
                  {social.icon}
                </a>
              ))}
            </div>

            {/* Styled Mini Maps Navigation Section */}
            <div className="rounded-2xl overflow-hidden border border-black/5 dark:border-white/10 shadow-xs relative group bg-neutral-50 dark:bg-zinc-900/40 p-1 mt-4">
              <iframe
                src="https://maps.google.com/maps?q=VTP%20Aethereus%20Commercial,%20Mahalunge,%20Pune&t=&z=14&ie=UTF8&iwloc=&output=embed"
                className="w-full h-24 rounded-xl border-0 grayscale dark:invert-[90%] dark:hue-rotate-180 contrast-125 opacity-75 hover:opacity-100 hover:grayscale-0 dark:hover:invert-0 dark:hover:hue-rotate-0 transition-all duration-300"
                allowFullScreen
                loading="lazy"
                title="Campus Location Map"
              ></iframe>
              <a
                href="https://maps.app.goo.gl/HfDLvejmHQTizR1v7"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-2.5 right-2.5 bg-white/95 dark:bg-zinc-900/95 text-[7.5px] font-black font-mono tracking-wider uppercase text-wine hover:text-black dark:text-zinc-300 dark:hover:text-white px-2.5 py-1 rounded border border-black/10 dark:border-white/10 transition-colors shadow-xs"
              >
                Navigate ↗
              </a>
            </div>
          </div>
        </div>

        <div className="pt-10 md:pt-12 border-t border-black/5 dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6" data-aos="fade-up">
          <p className="text-black/30 dark:text-zinc-500 text-[8px] md:text-[10px] uppercase font-bold tracking-[0.2em] md:tracking-[0.3em] text-center">© 2026 Lotlite Startup. All rights reserved.</p>
          <div className="flex flex-wrap gap-4 md:gap-8 items-center text-black/30 dark:text-zinc-500 text-[8px] md:text-[10px] uppercase font-bold tracking-[0.2em] md:tracking-[0.3em]">
            <Link to="/terms-of-use" className="hover:text-wine transition-colors">Terms of Use</Link>
            <Link to="/privacy-policy" className="hover:text-wine transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
