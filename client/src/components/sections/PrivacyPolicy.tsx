import { motion } from 'motion/react';

export default function PrivacyPolicy() {
  return (
    <div className="pt-32 pb-24 max-w-4xl mx-auto px-6 relative z-10 text-black dark:text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="prose dark:prose-invert prose-wine max-w-none"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight">Privacy Policy</h1>
        <p className="text-sm text-neutral-500 mb-8">Last Updated: June 2026</p>
        
        <h2>1. Information We Collect</h2>
        <p>
          We collect information that you provide directly to us, such as when you fill out a form, request information, or communicate with us. This may include your name, email address, phone number, and other relevant details necessary to provide our educational services.
        </p>

        <h2>2. How We Use Your Information</h2>
        <p>
          We use the information we collect to provide, maintain, and improve our services, communicate with you, process your admissions applications, and send you important notices and updates related to Lotlite Startup.
        </p>

        <h2>3. Information Sharing</h2>
        <p>
          We do not sell, trade, or rent users' personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners and trusted affiliates.
        </p>

        <h2>4. Data Security</h2>
        <p>
          We adopt appropriate data collection, storage and processing practices and security measures to protect against unauthorized access, alteration, disclosure or destruction of your personal information, username, password, transaction information and data stored on our site.
        </p>

        <h2>5. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, the practices of this site, or your dealings with this site, please contact us at <a href="mailto:admissions@lotlite.co" className="text-wine">admissions@lotlite.co</a>.
        </p>
      </motion.div>
    </div>
  );
}
