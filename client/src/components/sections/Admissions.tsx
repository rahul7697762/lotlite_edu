import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle } from 'lucide-react';
import OtpVerificationPage from '../auth/OtpVerificationPage';
import { useApp } from '../../AppContext';

const phrases = [
  "Real estate focused curriculum.",
  "Business and PropTech learning.",
  "Industry oriented projects.",
  "Career focused mentorship."
];

export default function Admissions() {
  const { setAdvisorPopupOpen, setDownloadBrochureOpen } = useApp();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [program, setProgram] = useState('MBA in Real Estate, Business and PropTech');

  const [pendingLead, setPendingLead] = useState<any>(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [formError, setFormError] = useState('');

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setIsSendingOtp(true);

    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/otp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setFormError(data.error || 'Failed to send OTP. Please try again.');
        setIsSendingOtp(false);
        return;
      }

      const newApp = {
        id: `app-${Date.now()}`,
        name,
        email,
        phone,
        program,
        background: 'Inquire Brief Draft',
        status: 'Pending',
        experience: 'Submitted via Public Application Desk Form',
        appliedDate: new Date().toISOString().split('T')[0]
      };

      setPendingLead({
        phone,
        localData: newApp,
        leadData: {
          fullName: name,
          email,
          phone,
          programCategory: program,
          programSpecialization: '',
          source: 'Admissions Desk Form'
        }
      });
    } catch (err) {
      console.error('Failed to send OTP:', err);
      setFormError('Network error. Please try again.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleResetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setProgram('MBA in Real Estate, Business and PropTech');
    setIsSubmitted(false);
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-16 md:pb-24 scroll-mt-20 border-b border-black/5" id="apply">
      {/* Background Layer with Red-and-White Gradient & Buildings Background */}
      <div className="absolute inset-0 z-0 bg-white transition-colors duration-500" />
      <div
        className="absolute inset-0 z-[1] bg-cover bg-center opacity-30 pointer-events-none transition-opacity duration-500"
        style={{
          backgroundImage: `url('/images/hero_background.png')`
        }}
      />
      <div className="absolute inset-0 z-[2] bg-gradient-to-br from-white via-white/80 via-40% to-[#C21A22]/40 to-100% pointer-events-none" />
      <div className="wine-glow -top-20 -right-20 w-[600px] h-[600px] blur-[150px] z-[3]" />

      <div className="grid md:grid-cols-2 min-h-screen relative z-10 max-w-7xl mx-auto px-6">
        <div className="p-6 md:p-12 lg:p-24 flex flex-col justify-center">
          <div data-aos="fade-right" className="space-y-4">
            <span className="text-wine text-[10px] font-bold uppercase tracking-[0.4em] block mb-2">Admissions Open</span>

            <h2 className="text-4xl md:text-5xl text-black font-serif font-light leading-[1.15] text-balance">
              Real Estate and PropTech <br className="hidden md:block" />
              <span className="text-wine">Business Education for the Next Generation</span>
            </h2>

            <div className="h-8">
              <p className="text-sm md:text-base text-muted italic font-serif">
                "{subText}"
              </p>
            </div>

            <p className="text-[11px] sm:text-xs text-muted font-medium leading-relaxed max-w-lg">
              Start your journey toward a career in real estate, business, marketing, sales, and PropTech. Build a future ready career in sales, investments, CRM, RERA, REIT, and property technology with Lotlite Edu.
            </p>

            <div className="flex flex-wrap gap-2 pt-1 pb-4">
              {["MBA pathway: 24 months", "BBA pathway: 36 months", "Online & Hybrid", "Real Estate & Business"].map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-lg border border-border text-muted text-[9px] font-bold uppercase tracking-widest bg-offwhite/50">
                  {tag}
                </span>
              ))}
            </div>

            <div className="space-y-4 mb-8">
              {[
                { n: "01", title: "Submit your enquiry" },
                { n: "02", title: "Speak with a programme counsellor" },
                { n: "03", title: "Attend a counselling session" },
                { n: "04", title: "Complete eligibility and documentation" },
                { n: "05", title: "Confirm your admission" }
              ].map((step, idx) => (
                <div key={idx} className="flex gap-4 items-center group">
                  <div className="w-8 h-8 rounded-xl border border-black/5 flex items-center justify-center text-wine font-serif text-sm font-bold group-hover:bg-wine group-hover:text-white transition-all duration-300 shadow-sm shrink-0">
                    {step.n}
                  </div>
                  <h3 className="text-black font-bold text-xs tracking-tight">{step.title}</h3>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="grid grid-cols-2 gap-3 max-w-md">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById('apply-now-container');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="bg-wine text-white px-4 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-md hover:opacity-90 transition-opacity cursor-pointer"
              >
                Apply Now
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setDownloadBrochureOpen(true);
                }}
                className="bg-black text-white px-4 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-md hover:bg-black/80 transition-colors cursor-pointer"
              >
                Download Brochure
              </button>
              <button
                onClick={() => setAdvisorPopupOpen(true)}
                className="bg-offwhite border border-border text-black px-4 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-sm hover:border-black/20 transition-colors cursor-pointer"
              >
                Request Callback
              </button>
              <button
                onClick={() => window.open('https://wa.me/917219877473?text=Hi%2C%20I%20would%20like%20to%20know%20more%20about%20Lotlite%20Edu%20programmes.', '_blank', 'noopener,noreferrer')}
                className="bg-[#25D366] text-white px-4 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-md hover:bg-[#20bd5a] transition-colors cursor-pointer"
              >
                WhatsApp Counsellor
              </button>
            </div>
          </div>
        </div>

        <div className="bg-transparent p-6 md:p-12 lg:p-24 flex items-center justify-center border-l border-black/5 dark:border-white/5 z-10" id="apply-now-container">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="light-gradient-card p-10 md:p-14 rounded-3xl shadow-2xl w-full max-w-xl"
              >
                <h3 className="text-3xl md:text-4xl font-serif text-black mb-10">Submit <span className="text-wine">Enquiry</span></h3>
                <form className="space-y-8" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-3">Full Name</label>
                      <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-offwhite border border-border rounded-xl px-5 py-4 text-black focus:outline-none focus:border-wine transition-colors font-medium placeholder:text-muted/30" placeholder="Aarav Sharma" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-3">Email Address</label>
                      <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-offwhite border border-border rounded-xl px-5 py-4 text-black focus:outline-none focus:border-wine transition-colors font-medium placeholder:text-muted/30" placeholder="aarav@university.com" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-3">Phone Number</label>
                    <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-offwhite border border-border rounded-xl px-5 py-4 text-black focus:outline-none focus:border-wine transition-colors font-medium placeholder:text-muted/30" placeholder="+91 98765 00000" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-3">Academic Program Interest</label>
                    <select required value={program} onChange={(e) => setProgram(e.target.value)} className="w-full bg-offwhite border border-border rounded-xl px-5 py-4 text-black focus:outline-none focus:border-wine transition-colors appearance-none font-medium">
                      <option value="MBA in Real Estate, Business and PropTech" className="bg-white dark:bg-offwhite text-black">MBA in Real Estate, Business and PropTech</option>
                      <option value="BBA in Business, Real Estate and Marketing" className="bg-white dark:bg-offwhite text-black">BBA in Business, Real Estate and Marketing</option>
                      <option value="BCA in Computer Applications, Data Science and Software Development" className="bg-white dark:bg-offwhite text-black">BCA in Computer Applications, Data Science and Software Development</option>
                      <option value="MCA in AI, Software Engineering and Applied Computing" className="bg-white dark:bg-offwhite text-black">MCA in AI, Software Engineering and Applied Computing</option>
                      <option value="Incubation Program" className="bg-white dark:bg-offwhite text-black">Incubation Program</option>
                    </select>
                  </div>
                  <button type="submit" disabled={isSendingOtp} className="w-full bg-wine text-white py-3.5 md:py-5 rounded-xl font-bold border-2 border-transparent shadow-xl shadow-wine/20 hover:bg-transparent hover:text-wine hover:border-wine transition-all uppercase tracking-[0.2em] text-xs md:text-sm disabled:opacity-75 disabled:cursor-not-allowed">
                    <span className="md:hidden">{isSendingOtp ? 'Sending...' : 'Apply Now'}</span>
                    <span className="hidden md:inline">{isSendingOtp ? 'Sending OTP...' : 'Apply Now →'}</span>
                  </button>
                  {formError && <p className="text-center text-red-500 text-xs font-bold uppercase mt-2">{formError}</p>}
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-offwhite p-16 rounded-3xl shadow-2xl w-full max-w-lg text-center flex flex-col items-center border border-border"
              >
                <div className="w-24 h-24 bg-wine/10 rounded-full flex items-center justify-center text-wine mb-10 shadow-lg shadow-wine/5">
                  <CheckCircle size={56} />
                </div>
                <h3 className="text-4xl font-serif text-black mb-4 leading-tight">Enquiry <span className="text-wine">Received.</span></h3>
                <p className="text-muted leading-relaxed font-medium text-lg">
                  🎉 We have received your details. A programme counsellor will be in touch with you shortly.
                </p>
                <button
                  onClick={handleResetForm}
                  className="mt-12 text-wine font-bold text-sm uppercase tracking-widest hover:underline opacity-60 hover:opacity-100 transition-opacity"
                >
                  Submit another enquiry?
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      {pendingLead && (
        <OtpVerificationPage
          pendingLead={pendingLead}
          onSuccess={() => {
            setPendingLead(null);
            setIsSubmitted(true);
          }}
          onCancel={() => setPendingLead(null)}
        />
      )}
    </section>
  );
}
