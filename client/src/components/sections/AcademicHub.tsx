import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Users,
  Cpu,
  Rocket,
  HandCoins,
  Target,
  ChevronRight,
  CheckCircle2,
  Clock,
  Calendar,
  MapPin,
  Award,
  BookOpen,
  ClipboardList,
  GraduationCap,
  Briefcase,
  X,
  ExternalLink,
  ChevronLeft,
  Search,
  BookOpenCheck,
  ChevronDown,
  Mail,
  Phone,
  Building2,
  Share2,
  Bookmark,
  Check,
  HelpCircle,
  FileDown,
  Linkedin
} from 'lucide-react';
import { useApp } from '../../AppContext';
import ProgramStructureDetail from './ProgramStructureDetail';
import OtpVerificationPage from '../auth/OtpVerificationPage';
import {
  bbaStructure,
  mbaStructure,
  bcaStructure,
  mcaStructure
} from '../../data/curriculumData';

export default function AcademicHub() {
  const { section, subTab } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const activeSection = section || 'programs';
  const activeSubTab = subTab || searchParams.get('tab') || (activeSection === 'programs' ? 'brem' : activeSection === 'blogs' ? 'insights' : '');

  const {
    blogs,
    faqs: allFaqs,
    fetchBlogs,
    fetchFaqs,
    submitApplicant,
    triggerToast,
    setSelectedBlog,
    setApplyPopupOpen,
    setAdvisorPopupOpen,
    websiteData,
    setDownloadBrochureOpen,
  } = useApp();

  useEffect(() => {
    fetchBlogs();
    fetchFaqs();
  }, []);

  // Local form states
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formProgram, setFormProgram] = useState('MBA in Real Estate, Business and PropTech');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Proposal form states
  const [proposalName, setProposalName] = useState('');
  const [proposalEmail, setProposalEmail] = useState('');
  const [proposalTopic, setProposalTopic] = useState('');
  const [proposalAbstract, setProposalAbstract] = useState('');
  const [proposalSubmitted, setProposalSubmitted] = useState(false);

  // OTP Verification states
  const [pendingLead, setPendingLead] = useState<any>(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [formError, setFormError] = useState('');

  // Modal expanders
  const [selectedCase, setSelectedCase] = useState<any | null>(null);

  // FAQ States
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Alumni Carousel index
  const [alumniIndex, setAlumniIndex] = useState(0);

  // Blog filters
  const [blogFilter, setBlogFilter] = useState('All');

  // Blog Pagination States
  const [blogPage, setBlogPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // desktop
        setPageSize(8); // 4 per row * 2 rows = 8
      } else if (window.innerWidth >= 768) { // tablet
        setPageSize(6); // 3 per row * 2 rows = 6
      } else { // mobile
        setPageSize(4); // 2 per row * 2 rows = 4
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset page when category filters change
  useEffect(() => {
    setBlogPage(1);
  }, [blogFilter]);

  // Course Selector States
  const [activeCourse, setActiveCourse] = useState<'bba' | 'mba' | 'bca' | 'mca'>('bba');
  const [ugOpen, setUgOpen] = useState(true);
  const [pgOpen, setPgOpen] = useState(false);

  // Brochure Download Handler
  const handleDownloadBrochure = (courseKey: string) => {
    setDownloadBrochureOpen(true, courseKey);
  };

  // Mobile submenu scroll indicators
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const [scrollRatio, setScrollRatio] = useState(0);

  const handleMobileScroll = () => {
    const el = mobileScrollRef.current;
    if (el) {
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll > 0) {
        setScrollRatio(el.scrollLeft / maxScroll);
      } else {
        setScrollRatio(0);
      }
    }
  };

  // Adjust scroll and keep selected option fully visible in mobile view
  useEffect(() => {
    setOpenFaq(null);
    const el = mobileScrollRef.current;
    if (el) {
      const timer = setTimeout(() => {
        const menus = sidebarMenus[activeSection as keyof typeof sidebarMenus] || [];

        let derivedOption = 'overview';
        if (activeSubTab.startsWith('pg-')) {
          derivedOption = activeSubTab.replace('pg-', '');
        } else if (activeSubTab.startsWith('brem-')) {
          derivedOption = activeSubTab.replace('brem-', '');
        }

        const activeItemIndex = menus.findIndex(item => {
          if (activeSection === 'programs') {
            return activeSubTab === item.id;
          }
          if (activeSection === 'admissions') {}
          return activeSubTab === item.id;
        });

        if (activeItemIndex !== -1) {
          const buttons = el.querySelectorAll('button');
          const activeButton = buttons[activeItemIndex];
          if (activeButton) {
            const containerWidth = el.clientWidth;
            const btnLeft = (activeButton as HTMLElement).offsetLeft;
            const btnWidth = (activeButton as HTMLElement).clientWidth;

            // Center the selected button smoothly inside the scrolling container
            const targetScrollLeft = btnLeft - (containerWidth / 2) + (btnWidth / 2);
            el.scrollTo({
              left: targetScrollLeft,
              behavior: 'smooth'
            });
          }
        }
        // Force calculation of scroll ratio
        const maxScroll = el.scrollWidth - el.clientWidth;
        if (maxScroll > 0) {
          setScrollRatio(el.scrollLeft / maxScroll);
        } else {
          setScrollRatio(0);
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [activeSection, activeSubTab]);

  // Scroll to sub-section in About single page
  useEffect(() => {
    if (activeSection === 'about' && activeSubTab) {
      const timer = setTimeout(() => {
        const element = document.getElementById(`about-section-${activeSubTab}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300); // Allow some time for rendering transitions
      return () => clearTimeout(timer);
    }
  }, [activeSection, activeSubTab]);

  // Scroll to sub-section in Incubation single page
  useEffect(() => {
    if (activeSection === 'incubation' && activeSubTab) {
      const timer = setTimeout(() => {
        const element = document.getElementById(`incubation-${activeSubTab}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300); // Allow some time for rendering transitions
      return () => clearTimeout(timer);
    }
  }, [activeSection, activeSubTab]);

  // Lock body scroll when target modal is active to prevent background scrolling
  useEffect(() => {
    if (selectedCase) {
      document.body.style.overflow = 'hidden';
      window.dispatchEvent(new CustomEvent('modal-state-change', { detail: { isOpen: true } }));
    } else {
      document.body.style.overflow = '';
      window.dispatchEvent(new CustomEvent('modal-state-change', { detail: { isOpen: false } }));
    }
    return () => {
      document.body.style.overflow = '';
      window.dispatchEvent(new CustomEvent('modal-state-change', { detail: { isOpen: false } }));
    };
  }, [selectedCase]);

  // Static Data lists
  const founders = [
    {
      name: "Rohan Shah",
      role: "Director of Sales",
      company: "Hiranandani Group",
      bio: "Active Mentor · Avid real estate investor with 12+ years luxury portfolio experience. ROHAN translates property acquisition theory into practical sales masterclasses.",
      education: "Stanford GSB Alumnus",
      tags: ["Luxury Sales", "Investing", "Advisory"],
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&h=450&q=80"
    },
    {
      name: "Vikram Aatrey",
      role: "PropTiger Founder",
      company: "Ex-Magicbricks Architect",
      bio: "Urgently scaling Indian proptech. VIKRAM built multi-million dollar search engines and now trains students on algorithmic pricing and real estate tech funding.",
      education: "IIT Bombay Graduate",
      tags: ["Technology", "PropTech", "VC Pitching"],
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=450&q=80"
    },
    {
      name: "Anita Khanna",
      role: "Group Chief Financial Officer",
      company: "Hiranandani & Lodha alliances",
      bio: "Distinguished financial wizard. ANITA steers active capital deployment, liquidity frameworks, REIT setups, and private equity deals within Indian metros.",
      education: "Delhi School of Economics",
      tags: ["REITs", "Direct Mergers", "Finance"],
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&h=450&q=80"
    },
    {
      name: "Mihir M",
      role: "NoBroker Founder",
      company: "Ex-Flipkart Growth Director",
      bio: "Pioneered peer-to-peer digital listings. MIHIR guides zero-CAC frameworks, tech monetization, and brokerage agent workflows inside Lotlite's practical sprints.",
      education: "IIT Kanpur Alumnus",
      tags: ["Growth Marketing", "Automations", "P2P Systems"],
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&h=450&q=80"
    },
    {
      name: "Abhinav Bansal",
      role: "Square Yards Co-Founder",
      company: "Ex-CBRE Managing Director",
      bio: "Global real estate authority. ABHINAV leads the Property Strategy Lab on campus, connecting student project teams to critical institutional accounts.",
      education: "IIM Ahmedabad Alumnus",
      tags: ["Global Brokerage", "SaaS Markets", "Strategy"],
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&h=450&q=80"
    },
    {
      name: "Varun Khaitan",
      role: "Managing Director",
      company: "Knight Frank Advisory",
      bio: "Infrastructure masterplanner. VARUN brings corporate advisory algorithms, feasibility mapping, and portfolio valuation frameworks to our classrooms.",
      education: "IIT Kanpur | Ex-BCG Manager",
      tags: ["Consulting", "Feasibility", "Masterplanning"],
      image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&h=450&q=80"
    }
  ];

  const faculty = [
    {
      name: "Anil Bassamboo",
      course: "Real Estate Operations",
      title: "Professor of Decision Sciences & Operations, MIT Real Estate Center",
      overview: "Learn how massive real estate portfolios operate at scale — from process pipelines to asset analytics — utilising robust structures and live modeling.",
      tags: ["MIT Center", "Stanford", "RICS Expert"],
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&h=450&q=80"
    },
    {
      name: "Tim Calkins",
      course: "Brand & Marketing Strategy",
      title: "Kellogg School of Management, Northwestern University",
      overview: "Study how real estate brands command exceptional margins. Analyze Hiranandani's legacy positioning and the premium reputation architecture of global properties.",
      tags: ["Kellogg Professor", "Harvard", "Brand Author"],
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&h=450&q=80"
    },
    {
      name: "Siddarth Menon",
      course: "Digital PropTech & Marketing",
      title: "Marketing Strategy Lead, Ex-CMO Square Yards",
      overview: "Deploy live lead-generation campaigns using true developer metrics. Master paid and organic distribution channels that capture modern property buyers.",
      tags: ["Square Yards CMO", "PropTech Maven", "SaaS Builder"],
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&h=450&q=80"
    },
    {
      name: "Prof. Sundar Venkatesh",
      course: "Real Estate Valuation & Finance",
      title: "Distinguished learning advisor working with global REIT managers",
      overview: "Master the mechanics of capital budgeting, discounted cashflows, and tax calculations necessary to evaluate real estate assets accurately.",
      tags: ["ISB Faculty", "Valuation Jury", "REIT Advisor"],
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&h=450&q=80"
    }
  ];

  const alumni = [
    { name: "Sanchit Madhura", role: "Chief of Staff", company: "Epigamia", batch: "2025", package: "14.5 LPA", review: "The case study methods here are unmatched. Moving directly from student pitches to a Chief of Staff role at Epigamia was facilitated entirely by founder mentorship." },
    { name: "Arvind Girish", role: "Sales Lead", company: "Lodha Group", batch: "2025", package: "12.0 LPA", review: "Selling actual high-end luxury assets during practical labs gave me the commercial confidence to run high-volume portfolios at Lodha." },
    { name: "Harshit Maheshwari", role: "PropTech PM", company: "99acres", batch: "2024", package: "11.2 LPA", review: "The AI & PropTech Term gave me the programming logic and product vision to lead digital tools inside India's premier property marketplace." },
    { name: "Ruheen Singh", role: "Growth Manager", company: "NoBroker", batch: "2024", package: "10.8 LPA", review: "My zero-CAC model built in Lotlite's build sprint was acquired by NoBroker, land-marking my pathway directly into a full leadership role." }
  ];

  const cases = [
    {
      founder: "Utkarsh Gupta",
      company: "Cosmos Realty",
      problem: "Scale residential operations across the Mumbai Metropolitan Region (MMR) while preserving Cosmos' ultra-premium legacy branding.",
      tag: "Brand Strategy",
      solution: "Students deployed a spatial-filtering framework and built 100+ high-wealth buyer surveys. Result: selected 2 target MMR pockets and launched a local sales sprint generating 400 qualified leads.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80"
    },
    {
      founder: "Anil Goteti",
      company: "Scapia Living",
      problem: "Formulate user engagement vectors and co-living loyalty incentives to scale tenant retention beyond 18 months in tech parks.",
      tag: "Growth Loop",
      solution: "Engineered an offline-to-online community portal featuring workspace credits and regional real estate networking hubs. Tenant retention increased by 35% in early pilots.",
      image: "https://images.unsplash.com/photo-1504384308090-c89e1224ad8f?auto=format&fit=crop&w=600&q=80"
    },
    {
      founder: "Vibha Harish",
      company: "CoSmix Realty",
      problem: "Optimize top-of-funnel broker discovery and organic viral marketing channels for premium villa land plots in Outskirts of Bengaluru.",
      tag: "Growth Loop",
      solution: "Architected a WhatsApp-driven geographic referral engine and beautiful 3D drone land views. Resulted in a 4X raise in organic qualified plot visits within 60 days.",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80"
    },
    {
      founder: "Shamika Haldipurkar",
      company: "d'you Spaces",
      problem: "Launch, market, and distribute d'you Spaces' flexible coworking slots through instant-access digital logistics.",
      tag: "Sales Framework",
      solution: "Integrated dynamic pricing models with popular quick-office channels, enabling local freelancers to book hotdesks within 90 seconds. Scaled bookings to 500+ weekly hours.",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80"
    },
    {
      founder: "Varun Khaitan",
      company: "Urban Property",
      problem: "Improve Net Promoter Scores (NPS) of the high-volume lease property management division operating above ₹80Cr ARR.",
      tag: "Sales Framework",
      solution: "Built a mobile-first automated diagnostic portal matching local technicians to lease tenants, cutting ticket resolution from 5 days to 4 hours. Checked a rise in NPS by 35 points.",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80"
    },
    {
      founder: "Vivek Sinha",
      company: "Emversity Properties",
      problem: "Bridge digital marketing efficiency to achieve customer acquisition cost (CAC) reduction below 12% across suburban developments.",
      tag: "Growth Loop",
      solution: "Developed highly targeted spatial brokerage ads paired with physical localized weekend property tea-clubs, reducing reliance on expensive listing hubs. CAC dropped by 22%.",
      image: "https://images.unsplash.com/photo-1512403754473-27855f33d0fc?auto=format&fit=crop&w=600&q=80"
    }
  ];

  // Blogs are now synchronized seamlessly from Redux blogs slice state and local storage API proxy

  // FAQs for BBA and MBA program segments
  const bbaFaqs = [
    {
      q: "What is the BBA program in Business, Real Estate and Marketing?",
      a: "It is a highly practical 3-year degree focusing on marketing management, human resource principles, business accounting, microeconomics, macroeconomics, sales mechanics, and real estate developer strategies."
    },
    {
      q: "What are the career opportunities after completing BBA?",
      a: "Graduates are highly sought after by premium developers, PropTech startups, real estate funds, global advisory firms, and property management consultants for executive roles."
    },
    {
      q: "Is there a corporate internship included in the BBA curriculum?",
      a: "Yes. During Semester 5, students participate in a compulsory 8-week corporate internship or summer project directly set up within physical real estate houses and developer offices."
    },
    {
      q: "Are there standard entrance exams required?",
      a: "No. Lotlite evaluates applicants based on our custom diagnostic aptitude tests, historical academic performance, and a direct interview with our core founding panel."
    }
  ];

  const mbaFaqs = [
    {
      q: "What is the MBA program in Real Estate, Business and PropTech?",
      a: "The MBA is an elite 2-year postgraduate track covering commercial capitalization structures, RERA titles, REIT conversions, construction administration, machine learning in retail logistics, brand positioning, and CRM automation loops."
    },
    {
      q: "What is the background eligibility for the MBA Program?",
      a: "Applicants with a Bachelor's degree (any stream) from a recognized university who display strong analytical logic, corporate aspiration, and creative enterprise are eligible to enroll."
    },
    {
      q: "How does the PropTech curriculum benefit students?",
      a: "PropTech, CRM, Lead Nurturing, and AI/ML elements in Semester 3 and 4 teach students how to build structural software, manage automated marketing funnels, and scale commercial models like modern startups."
    },
    {
      q: "Is there a capstone venture project required?",
      a: "Yes. Students spend the final semester constructing, launching, and defending a commercial property launch plan or PropTech software venture before actual developers and venture capital partners."
    }
  ];

  const bcaFaqs = [
    {
      q: "What is the BCA program in Computer Applications, Data Science and Software Development?",
      a: "It is a comprehensive 3-year undergraduate degree focusing on programming fundamentals, data structures, web development, database management, AI basics, cloud computing, and software engineering with hands-on capstone projects."
    },
    {
      q: "What career opportunities are available after BCA?",
      a: "Graduates can pursue roles as software developers, web developers, data analysts, system administrators, cloud engineers, QA testers, and technical support engineers at IT companies, startups, and technology consulting firms."
    },
    {
      q: "Is there an internship included in the BCA curriculum?",
      a: "Yes. During Semester 5, students participate in a compulsory 8-week corporate internship at IT companies, startups, or software development houses to gain real-world industry experience."
    },
    {
      q: "What is the eligibility requirement for BCA admission?",
      a: "Students who have completed class twelve (any stream, preferably with mathematics) from a recognized board are eligible. Selection is based on aptitude evaluation, academic performance, and a personal interview."
    }
  ];

  const mcaFaqs = [
    {
      q: "What is the MCA program in AI, Software Engineering and Applied Computing?",
      a: "The MCA is a postgraduate technology pathway for learners who want stronger foundations in software engineering, cloud, databases, AI, system design, product thinking, and deployment-focused projects."
    },
    {
      q: "What is the eligibility for the MCA Program?",
      a: "Applicants with a Bachelor's degree in Computer Applications, Computer Science, IT, or related fields from a recognized university are eligible. Strong programming skills and analytical aptitude are evaluated during the admission process."
    },
    {
      q: "What makes this MCA different from traditional programs?",
      a: "This MCA goes beyond traditional software education. It focuses on real-world engineering, clean code principles, AI tooling, deployment readiness, and full-system thinking with industry-level capstone projects and internships."
    },
    {
      q: "What roles can I pursue after completing the MCA?",
      a: "Graduates can pursue roles as software engineers, full stack developers, backend developers, data engineers, ML engineers, AI/NLP researchers, systems architects, DevOps engineers, cloud engineers, and product managers."
    }
  ];

  // Auto-switch outcomes carousel
  useEffect(() => {
    if (activeSection !== 'outcomes') return;
    const interval = setInterval(() => {
      setAlumniIndex((prev) => (prev + 1) % alumni.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [activeSection]);

  const filteredBlogs = blogFilter === 'All' ? blogs : blogs.filter(b => b.category === blogFilter);
  const paginatedBlogs = filteredBlogs.slice((blogPage - 1) * pageSize, blogPage * pageSize);
  const totalPages = Math.max(1, Math.ceil(filteredBlogs.length / pageSize));

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail || !formPhone) return;
    setFormError('');
    setIsSendingOtp(true);

    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/otp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formPhone })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setFormError(data.error || 'Failed to send OTP. Please try again.');
        setIsSendingOtp(false);
        return;
      }

      setPendingLead({
        phone: formPhone,
        localData: {
          name: formName,
          email: formEmail,
          phone: formPhone,
          program: formProgram,
          background: `Admissions Portal Candidate from ${formCity || 'Not Specified'}`,
          experience: `Career Goal: ${proposalAbstract || 'No message explanation defined.'}`
        },
        leadData: {
          fullName: formName,
          email: formEmail,
          phone: formPhone,
          programCategory: formProgram,
          programSpecialization: formCity || '',
          source: 'AcademicHub Apply Now Form'
        }
      });
    } catch (err) {
      console.error('Failed to send OTP:', err);
      setFormError('Network error. Please try again.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleProposalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposalName || !proposalEmail || !proposalTopic || !proposalAbstract) return;
    setProposalSubmitted(true);
  };

  // Synchronize Program and Option state mapping for consistent routing
  let currentOption = 'overview';

  if (activeSubTab.startsWith('bba-')) {
    currentOption = activeSubTab.replace('bba-', '');
  } else if (activeSubTab.startsWith('mba-')) {
    currentOption = activeSubTab.replace('mba-', '');
  } else if (activeSubTab.startsWith('brem-')) {
    currentOption = activeSubTab.replace('brem-', '');
  } else if (activeSubTab.startsWith('bca-')) {
    currentOption = activeSubTab.replace('bca-', '');
  } else if (activeSubTab.startsWith('mca-')) {
    currentOption = activeSubTab.replace('mca-', '');
  } else {
    currentOption = 'overview';
  }

  const selectProgramOption = (course: 'bba' | 'mba' | 'bca' | 'mca' | string, option: string) => {
    navigate('/' + activeSection + '/' + `${course}-${option}`);
  };

  useEffect(() => {
    if (activeSubTab.startsWith('bba-') || activeSubTab.startsWith('brem-')) {
      setActiveCourse('bba');
    } else if (activeSubTab.startsWith('bca-')) {
      setActiveCourse('bca');
    } else if (activeSubTab.startsWith('mba-') || activeSubTab.startsWith('mbs-') || activeSubTab.startsWith('pg-')) {
      setActiveCourse('mba');
    } else if (activeSubTab.startsWith('mca-')) {
      setActiveCourse('mca');
    }
  }, [activeSubTab]);

  useEffect(() => {
    if (activeCourse === 'bba' || activeCourse === 'bca') {
      setUgOpen(true);
      setPgOpen(false);
    } else {
      setPgOpen(true);
      setUgOpen(false);
    }
  }, [activeCourse]);

  // Define sidebars options
  const sidebarMenus = {
    programs: [
      { id: 'overview', label: 'Overview', icon: BookOpen },
      { id: 'objective', label: 'Programme Objective', icon: Target },
      { id: 'structure', label: 'Programme Structure', icon: ClipboardList },
      { id: 'admission', label: 'Admission Process', icon: GraduationCap },
      { id: 'fees', label: 'Fees Structure', icon: HandCoins },
      { id: 'exam', label: 'Examination', icon: Award },
      { id: 'faq', label: 'Frequently Asked Questions', icon: HelpCircle },
      { id: 'contact', label: 'Contact Details', icon: MapPin },
    ],
    about: [
      { id: 'why-ssi', label: 'Why Lotlite?', icon: Sparkles },
      { id: 'founders', label: 'Our Founders', icon: Users },
      { id: 'all', label: 'Academic board and faculty', icon: Users },
      { id: 'research', label: 'Intellectual papers', icon: BookOpenCheck },
    ],
    outcomes: [
      { id: 'stats', label: 'Placements & CTC Stats', icon: Briefcase },
      { id: 'carousel', label: 'Alumni Success Stories', icon: ChevronRight },
    ],
    incubation: [],
    blogs: []
  };

  // Helper title names for the outer section
  const sectionHeadings: Record<string, { tag: string; title: string; desc: string }> = {
    programs: {
      tag: "PROFESSIONAL REAL ESTATE CURRICULA",
      title: "Academic Programs",
      desc: "Choose your path. Taught in accordance with RICS guidelines, directed by seasoned developers and expert startup venture owners."
    },
    about: {
      tag: "FOUNDER LED PEDAGOGY",
      title: "About Lotlite & Legacy",
      desc: "Real industry leadership. We trace our legacy directly to pioneering developers, replacing classical textbook memorization with street-smart real deal-making."
    },
    outcomes: {
      tag: "VERIFIED PLACEMENT RESULTS",
      title: "Alumni Outcomes",
      desc: "Track real CTC results, career trajectories, and placements analytics from our past three student cohorts."
    },
    incubation: {
      tag: "STUDENT VENTURE ACCELEROMETER",
      title: "Incubation & Projects",
      desc: "Access a robust ₹5Cr venture pool. Support student proptech prototypes moving cleanly from beta deployment to monetization."
    },
    blogs: {
      tag: "PERSPECTIVES & REAL ESTATE REVIEWS",
      title: "Sprints & Chronicle",
      desc: "Read the analytical studies on artificial intelligence, pricing mechanics, and spatial urban changes transforming Indian development."
    }
  };

  const currentMetadata = sectionHeadings[activeSection] || { tag: '', title: '', desc: '' };
  const currentSidebarOptions = sidebarMenus[activeSection as keyof typeof sidebarMenus] || [];

  const isModalViewActive = !!(selectedCase);

  return (
    <div className={`py-6 pb-6 relative scroll-mt-24 ${isModalViewActive ? 'z-[99999]' : 'z-10'}`} id="academic-hub">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-10 lg:px-12 bg-white/75 backdrop-blur-lg rounded-3xl p-5 sm:p-8 md:p-12 shadow-sm border border-border">

        {activeSection !== 'programs' && activeSection !== 'admissions' && activeSection !== 'incubation' && (
          <div className="border-b border-black/5 dark:border-white/5 pb-8 mb-10 text-center md:text-left">
            <span className="text-wine text-xs font-bold uppercase tracking-[0.4em] block mb-3">
              {currentMetadata.tag}
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl text-black font-serif font-light leading-none">
              {currentMetadata.title}
            </h2>
            <p className="text-muted dark:text-neutral-400 text-sm mt-4 max-w-3xl font-medium leading-relaxed">
              {currentMetadata.desc}
            </p>
          </div>
        )}



        {/* ======================= DETAILS LAYOUT FRAMEWORK ======================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* SINGLE FULL-WIDTH AREA FOR DETAIL PANELS */}
          <div className="lg:col-span-12 w-full" id="side-content-pane">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeSection}-${activeCourse}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className={(activeSection === 'about' || activeSection === 'admissions' || activeSection === 'programs' || activeSection === 'incubation') ? "w-full" : "bg-card/75 backdrop-blur-md border border-border rounded-3xl p-6 md:p-8 lg:p-10 shadow-xs"}
              >

                {/* ======================================================== */}
                {/* 1. SECTIONS CORRESPONDING TO PROGRAMS                    */}
                {/* ======================================================== */}
                {activeSection === 'programs' && (
                  <div className="space-y-10">
                    {/* 1.1 BBA PROGRAM DETAILS */}
                    {activeCourse === 'bba' && (
                      <>
                        <div className="relative bg-white text-black rounded-3xl overflow-hidden shadow-xl p-6 md:p-10 lg:p-12 mb-10 flex flex-col lg:flex-row gap-10 items-center border border-black/5">
                          {/* Abstract Background Elements matching Home Hero */}
                          <div className="absolute inset-0 z-0 bg-white" />
                          <div
                            className="absolute inset-0 z-[1] bg-cover bg-center opacity-[0.15] pointer-events-none"
                            style={{
                              backgroundImage: `url('/images/hero_background.png')`
                            }}
                          />
                          <div className="absolute inset-0 z-[2] bg-gradient-to-br from-white via-white/80 via-40% to-[#C21A22]/20 to-100% pointer-events-none" />
                          <div className="absolute top-0 right-0 w-96 h-96 bg-wine/10 blur-[100px] rounded-full mix-blend-multiply z-[3] pointer-events-none" />
                          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 blur-[100px] rounded-full mix-blend-multiply z-[3] pointer-events-none" />

                          <div className="relative z-10 flex-1 space-y-6">


                            <span className="text-wine text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] block">
                              India's Top BBA & Real Estate Program
                            </span>

                            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light tracking-tight leading-[1.1] text-black">
                              <span className="text-wine">BBA</span> in Business, Real Estate & Marketing
                            </h3>

                            <div className="space-y-4 pt-2">
                              <div className="flex gap-3 items-start">
                                <CheckCircle2 size={20} className="text-wine shrink-0 mt-0.5" />
                                <p className="text-sm md:text-base text-neutral-600 font-medium leading-relaxed">
                                  Enroll into India's pioneering BBA Program; Learn real estate, marketing, and business management the way top developers build, deploy, and scale properties.
                                </p>
                              </div>
                              <div className="flex gap-3 items-start">
                                <CheckCircle2 size={20} className="text-wine shrink-0 mt-0.5" />
                                <p className="text-sm md:text-base text-neutral-600 font-medium leading-relaxed">
                                  Join an alumni network of professionals at Hiranandani, Lodha, PropTiger, Square Yards, DLF, Godrej Properties, and more.
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="relative z-10 w-full lg:w-[380px] bg-white text-black rounded-2xl p-6 md:p-8 shadow-xl shrink-0">
                            <h4 className="text-xl font-bold text-black mb-6">Secure your spot now!</h4>

                            <div className="space-y-6">
                              <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                  <Clock size={18} className="text-gray-600" />
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 font-medium">Duration</p>
                                  <p className="text-sm font-bold text-black">3 Years (Undergraduate)</p>
                                </div>
                              </div>

                              <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                  <Calendar size={18} className="text-gray-600" />
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 font-medium">Admission Deadline</p>
                                  <p className="text-sm font-bold text-black">15-Jun-26</p>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mt-8">
                              <button
                                className="w-full py-3 rounded-lg border-2 border-black text-black font-bold text-sm hover:bg-black hover:text-white transition-colors text-center cursor-pointer"
                                onClick={() => setApplyPopupOpen(true)}
                              >
                                Apply Now
                              </button>
                              <button
                                onClick={() => handleDownloadBrochure('bba')}
                                className="w-full py-3 rounded-lg bg-[#de2341] text-white font-bold text-sm hover:bg-red-700 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                              >
                                <FileDown size={16} /> Syllabus
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="bg-card/75 backdrop-blur-md border border-border rounded-3xl p-6 md:p-8 lg:p-10 shadow-xs space-y-6">
                          <span className="inline-block text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">AIMS & PHILOSOPHY</span>
                          <h3 className="text-3xl font-serif text-black leading-tight">BBA Program Objectives</h3>
                          <p className="text-muted text-xs md:text-sm font-medium leading-relaxed">
                            Our primary mission is to create highly-skilled, operational business professionals who understand the physical, digital, and regulatory dimensions of modern marketing and property portfolios. Students will achieve these core competencies:
                          </p>
                          <div className="space-y-4 pt-2">
                            {[
                              { title: "Marketing & Sales Strategy", desc: "Gain professional confidence by executing marketing campaigns, tracking user conversion rates, and administering distribution channels." },
                              { title: "Comprehensive Financial Accounting", desc: "Build standard ledger books, master cost calculation models, analyze balance margin trends, and balance cash flows." },
                              { title: "Applied Operations Research", desc: "Solve logistical scheduling problems, manage inventories efficiently, configure database systems, and design workflow models." }
                            ].map((obj, i) => (
                              <div key={i} className="flex gap-3 p-4 bg-card border border-border rounded-2xl">
                                <div className="w-6 h-6 rounded-full bg-wine-light text-wine border border-wine-light-border font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                                  0{i + 1}
                                </div>
                                <div>
                                  <h5 className="font-bold text-black text-xs uppercase tracking-wide">{obj.title}</h5>
                                  <p className="text-[11px] text-muted leading-normal font-medium mt-1">{obj.desc}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-card/75 backdrop-blur-md border border-border rounded-3xl p-6 md:p-8 lg:p-10 shadow-xs space-y-6">
                          <span className="inline-block text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">3-YEAR PATHWAY</span>
                          <h3 className="text-3xl font-serif text-black leading-tight">BBA Programme Structure</h3>
                          <p className="text-muted text-xs md:text-sm font-medium leading-relaxed">
                            A comprehensive, six-semester modular itinerary. Highlights include core organizational theories, business mathematics, analytics foundation and capstone projects. Click on any year below to view terms in detail.
                          </p>
                          <ProgramStructureDetail data={bbaStructure} />
                        </div>

                        <div className="bg-card/75 backdrop-blur-md border border-border rounded-3xl p-6 md:p-8 lg:p-10 shadow-xs space-y-6">
                          <span className="inline-block text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">ENROLLMENT PORTAL</span>
                          <h3 className="text-3xl font-serif text-black leading-tight">BBA Admission Process</h3>
                          <p className="text-muted text-xs md:text-sm font-medium leading-relaxed">
                            Selection is highly selective, evaluating raw competence, general analytical acumen, and entrepreneurial intent. Follow this 4-step pathway.
                          </p>

                          <div className="grid sm:grid-cols-4 gap-4 py-4">
                            {[
                              { step: "01", label: "Online Inquiry", desc: "Submit 12th aggregates along with baseline academic credentials." },
                              { step: "02", label: "Aptitude Evaluator", desc: "Attempt diagnostic tests covering business and descriptive logic." },
                              { step: "03", label: "Interactive Interview", desc: "Discuss goals with directors to evaluate drive and program alignment." },
                              { step: "04", label: "Direct Admittance", desc: "Secure your enrollment and finalize registration procedures." }
                            ].map((step, idx) => (
                              <div key={idx} className="bg-card border border-border p-5 rounded-2xl shadow-xs transition-colors hover:border-wine/25">
                                <span className="text-wine text-3xl font-serif font-black">{step.step}</span>
                                <h5 className="font-extrabold text-black text-xs sm:text-sm uppercase tracking-wider mt-3 mb-1.5 leading-tight">{step.label}</h5>
                                <p className="text-[11px] text-muted leading-relaxed font-semibold">{step.desc}</p>
                              </div>
                            ))}
                          </div>

                          {/* Ready to build a career in real estate CTA */}
                          <div
                            className="bg-gradient-to-br from-white via-white/85 to-[#C21A22]/20 dark:from-zinc-950 dark:via-zinc-950/85 dark:to-[#C21A22]/25 border border-neutral-200/65 dark:border-zinc-800/80 rounded-3xl py-8 px-6 md:py-10 md:px-12 relative overflow-hidden shadow-md mt-6"
                            id="bba-admission-cta-card"
                          >
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 text-left">
                              <div className="space-y-2.5 max-w-2xl">
                                <h3 className="text-2xl md:text-3xl text-black dark:text-neutral-100 font-serif tracking-tight leading-tight">
                                  Ready to build a career in <span className="text-wine font-bold">real estate?</span>
                                </h3>
                                <p className="text-xs md:text-sm text-muted dark:text-zinc-400 leading-relaxed font-semibold">
                                  Speak to the admissions team and understand which programme is right for you.
                                </p>
                              </div>

                              <div className="shrink-0 w-full md:w-auto">
                                <button
                                  onClick={() => {
                                    navigate('/admissions/all-applications');
                                    setTimeout(() => {
                                      const element = document.getElementById('workspace-section');
                                      if (element) {
                                        element.scrollIntoView({ behavior: 'smooth' });
                                      }
                                    }, 100);
                                  }}
                                  className="bg-wine hover:bg-black text-white font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-full shadow-lg transition-all w-full md:w-auto text-center inline-flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
                                >
                                  Start Admission
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-card/75 backdrop-blur-md border border-border rounded-3xl p-6 md:p-8 lg:p-10 shadow-xs space-y-6">
                          <span className="inline-block text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">FEE TRANSPARENCY</span>
                          <h3 className="text-3xl font-serif text-black leading-tight">BBA Tuition Structure</h3>
                          <p className="text-muted text-xs md:text-sm font-medium leading-relaxed">
                            Transparent funding structure with zero hidden levies. Lotlite maintains multiple financial aid layouts to keep education highly accessible.
                          </p>

                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-card border border-border p-6 rounded-2xl">
                              <span className="text-[9px] font-extrabold text-muted uppercase tracking-widest block mb-1">Standard Semester Charges</span>
                              <h4 className="text-3xl font-serif text-black font-black">₹1,50,000 <span className="text-xs text-muted">/ Sem</span></h4>
                              <ul className="text-xs text-muted space-y-2 mt-4 font-semibold border-t border-border pt-4">
                                <li className="flex items-center gap-2"><Check size={12} className="text-wine" /> Complete Tuition Coverage</li>
                                <li className="flex items-center gap-2"><Check size={12} className="text-wine" /> Marketing Tools & Modern Research Access</li>
                                <li className="flex items-center gap-2"><Check size={12} className="text-wine" /> Industrial Training Seminars Fee Include</li>
                              </ul>
                            </div>

                            <div className="bg-card border border-border p-6 rounded-2xl flex flex-col justify-between">
                              <div>
                                <span className="text-[9px] font-extrabold text-wine uppercase tracking-widest block mb-1">Founders Merit Scholarships</span>
                                <h4 className="text-2xl font-serif text-black font-bold">Up to 50% Aid</h4>
                                <p className="text-xs text-muted mt-2 leading-relaxed font-semibold">
                                  Awarded selectively to applicants scoring high aggregates on standard analytical entrance formats or exhibiting extreme entrepreneurial skills.
                                </p>
                              </div>
                              <span className="text-[9px] font-extrabold uppercase tracking-widest text-black/60 block mt-4">Calculations audited in accordance with state guidelines</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-card/75 backdrop-blur-md border border-border rounded-3xl p-6 md:p-8 lg:p-10 shadow-xs space-y-6">
                          <span className="inline-block text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">APPLIED EVALUATION</span>
                          <h3 className="text-3xl font-serif text-black leading-tight">BBA Examination & Grading</h3>
                          <p className="text-muted text-sm leading-relaxed font-semibold">
                            We do not believe in standard rote classroom memory loops. Lotlite evaluates graduates based on continuous real-world execution capacity. Grading metrics are split strictly across three transparent vectors:
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                            {[
                              { pct: "40%", label: "Live Case Studies", desc: "Performance conducting field surveys, sector research, brand auditing, and core marketing modeling." },
                              { pct: "30%", label: "Course Internships", desc: "Summer residency report scores evaluated directly by partner corporate teams and directors." },
                              { pct: "30%", label: "Diagnostic Exams", desc: "Semester examinations measuring comprehension of financial ledgers, corporate laws, and marketing strategy frameworks." }
                            ].map((exam, i) => (
                              <div key={i} className="bg-card border border-border p-6 rounded-2xl">
                                <span className="text-4xl font-serif font-black text-wine">{exam.pct}</span>
                                <h5 className="font-extrabold text-xs uppercase tracking-wider text-black my-2">{exam.label}</h5>
                                <p className="text-[10px] text-muted leading-normal font-medium">{exam.desc}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-card/75 backdrop-blur-md border border-border rounded-3xl p-6 md:p-8 lg:p-10 shadow-xs space-y-6">
                          <span className="inline-block text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">ACADEMIC OFFICES</span>
                          <h3 className="text-3xl font-serif text-black leading-tight">Admissions Contact Details</h3>
                          <p className="text-muted text-xs md:text-sm font-medium leading-relaxed">
                            Get in touch with executive coordinators at our prime academic compound. We coordinate site tours on active request.
                          </p>

                          <div className="pt-2 max-w-2xl">
                            <div className="bg-card border border-border p-6 rounded-2xl space-y-4">
                              <h4 className="font-extrabold text-black text-xs uppercase tracking-wider border-b border-border pb-2">Academic Coordination Desk</h4>
                              <div className="space-y-3 text-xs text-muted font-semibold">
                                <div className="flex items-center gap-3"><Mail size={14} className="text-wine" /> <span>bba@lotlite-education.in</span></div>
                                <div className="flex items-center gap-3"><Phone size={14} className="text-wine" /> <span>+91 80 4912 3500</span></div>
                                <div className="flex items-start gap-3"><Building2 size={14} className="text-wine mt-0.5" /> <span className="leading-relaxed">Unit No 1, VTP Aethereus Commercial, Commercial 1, Mahalunge, Pune, Maharashtra 411045</span></div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Certificate Card */}
                        <div className="bg-card/75 backdrop-blur-md border border-border rounded-3xl p-6 md:p-8 lg:p-10 shadow-xs space-y-6">
                          <span className="inline-block text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">CREDENTIAL AWARD</span>
                          <h3 className="text-3xl font-serif text-black leading-tight">BBA Completion Certificate</h3>
                          <div className="bg-white dark:bg-zinc-900/60 text-neutral-800 dark:text-neutral-200 p-6 sm:p-8 md:p-10 rounded-3xl border border-neutral-200/80 dark:border-zinc-800/80 relative overflow-hidden shadow-sm hover:border-wine/25 transition-colors duration-300" id="bba-credentials-certificate-card">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-wine/5 rounded-full blur-3xl pointer-events-none" />
                            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-neutral-100/50 rounded-full blur-2xl pointer-events-none" />
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
                              <div className="lg:col-span-7 flex flex-col justify-center space-y-4 text-left">
                                <span className="inline-block bg-wine px-3 py-1 rounded-full text-[8.5px] font-black uppercase tracking-widest text-[#ffffff] border border-white/10 shadow-xs w-fit">GRADUATE EXCELLENCE CREDENTIAL</span>
                                <h4 className="text-2xl sm:text-3xl font-serif text-black tracking-tight leading-tight">Professional Certificate in Real Estate & Marketing</h4>
                                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-semibold">
                                  Earn an industry-renowned, physical and secure digital certificate of completion backed directly by Lotlite Capital and the School of Real Estate Studies. Perfect for LinkedIn portfolios, career accelerations, and global recruitment validations.
                                </p>
                                <div className="flex flex-wrap gap-4 pt-2 text-[10px] font-bold text-wine">
                                  <span className="flex items-center gap-1"><Award size={12} /> RICS Standardized Alignment</span>
                                  <span className="flex items-center gap-0.5 font-mono">100% Verified Profile</span>
                                </div>
                                <div className="mt-4 pt-4 border-t border-neutral-200/60 flex items-center gap-3">
                                  <span className="text-[8.5px] font-mono text-wine font-bold bg-wine-light px-2.5 py-1 rounded-md border border-wine-light-border">ID: LOTLITE-BBA-2026</span>
                                  <span className="text-[10px] text-neutral-500 font-extrabold uppercase">Secure Verification Registered</span>
                                </div>
                              </div>
                              <div className="lg:col-span-5 flex items-center justify-center">
                                <div className="w-full max-w-md aspect-[29.7/21] bg-white border border-neutral-300 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-2 bg-gradient-to-tr from-neutral-50 to-white">
                                  <div className="w-full h-full border border-neutral-200 rounded-lg overflow-hidden relative">
                                    <img
                                      src={websiteData?.bba_certificate_url || "https://images.unsplash.com/photo-1578572717361-b44c66914561?auto=format&fit=crop&w=800&q=80"}
                                      alt="BBA Certificate Mockup"
                                      className="w-full h-full object-cover grayscale-0"
                                      referrerPolicy="no-referrer"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-card/75 backdrop-blur-md border border-border rounded-3xl p-6 md:p-8 lg:p-10 shadow-xs space-y-6">
                          <span className="inline-block text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">ANSWERS TO YOUR QUESTIONS</span>
                          <h3 className="text-3xl font-serif text-black leading-tight">Frequently Asked Questions</h3>
                          <p className="text-muted text-xs md:text-sm font-medium leading-relaxed">
                            Common queries about the BBA program structure, entry pathways, and requirements.
                          </p>

                          <div className="space-y-4 pt-2">
                            {bbaFaqs.map((faq, idx) => (
                              <div
                                key={idx}
                                className="bg-card border border-border rounded-2xl overflow-hidden hover:border-wine/30 transition-colors shadow-sm animate-fade-in"
                              >
                                <button
                                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                  className="w-full px-6 py-5 flex items-center justify-between text-left group transition-all"
                                >
                                  <span className="text-sm font-extrabold text-black group-hover:text-wine transition-colors">{faq.q}</span>
                                  <motion.div
                                    animate={{ rotate: openFaq === idx ? 180 : 0 }}
                                    className="text-wine shrink-0 ml-4"
                                  >
                                    <ChevronDown size={12} />
                                  </motion.div>
                                </button>
                                <AnimatePresence initial={false}>
                                  {openFaq === idx && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      <div className="px-6 pb-5 text-xs text-muted leading-relaxed font-semibold border-t border-border/10 pt-3">
                                        {faq.a}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="border-t border-black/5 pt-12 md:pt-16" />

                        {/* Final CTA redirect box */}
                        <div className="bg-wine-light/50 border border-wine-light-border p-8 md:p-10 rounded-3xl text-center space-y-4 shadow-sm" id="final-bba-cta">
                          <span className="inline-block text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">JOIN THE UPCOMING COHORT</span>
                          <h3 className="text-2xl sm:text-3xl text-black font-serif tracking-tight">Ready to begin your journey in BBA?</h3>
                          <p className="text-muted text-xs md:text-sm font-medium max-w-2xl mx-auto leading-relaxed">
                            Admissions are currently open for our upcoming batch. Complete your online profile briefing inside our secure system in under 2 minutes.
                          </p>
                          <div className="pt-2">
                            <button
                              onClick={() => {
                                navigate('/admissions/all-applications');
                                const element = document.getElementById('workspace-section');
                                if (element) {
                                  element.scrollIntoView({ behavior: 'smooth' });
                                }
                              }}
                              className="bg-wine hover:bg-wine-hover text-white font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-xl shadow-lg shadow-wine/10 cursor-pointer inline-flex items-center gap-2 select-none transform hover:-translate-y-0.5 transition-all"
                            >
                              <GraduationCap size={16} />
                              Apply for Course
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                    {/* 1.3 BCA PROGRAM DETAILS */}
                    {activeCourse === 'bca' && (
                      <>
                        <div className="relative bg-white text-black rounded-3xl overflow-hidden shadow-xl p-6 md:p-10 lg:p-12 mb-10 flex flex-col lg:flex-row gap-10 items-center border border-black/5">
                          <div className="absolute inset-0 z-0 bg-white" />
                          <div
                            className="absolute inset-0 z-[1] bg-cover bg-center opacity-[0.15] pointer-events-none"
                            style={{
                              backgroundImage: `url('/images/hero_background.png')`
                            }}
                          />
                          <div className="absolute inset-0 z-[2] bg-gradient-to-br from-white via-white/80 via-40% to-[#C21A22]/20 to-100% pointer-events-none" />
                          <div className="absolute top-0 right-0 w-96 h-96 bg-wine/10 blur-[100px] rounded-full mix-blend-multiply z-[3] pointer-events-none" />
                          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 blur-[100px] rounded-full mix-blend-multiply z-[3] pointer-events-none" />

                          <div className="relative z-10 flex-1 space-y-6">
                            <span className="text-wine text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] block">
                              India's Premier BCA & Technology Program
                            </span>

                            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light tracking-tight leading-[1.1] text-black">
                              <span className="text-wine">BCA</span> in Computer Applications, Data Science & Software Development
                            </h3>

                            <div className="space-y-4 pt-2">
                              <div className="flex gap-3 items-start">
                                <CheckCircle2 size={20} className="text-wine shrink-0 mt-0.5" />
                                <p className="text-sm md:text-base text-neutral-600 font-medium leading-relaxed">
                                  Enrol into a comprehensive undergraduate program covering programming, databases, web development, AI fundamentals, and real-world software engineering.
                                </p>
                              </div>
                              <div className="flex gap-3 items-start">
                                <CheckCircle2 size={20} className="text-wine shrink-0 mt-0.5" />
                                <p className="text-sm md:text-base text-neutral-600 font-medium leading-relaxed">
                                  Graduate with hands-on skills in Python, Java, cloud computing, mobile development, and machine learning ready for the modern tech industry.
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="relative z-10 w-full lg:w-[380px] bg-white text-black rounded-2xl p-6 md:p-8 shadow-xl shrink-0">
                            <h4 className="text-xl font-bold text-black mb-6">Secure your spot now!</h4>

                            <div className="space-y-6">
                              <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                  <Clock size={18} className="text-gray-600" />
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 font-medium">Duration</p>
                                  <p className="text-sm font-bold text-black">3 Years (Undergraduate)</p>
                                </div>
                              </div>

                              <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                  <Calendar size={18} className="text-gray-600" />
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 font-medium">Admission Deadline</p>
                                  <p className="text-sm font-bold text-black">15-Jun-26</p>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mt-8">
                              <button
                                className="w-full py-3 rounded-lg border-2 border-black text-black font-bold text-sm hover:bg-black hover:text-white transition-colors text-center cursor-pointer"
                                onClick={() => setApplyPopupOpen(true)}
                              >
                                Apply Now
                              </button>
                              <button
                                onClick={() => handleDownloadBrochure('bca')}
                                className="w-full py-3 rounded-lg bg-[#de2341] text-white font-bold text-sm hover:bg-red-700 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                              >
                                <FileDown size={16} /> Syllabus
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="bg-card/75 backdrop-blur-md border border-border rounded-3xl p-6 md:p-8 lg:p-10 shadow-xs space-y-6">
                          <span className="inline-block text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">AIMS & PHILOSOPHY</span>
                          <h3 className="text-3xl font-serif text-black leading-tight">BCA Program Objectives</h3>
                          <p className="text-muted text-xs md:text-sm font-medium leading-relaxed">
                            Our primary mission is to create technically skilled computing professionals who can design, develop, and deploy software systems. Students will achieve these core competencies:
                          </p>
                          <div className="space-y-4 pt-2">
                            {[
                              { title: "Programming & Software Development", desc: "Master multiple programming languages, build production-grade applications, and follow industry-standard coding practices." },
                              { title: "Data Management & Analysis", desc: "Design and manage databases, write optimized SQL queries, perform data analysis, and build data-driven applications." },
                              { title: "Web & Mobile Technologies", desc: "Develop responsive web applications, mobile apps, and RESTful APIs using modern frameworks and deployment workflows." }
                            ].map((obj, i) => (
                              <div key={i} className="flex gap-3 p-4 bg-card border border-border rounded-2xl">
                                <div className="w-6 h-6 rounded-full bg-wine-light text-wine border border-wine-light-border font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                                  0{i + 1}
                                </div>
                                <div>
                                  <h5 className="font-bold text-black text-xs uppercase tracking-wide">{obj.title}</h5>
                                  <p className="text-[11px] text-muted leading-normal font-medium mt-1">{obj.desc}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-card/75 backdrop-blur-md border border-border rounded-3xl p-6 md:p-8 lg:p-10 shadow-xs space-y-6">
                          <span className="inline-block text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">3-YEAR PATHWAY</span>
                          <h3 className="text-3xl font-serif text-black leading-tight">BCA Programme Structure</h3>
                          <p className="text-muted text-xs md:text-sm font-medium leading-relaxed">
                            A comprehensive, six-semester modular itinerary covering programming foundations, software development, databases, AI, and capstone projects. Click on any year below to view terms in detail.
                          </p>
                          <ProgramStructureDetail data={bcaStructure} />
                        </div>

                        <div className="bg-card/75 backdrop-blur-md border border-border rounded-3xl p-6 md:p-8 lg:p-10 shadow-xs space-y-6">
                          <span className="inline-block text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">ENROLLMENT PORTAL</span>
                          <h3 className="text-3xl font-serif text-black leading-tight">BCA Admission Process</h3>
                          <p className="text-muted text-xs md:text-sm font-medium leading-relaxed">
                            Selection evaluates analytical aptitude, programming interest, and academic performance. Follow this 4-step pathway.
                          </p>

                          <div className="grid sm:grid-cols-4 gap-4 py-4">
                            {[
                              { step: "01", label: "Online Inquiry", desc: "Submit 12th aggregates along with baseline academic credentials." },
                              { step: "02", label: "Aptitude Evaluator", desc: "Attempt diagnostic tests covering logical reasoning and basic mathematics." },
                              { step: "03", label: "Interactive Interview", desc: "Discuss goals with directors to evaluate technical aptitude and program alignment." },
                              { step: "04", label: "Direct Admittance", desc: "Secure your enrollment and finalize registration procedures." }
                            ].map((step, idx) => (
                              <div key={idx} className="bg-card border border-border p-5 rounded-2xl shadow-xs transition-colors hover:border-wine/25">
                                <span className="text-wine text-3xl font-serif font-black">{step.step}</span>
                                <h5 className="font-extrabold text-black text-xs sm:text-sm uppercase tracking-wider mt-3 mb-1.5 leading-tight">{step.label}</h5>
                                <p className="text-[11px] text-muted leading-relaxed font-semibold">{step.desc}</p>
                              </div>
                            ))}
                          </div>

                          <div
                            className="bg-gradient-to-br from-white via-white/85 to-[#C21A22]/20 dark:from-zinc-950 dark:via-zinc-950/85 dark:to-[#C21A22]/25 border border-neutral-200/65 dark:border-zinc-800/80 rounded-3xl py-8 px-6 md:py-10 md:px-12 relative overflow-hidden shadow-md mt-6"
                            id="bca-admission-cta-card"
                          >
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 text-left">
                              <div className="space-y-2.5 max-w-2xl">
                                <h3 className="text-2xl md:text-3xl text-black dark:text-neutral-100 font-serif tracking-tight leading-tight">
                                  Ready to build a career in <span className="text-wine font-bold">technology?</span>
                                </h3>
                                <p className="text-xs md:text-sm text-muted dark:text-zinc-400 leading-relaxed font-semibold">
                                  Speak to the admissions team and understand which programme is right for you.
                                </p>
                              </div>

                              <div className="shrink-0 w-full md:w-auto">
                                <button
                                  onClick={() => {
                                    navigate('/admissions/all-applications');
                                    setTimeout(() => {
                                      const element = document.getElementById('workspace-section');
                                      if (element) {
                                        element.scrollIntoView({ behavior: 'smooth' });
                                      }
                                    }, 100);
                                  }}
                                  className="bg-wine hover:bg-black text-white font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-full shadow-lg transition-all w-full md:w-auto text-center inline-flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
                                >
                                  Start Admission
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-card/75 backdrop-blur-md border border-border rounded-3xl p-6 md:p-8 lg:p-10 shadow-xs space-y-6">
                          <span className="inline-block text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">FEE TRANSPARENCY</span>
                          <h3 className="text-3xl font-serif text-black leading-tight">BCA Tuition Structure</h3>
                          <p className="text-muted text-xs md:text-sm font-medium leading-relaxed">
                            Transparent funding structure with zero hidden levies. Lotlite maintains multiple financial aid layouts to keep education highly accessible.
                          </p>

                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-card border border-border p-6 rounded-2xl">
                              <span className="text-[9px] font-extrabold text-muted uppercase tracking-widest block mb-1">Standard Semester Charges</span>
                              <h4 className="text-3xl font-serif text-black font-black">₹1,25,000 <span className="text-xs text-muted">/ Sem</span></h4>
                              <ul className="text-xs text-muted space-y-2 mt-4 font-semibold border-t border-border pt-4">
                                <li className="flex items-center gap-2"><Check size={12} className="text-wine" /> Complete Tuition Coverage</li>
                                <li className="flex items-center gap-2"><Check size={12} className="text-wine" /> Programming Tools & Lab Access</li>
                                <li className="flex items-center gap-2"><Check size={12} className="text-wine" /> Cloud Computing Credits Included</li>
                              </ul>
                            </div>

                            <div className="bg-card border border-border p-6 rounded-2xl flex flex-col justify-between">
                              <div>
                                <span className="text-[9px] font-extrabold text-wine uppercase tracking-widest block mb-1">Merit Scholarships</span>
                                <h4 className="text-2xl font-serif text-black font-bold">Up to 50% Aid</h4>
                                <p className="text-xs text-muted mt-2 leading-relaxed font-semibold">
                                  Awarded selectively to applicants scoring high aggregates on analytical entrance formats or exhibiting exceptional programming skills.
                                </p>
                              </div>
                              <span className="text-[9px] font-extrabold uppercase tracking-widest text-black/60 block mt-4">Calculations audited in accordance with state guidelines</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-card/75 backdrop-blur-md border border-border rounded-3xl p-6 md:p-8 lg:p-10 shadow-xs space-y-6">
                          <span className="inline-block text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">APPLIED EVALUATION</span>
                          <h3 className="text-3xl font-serif text-black leading-tight">BCA Examination & Grading</h3>
                          <p className="text-muted text-sm leading-relaxed font-semibold">
                            We evaluate graduates based on continuous real-world execution capacity, not rote memorization. Grading is split across three transparent vectors:
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                            {[
                              { pct: "40%", label: "Lab Projects & Assignments", desc: "Performance building software applications, coding exercises, and technical documentation." },
                              { pct: "30%", label: "Industry Internship", desc: "Corporate internship evaluation by partner IT companies and senior developers." },
                              { pct: "30%", label: "Written Examinations", desc: "Semester examinations measuring comprehension of algorithms, databases, and system concepts." }
                            ].map((exam, i) => (
                              <div key={i} className="bg-card border border-border p-6 rounded-2xl">
                                <span className="text-4xl font-serif font-black text-wine">{exam.pct}</span>
                                <h5 className="font-extrabold text-xs uppercase tracking-wider text-black my-2">{exam.label}</h5>
                                <p className="text-[10px] text-muted leading-normal font-medium">{exam.desc}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-card/75 backdrop-blur-md border border-border rounded-3xl p-6 md:p-8 lg:p-10 shadow-xs space-y-6">
                          <span className="inline-block text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">ACADEMIC OFFICES</span>
                          <h3 className="text-3xl font-serif text-black leading-tight">Admissions Contact Details</h3>
                          <p className="text-muted text-xs md:text-sm font-medium leading-relaxed">
                            Get in touch with executive coordinators at our prime academic compound. We coordinate site tours on active request.
                          </p>

                          <div className="pt-2 max-w-2xl">
                            <div className="bg-card border border-border p-6 rounded-2xl space-y-4">
                              <h4 className="font-extrabold text-black text-xs uppercase tracking-wider border-b border-border pb-2">BCA Academic Coordination Desk</h4>
                              <div className="space-y-3 text-xs text-muted font-semibold">
                                <div className="flex items-center gap-3"><Mail size={14} className="text-wine" /> <span>bca@lotlite-education.in</span></div>
                                <div className="flex items-center gap-3"><Phone size={14} className="text-wine" /> <span>+91 80 4912 3600</span></div>
                                <div className="flex items-start gap-3"><Building2 size={14} className="text-wine mt-0.5" /> <span className="leading-relaxed">Unit No 1, VTP Aethereus Commercial, Commercial 1, Mahalunge, Pune, Maharashtra 411045</span></div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Certificate Card */}
                        <div className="bg-card/75 backdrop-blur-md border border-border rounded-3xl p-6 md:p-8 lg:p-10 shadow-xs space-y-6">
                          <span className="inline-block text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">CREDENTIAL AWARD</span>
                          <h3 className="text-3xl font-serif text-black leading-tight">BCA Completion Certificate</h3>
                          <div className="bg-white dark:bg-zinc-900/60 text-neutral-800 dark:text-neutral-200 p-6 sm:p-8 md:p-10 rounded-3xl border border-neutral-200/80 dark:border-zinc-800/80 relative overflow-hidden shadow-sm hover:border-wine/25 transition-colors duration-300" id="bca-credentials-certificate-card">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-wine/5 rounded-full blur-3xl pointer-events-none" />
                            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-neutral-100/50 rounded-full blur-2xl pointer-events-none" />
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
                              <div className="lg:col-span-7 flex flex-col justify-center space-y-4 text-left">
                                <span className="inline-block bg-wine px-3 py-1 rounded-full text-[8.5px] font-black uppercase tracking-widest text-[#ffffff] border border-white/10 shadow-xs w-fit">GRADUATE EXCELLENCE CREDENTIAL</span>
                                <h4 className="text-2xl sm:text-3xl font-serif text-black tracking-tight leading-tight">Professional Certificate in Computer Applications & Software Development</h4>
                                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-semibold">
                                  Earn an industry-renowned, physical and secure digital certificate of completion backed directly by Lotlite Startup. Perfect for LinkedIn portfolios, career accelerations, and global recruitment validations.
                                </p>
                                <div className="flex flex-wrap gap-4 pt-2 text-[10px] font-bold text-wine">
                                  <span className="flex items-center gap-1"><Award size={12} /> Industry Standardized Alignment</span>
                                  <span className="flex items-center gap-0.5 font-mono">100% Verified Profile</span>
                                </div>
                                <div className="mt-4 pt-4 border-t border-neutral-200/60 flex items-center gap-3">
                                  <span className="text-[8.5px] font-mono text-wine font-bold bg-wine-light px-2.5 py-1 rounded-md border border-wine-light-border">ID: LOTLITE-BCA-2026</span>
                                  <span className="text-[10px] text-neutral-500 font-extrabold uppercase">Secure Verification Registered</span>
                                </div>
                              </div>
                              <div className="lg:col-span-5 flex items-center justify-center">
                                <div className="w-full max-w-md aspect-[29.7/21] bg-white border border-neutral-300 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-2 bg-gradient-to-tr from-neutral-50 to-white">
                                  <div className="w-full h-full border border-neutral-200 rounded-lg overflow-hidden relative">
                                    <img
                                      src={websiteData?.bca_certificate_url || "https://images.unsplash.com/photo-1578572717361-b44c66914561?auto=format&fit=crop&w=800&q=80"}
                                      alt="BCA Certificate Mockup"
                                      className="w-full h-full object-cover grayscale-0"
                                      referrerPolicy="no-referrer"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-card/75 backdrop-blur-md border border-border rounded-3xl p-6 md:p-8 lg:p-10 shadow-xs space-y-6">
                          <span className="inline-block text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">ANSWERS TO YOUR QUESTIONS</span>
                          <h3 className="text-3xl font-serif text-black leading-tight">Frequently Asked Questions</h3>
                          <p className="text-muted text-xs md:text-sm font-medium leading-relaxed">
                            Common queries about the BCA program structure, entry pathways, and requirements.
                          </p>

                          <div className="space-y-4 pt-2">
                            {bcaFaqs.map((faq, idx) => (
                              <div
                                key={idx}
                                className="bg-card border border-border rounded-2xl overflow-hidden hover:border-wine/30 transition-colors shadow-sm animate-fade-in"
                              >
                                <button
                                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                  className="w-full px-6 py-5 flex items-center justify-between text-left group transition-all"
                                >
                                  <span className="text-sm font-extrabold text-black group-hover:text-wine transition-colors">{faq.q}</span>
                                  <motion.div
                                    animate={{ rotate: openFaq === idx ? 180 : 0 }}
                                    className="text-wine shrink-0 ml-4"
                                  >
                                    <ChevronDown size={12} />
                                  </motion.div>
                                </button>
                                <AnimatePresence initial={false}>
                                  {openFaq === idx && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      <div className="px-6 pb-5 text-xs text-muted leading-relaxed font-semibold border-t border-border/10 pt-3">
                                        {faq.a}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="border-t border-black/5 pt-12 md:pt-16" />

                        {/* Final CTA redirect box */}
                        <div className="bg-wine-light/50 border border-wine-light-border p-8 md:p-10 rounded-3xl text-center space-y-4 shadow-sm" id="final-bca-cta">
                          <span className="inline-block text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">JOIN THE UPCOMING COHORT</span>
                          <h3 className="text-2xl sm:text-3xl text-black font-serif tracking-tight">Ready to begin your journey in BCA?</h3>
                          <p className="text-muted text-xs md:text-sm font-medium max-w-2xl mx-auto leading-relaxed">
                            Admissions are currently open for our upcoming batch. Complete your online profile briefing inside our secure system in under 2 minutes.
                          </p>
                          <div className="pt-2">
                            <button
                              onClick={() => {
                                navigate('/admissions/all-applications');
                                const element = document.getElementById('workspace-section');
                                if (element) {
                                  element.scrollIntoView({ behavior: 'smooth' });
                                }
                              }}
                              className="bg-wine hover:bg-wine-hover text-white font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-xl shadow-lg shadow-wine/10 cursor-pointer inline-flex items-center gap-2 select-none transform hover:-translate-y-0.5 transition-all"
                            >
                              <GraduationCap size={16} />
                              Apply for Course
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                    {/* 1.2 MBA PROGRAM DETAILS */}
                    {activeCourse === 'mba' && (
                      <>
                        {/* 1. OVERVIEW */}
                        <div className="relative bg-white text-black rounded-3xl overflow-hidden shadow-xl p-6 md:p-10 lg:p-12 mb-10 flex flex-col lg:flex-row gap-10 items-center border border-black/5">
                          {/* Abstract Background Elements matching Home Hero */}
                          <div className="absolute inset-0 z-0 bg-white" />
                          <div
                            className="absolute inset-0 z-[1] bg-cover bg-center opacity-[0.15] pointer-events-none"
                            style={{
                              backgroundImage: `url('/images/hero_background.png')`
                            }}
                          />
                          <div className="absolute inset-0 z-[2] bg-gradient-to-br from-white via-white/80 via-40% to-[#C21A22]/20 to-100% pointer-events-none" />
                          <div className="absolute top-0 right-0 w-96 h-96 bg-wine/10 blur-[100px] rounded-full mix-blend-multiply z-[3] pointer-events-none" />
                          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 blur-[100px] rounded-full mix-blend-multiply z-[3] pointer-events-none" />

                          <div className="relative z-10 flex-1 space-y-6">


                            <span className="text-wine text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] block">
                              India's Top MBA & PropTech Program
                            </span>

                            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light tracking-tight leading-[1.1] text-black">
                              <span className="text-wine">MBA</span> in Real Estate, Business & PropTech
                            </h3>

                            <div className="space-y-4 pt-2">
                              <div className="flex gap-3 items-start">
                                <CheckCircle2 size={20} className="text-wine shrink-0 mt-0.5" />
                                <p className="text-sm md:text-base text-neutral-600 font-medium leading-relaxed">
                                  Built for next-generation marketing directors, real estate developers, and corporate strategy heads.
                                </p>
                              </div>
                              <div className="flex gap-3 items-start">
                                <CheckCircle2 size={20} className="text-wine shrink-0 mt-0.5" />
                                <p className="text-sm md:text-base text-neutral-600 font-medium leading-relaxed">
                                  Master strategic brand positioning, digital marketing automation, AI/ML tools, and lead nurturing workflows.
                                </p>
                              </div>
                            </div>
                            </div>

                          <div className="relative z-10 w-full lg:w-[380px] bg-white text-black rounded-2xl p-6 md:p-8 shadow-xl shrink-0">
                            <h4 className="text-xl font-bold text-black mb-6">Secure your spot now!</h4>
                            
                            <div className="space-y-6">
                              <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                  <Clock size={18} className="text-gray-600"/>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 font-medium">Duration</p>
                                  <p className="text-sm font-bold text-black">2 Years (Postgraduate)</p>
                                </div>
                              </div>
                              
                              <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                  <Calendar size={18} className="text-gray-600"/>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 font-medium">Admission Deadline</p>
                                  <p className="text-sm font-bold text-black">15-Jun-26</p>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mt-8">
                              <button 
                                className="w-full py-3 rounded-lg border-2 border-black text-black font-bold text-sm hover:bg-black hover:text-white transition-colors text-center cursor-pointer"
                                onClick={() => setApplyPopupOpen(true)}
                              >
                                Apply Now
                              </button>
                              <button 
                                onClick={() => handleDownloadBrochure('mba')}
                                className="w-full py-3 rounded-lg bg-[#de2341] text-white font-bold text-sm hover:bg-red-700 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                              >
                                <FileDown size={16}/> Syllabus
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* 2. OBJECTIVES */}
                        <div className="bg-card/75 backdrop-blur-md border border-border rounded-3xl p-6 md:p-8 lg:p-10 shadow-xs space-y-6">
                          <span className="inline-block text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">EXECUTIVE COMPETENCIES</span>
                          <h3 className="text-3xl font-serif text-black leading-tight">MBA Program Objectives</h3>
                          <p className="text-muted text-xs md:text-sm font-medium leading-relaxed">
                            Our goals focus on training young business leaders to balance strategic brand building, lead generation analytics, and active real estate operations:
                          </p>

                          <div className="space-y-4 pt-2">
                            {[
                              { title: "Strategic Resource Deployment", desc: "Formulate corporate strategy frameworks, assess industry trends, and drive organizational turnaround sprints." },
                              { title: "Automated Lead Generation", desc: "Deploy digital CRM architectures, configure triggers, build segmented marketing lists, and track customer analytics." },
                              { title: "Real Estate & Channel Intelligence", desc: "Establish extensive channel partner networks, administer incentive loops, and organize high-impact property launches." }
                            ].map((obj, i) => (
                              <div key={i} className="flex gap-3 p-4 bg-card border border-border rounded-2xl">
                                <div className="w-6 h-6 rounded-full bg-wine-light text-wine border border-wine-light-border font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                                  0{i+1}
                                </div>
                                <div>
                                  <h5 className="font-bold text-black text-xs uppercase tracking-wide">{obj.title}</h5>
                                  <p className="text-[11px] text-muted leading-normal font-medium mt-1">{obj.desc}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 3. STRUCTURE */}
                        <div className="bg-card/75 backdrop-blur-md border border-border rounded-3xl p-6 md:p-8 lg:p-10 shadow-xs space-y-6">
                          <span className="inline-block text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">4-SEMESTER ADVANCED PATH</span>
                          <h3 className="text-3xl font-serif text-black leading-tight">MBA Program Structure</h3>
                          <p className="text-muted text-xs md:text-sm font-medium leading-relaxed">
                            A fully-optimized four-semester blueprint. Click on any year below to view terms and course syllabi in detail.
                          </p>
                          <ProgramStructureDetail data={mbaStructure} />
                        </div>


                        <div className="border-t border-border/10 my-8" />

                        {/* 4. ADMISSIONS */}
                        <div className="bg-card/75 backdrop-blur-md border border-border rounded-3xl p-6 md:p-8 lg:p-10 shadow-xs space-y-6">
                          <span className="inline-block text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">EXECUTIVE INTAKE</span>
                          <h3 className="text-3xl font-serif text-black leading-tight">MBA Admission Process</h3>
                          <p className="text-muted text-xs md:text-sm font-medium leading-relaxed">
                            Candidates are evaluated on analytical background, organizational experience, and long-term career drive.
                          </p>

                          <div className="space-y-6">
                            <div className="bg-card border border-border p-6 rounded-2xl">
                              <h4 className="font-extrabold text-black text-xs sm:text-sm uppercase tracking-wider border-b border-border pb-2 mb-3">Admission Criteria</h4>
                              <p className="text-sm text-black leading-relaxed font-semibold">
                                Applicants should have a completed Bachelor’s degree in Business, Commerce, Management, or related fields from a recognized university. Relevant work experiences represent a spectacular advantage.
                              </p>
                            </div>

                            <div className="grid sm:grid-cols-3 gap-4 py-4">
                              {[
                                { step: "01", label: "Profile Records", desc: "Submit graduation records along with baseline professional/academic credentials." },
                                { step: "02", label: "Management Quiz", desc: "Attempt diagnostic tests assessing analytical acumen and business logic." },
                                { step: "03", label: "Executive Panel", desc: "Discuss developmental alignment and goals with corporate directors." }
                              ].map((step, idx) => (
                                <div key={idx} className="bg-card border border-border p-5 rounded-2xl shadow-xs transition-colors hover:border-wine/25">
                                  <span className="text-wine text-3xl font-serif font-black">{step.step}</span>
                                  <h5 className="font-extrabold text-black text-xs sm:text-sm uppercase tracking-wider mt-3 mb-1.5 leading-tight">{step.label}</h5>
                                  <p className="text-[11px] text-muted leading-relaxed font-semibold">{step.desc}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Ready to build a career in real estate CTA */}
                          <div
                            className="bg-gradient-to-br from-white via-white/85 to-[#C21A22]/20 dark:from-zinc-950 dark:via-zinc-950/85 dark:to-[#C21A22]/25 border border-neutral-200/65 dark:border-zinc-800/80 rounded-3xl py-8 px-6 md:py-10 md:px-12 relative overflow-hidden shadow-md mt-6"
                            id="mba-admission-cta-card"
                          >
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 text-left">
                              <div className="space-y-2.5 max-w-2xl">
                                <h3 className="text-2xl md:text-3xl text-black dark:text-neutral-100 font-serif tracking-tight leading-tight">
                                  Ready to build a career in <span className="text-wine font-bold">real estate?</span>
                                </h3>
                                <p className="text-xs md:text-sm text-muted dark:text-zinc-400 leading-relaxed font-semibold">
                                  Speak to the admissions team and understand which programme is right for you.
                                </p>
                              </div>

                              <div className="shrink-0 w-full md:w-auto">
                                <button
                                  onClick={() => {
                                    navigate('/admissions/all-applications');
                                    setTimeout(() => {
                                      const element = document.getElementById('workspace-section');
                                      if (element) {
                                        element.scrollIntoView({ behavior: 'smooth' });
                                      }
                                    }, 100);
                                  }}
                                  className="bg-wine hover:bg-black text-white font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-full shadow-lg transition-all w-full md:w-auto text-center inline-flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
                                >
                                  Start Admission
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 5. FEES */}
                        <div className="bg-card/75 backdrop-blur-md border border-border rounded-3xl p-6 md:p-8 lg:p-10 shadow-xs space-y-6">
                          <span className="inline-block text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">EDUCATION INVESTMENT</span>
                          <h3 className="text-3xl font-serif text-black leading-tight">MBA Program Fees</h3>
                          <p className="text-muted text-xs md:p-8 lg:p-10 shadow-xs space-y-6">
                            Invest in your executive credentials. Includes direct access to developer CFO groups and site modeling tools.
                          </p>

                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-card border border-border p-6 rounded-2xl">
                              <span className="text-[9px] font-extrabold text-muted uppercase tracking-widest block mb-1">Tuition Layout</span>
                              <h4 className="text-3xl font-serif text-black font-black">₹2,25,000 <span className="text-xs text-muted">/ Sem</span></h4>
                              <ul className="text-xs text-muted space-y-2 mt-4 font-semibold border-t border-border pt-4">
                                <li className="flex items-center gap-2"><Check size={12} className="text-wine" /> Premium Business Strategy Sprints</li>
                                <li className="flex items-center gap-2"><Check size={12} className="text-wine" /> Field Application study, Capstones, & projects</li>
                                <li className="flex items-center gap-2"><Check size={12} className="text-wine" /> Marketing, CRM, & Lead Automation packages</li>
                              </ul>
                            </div>

                            <div className="bg-card border border-border p-6 rounded-2xl flex flex-col justify-between">
                              <div>
                                <span className="text-[9px] font-extrabold text-wine uppercase tracking-widest block mb-1">Financial Partnerships</span>
                                <h4 className="text-2xl font-serif text-black font-bold">0% EMI Financing</h4>
                                <p className="text-xs text-muted mt-2 leading-relaxed font-semibold">
                                  Education credit lines through leading banks to support progressive professionals seamlessly.
                                </p>
                              </div>
                              <span className="text-[9px] font-extrabold uppercase tracking-widest text-black/60 block mt-4">Audited strictly via finance directors</span>
                            </div>
                          </div>
                        </div>

                        {/* 6. ASSESSMENT & EVALUATION */}
                        <div className="bg-card/75 backdrop-blur-md border border-border rounded-3xl p-6 md:p-8 lg:p-10 shadow-xs space-y-6">
                          <span className="inline-block text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">APPLIED GRADING</span>
                          <h3 className="text-3xl font-serif text-black leading-tight">MBA Assessment & Evaluation</h3>
                          <p className="text-muted text-sm leading-relaxed font-semibold">
                            Graduates are evaluated directly on Capstone defenses, Marketing campaign analysis reports, and core written strategic business papers.
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                            {[
                              { pct: "40%", label: "Capstone Venture Defense", desc: "Present and defend your new operational PropTech relaunch or marketing model before active developers." },
                              { pct: "35%", label: "Analytical Audits", desc: "Complete rigorous CRM campaign audits, statistics simulations, and financial models." },
                              { pct: "25%", label: "Written Papers", desc: "Written evaluative papers checking corporate governance, Indian regulatory frameworks, and operations strategy." }
                            ].map((exam, i) => (
                              <div key={i} className="bg-card border border-border p-6 rounded-2xl">
                                <span className="text-4xl font-serif font-black text-wine">{exam.pct}</span>
                                <h5 className="font-extrabold text-xs uppercase tracking-wider text-black my-2">{exam.label}</h5>
                                <p className="text-[10px] text-muted leading-normal font-medium">{exam.desc}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 7. CONTACT */}
                        <div className="bg-card/75 backdrop-blur-md border border-border rounded-3xl p-6 md:p-8 lg:p-10 shadow-xs space-y-6">
                          <span className="inline-block text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">EXECUTIVE OFFICES</span>
                          <h3 className="text-3xl font-serif text-black leading-tight">MBA Contact Details</h3>
                          <p className="text-muted text-xs md:text-sm font-medium leading-relaxed">
                            Speak with advisors at our premium office compounds.
                          </p>

                          <div className="pt-2 max-w-2xl">
                            <div className="bg-card border border-border p-6 rounded-2xl space-y-4">
                              <h4 className="font-extrabold text-black text-xs uppercase tracking-wider border-b border-border pb-2">MBA Executive Admissions Hub</h4>
                              <div className="space-y-3 text-xs text-muted font-semibold">
                                <div className="flex items-center gap-3"><Mail size={14} className="text-wine" /> <span>mba@lotlite-education.in</span></div>
                                <div className="flex items-center gap-3"><Phone size={14} className="text-wine" /> <span>+91 80 4912 3705</span></div>
                                <div className="flex items-start gap-3"><Building2 size={14} className="text-wine mt-0.5" /> <span className="leading-relaxed">Unit No 1, VTP Aethereus Commercial, Commercial 1, Mahalunge, Pune, Maharashtra 411045</span></div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Certificate Card */}
                        <div className="bg-card/75 backdrop-blur-md border border-border rounded-3xl p-6 md:p-8 lg:p-10 shadow-xs space-y-6">
                          <span className="inline-block text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">CREDENTIAL AWARD</span>
                          <h3 className="text-3xl font-serif text-black leading-tight">MBA Completion Certificate</h3>
                          <div className="bg-white dark:bg-zinc-900/60 text-neutral-800 dark:text-neutral-200 p-6 sm:p-8 md:p-10 rounded-3xl border border-neutral-200/80 dark:border-zinc-800/80 relative overflow-hidden shadow-sm hover:border-wine/25 transition-colors duration-300" id="mba-credentials-certificate-card">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-wine/5 rounded-full blur-3xl pointer-events-none" />
                            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-neutral-100/50 rounded-full blur-2xl pointer-events-none" />
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
                              <div className="lg:col-span-7 flex flex-col justify-center space-y-4 text-left">
                                <span className="inline-block bg-wine px-3 py-1 rounded-full text-[8.5px] font-black uppercase tracking-widest text-[#ffffff] border border-white/10 shadow-xs w-fit">EXECUTIVE CREDENTIAL Excellence</span>
                                <h4 className="text-2xl sm:text-3xl font-serif text-black tracking-tight leading-tight">Postgraduate Certificate in Real Estate & Marketing Strategy</h4>
                                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-semibold">
                                  Earn an executive-grade, physically-sealed and secure digital certificate of mastery backed directly by Lotlite Capital Partners and the Board of Real Estate Studies. Perfect for corporate portfolio validations, promotions, and strategic placement boards.
                                </p>
                                <div className="flex flex-wrap gap-4 pt-2 text-[10px] font-bold text-wine">
                                  <span className="flex items-center gap-1"><Award size={12} /> RICS Standardized Alignment</span>
                                  <span className="flex items-center gap-0.5 font-mono">100% Verified Profile</span>
                                </div>
                                <div className="mt-4 pt-4 border-t border-neutral-200/60 flex items-center gap-3">
                                  <span className="text-[8.5px] font-mono text-wine font-bold bg-wine-light px-2.5 py-1 rounded-md border border-wine-light-border">ID: LOTLITE-MBA-2026</span>
                                  <span className="text-[10px] text-neutral-500 font-extrabold uppercase">Secure Verification Registered</span>
                                </div>
                              </div>
                              <div className="lg:col-span-5 flex items-center justify-center">
                                <div className="w-full max-w-md aspect-[29.7/21] bg-white border border-neutral-300 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-2 bg-gradient-to-tr from-neutral-50 to-white">
                                  <div className="w-full h-full border border-neutral-200 rounded-lg overflow-hidden relative">
                                    <img
                                      src={websiteData?.mba_certificate_url || "https://images.unsplash.com/photo-1578572717361-b44c66914561?auto=format&fit=crop&w=800&q=80"}
                                      alt="MBA Certificate Mockup"
                                      className="w-full h-full object-cover grayscale-0"
                                      referrerPolicy="no-referrer"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 8. Frequently Asked Questions */}
                        <div className="bg-card/75 backdrop-blur-md border border-border rounded-3xl p-6 md:p-8 lg:p-10 shadow-xs space-y-6">
                          <span className="inline-block text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">ANSWERS TO YOUR QUESTIONS</span>
                          <h3 className="text-3xl font-serif text-black leading-tight">Frequently Asked Questions</h3>
                          <p className="text-muted text-xs md:text-sm font-medium leading-relaxed">
                            Common queries about real-estate business strategy and developer recruitment.
                          </p>

                          <div className="space-y-4 pt-2">
                            {mbaFaqs.map((faq, idx) => (
                              <div
                                key={idx}
                                className="bg-card border border-border rounded-2xl overflow-hidden hover:border-wine/30 transition-colors shadow-sm animate-fade-in"
                              >
                                <button
                                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                  className="w-full px-6 py-5 flex items-center justify-between text-left group transition-all"
                                >
                                  <span className="text-sm font-extrabold text-black group-hover:text-wine transition-colors">{faq.q}</span>
                                  <motion.div
                                    animate={{ rotate: openFaq === idx ? 180 : 0 }}
                                    className="text-wine shrink-0 ml-4"
                                  >
                                    <ChevronDown size={12} />
                                  </motion.div>
                                </button>
                                <AnimatePresence initial={false}>
                                  {openFaq === idx && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      <div className="px-6 pb-5 text-xs text-muted leading-relaxed font-semibold border-t border-border/10 pt-3">
                                        {faq.a}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="border-t border-black/5 pt-12 md:pt-16" />

                        {/* Final CTA redirect box */}
                        <div className="bg-wine-light/50 border border-wine-light-border p-8 md:p-10 rounded-3xl text-center space-y-4 shadow-sm" id="final-mba-cta">
                          <span className="inline-block text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">JOIN THE UPCOMING COHORT</span>
                          <h3 className="text-2xl sm:text-3xl text-black font-serif tracking-tight">Ready to begin your journey in MBA?</h3>
                          <p className="text-muted text-xs md:text-sm font-medium max-w-2xl mx-auto leading-relaxed">
                            Admissions are currently open for our upcoming batch. Complete your online profile briefing inside our secure system in under 2 minutes.
                          </p>
                          <div className="pt-2">
                            <button
                              onClick={() => {
                                navigate('/admissions/all-applications');
                                const element = document.getElementById('workspace-section');
                                if (element) {
                                  element.scrollIntoView({ behavior: 'smooth' });
                                }
                              }}
                              className="bg-wine hover:bg-wine-hover text-white font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-xl shadow-lg shadow-wine/10 cursor-pointer inline-flex items-center gap-2 select-none transform hover:-translate-y-0.5 transition-all"
                            >
                              <GraduationCap size={16} />
                              Apply for Course
                            </button>
                          </div>
                        </div>

                      </>
                    )}
                    {/* 1.4 MCA PROGRAM DETAILS */}
                    {activeCourse === 'mca' && (
                      <>
                        {/* MCA Overview Hero */}
                        <div className="relative bg-white text-black rounded-3xl overflow-hidden shadow-xl p-6 md:p-10 lg:p-12 mb-10 flex flex-col lg:flex-row gap-10 items-center border border-black/5">
                          {/* Abstract Background Elements matching Home Hero */}
                          <div className="absolute inset-0 z-0 bg-white" />
                          <div
                            className="absolute inset-0 z-[1] bg-cover bg-center opacity-[0.15] pointer-events-none"
                            style={{
                              backgroundImage: `url('/images/hero_background.png')`
                            }}
                          />
                          <div className="absolute inset-0 z-[2] bg-gradient-to-br from-white via-white/80 via-40% to-[#C21A22]/20 to-100% pointer-events-none" />
                          <div className="absolute top-0 right-0 w-96 h-96 bg-wine/10 blur-[100px] rounded-full mix-blend-multiply z-[3] pointer-events-none" />
                          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 blur-[100px] rounded-full mix-blend-multiply z-[3] pointer-events-none" />

                          <div className="relative z-10 flex-1 space-y-6">
                            <span className="text-wine text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] block">
                              Postgraduate Technology Pathway
                            </span>

                            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light tracking-tight leading-[1.1] text-black">
                              <span className="text-wine">MCA</span> in AI, Software Engineering and Applied Computing.
                            </h3>

                            <div className="space-y-4 pt-2">
                              <div className="flex gap-3 items-start">
                                <CheckCircle2 size={20} className="text-wine shrink-0 mt-0.5" />
                                <p className="text-sm md:text-base text-neutral-600 font-medium leading-relaxed">
                                  A postgraduate technology pathway for learners who want stronger foundations in software engineering, cloud, databases, AI, system design, product thinking, and deployment-focused projects.
                                </p>
                              </div>
                              <div className="flex gap-3 items-start">
                                <CheckCircle2 size={20} className="text-wine shrink-0 mt-0.5" />
                                <p className="text-sm md:text-base text-neutral-600 font-medium leading-relaxed">
                                  Master modern software engineering, clean code principles, AI integration, and build production-grade scalable systems.
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="relative z-10 w-full lg:w-[380px] bg-white text-black rounded-2xl p-6 md:p-8 shadow-xl shrink-0">
                            <h4 className="text-xl font-bold text-black mb-6">Secure your spot now!</h4>

                            <div className="space-y-6">
                              <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                  <Clock size={18} className="text-gray-600" />
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 font-medium">Duration</p>
                                  <p className="text-sm font-bold text-black">2 Years (Postgraduate)</p>
                                </div>
                              </div>

                              <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                  <Calendar size={18} className="text-gray-600" />
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 font-medium">Admission Deadline</p>
                                  <p className="text-sm font-bold text-black">15-Jun-26</p>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mt-8">
                              <button
                                className="w-full py-3 rounded-lg border-2 border-black text-black font-bold text-sm hover:bg-black hover:text-white transition-colors text-center cursor-pointer"
                                onClick={() => setApplyPopupOpen(true)}
                              >
                                Apply Now
                              </button>
                              <button
                                onClick={() => handleDownloadBrochure('mca')}
                                className="w-full py-3 rounded-lg bg-[#de2341] text-white font-bold text-sm hover:bg-red-700 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                              >
                                <FileDown size={16} /> Syllabus
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Move from learning concepts to building systems */}
                        <div className="bg-card/75 backdrop-blur-md border border-border rounded-3xl p-6 md:p-8 lg:p-10 shadow-xs space-y-6">
                          <span className="inline-block text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">EDUCATION THAT WORKS</span>
                          <h3 className="text-3xl font-serif text-black leading-tight">Move from learning concepts to building systems.</h3>
                          <p className="text-muted text-xs md:text-sm font-medium leading-relaxed">
                            The MCA program goes beyond traditional software education. It focuses on real-world engineering, clean code principles, AI tooling, deployment readiness, and full-system thinking for building scalable products.
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                            {[
                              { num: "01", title: "Engineering foundations", desc: "Covers computer networks, operating systems, data structures, and database design to build a solid technical base." },
                              { num: "02", title: "Modern AI systems", desc: "Trains learners in machine learning algorithms, NLP, computer vision, AI tools, and prompt engineering." },
                              { num: "03", title: "Deployment readiness", desc: "Teaches cloud infrastructure, system design, API integration, CI/CD pipelines, and containerized deployment." }
                            ].map((obj, i) => (
                              <div key={i} className="bg-card border border-border p-5 rounded-2xl">
                                <div className="w-8 h-8 rounded-full bg-wine-light text-wine border border-wine-light-border font-bold text-xs flex items-center justify-center mb-3">
                                  {obj.num}
                                </div>
                                <h5 className="font-bold text-black text-xs uppercase tracking-wide mb-1">{obj.title}</h5>
                                <p className="text-[11px] text-muted leading-normal font-medium">{obj.desc}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Build for real constraints */}
                        <div className="bg-card/75 backdrop-blur-md border border-border rounded-3xl p-6 md:p-8 lg:p-10 shadow-xs space-y-6">
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                            <div className="lg:col-span-5 space-y-4">
                              <span className="inline-block text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">PRACTICAL METHODOLOGY</span>
                              <h3 className="text-3xl font-serif text-black leading-tight">Build for real constraints.</h3>
                              <p className="text-muted text-xs md:text-sm font-medium leading-relaxed">
                                The MCA curriculum puts you through real-world challenges beyond textbooks. Time-bound, client-driven, and production-level constraints define how projects are run.
                              </p>
                            </div>
                            <div className="lg:col-span-7 space-y-4">
                              {[
                                { num: "1", title: "Understand the problem", desc: "Research real-world needs and existing software to find areas for improvement and gaps in the market." },
                                { num: "2", title: "Design the system", desc: "Create architecture plans, data flow, UI wireframes, and define tools and services for a robust solution." },
                                { num: "3", title: "Deploy and improve", desc: "Build, test, deploy, monitor live usage, and iterate based on feedback to ship production-grade software." }
                              ].map((item, idx) => (
                                <div key={idx} className="flex gap-4 p-4 bg-card border border-border rounded-2xl hover:border-wine/25 transition-all">
                                  <div className="w-8 h-8 rounded-full bg-wine-light text-wine border border-wine-light-border font-bold text-xs flex items-center justify-center shrink-0">
                                    {item.num}
                                  </div>
                                  <div>
                                    <h5 className="font-bold text-black text-xs uppercase tracking-wide">{item.title}</h5>
                                    <p className="text-[11px] text-muted leading-normal font-medium mt-1">{item.desc}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Four Semester Snapshot */}
                        <div className="bg-card/75 backdrop-blur-md border border-border rounded-3xl p-6 md:p-8 lg:p-10 shadow-xs space-y-6">
                          <span className="inline-block text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">4-SEMESTER ADVANCED PATH</span>
                          <h3 className="text-3xl font-serif text-black leading-tight">Four semester snapshot.</h3>
                          <p className="text-muted text-xs md:text-sm font-medium leading-relaxed">
                            Practical terms are designed for iterative learning. The subjects must be studied with the course material provided in the curriculum. Click on any year below to view terms and syllabi in detail.
                          </p>
                          <ProgramStructureDetail data={mcaStructure} />
                        </div>

                        {/* MBA-style Admissions section */}
                        <div className="bg-card/75 backdrop-blur-md border border-border rounded-3xl p-6 md:p-8 lg:p-10 shadow-xs space-y-6">
                          <span className="inline-block text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">EXECUTIVE INTAKE</span>
                          <h3 className="text-3xl font-serif text-black leading-tight">MCA Admission Process</h3>
                          <p className="text-muted text-xs md:text-sm font-medium leading-relaxed">
                            Candidates are evaluated on technical background, programming skills, and analytical aptitude.
                          </p>

                          <div className="space-y-6">
                            <div className="bg-card border border-border p-6 rounded-2xl">
                              <h4 className="font-extrabold text-black text-xs sm:text-sm uppercase tracking-wider border-b border-border pb-2 mb-3">Admission Criteria</h4>
                              <p className="text-sm text-black leading-relaxed font-semibold">
                                Applicants should have a completed Bachelor's degree in Computer Applications, Computer Science, IT, or related fields from a recognized university. Strong programming skills and relevant project experience represent a significant advantage.
                              </p>
                            </div>

                            <div className="grid sm:grid-cols-3 gap-4 py-4">
                              {[
                                { step: "01", label: "Profile Records", desc: "Submit graduation records along with technical project portfolios and academic credentials." },
                                { step: "02", label: "Technical Assessment", desc: "Attempt diagnostic tests assessing programming logic, data structures, and problem-solving." },
                                { step: "03", label: "Technical Panel", desc: "Discuss development experience, career goals, and technical alignment with the academic panel." }
                              ].map((step, idx) => (
                                <div key={idx} className="bg-card border border-border p-5 rounded-2xl shadow-xs transition-colors hover:border-wine/25">
                                  <span className="text-wine text-3xl font-serif font-black">{step.step}</span>
                                  <h5 className="font-extrabold text-black text-xs sm:text-sm uppercase tracking-wider mt-3 mb-1.5 leading-tight">{step.label}</h5>
                                  <p className="text-[11px] text-muted leading-relaxed font-semibold">{step.desc}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div
                            className="bg-gradient-to-br from-white via-white/85 to-[#C21A22]/20 dark:from-zinc-950 dark:via-zinc-950/85 dark:to-[#C21A22]/25 border border-neutral-200/65 dark:border-zinc-800/80 rounded-3xl py-8 px-6 md:py-10 md:px-12 relative overflow-hidden shadow-md mt-6"
                            id="mca-admission-cta-card"
                          >
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 text-left">
                              <div className="space-y-2.5 max-w-2xl">
                                <h3 className="text-2xl md:text-3xl text-black dark:text-neutral-100 font-serif tracking-tight leading-tight">
                                  Interested in the <span className="text-wine font-bold">MCA pathway?</span>
                                </h3>
                                <p className="text-xs md:text-sm text-muted dark:text-zinc-400 leading-relaxed font-semibold">
                                  If you have a degree in CS, IT, BCA, or any related field, you're eligible to apply for this intensive, industry-led MCA pathway.
                                </p>
                              </div>

                              <div className="shrink-0 w-full md:w-auto">
                                <button
                                  onClick={() => {
                                    navigate('/admissions/all-applications');
                                    setTimeout(() => {
                                      const element = document.getElementById('workspace-section');
                                      if (element) {
                                        element.scrollIntoView({ behavior: 'smooth' });
                                      }
                                    }, 100);
                                  }}
                                  className="bg-wine hover:bg-black text-white font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-full shadow-lg transition-all w-full md:w-auto text-center inline-flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
                                >
                                  Apply Now
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* MCA Fees */}
                        <div className="bg-card/75 backdrop-blur-md border border-border rounded-3xl p-6 md:p-8 lg:p-10 shadow-xs space-y-6">
                          <span className="inline-block text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">EDUCATION INVESTMENT</span>
                          <h3 className="text-3xl font-serif text-black leading-tight">MCA Program Fees</h3>
                          <p className="text-muted text-xs md:text-sm font-medium leading-relaxed">
                            Invest in your technology credentials. Includes access to cloud platforms, AI tools, and industry mentorship.
                          </p>

                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-card border border-border p-6 rounded-2xl">
                              <span className="text-[9px] font-extrabold text-muted uppercase tracking-widest block mb-1">Tuition Layout</span>
                              <h4 className="text-3xl font-serif text-black font-black">₹2,00,000 <span className="text-xs text-muted">/ Sem</span></h4>
                              <ul className="text-xs text-muted space-y-2 mt-4 font-semibold border-t border-border pt-4">
                                <li className="flex items-center gap-2"><Check size={12} className="text-wine" /> Cloud Computing & AI Platform Credits</li>
                                <li className="flex items-center gap-2"><Check size={12} className="text-wine" /> Industry Capstone Projects & Mentorship</li>
                                <li className="flex items-center gap-2"><Check size={12} className="text-wine" /> DevOps Tools & Lab Infrastructure</li>
                              </ul>
                            </div>

                            <div className="bg-card border border-border p-6 rounded-2xl flex flex-col justify-between">
                              <div>
                                <span className="text-[9px] font-extrabold text-wine uppercase tracking-widest block mb-1">Financial Partnerships</span>
                                <h4 className="text-2xl font-serif text-black font-bold">0% EMI Financing</h4>
                                <p className="text-xs text-muted mt-2 leading-relaxed font-semibold">
                                  Education credit lines through leading banks to support technology professionals seamlessly.
                                </p>
                              </div>
                              <span className="text-[9px] font-extrabold uppercase tracking-widest text-black/60 block mt-4">Audited strictly via finance directors</span>
                            </div>
                          </div>
                        </div>

                        {/* Possible roles after MCA */}
                        <div className="bg-card/75 backdrop-blur-md border border-border rounded-3xl p-6 md:p-8 lg:p-10 shadow-xs space-y-6">
                          <span className="inline-block text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">CAREER OUTCOMES</span>
                          <h3 className="text-3xl font-serif text-black leading-tight">Possible roles after MCA.</h3>
                          <p className="text-muted text-xs md:text-sm font-medium leading-relaxed">
                            Every competency trained during the programme is mapped to a tangible, in-demand role across startups, enterprises, and product companies.
                          </p>
                          <div className="flex flex-wrap gap-2 pt-2">
                            {[
                              "Software Engineer", "Full Stack Developer", "Backend Developer", "Data Engineer",
                              "Machine Learning Engineer", "AI/NLP Researcher", "Systems Architect", "DevOps Engineer",
                              "Cloud Engineer", "Product Manager", "AI Application Developer", "Database Administrator"
                            ].map((role, idx) => (
                              <span key={idx} className="bg-card border border-border px-4 py-2 rounded-full text-xs font-bold text-black hover:border-wine/30 hover:text-wine transition-colors">
                                {role}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* MCA Contact */}
                        <div className="bg-card/75 backdrop-blur-md border border-border rounded-3xl p-6 md:p-8 lg:p-10 shadow-xs space-y-6">
                          <span className="inline-block text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">EXECUTIVE OFFICES</span>
                          <h3 className="text-3xl font-serif text-black leading-tight">MCA Contact Details</h3>
                          <p className="text-muted text-xs md:text-sm font-medium leading-relaxed">
                            Speak with advisors at our technology programme offices.
                          </p>

                          <div className="pt-2 max-w-2xl">
                            <div className="bg-card border border-border p-6 rounded-2xl space-y-4">
                              <h4 className="font-extrabold text-black text-xs uppercase tracking-wider border-b border-border pb-2">MCA Admissions Hub</h4>
                              <div className="space-y-3 text-xs text-muted font-semibold">
                                <div className="flex items-center gap-3"><Mail size={14} className="text-wine" /> <span>mca@lotlite-education.in</span></div>
                                <div className="flex items-center gap-3"><Phone size={14} className="text-wine" /> <span>+91 80 4912 3800</span></div>
                                <div className="flex items-start gap-3"><Building2 size={14} className="text-wine mt-0.5" /> <span className="leading-relaxed">Unit No 1, VTP Aethereus Commercial, Commercial 1, Mahalunge, Pune, Maharashtra 411045</span></div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* MCA Certificate */}
                        <div className="bg-card/75 backdrop-blur-md border border-border rounded-3xl p-6 md:p-8 lg:p-10 shadow-xs space-y-6">
                          <span className="inline-block text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">CREDENTIAL AWARD</span>
                          <h3 className="text-3xl font-serif text-black leading-tight">MCA Completion Certificate</h3>
                          <div className="bg-white dark:bg-zinc-900/60 text-neutral-800 dark:text-neutral-200 p-6 sm:p-8 md:p-10 rounded-3xl border border-neutral-200/80 dark:border-zinc-800/80 relative overflow-hidden shadow-sm hover:border-wine/25 transition-colors duration-300" id="mca-credentials-certificate-card">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-wine/5 rounded-full blur-3xl pointer-events-none" />
                            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-neutral-100/50 rounded-full blur-2xl pointer-events-none" />
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
                              <div className="lg:col-span-7 flex flex-col justify-center space-y-4 text-left">
                                <span className="inline-block bg-wine px-3 py-1 rounded-full text-[8.5px] font-black uppercase tracking-widest text-[#ffffff] border border-white/10 shadow-xs w-fit">EXECUTIVE CREDENTIAL EXCELLENCE</span>
                                <h4 className="text-2xl sm:text-3xl font-serif text-black tracking-tight leading-tight">Postgraduate Certificate in AI, Software Engineering & Applied Computing</h4>
                                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-semibold">
                                  Earn an executive-grade, physically-sealed and secure digital certificate of mastery backed directly by Lotlite Startup. Perfect for corporate portfolio validations, career promotions, and technology leadership positions.
                                </p>
                                <div className="flex flex-wrap gap-4 pt-2 text-[10px] font-bold text-wine">
                                  <span className="flex items-center gap-1"><Award size={12} /> Industry Standardized Alignment</span>
                                  <span className="flex items-center gap-0.5 font-mono">100% Verified Profile</span>
                                </div>
                                <div className="mt-4 pt-4 border-t border-neutral-200/60 flex items-center gap-3">
                                  <span className="text-[8.5px] font-mono text-wine font-bold bg-wine-light px-2.5 py-1 rounded-md border border-wine-light-border">ID: LOTLITE-MCA-2026</span>
                                  <span className="text-[10px] text-neutral-500 font-extrabold uppercase">Secure Verification Registered</span>
                                </div>
                              </div>
                              <div className="lg:col-span-5 flex items-center justify-center">
                                <div className="w-full max-w-md aspect-[29.7/21] bg-white border border-neutral-300 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-2 bg-gradient-to-tr from-neutral-50 to-white">
                                  <div className="w-full h-full border border-neutral-200 rounded-lg overflow-hidden relative">
                                    <img
                                      src={websiteData?.mca_certificate_url || "https://images.unsplash.com/photo-1578572717361-b44c66914561?auto=format&fit=crop&w=800&q=80"}
                                      alt="MCA Certificate Mockup"
                                      className="w-full h-full object-cover grayscale-0"
                                      referrerPolicy="no-referrer"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* MCA FAQs */}
                        <div className="bg-card/75 backdrop-blur-md border border-border rounded-3xl p-6 md:p-8 lg:p-10 shadow-xs space-y-6">
                          <span className="inline-block text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">ANSWERS TO YOUR QUESTIONS</span>
                          <h3 className="text-3xl font-serif text-black leading-tight">Frequently Asked Questions</h3>
                          <p className="text-muted text-xs md:text-sm font-medium leading-relaxed">
                            Common queries about the MCA program, technology curriculum, and career outcomes.
                          </p>

                          <div className="space-y-4 pt-2">
                            {mcaFaqs.map((faq, idx) => (
                              <div
                                key={idx}
                                className="bg-card border border-border rounded-2xl overflow-hidden hover:border-wine/30 transition-colors shadow-sm animate-fade-in"
                              >
                                <button
                                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                  className="w-full px-6 py-5 flex items-center justify-between text-left group transition-all"
                                >
                                  <span className="text-sm font-extrabold text-black group-hover:text-wine transition-colors">{faq.q}</span>
                                  <motion.div
                                    animate={{ rotate: openFaq === idx ? 180 : 0 }}
                                    className="text-wine shrink-0 ml-4"
                                  >
                                    <ChevronDown size={12} />
                                  </motion.div>
                                </button>
                                <AnimatePresence initial={false}>
                                  {openFaq === idx && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      <div className="px-6 pb-5 text-xs text-muted leading-relaxed font-semibold border-t border-border/10 pt-3">
                                        {faq.a}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="border-t border-black/5 pt-12 md:pt-16" />

                        {/* Final CTA */}
                        <div className="bg-wine-light/50 border border-wine-light-border p-8 md:p-10 rounded-3xl text-center space-y-4 shadow-sm" id="final-mca-cta">
                          <span className="inline-block text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">JOIN THE UPCOMING COHORT</span>
                          <h3 className="text-2xl sm:text-3xl text-black font-serif tracking-tight">Ready to begin your journey in MCA?</h3>
                          <p className="text-muted text-xs md:text-sm font-medium max-w-2xl mx-auto leading-relaxed">
                            Admissions are currently open for our upcoming batch. Complete your online profile briefing inside our secure system in under 2 minutes.
                          </p>
                          <div className="pt-2">
                            <button
                              onClick={() => {
                                navigate('/admissions/all-applications');
                                const element = document.getElementById('workspace-section');
                                if (element) {
                                  element.scrollIntoView({ behavior: 'smooth' });
                                }
                              }}
                              className="bg-wine hover:bg-wine-hover text-white font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-xl shadow-lg shadow-wine/10 cursor-pointer inline-flex items-center gap-2 select-none transform hover:-translate-y-0.5 transition-all"
                            >
                              <GraduationCap size={16} />
                              Apply for Course
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}


                {/* ======================================================== */}
                {/* 2. SECTIONS CORRESPONDING TO ABOUT                       */}
                {/* ======================================================== */}
                {activeSection === 'about' && (
                  <div className="space-y-8 animate-fade-in" id="about-single-page-container">

                    {/* SECTION 1: Why Lotlite */}
                    <div className="bg-[#fcfbfc] dark:bg-zinc-900/40 border border-neutral-200/50 dark:border-zinc-800/80 rounded-3xl p-6 sm:p-8 md:p-10 space-y-6 scroll-mt-32 shadow-xs transition-all hover:border-wine/20" id="about-section-why-ssi">
                      <div>
                        <span className="inline-block mb-3 text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">OUR ADULT LEGACY</span>
                        <h3 className="text-3xl md:text-4xl text-black font-serif tracking-tight">Why Lotlite?</h3>
                        <p className="text-muted text-sm leading-relaxed font-semibold mt-2">
                          Lotlite Startup represents India's leading center dedicated completely to Real Estate Study and development. We operate strictly in accordance under global Royal Institution of Chartered Surveyors templates.
                        </p>
                      </div>
                      <div className="grid md:grid-cols-3 gap-6 pt-2">
                        {[
                          { title: "Founder Classroom", desc: "No generic theoretical coaches. Meet real CFOs, builders, and active tech operators every week." },
                          { title: "RICS Standard Grading", desc: "Our syllabus satisfies requirements recognized across 140+ countries worldwide." },
                          { title: "Active Capital Support", desc: "Deploy products directly while studying using our dedicated ₹5Cr startup pool." }
                        ].map((adv, i) => (
                          <div key={i} className="bg-card border border-border p-5 rounded-2xl shadow-2xs">
                            <CheckCircle2 size={18} className="text-wine mb-3" />
                            <h5 className="font-bold text-black text-xs uppercase tracking-wider mb-2">{adv.title}</h5>
                            <p className="text-[10px] text-muted leading-normal font-medium">{adv.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* SECTION 2: Our Founders */}
                    <div className="bg-[#fcfbfc] dark:bg-zinc-900/40 border border-neutral-200/50 dark:border-zinc-800/80 rounded-3xl p-6 sm:p-8 md:p-10 space-y-6 scroll-mt-32 shadow-xs transition-all hover:border-wine/20" id="about-section-founders">
                      <div>
                        <span className="inline-block mb-3 text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">BOARD OF TRUSTEES</span>
                        <h3 className="text-3xl text-black font-serif tracking-tight">Our Founders</h3>
                        <p className="text-muted text-xs md:text-sm font-semibold mt-2">
                          Instructing daily, reviewing term portfolios, and connecting graduates directly to primary employer groups.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-2">
                        {(websiteData?.industryMentors?.length > 0 ? websiteData.industryMentors : founders).map((item: any, idx: number) => (
                          <div
                            key={idx}
                            className="group relative bg-[#ffffff] dark:bg-zinc-900/40 border border-border dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg hover:border-wine/30 transition-all duration-300 flex flex-col justify-between"
                            id={`founder-card-${idx}`}
                          >
                            <div className="p-5 space-y-4">
                              {/* Photo Frame */}
                              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-neutral-100 border border-black/5 dark:border-white/5">
                                <img
                                  src={item.imageUrl || item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-85 group-hover:opacity-75 transition-opacity duration-300" />
                                {item.education && (
                                  <span className="absolute top-3 right-3 bg-white/95 dark:bg-zinc-900/95 text-[8px] font-black tracking-widest text-[#111111] dark:text-zinc-300 uppercase px-2.5 py-1 rounded-md border border-neutral-200/80 dark:border-white/10 shadow-sm">
                                    {item.education}
                                  </span>
                                )}

                                <div className="absolute bottom-3 left-4 right-4 text-left">
                                  <p className="text-[8.5px] uppercase tracking-widest text-zinc-300 font-extrabold mb-0.5">{item.company}</p>
                                  <h4 className="text-base sm:text-lg font-serif font-black text-white leading-tight">{item.name}</h4>
                                </div>
                              </div>

                              {/* Details */}
                              <div className="space-y-2">
                                <div className="flex flex-col text-left">
                                  <span className="text-wine text-[9px] font-black uppercase tracking-widest">{item.role}</span>
                                </div>

                                <p className="text-[#525252] dark:text-zinc-300 text-xs leading-relaxed font-semibold">
                                  "{item.bio}"
                                </p>
                              </div>
                            </div>

                            {/* Bottom Tags bar */}
                            <div className="px-5 pb-5 pt-3 border-t border-dashed border-border/80 flex flex-wrap gap-1.5 mt-auto">
                              {item.tags?.map((tag: string, tagIdx: number) => (
                                <span
                                  key={tagIdx}
                                  className="text-[8.5px] uppercase tracking-widest font-black text-wine bg-wine-light/50 px-2 py-0.5 rounded-md border border-wine-light-border/60"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* SECTION 3: Academic board and faculty */}
                    <div className="bg-[#fcfbfc] dark:bg-zinc-900/40 border border-neutral-200/50 dark:border-zinc-800/80 rounded-3xl p-6 sm:p-8 md:p-10 space-y-6 scroll-mt-32 shadow-xs transition-all hover:border-wine/20" id="about-section-all">
                      <div>
                        <span className="inline-block mb-3 text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">RICS CERTIFIED MENTORS</span>
                        <h3 className="text-3xl text-black font-serif tracking-tight">Academic Board and Faculty</h3>
                        <p className="text-muted text-xs md:text-sm font-semibold mt-2">
                          Meet RICS-certified mentors, unicorn builders, and dedicated corporate development advisors.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        {(websiteData?.instructors?.length > 0 ? websiteData.instructors : faculty).map((prof: any, idx: number) => (
                          <div key={idx} className="bg-card border border-border p-6 rounded-2xl flex gap-4 shadow-2xs">
                            <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-border">
                              <img src={prof.imageUrl || prof.image} alt={prof.name} className="w-full h-full object-cover grayscale-0" referrerPolicy="no-referrer" />
                            </div>
                            <div className="space-y-1 flex-1">
                              <span className="text-[9px] font-extrabold uppercase text-wine tracking-wider bg-wine-light px-2 py-0.5 rounded">{prof.course}</span>
                              <h4 className="font-serif font-black text-black text-base pt-1">{prof.name}</h4>
                              <p className="text-[9px] text-black/65 leading-tight font-extrabold uppercase tracking-wide">{prof.title}</p>
                              <p className="text-[10px] text-muted dark:text-neutral-300 italic font-semibold leading-relaxed pt-1">"{prof.bio || prof.overview}"</p>
                              <div className="pt-2 border-t border-border/80 mt-2 flex items-center">
                                <a
                                  href={prof.linkedinUrl || `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(prof.name + " Lotlite Startup")}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 text-[9px] text-neutral-500 hover:text-blue-600 font-extrabold uppercase tracking-widest transition-colors cursor-pointer"
                                >
                                  <Linkedin size={10} className="text-blue-600 shrink-0" />
                                  <span>LinkedIn Profile ↗</span>
                                </a>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* SECTION 4: Intellectual papers */}
                    <div className="bg-[#fcfbfc] dark:bg-zinc-900/40 border border-neutral-200/50 dark:border-zinc-800/80 rounded-3xl p-6 sm:p-8 md:p-10 space-y-6 scroll-mt-32 shadow-xs transition-all hover:border-wine/20" id="about-section-research">
                      <div>
                        <span className="inline-block mb-3 text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">RESEARCH CORPUS</span>
                        <h3 className="text-3xl font-serif text-black leading-tight">Intellectual Papers</h3>
                        <p className="text-muted text-xs md:text-sm font-medium leading-relaxed mt-2">
                          We push the limits of traditional spatial economics. Our active study group tracks critical housing anomalies.
                        </p>
                      </div>

                      <div className="space-y-4 pt-2">
                        {(websiteData?.papers?.length > 0 ? websiteData.papers : [
                          { title: "Metropolitan Real Estate Pricing Anomalies", author: "Dr. Sundar Venkatesh", journal: "Global Journal of Spatial Finance", year: "2026", desc: "Constructing algorithmic models to isolate land tax distortions inside emerging smart cities.", link: "" },
                          { title: "SaaS Multi-Listing Protocols in Indian MMR", author: "Siddarth Menon", journal: "Proptech Sprints Review", year: "2025", desc: "A detailed breakdown of brokerage CAC reductions using serverless automation networks.", link: "" }
                        ]).map((paper: any, idx: number) => (
                          <div key={idx} className="bg-card border border-border p-5 rounded-2xl shadow-2xs">
                            <span className="text-[9px] text-wine uppercase tracking-widest font-black block">{paper.journal} (Year {paper.year})</span>
                            
                            {paper.link ? (
                              <a href={paper.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-serif text-black hover:text-wine transition-colors mt-1">
                                <h4 className="text-base font-bold leading-tight">{paper.title}</h4>
                                <ExternalLink size={14} className="opacity-70" />
                              </a>
                            ) : (
                              <h4 className="font-serif text-black text-base font-bold mt-1 leading-tight">{paper.title}</h4>
                            )}
                            
                            <p className="text-[10px] text-muted font-extrabold uppercase tracking-widest mt-1">Lead Researcher: {paper.author || paper.autor}</p>
                            <p className="text-xs text-muted leading-relaxed font-semibold mt-2">{paper.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

                {/* ======================================================== */}
                {/* 4. SECTIONS CORRESPONDING TO OUTCOMES                    */}
                {/* ======================================================== */}
                {activeSection === 'outcomes' && (
                  <div className="space-y-12">
                    {/* Placements Metrics */}
                    <div className="space-y-6">
                      <span className="inline-block mb-3 text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">RECRUITMENT SUMMARY</span>
                      <h3 className="text-3xl text-black font-serif tracking-tight">Placements Metrics</h3>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                        {[
                          { value: "₹9L+", label: "Average CTC Placement" },
                          { value: "₹14.5L", label: "Peak Package Cleared" },
                          { value: "100%", label: "Total Cohort Placement" },
                          { value: "40+", label: "Developer Employers" },
                          { value: "3.2X", label: "Average CTC Multiplier" },
                          { value: "62%", label: "Client-Facing Leadership" }
                        ].map((stat, idx) => (
                          <div key={idx} className="bg-card border border-border p-5 rounded-xl block text-left">
                            <span className="text-3xl font-serif text-wine font-black block">{stat.value}</span>
                            <span className="text-[9px] text-black/65 font-black uppercase tracking-widest mt-1 block">{stat.label}</span>
                          </div>
                        ))}
                      </div>

                      <div className="bg-card border border-border p-6 rounded-2xl flex flex-col sm:flex-row gap-5 items-center">
                        <span className="text-3xl">🤝</span>
                        <div className="text-left">
                          <h5 className="font-extrabold text-black text-xs uppercase tracking-wider mb-1">Corporate Placement Board Partners</h5>
                          <p className="text-[11px] text-muted dark:text-neutral-400 font-semibold leading-relaxed">
                            Graduates from our real estate program undergo instant selection interviews from partners including CBRE, Lodha Alliance, NoBroker, JLL corporate advisory, and Knight Frank.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-black/5 dark:border-white/5 pt-8" />

                    {/* Alumni Success Stories */}
                    <div className="space-y-6">
                      <span className="inline-block mb-3 text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">ALUMNI VOICES</span>
                      <h3 className="text-3xl text-black font-serif tracking-tight">Student Success Stories</h3>

                      <div className="bg-card border border-border p-6 rounded-2xl min-h-[140px] flex flex-col justify-between">
                        <p className="text-sm font-serif italic text-black/80 leading-relaxed">
                          "{alumni[alumniIndex].review}"
                        </p>
                        <div className="border-t border-border pt-4 mt-4 flex justify-between items-center">
                          <div>
                            <h4 className="font-bold text-black text-xs">{alumni[alumniIndex].name}</h4>
                            <p className="text-[9px] font-bold text-wine uppercase tracking-widest">{alumni[alumniIndex].role} @ {alumni[alumniIndex].company} (CTC: {alumni[alumniIndex].package})</p>
                          </div>
                          <div className="flex gap-1.5 shrink-0">
                            <button onClick={() => setAlumniIndex((p) => (p - 1 + alumni.length) % alumni.length)} className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-black/65 hover:bg-wine hover:text-[#ffffff] transition-all cursor-pointer"><ChevronLeft size={12} /></button>
                            <button onClick={() => setAlumniIndex((p) => (p + 1) % alumni.length)} className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-black/65 hover:bg-wine hover:text-[#ffffff] transition-all cursor-pointer"><ChevronRight size={12} /></button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}


                {/* ======================================================== */}
                {/* 5. SECTIONS CORRESPONDING TO INCUBATION                 */}
                {/* ======================================================== */}
                {activeSection === 'incubation' && (
                  <div className="space-y-16">
                    {/* 5.1 INCUBATION PROGRAM DETAILS */}
                    <div id="incubation-program" className="space-y-12 animate-fade-in scroll-mt-28">
                      {/* Hero Section */}
                      <div className="relative bg-white text-black rounded-3xl overflow-hidden shadow-xl p-6 md:p-10 lg:p-12 mb-10 flex flex-col lg:flex-row gap-10 items-center border border-black/5">
                        {/* Abstract Background Elements matching Home Hero */}
                        <div className="absolute inset-0 z-0 bg-white" />
                        <div
                          className="absolute inset-0 z-[1] bg-cover bg-center opacity-[0.15] pointer-events-none"
                          style={{
                            backgroundImage: `url('/images/hero_background.png')`
                          }}
                        />
                        <div className="absolute inset-0 z-[2] bg-gradient-to-br from-white via-white/80 via-40% to-[#C21A22]/20 to-100% pointer-events-none" />
                        <div className="absolute top-0 right-0 w-96 h-96 bg-wine/10 blur-[100px] rounded-full mix-blend-multiply z-[3] pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 blur-[100px] rounded-full mix-blend-multiply z-[3] pointer-events-none" />

                        <div className="relative z-10 flex-1 space-y-6">
                          <span className="text-wine text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] block">
                            Incubation
                          </span>

                          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light tracking-tight leading-[1.1] text-black">
                            Build your real estate venture with guided incubation
                          </h3>

                          <p className="text-sm md:text-base text-neutral-600 font-medium leading-relaxed max-w-xl">
                            Put property marketing or PropTech ideas into practice in tangible plans.
                          </p>

                          <div className="flex flex-wrap gap-4 pt-4">
                            <button
                              onClick={() => setApplyPopupOpen(true)}
                              className="bg-wine hover:bg-wine-hover text-white px-6 py-3 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all cursor-pointer shadow-sm"
                            >
                              Apply for Incubation
                            </button>
                            <button
                              onClick={() => navigate(`/${activeSection}/ventures`)}
                              className="border border-border text-black bg-white px-6 py-3 rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-black hover:text-white transition-all cursor-pointer"
                            >
                              View Projects
                            </button>
                          </div>
                        </div>

                        <div className="relative z-10 w-full lg:w-[380px] bg-white text-black rounded-2xl p-6 md:p-8 shadow-xl shrink-0">
                          <h4 className="text-xl font-bold text-black mb-6">Venture Lab Highlights</h4>

                          <div className="space-y-6">
                            <div className="flex items-start gap-4">
                              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                <Clock size={18} className="text-gray-600" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 font-medium">Cohort Duration</p>
                                <p className="text-sm font-bold text-black">6 Months (Intensive)</p>
                              </div>
                            </div>

                            <div className="flex items-start gap-4">
                              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                <HandCoins size={18} className="text-gray-600" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 font-medium">Incubation Pool</p>
                                <p className="text-sm font-bold text-black">Up to ₹5Cr Seed Fund</p>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => setAdvisorPopupOpen(true)}
                            className="w-full mt-8 py-3 rounded-lg border-2 border-black text-black font-bold text-sm hover:bg-black hover:text-white transition-colors text-center cursor-pointer"
                          >
                            Talk to Advisor
                          </button>
                        </div>
                      </div>

                      {/* Ideal For / Outcome / Format Row */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-[#fcfbfc] border border-neutral-200/55 p-6 rounded-2xl shadow-xs transition-all hover:border-wine/20">
                          <h5 className="font-extrabold text-black text-xs uppercase tracking-wider mb-2">Ideal For</h5>
                          <p className="text-xs text-neutral-600 leading-relaxed font-semibold">
                            Marketing, Startup, Venture, Family Business, real estate business, property, construction, any other real estate field.
                          </p>
                        </div>

                        <div className="bg-[#fcfbfc] border border-neutral-200/55 p-6 rounded-2xl shadow-xs transition-all hover:border-wine/20">
                          <h5 className="font-extrabold text-black text-xs uppercase tracking-wider mb-2">Outcome</h5>
                          <p className="text-xs text-neutral-600 leading-relaxed font-semibold">
                            A concrete business plan, market analysis pitch, brand strategy, financial projections, launch roadmap.
                          </p>
                        </div>

                        <div className="bg-[#fcfbfc] border border-neutral-200/55 p-6 rounded-2xl shadow-xs transition-all hover:border-wine/20">
                          <h5 className="font-extrabold text-black text-xs uppercase tracking-wider mb-2">Format</h5>
                          <p className="text-xs text-neutral-600 leading-relaxed font-semibold">
                            Guided mentorship, cohort participation, regular pitches, interactive assignments, business building sessions.
                          </p>
                        </div>
                      </div>

                      {/* 5-Step Roadmap Section */}
                      <div className="bg-[#fcfbfc] border border-neutral-200/55 rounded-3xl p-6 md:p-8 lg:p-10 shadow-xs space-y-6">
                        <span className="inline-block text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">FIVE STEP ROADMAP</span>
                        <h3 className="text-3xl font-serif text-black leading-tight">From idea clarity to business launch readiness.</h3>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
                          <div className="lg:col-span-5 space-y-4">
                            <p className="text-muted text-xs md:text-sm font-semibold leading-relaxed">
                              Detailed, milestone-driven pathway structured to validate your startup assumptions, build high-converting assets, configure standard sales automations, and present pitch briefs before deep capital boards.
                            </p>
                          </div>

                          <div className="lg:col-span-7 space-y-4">
                            {[
                              { step: "Step 01", title: "Idea and market clarity", desc: "Define the unique value proposition, target audience, local opportunity, validate demand and analyze market fit." },
                              { step: "Step 02", title: "Business model design", desc: "Structure revenue streams, costing estimates, channel partners, and a robust pricing model." },
                              { step: "Step 03", title: "Brand and digital setup", desc: "Build marketing assets, brand identity, landing page, pitch deck outline and target audience profiles." },
                              { step: "Step 04", title: "Sales and CRM system", desc: "Create lead generation setups, follow-up workflows, customer journey, CRM tools and interactive landing page." },
                              { step: "Step 05", title: "Launch readiness review", desc: "Review the launch plan, draft business model, test marketing setup, present solutions and validation plan with mentors." }
                            ].map((item, idx) => (
                              <div key={idx} className="flex gap-4 p-4 bg-card border border-border rounded-2xl hover:border-wine/20 transition-all">
                                <div className="w-16 h-8 rounded-lg bg-wine-light text-wine border border-wine-light-border font-bold text-[10px] uppercase tracking-wider flex items-center justify-center shrink-0">
                                  {item.step}
                                </div>
                                <div>
                                  <h5 className="font-bold text-black text-xs uppercase tracking-wide">{item.title}</h5>
                                  <p className="text-[11px] text-muted leading-normal font-medium mt-1">{item.desc}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Who Can Join Section */}
                      <div className="space-y-6">
                        <span className="inline-block text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">WHO CAN JOIN</span>
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                          <div className="lg:col-span-5 bg-[#fcfbfc] border border-neutral-200/55 text-black p-8 rounded-3xl relative overflow-hidden flex flex-col justify-between shadow-xs hover:border-wine/20 transition-all">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-wine/5 blur-[80px] rounded-full pointer-events-none" />
                            <div className="relative z-10 space-y-6">
                              <h3 className="text-2xl sm:text-3xl font-serif leading-tight text-black">For people who want to create, not only study.</h3>
                              <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed font-semibold">
                                The SSI incubation program is for doers, creators, and builders who are serious about building a real company and brand.
                              </p>
                            </div>
                          </div>

                          <div className="lg:col-span-7 flex flex-col gap-4">
                            {[
                              { id: "1", title: "Student founders", desc: "BBA and MBA students who want to build their startup while pursuing their academic program." },
                              { id: "2", title: "Family business owners", desc: "Successors of real estate developer companies looking to pivot, diversify or launch new digital ventures." },
                              { id: "3", title: "PropTech builders", desc: "Builders developing software, hardware, or analytics tools for the real estate, property and construction industry." }
                            ].map((item) => (
                              <div key={item.id} className="bg-[#fcfbfc] border border-neutral-200/50 p-5 rounded-2xl flex items-center gap-4 transition-all hover:border-wine/25">
                                <div className="w-10 h-10 rounded-full bg-wine text-white font-bold flex items-center justify-center shrink-0 shadow-sm shadow-wine/20">
                                  {item.id}
                                </div>
                                <div>
                                  <h5 className="font-bold text-black text-xs uppercase tracking-wide">{item.title}</h5>
                                  <p className="text-[11px] text-muted leading-relaxed font-semibold mt-1">{item.desc}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Tracks Section */}
                      <div className="bg-[#fcfbfc] border border-neutral-200/55 rounded-3xl p-6 md:p-8 lg:p-10 shadow-xs space-y-6">
                        <span className="inline-block text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">TRACKS</span>
                        <h3 className="text-3xl font-serif text-black leading-tight">Incubation tracks for real estate builders.</h3>
                        <p className="text-muted text-xs md:text-sm font-semibold leading-relaxed">
                          Select a track that matches your background, target space and business goals.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                          {[
                            { title: "Brokerage and consulting venture", desc: "For founders who want to build a brokerage firm, real estate consulting, lead generation agency or advisory boutique." },
                            { title: "Real estate marketing studio", desc: "For creators, developers, designers, and managers building advertising agencies, proptech setups, and content channels." },
                            { title: "PropTech Idea lab", desc: "For technical students building SaaS, platforms, hardware or mobile apps for real estate management and automation." },
                            { title: "Family business growth track", desc: "For legacy business successors looking to digitize operations, launch new sub-brands, and diversify portfolio." }
                          ].map((track, idx) => (
                            <div key={idx} className="bg-card border border-border p-5 rounded-2xl shadow-xs transition-colors hover:border-wine/25">
                              <h5 className="font-extrabold text-black text-xs sm:text-sm uppercase tracking-wider mb-2">{track.title}</h5>
                              <p className="text-[11px] text-muted leading-relaxed font-semibold">{track.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Deliverables Section */}
                      <div className="space-y-6">
                        <div className="text-center md:text-left space-y-2">
                          <span className="inline-block text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">DELIVERABLES</span>
                          <h3 className="text-3xl font-serif text-black leading-tight">What participants should leave with.</h3>
                          <p className="text-muted text-xs md:text-sm font-semibold leading-relaxed">
                            Practical value, milestone metrics, and launch-ready deliverables.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {[
                            { title: "Business concept note", desc: "A comprehensive overview of the business idea, target market, value proposition, and competitive advantage." },
                            { title: "Launch plan", desc: "A step-by-step roadmap to launch the business, including timelines, milestones, budget estimates and resource allocation." },
                            { title: "Pitch deck outline", desc: "A structured outline of the pitch deck to present the business idea to investors, partners, advisors and potential clients." }
                          ].map((item, idx) => (
                            <div key={idx} className="bg-[#fcfbfc] border border-neutral-200/50 p-6 rounded-2xl shadow-xs transition-all hover:border-wine/20">
                              <h5 className="font-extrabold text-black text-xs uppercase tracking-wider mb-2">{item.title}</h5>
                              <p className="text-[11px] text-neutral-600 leading-relaxed font-semibold">{item.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Have a real estate idea CTA */}
                      <div className="bg-gradient-to-br from-white via-white/85 to-[#C21A22]/20 border border-neutral-200 rounded-3xl py-10 px-8 relative overflow-hidden shadow-md text-left mt-6">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                          <div className="space-y-2 max-w-2xl">
                            <h3 className="text-2xl md:text-3xl text-black font-serif tracking-tight leading-tight">
                              Have a real estate <span className="text-wine font-bold">idea?</span>
                            </h3>
                            <p className="text-xs md:text-sm text-muted leading-relaxed font-semibold">
                              Apply for our incubation program and learn how to build your startup.
                            </p>
                          </div>

                          <div className="shrink-0 w-full md:w-auto">
                            <button
                              onClick={() => setApplyPopupOpen(true)}
                              className="w-full md:w-auto bg-wine hover:bg-wine-hover text-white border border-transparent px-6 py-3.5 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all cursor-pointer shadow-md shadow-wine/10"
                            >
                              Apply for Incubation
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Separator */}
                    <div className="border-t border-black/5 pt-8 dark:border-white/5" />

                    {/* Venture Labs Overview */}
                    <div id="incubation-ventures" className="space-y-6 scroll-mt-28">
                      <span className="inline-block mb-3 text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">SEED PLATFORM</span>
                      <h3 className="text-3xl text-black font-serif tracking-tight">Venture Labs Overview</h3>
                      <p className="text-muted dark:text-neutral-400 text-xs md:text-sm font-semibold leading-relaxed">
                        We fuel actual builders. Our incubator program supports live student startups with dedicated office complexes and baseline seed funding.
                      </p>

                      <div className="grid md:grid-cols-2 gap-6 pt-2">
                        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between">
                          <div className="p-5 space-y-3">
                            <span className="bg-wine-light border border-wine-light-border px-2 py-0.5 rounded text-[8px] font-extrabold uppercase text-wine tracking-wider">REVENUE-FIRST DIRECTORY</span>
                            <h4 className="text-lg font-bold text-black">Vihaan Realty</h4>
                            <p className="text-xs text-muted dark:text-neutral-400 leading-relaxed font-semibold">
                              Vihaan Realty enables middle-income plot buyers to purchase secure, layout-mapped plots layout without brokerage overlays.
                            </p>
                            <div className="bg-input p-3 rounded-lg text-[10px] text-muted">
                              <strong>Outcome:</strong> Reached ₹6L+ in monthly property transaction commissions inside its initial launch phase.
                            </div>
                          </div>
                          <span className="p-3 bg-input text-center text-[8px] font-extrabold text-black/55 uppercase tracking-widest border-t border-border">Founded by Lakshay Soni, Cohort 2</span>
                        </div>

                        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between">
                          <div className="p-5 space-y-3">
                            <span className="bg-wine-light border border-wine-light-border px-2 py-0.5 rounded text-[8px] font-extrabold uppercase text-wine tracking-wider">A.I. ALGORITHMIC MAPS</span>
                            <h4 className="text-lg font-bold text-black">Aura Insights</h4>
                            <p className="text-xs text-muted dark:text-neutral-400 leading-relaxed font-semibold">
                              Aura Insights harnesses spatial analytics databases to notify retail buyers of localized micro-market pricing variances.
                            </p>
                            <div className="bg-input p-3 rounded-lg text-[10px] text-muted">
                              <strong>Outcome:</strong> Awarded ₹10L in seed capital during VC evaluations inside the PropTech Lab.
                            </div>
                          </div>
                          <span className="p-3 bg-input text-center text-[8px] font-extrabold text-black/55 uppercase tracking-widest border-t border-border">Founded by Neha Gupta, Cohort 3</span>
                        </div>
                      </div>
                    </div>

                    {/* Separator */}
                    <div className="border-t border-black/5 pt-8 dark:border-white/5" />

                    {/* Student Case Projects */}
                    <div id="incubation-cases" className="space-y-6 scroll-mt-28">
                      <span className="inline-block mb-3 text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">APPLIED STRATEGY CODES</span>
                      <h3 className="text-3xl text-black font-serif tracking-tight">Student Case Projects</h3>
                      <p className="text-muted dark:text-neutral-400 text-xs md:text-sm font-semibold">
                        Click any card block to browse the exact client founder challenge and student-engineered strategy.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        {cases.map((item, idx) => (
                          <div
                            key={idx}
                            onClick={() => setSelectedCase(item)}
                            className="bg-card border border-border p-5 rounded-2xl hover:border-wine/25 transition-all cursor-pointer shadow-xs group"
                          >
                            <span className="bg-input text-wine text-[8px] font-extrabold px-2.5 py-0.5 rounded">
                              {item.tag}
                            </span>
                            <h4 className="font-serif text-black text-base font-black mt-2 leading-tight group-hover:text-wine transition-colors">{item.company} Case</h4>
                            <p className="text-[10px] text-muted dark:text-neutral-400 mt-1 uppercase font-bold tracking-wider">Brief by Founder: {item.founder}</p>
                            <p className="text-[11px] text-muted dark:text-neutral-400 leading-normal line-clamp-2 mt-2 font-medium"><strong>Challenge:</strong> {item.problem}</p>
                            <span className="text-[9px] font-black uppercase text-wine tracking-wider block text-right pt-3 border-t border-border mt-3 group-hover:underline">Read Case File →</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}


                {/* ======================================================== */}
                {/* 6. SECTIONS CORRESPONDING TO BLOGS                       */}
                {/* ======================================================== */}
                {activeSection === 'blogs' && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-border/60">
                      <div>
                        <span className="inline-block mb-2 text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">LOTLITE CHRONICLES</span>
                        <h3 className="text-3xl text-black font-serif tracking-tight">Sprints & Chronicle Insights</h3>
                      </div>
                      <p className="text-xs text-muted font-bold tracking-wide">
                        Showing {filteredBlogs.length > 0 ? (blogPage - 1) * pageSize + 1 : 0}-{Math.min(filteredBlogs.length, blogPage * pageSize)} of {filteredBlogs.length} Articles
                      </p>
                    </div>

                    {/* Category filtering bar */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {["All", "PropTech", "Education", "Growth"].map(cat => (
                        <button
                          key={cat}
                          onClick={() => setBlogFilter(cat)}
                          className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border cursor-pointer transition-colors ${blogFilter === cat
                              ? 'bg-wine border-wine text-[#ffffff]'
                              : 'bg-card text-muted border-border hover:border-wine/20'
                            }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-2">
                      {paginatedBlogs.map((post, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setSelectedBlog(post);
                            navigate(`/blog/${post.id}`);
                          }}
                          className="bg-card border border-border rounded-2xl overflow-hidden hover:border-wine/25 cursor-pointer shadow-xs hover:shadow-md transition-all duration-300 group flex flex-col justify-between"
                        >
                          <div>
                            <div className="h-36 relative bg-neutral-100 overflow-hidden border-b border-border/40">
                              <img
                                src={post.image || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80'}
                                alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                referrerPolicy="no-referrer"
                              />
                              <span className="absolute top-2.5 left-2.5 bg-wine text-[#ffffff] text-[8px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded shadow-sm">{post.category}</span>
                            </div>
                            <div className="p-4 space-y-2">
                              <span className="text-[8px] text-muted uppercase tracking-widest font-bold block">{post.date}</span>
                              <h4 className="font-serif font-black text-black text-sm group-hover:text-wine transition-colors leading-tight line-clamp-2">{post.title}</h4>
                              <p className="text-[11px] text-muted leading-relaxed line-clamp-3 font-semibold">{post.excerpt?.replace(/[#*`~_]/g, '')?.replace(/>\s?/g, '')}</p>
                            </div>
                          </div>
                          <div className="p-4 pt-0">
                            <span className="text-[9px] font-black uppercase tracking-widest text-wine text-right block pt-2 border-t border-dashed border-border/85">Read Article →</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination Bar */}
                    {totalPages > 1 && (
                      <div className="flex flex-col sm:flex-row items-center justify-between border-t border-border/80 pt-6 mt-8 gap-4" id="blog-pagination-block">
                        <p className="text-xs text-muted font-semibold">
                          Showing <span className="font-bold text-black">{filteredBlogs.length > 0 ? (blogPage - 1) * pageSize + 1 : 0}-{Math.min(filteredBlogs.length, blogPage * pageSize)}</span> of <span className="font-bold text-black">{filteredBlogs.length}</span> articles
                        </p>

                        <div className="flex items-center gap-1.5" id="blog-pagination-controls">
                          <button
                            disabled={blogPage === 1}
                            onClick={() => {
                              setBlogPage(prev => Math.max(1, prev - 1));
                              const element = document.getElementById('workspace-section');
                              if (element) {
                                element.scrollIntoView({ behavior: 'smooth' });
                              }
                            }}
                            className="bg-card border border-border disabled:opacity-45 disabled:cursor-not-allowed hover:bg-neutral-50 dark:hover:bg-zinc-800 text-black px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 select-none"
                            id="blog-pagination-prev"
                          >
                            <ChevronLeft size={14} className="text-wine" />
                            <span>Prev</span>
                          </button>

                          {Array.from({ length: totalPages }).map((_, i) => {
                            const pageNum = i + 1;
                            const isCurrent = pageNum === blogPage;
                            return (
                              <button
                                key={pageNum}
                                onClick={() => {
                                  setBlogPage(pageNum);
                                  const element = document.getElementById('workspace-section');
                                  if (element) {
                                    element.scrollIntoView({ behavior: 'smooth' });
                                  }
                                }}
                                className={`w-8 h-8 rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer border ${isCurrent
                                    ? 'bg-wine border-wine text-white shadow-xs font-black'
                                    : 'bg-card border-border hover:bg-neutral-50 dark:hover:bg-zinc-800 text-muted'
                                  }`}
                                id={`blog-pagination-page-${pageNum}`}
                              >
                                {pageNum}
                              </button>
                            );
                          })}

                          <button
                            disabled={blogPage === totalPages}
                            onClick={() => {
                              setBlogPage(prev => Math.min(totalPages, prev + 1));
                              const element = document.getElementById('workspace-section');
                              if (element) {
                                element.scrollIntoView({ behavior: 'smooth' });
                              }
                            }}
                            className="bg-card border border-border disabled:opacity-45 disabled:cursor-not-allowed hover:bg-neutral-50 dark:hover:bg-zinc-800 text-black px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 select-none"
                            id="blog-pagination-next"
                          >
                            <span>Next</span>
                            <ChevronRight size={14} className="text-wine" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeSection === 'admissions' && (
                  <div className="space-y-12 max-w-6xl mx-auto" id="admissions-application-portal">

                    {/* Top Header Section */}
                    <div className="space-y-4 pb-6 select-text border-b border-black/5 dark:border-white/5 mb-8" id="admissions-header">
                      <span className="inline-block text-wine text-xs font-bold uppercase tracking-[0.4em] mb-1 bg-wine-light px-4 py-1.5 rounded-full border border-wine-light-border animate-fade-in">
                        ADMISSIONS
                      </span>
                      <h2 className="text-4xl md:text-5xl lg:text-6xl text-black font-serif font-light leading-none tracking-tight animate-fade-in">
                        Start your admission journey.
                      </h2>
                      <p className="text-muted dark:text-neutral-400 text-sm md:text-base mt-2 max-w-3xl font-medium leading-relaxed animate-fade-in">
                        Apply for the elite, industry-oriented professional courses provided by Lotlite Edu to unlock practical business expertise, master modern property marketing strategies, and launch your career in the thriving real estate businesses and high-growth PropTech enterprises.
                      </p>
                    </div>

                    <div className="border-t border-border/10 animate-fade-in" />

                    {/* Bottom Split Column Container */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start" id="admissions-content-split">

                      {/* Left Column: Process Stepper */}
                      <div className="lg:col-span-5 space-y-8 animate-fade-in" id="admissions-process-column">
                        <div className="space-y-2">
                          <span className="inline-block text-wine text-[10px] font-semibold uppercase tracking-widest bg-wine-light px-3 py-1 rounded-full border border-wine-light-border">
                            PROCESS
                          </span>
                          <h4 className="text-2xl md:text-3xl text-black font-serif tracking-tight">
                            Simple admission flow.
                          </h4>
                        </div>

                        {/* Steps List */}
                        <div className="space-y-4" id="admissions-steps-list">
                          {[
                            {
                              num: "1",
                              title: "Submit enquiry",
                              desc: "Student shares basic details and programme interest."
                            },
                            {
                              num: "2",
                              title: "Counselling call",
                              desc: "The team explains eligibility, curriculum, fees, format and career direction."
                            },
                            {
                              num: "3",
                              title: "Document review",
                              desc: "Eligibility documents are checked before admission confirmation."
                            },
                            {
                              num: "4",
                              title: "Admission confirmation",
                              desc: "Student receives next steps, schedule and onboarding support."
                            }
                          ].map((step, idx) => (
                            <div key={idx} className="bg-card border border-border rounded-2xl p-5 flex gap-4 shadow-xs items-start transition-all hover:shadow-md hover:border-wine/10" id={`step-card-${step.num}`}>
                              <div className="w-8 h-8 rounded-full bg-wine text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                                {step.num}
                              </div>
                              <div className="space-y-1">
                                <h5 className="font-bold text-black text-sm">{step.title}</h5>
                                <p className="text-xs text-muted leading-relaxed font-semibold">{step.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right Column: Dynamic Form Widget */}
                      <div className="lg:col-span-7 bg-card border border-border p-6 sm:p-8 md:p-10 rounded-2xl shadow-xs relative overflow-hidden" id="apply-now-container">
                        <AnimatePresence mode="wait">
                          {!isSubmitted ? (
                            <form className="space-y-5" onSubmit={handleFormSubmit}>
                              <div className="space-y-1 pb-2">
                                <h4 className="text-2xl font-serif text-black">Apply Now</h4>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-[9.5px] font-bold text-muted uppercase tracking-widest mb-1.5">Full Name</label>
                                  <input
                                    required
                                    type="text"
                                    value={formName}
                                    onChange={(e) => setFormName(e.target.value)}
                                    className="w-full bg-input border border-border rounded-xl px-3.5 py-2.5 text-xs text-black focus:outline-none focus:border-wine transition-colors font-medium"
                                    placeholder="Enter full name"
                                    id="admission-input-name"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[9.5px] font-bold text-muted uppercase tracking-widest mb-1.5">Mobile Number</label>
                                  <input
                                    required
                                    type="tel"
                                    value={formPhone}
                                    onChange={(e) => setFormPhone(e.target.value)}
                                    className="w-full bg-input border border-border rounded-xl px-3.5 py-2.5 text-xs text-black focus:outline-none focus:border-wine transition-colors font-medium"
                                    placeholder="Enter mobile number"
                                    id="admission-input-phone"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-[9.5px] font-bold text-muted uppercase tracking-widest mb-1.5">Email</label>
                                  <input
                                    required
                                    type="email"
                                    value={formEmail}
                                    onChange={(e) => setFormEmail(e.target.value)}
                                    className="w-full bg-input border border-border rounded-xl px-3.5 py-2.5 text-xs text-black focus:outline-none focus:border-wine transition-colors font-medium"
                                    placeholder="Enter email address"
                                    id="admission-input-email"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[9.5px] font-bold text-muted uppercase tracking-widest mb-1.5">City</label>
                                  <input
                                    required
                                    type="text"
                                    value={formCity}
                                    onChange={(e) => setFormCity(e.target.value)}
                                    className="w-full bg-input border border-border rounded-xl px-3.5 py-2.5 text-xs text-black focus:outline-none focus:border-wine transition-colors font-medium"
                                    placeholder="Enter city"
                                    id="admission-input-city"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-[9.5px] font-bold text-muted uppercase tracking-widest mb-1.5">Programme Interest</label>
                                <div className="relative">
                                  <select
                                    required
                                    value={formProgram}
                                    onChange={(e) => setFormProgram(e.target.value)}
                                    className="w-full bg-input border border-border rounded-xl px-3.5 py-2.5 text-xs text-black focus:outline-none focus:border-wine transition-colors font-medium cursor-pointer pr-10"
                                    id="admission-input-program"
                                  >
                                    <option value="MBA in Real Estate, Business and PropTech">MBA in Real Estate, Business and PropTech</option>
                                    <option value="BBA in Business, Real Estate and Marketing">BBA in Business, Real Estate and Marketing</option>
                                    <option value="BCA in Computer Applications, Data Science and Software Development">BCA in Computer Applications, Data Science and Software Development</option>
                                    <option value="MCA in AI, Software Engineering and Applied Computing">MCA in AI, Software Engineering and Applied Computing</option>
                                    <option value="Incubation Program">Incubation Program</option>
                                  </select>
                                </div>
                              </div>

                              <button
                                type="submit"
                                disabled={isSendingOtp}
                                className="bg-wine hover:bg-wine-hover text-white font-bold text-xs uppercase tracking-widest py-3 rounded-xl transition-all w-full select-none cursor-pointer text-center shadow-md transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-75 disabled:cursor-not-allowed"
                              >
                                {isSendingOtp ? 'Sending OTP...' : 'Submit Application'}
                              </button>
                              {formError && <p className="text-center text-red-500 text-xs font-bold uppercase mt-2">{formError}</p>}
                            </form>
                          ) : (
                            <div className="text-center py-10 space-y-4 animate-fade-in" id="admissions-success-view">
                              <span className="text-5xl block animate-bounce">🎉</span>
                              <h4 className="font-serif text-black text-2xl font-black animate-fade-in">Application Successfully Received!</h4>
                              <p className="text-xs text-muted font-semibold max-w-sm mx-auto leading-relaxed">
                                Your profile credentials have been filed securely into Lotlite's central Admissions Registry. A dedicated coordinator will verify your information and contact you within 12 working hours.
                              </p>
                              <div className="pt-4">
                                <button
                                  onClick={() => {
                                    setIsSubmitted(false);
                                    setFormName('');
                                    setFormEmail('');
                                    setFormPhone('');
                                    setFormCity('');
                                    setProposalAbstract('');
                                  }}
                                  className="bg-wine hover:bg-wine-hover text-white px-6 py-2.5 rounded-lg text-[10px] uppercase font-bold tracking-widest transition-colors cursor-pointer"
                                >
                                  Register Another Candidate
                                </button>
                              </div>
                            </div>
                          )}
                        </AnimatePresence>
                      </div>

                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>

      {/* Spacious padding above footer as instructed by user */}
      <div className="h-16 sm:h-28" />

      {/* ======================= CASE STUDIES EXPANSION MODAL ======================= */}
      <AnimatePresence>
        {selectedCase && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100020] flex items-center justify-center p-4 pt-20 pb-6 md:p-6 md:pt-24 md:pb-8 bg-white/80 backdrop-blur-md dark:bg-[#000000]/80 dark:backdrop-blur-md"
            onClick={() => setSelectedCase(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white dark:bg-zinc-900/90 dark:backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-2xl w-full max-w-2xl p-6 md:p-10 relative rounded-3xl max-h-[85vh] md:max-h-[80vh] flex flex-col overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <button
                className="absolute top-6 right-6 text-neutral-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors cursor-pointer z-10 bg-black/5 dark:bg-white/5 p-1.5 rounded-full"
                onClick={() => setSelectedCase(null)}
              >
                <X size={20} />
              </button>

              {/* Fixed Header */}
              <div className="pb-4 mb-4 border-b border-black/10 dark:border-white/15 pr-8">
                <span className="inline-block px-3 py-1 bg-wine text-[#ffffff] rounded text-[9px] font-bold uppercase tracking-widest mb-3">
                  {selectedCase.tag}
                </span>
                <h3 className="text-2xl md:text-3xl font-serif text-neutral-950 dark:text-zinc-100 leading-tight">{selectedCase.company} Project</h3>
                <p className="text-wine dark:text-rose-400 text-xs font-bold uppercase tracking-widest mt-1">Instructed by Founder: {selectedCase.founder}</p>
              </div>

              {/* Scrollable Body Content - smaller padding-right to reduce space beside scrollbar */}
              <div className="overflow-y-auto custom-modal-scrollbar pr-1.5 md:pr-2.5 flex-1 my-2">
                <div className="space-y-6 text-xs text-neutral-950 dark:text-zinc-200 leading-relaxed font-semibold">
                  <div>
                    <h5 className="font-bold text-wine dark:text-rose-400 text-sm uppercase tracking-widest mb-1">The Problem Statement</h5>
                    <p className="italic text-neutral-800 dark:text-zinc-300">"{selectedCase.problem}"</p>
                  </div>
                  <div className="border-t border-black/10 dark:border-white/15 pt-4">
                    <h5 className="font-bold text-wine dark:text-rose-400 text-sm uppercase tracking-widest mb-1">Our Student Solution</h5>
                    <p className="text-neutral-950 dark:text-zinc-100 font-semibold">{selectedCase.solution}</p>
                  </div>
                </div>
              </div>

              {/* Fixed Footer */}
              <div className="pt-4 border-t border-black/10 dark:border-white/15 flex justify-end mt-4">
                <button
                  onClick={() => setSelectedCase(null)}
                  className="bg-wine hover:bg-zinc-900 dark:hover:bg-rose-500 text-[#ffffff] px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest select-none cursor-pointer transition-colors"
                >
                  Close Case file
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {pendingLead && (
        <OtpVerificationPage
          pendingLead={pendingLead}
          onSuccess={() => {
            setPendingLead(null);
            setIsSubmitted(true);
            triggerToast({
              title: "Application Received",
              description: `Logged application for ${formName} under ${formProgram}`,
              type: 'success'
            });
          }}
          onCancel={() => setPendingLead(null)}
        />
      )}
    </div>
  );
}

