import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  Applicant,
  Venture,
  BlogPost,
  FaqItem,
  ChatMessage,
  Course,
  Faculty,
  AlumniStory,
  PlacementPartner,
  PlacementStats
} from './types';

// Let's create types for toast messages
export interface Toast {
  title: string;
  description: string;
  show: boolean;
  type?: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  // Navigation & UI state
  isMenuOpen: boolean;
  isInternshipOpen: boolean;
  isAdvisorPopupOpen: boolean;
  isApplyPopupOpen: boolean;
  isDownloadBrochureOpen: boolean;
  downloadBrochureDefaultProgram: string | null;
  toastMessage: Toast | null;
  statistics: {
    totalApplications: number;
    interviewCount: number;
    offeredCount: number;
    averageTraction: number;
  };

  setMenuOpen: (open: boolean) => void;
  setInternshipPanelOpen: (open: boolean) => void;
  setAdvisorPopupOpen: (open: boolean) => void;
  setApplyPopupOpen: (open: boolean) => void;
  setDownloadBrochureOpen: (open: boolean, defaultProgram?: string) => void;
  triggerToast: (toast: { title: string; description: string; type?: 'success' | 'info' | 'warning' | 'error' }) => void;
  clearToast: () => void;
  fetchSystemStats: () => Promise<void>;

  // Website Global Data
  websiteData: Record<string, any>;
  fetchWebsiteData: () => Promise<void>;

  // User Auth State
  currentUser: UserProfile | null;
  isAdminLoggedIn: boolean;
  isAdminLoginOpen: boolean;
  authLoading: boolean;
  authError: string | null;

  setAdminLoginOpen: (open: boolean) => void;
  authenticateAdmin: (email: string, pass: string) => Promise<boolean>;
  logoutUser: () => void;
  checkLocalAuth: () => void;
  clearAuthError: () => void;

  // FAQ State
  faqs: FaqItem[];
  faqsLoading: boolean;
  fetchFaqs: (category?: string) => Promise<void>;

  // Blogs State
  blogs: BlogPost[];
  blogsLoading: boolean;
  selectedBlog: BlogPost | null;
  fetchBlogs: () => Promise<void>;
  setSelectedBlog: (blog: BlogPost | null) => void;
  addNewBlogPost: (blog: Omit<BlogPost, 'id' | 'date'>) => Promise<BlogPost>;
  deleteBlogPost: (id: string) => Promise<void>;

  // Programs / Courses State
  courses: Record<string, Course>;
  coursesLoading: boolean;
  fetchCourses: () => Promise<void>;
  saveCourse: (course: Course) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;

  // Faculty State
  faculty: Faculty[];
  facultyLoading: boolean;
  fetchFaculty: () => Promise<void>;
  saveFaculty: (fac: Faculty) => Promise<void>;
  deleteFaculty: (id: string) => Promise<void>;

  // Placements State
  placementStats: PlacementStats | null;
  placementPartners: PlacementPartner[];
  placementsLoading: boolean;
  fetchPlacements: () => Promise<void>;
  savePlacementStats: (stats: PlacementStats) => Promise<void>;
  addPlacementPartner: (name: string) => Promise<void>;
  deletePlacementPartner: (id: string) => Promise<void>;

  // Success Stories (Alumni) State
  alumniStories: AlumniStory[];
  alumniStoriesLoading: boolean;
  fetchAlumniStories: () => Promise<void>;
  saveAlumniStory: (alum: AlumniStory) => Promise<void>;
  deleteAlumniStory: (id: string) => Promise<void>;

  // Chatbot State
  chatMessages: ChatMessage[];
  isBotTyping: boolean;
  isChatbotOpen: boolean;

  toggleChatbot: () => void;
  setChatbotOpen: (open: boolean) => void;
  clearChatHistory: () => void;
  addMessage: (msg: ChatMessage) => void;
  sendMessageToBot: (text: string) => Promise<void>;

  // Admissions & Ventures State
  applicants: Applicant[];
  ventures: Venture[];
  admissionsLoading: boolean;
  admissionsError: string | null;
  submittingApplication: boolean;
  applicationSuccess: boolean;

  fetchApplicants: () => Promise<void>;
  fetchVentures: () => Promise<void>;
  submitApplicant: (applicant: Omit<Applicant, 'id' | 'appliedDate' | 'status'>) => Promise<Applicant>;
  updateApplicantStatus: (id: string, status: Applicant['status']) => Promise<void>;
  deleteApplicant: (id: string) => Promise<void>;
  auditVenture: (id: string) => Promise<void>;
  createVenture: (venture: Omit<Venture, 'id' | 'status'>) => Promise<Venture>;
  updateVenture: (updatedVenture: Venture) => void;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & UI States
  // Initialize state based on current URL path
  const [isMenuOpen, setMenuOpenState] = useState<boolean>(false);
  const [isInternshipOpen, setInternshipOpenState] = useState<boolean>(false);
  const [isAdvisorPopupOpen, setAdvisorPopupOpenState] = useState<boolean>(false);
  const [isApplyPopupOpen, setApplyPopupOpenState] = useState<boolean>(false);
  const [isDownloadBrochureOpen, setDownloadBrochureOpenState] = useState<boolean>(false);
  const [downloadBrochureDefaultProgram, setDownloadBrochureDefaultProgram] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<Toast | null>(null);
  const [statistics, setStatistics] = useState({
    totalApplications: 0,
    interviewCount: 0,
    offeredCount: 0,
    averageTraction: 0,
  });

  const setMenuOpen = (open: boolean) => setMenuOpenState(open);
  const setInternshipPanelOpen = (open: boolean) => setInternshipOpenState(open);
  const setAdvisorPopupOpen = (open: boolean) => setAdvisorPopupOpenState(open);
  const setApplyPopupOpen = (open: boolean) => setApplyPopupOpenState(open);
  const setDownloadBrochureOpen = (open: boolean, defaultProgram?: string) => {
    setDownloadBrochureOpenState(open);
    if (open && defaultProgram) {
      setDownloadBrochureDefaultProgram(defaultProgram);
    } else if (!open) {
      setDownloadBrochureDefaultProgram(null);
    }
  };

  const triggerToast = (toast: { title: string; description: string; type?: 'success' | 'info' | 'warning' | 'error' }) => {
    setToastMessage({
      ...toast,
      show: true
    });
  };

  const clearToast = () => {
    if (toastMessage) {
      setToastMessage({
        ...toastMessage,
        show: false
      });
    }
  };

  const fetchSystemStats = async () => {
    try {
      const statsRes = await fetch(`${API_BASE}/api/applicants`);
      const apps: Applicant[] = await statsRes.json();
      const venturesRes = await fetch(`${API_BASE}/api/ventures`);
      const vens: Venture[] = await venturesRes.json();

      const interviewCount = apps.filter(a => a.status === 'Interview Scheduled').length;
      const offeredCount = apps.filter(a => a.status === 'Offered').length;
      const auditedVens = vens.filter(v => v.status === 'Audited & Certified');
      const averageTraction = auditedVens.length > 0
        ? Math.round(auditedVens.reduce((sum, v) => sum + v.traction, 0) / auditedVens.length)
        : 0;

      setStatistics({
        totalApplications: apps.length,
        interviewCount,
        offeredCount,
        averageTraction,
      });
    } catch (err) {
      console.error('Failed to calculate stats:', err);
    }
  };

  // Website Global Data State
  const [websiteData, setWebsiteData] = useState<Record<string, any>>({});

  const fetchWebsiteData = async () => {
    try {
      const [certRes, instRes, mentorRes, papersRes] = await Promise.all([
        fetch(`${API_BASE}/api/website-data/certificates`),
        fetch(`${API_BASE}/api/website-data/instructors`),
        fetch(`${API_BASE}/api/website-data/industryMentors`),
        fetch(`${API_BASE}/api/website-data/papers`)
      ]);

      let mergedData = {};

      if (certRes.ok) {
        const json = await certRes.json();
        if (json.data) mergedData = { ...mergedData, ...json.data };
      }

      if (instRes.ok) {
        const json = await instRes.json();
        if (json.data) mergedData = { ...mergedData, instructors: json.data };
      }

      if (mentorRes.ok) {
        const json = await mentorRes.json();
        if (json.data) mergedData = { ...mergedData, industryMentors: json.data };
      }

      if (papersRes.ok) {
        const json = await papersRes.json();
        if (json.data) mergedData = { ...mergedData, papers: json.data };
      }

      setWebsiteData(mergedData);
    } catch (e) {
      console.error('Failed to fetch website data:', e);
    }
  };

  // Fetch website data on mount
  useEffect(() => {
    fetchWebsiteData();
  }, []);

  // User Auth States
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [isAdminLoginOpen, setAdminLoginOpen] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const clearAuthError = () => setAuthError(null);

  const checkLocalAuth = () => {
    const isLogged = localStorage.getItem('lotlite_admin_logged') === 'true';
    const storedUser = localStorage.getItem('lotlite_admin_user');

    if (isLogged && storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
        setIsAdminLoggedIn(true);
      } catch {
        setCurrentUser(null);
        setIsAdminLoggedIn(false);
      }
    }
  };

  const authenticateAdmin = async (email: string, pass: string): Promise<boolean> => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      // Simulate network interaction
      await new Promise(resolve => setTimeout(resolve, 850));

      if ((email === 'admin@lotlite.org' && pass === 'Admin994#') || (email === 'admin@lotlite.edu' && pass === 'lotlite2026')) {
        const user: UserProfile = {
          id: 'lotlite-usr-994',
          name: 'LotLite Principal Admin',
          email: email,
          role: 'admin',
          token: 'jwt-mock-header-token-8921-9942',
        };
        localStorage.setItem('lotlite_admin_logged', 'true');
        localStorage.setItem('lotlite_admin_user', JSON.stringify(user));
        setCurrentUser(user);
        setIsAdminLoggedIn(true);
        setAdminLoginOpen(false);
        setAuthLoading(false);
        return true;
      } else {
        setAuthError('Invalid administrator credentials. Please check and try again.');
        setIsAdminLoggedIn(false);
        setAuthLoading(false);
        return false;
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication error');
      setIsAdminLoggedIn(false);
      setAuthLoading(false);
      return false;
    }
  };

  const logoutUser = () => {
    setCurrentUser(null);
    setIsAdminLoggedIn(false);
    setAuthError(null);
    localStorage.removeItem('lotlite_admin_logged');
    localStorage.removeItem('lotlite_admin_user');
  };

  // FAQ States
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [faqsLoading, setFaqsLoading] = useState<boolean>(false);

  const fetchFaqs = async (category?: string) => {
    setFaqsLoading(true);
    const url = category ? `${API_BASE}/api/faqs?category=${category}` : `${API_BASE}/api/faqs`;
    try {
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setFaqs(data);
      }
    } catch (e) {
      console.error('Failed to fetch faqs:', e);
    } finally {
      setFaqsLoading(false);
    }
  };

  // Blogs States
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [blogsLoading, setBlogsLoading] = useState<boolean>(true);
  const [selectedBlog, setSelectedBlogState] = useState<BlogPost | null>(null);

  // Custom setter for selectedBlog
  const setSelectedBlog = (blog: BlogPost | null) => {
    setSelectedBlogState(blog);
  };

  const fetchBlogs = async () => {
    setBlogsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/blog`);
      if (res.ok) {
        const data = await res.json();
        // Map backend Blog schema to frontend BlogPost interface
        const mappedBlogs = data.map((b: any) => ({
          id: b._id,
          title: b.seoTitle || b.topic,
          excerpt: b.article ? b.article.replace(/<[^>]+>/g, '').substring(0, 130) + '...' : '',
          content: b.markdown || b.article || '',
          category: b.industry || 'PropTech',
          date: new Date(b.createdAt).toLocaleDateString(),
          author: 'AI Generator',
          image: b.imageUrl || b.image_option
        }));
        setBlogs(mappedBlogs);

        // If we loaded initially on a specific blog URL, set it as selected
        const path = window.location.pathname;
        if (path.startsWith('/blog/') && path.length > 6) {
          const blogId = path.split('/')[2];
          const found = mappedBlogs.find((b: BlogPost) => b.id === blogId);
          if (found) {
            setSelectedBlogState(found);
          }
        }
      }
    } catch (e) {
      console.error('Failed to fetch blogs:', e);
    } finally {
      setBlogsLoading(false);
    }
  };

  const addNewBlogPost = async (blog: Omit<BlogPost, 'id' | 'date'>): Promise<BlogPost> => {
    // For manual additions, save it matching the backend Blog schema structure
    const payload = {
      topic: blog.title,
      article: blog.content,
      markdown: blog.content,
      industry: blog.category,
      audience: 'General',
      isPublished: true
    };

    const res = await fetch(`${API_BASE}/api/blog/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
          if(!res.ok) {
        throw new Error('Failed to create new blog post');
      }
    const savedData = await res.json();
      const newBlog = {
        id: savedData.blog._id,
        title: savedData.blog.topic,
        excerpt: savedData.blog.article ? savedData.blog.article.substring(0, 130) + '...' : '',
        content: savedData.blog.article,
        category: savedData.blog.industry,
        date: new Date(savedData.blog.createdAt).toLocaleDateString(),
        author: blog.author || 'Author'
      };
      setBlogs(prev => [newBlog, ...prev]);
return newBlog;
  };

const deleteBlogPost = async (id: string) => {
  try {
    const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setBlogs(prev => prev.filter(b => b.id !== id));
    }
  } catch (e) {
    console.error('Failed to delete blog post:', e);
  }
};

// --- PROGRAMS STATE ---
const [courses, setCourses] = useState<Record<string, Course>>({});
const [coursesLoading, setCoursesLoading] = useState<boolean>(false);

const fetchCourses = async () => {
  setCoursesLoading(true);
  try {
    const res = await fetch('/api/courses');
    if (res.ok) {
      const data = await res.json();
      setCourses(data);
    }
  } catch (e) {
    console.error('Failed to fetch courses:', e);
  } finally {
    setCoursesLoading(false);
  }
};

const saveCourse = async (course: Course) => {
  try {
    const res = await fetch('/api/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(course)
    });
    if (res.ok) {
      const data = await res.json();
      setCourses(prev => ({ ...prev, [data.id]: data }));
    }
  } catch (e) {
    console.error('Failed to save course:', e);
  }
};

const deleteCourse = async (id: string) => {
  try {
    const res = await fetch(`/api/courses/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setCourses(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  } catch (e) {
    console.error('Failed to delete course:', e);
  }
};

// --- FACULTY STATE ---
const [faculty, setFaculty] = useState<Faculty[]>([]);
const [facultyLoading, setFacultyLoading] = useState<boolean>(false);

const fetchFaculty = async () => {
  setFacultyLoading(true);
  try {
    const res = await fetch('/api/faculty');
    if (res.ok) {
      const data = await res.json();
      setFaculty(data);
    }
  } catch (e) {
    console.error('Failed to fetch faculty:', e);
  } finally {
    setFacultyLoading(false);
  }
};

const saveFaculty = async (fac: Faculty) => {
  try {
    const res = await fetch('/api/faculty', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fac)
    });
    if (res.ok) {
      const data = await res.json();
      setFaculty(prev => {
        const idx = prev.findIndex(f => f.id === data.id);
        if (idx >= 0) {
          return prev.map(f => f.id === data.id ? data : f);
        } else {
          return [...prev, data];
        }
      });
    }
  } catch (e) {
    console.error('Failed to save faculty:', e);
  }
};

const deleteFaculty = async (id: string) => {
  try {
    const res = await fetch(`/api/faculty/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setFaculty(prev => prev.filter(f => f.id !== id));
    }
  } catch (e) {
    console.error('Failed to delete faculty member:', e);
  }
};

// --- PLACEMENTS STATE ---
const [placementStats, setPlacementStats] = useState<PlacementStats | null>(null);
const [placementPartners, setPlacementPartners] = useState<PlacementPartner[]>([]);
const [placementsLoading, setPlacementsLoading] = useState<boolean>(false);

const fetchPlacements = async () => {
  setPlacementsLoading(true);
  try {
    const res = await fetch('/api/placements');
    if (res.ok) {
      const data = await res.json();
      setPlacementStats(data.stats);
      setPlacementPartners(data.partners);
    }
  } catch (e) {
    console.error('Failed to fetch placements:', e);
  } finally {
    setPlacementsLoading(false);
  }
};

const savePlacementStats = async (stats: PlacementStats) => {
  try {
    const res = await fetch('/api/placements/stats', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(stats)
    });
    if (res.ok) {
      const data = await res.json();
      setPlacementStats(data);
    }
  } catch (e) {
    console.error('Failed to save placement stats:', e);
  }
};

const addPlacementPartner = async (name: string) => {
  try {
    const res = await fetch('/api/placements/partners', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    if (res.ok) {
      const data = await res.json();
      setPlacementPartners(prev => [...prev, data]);
    }
  } catch (e) {
    console.error('Failed to add placement partner:', e);
  }
};

const deletePlacementPartner = async (id: string) => {
  try {
    const res = await fetch(`/api/placements/partners/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setPlacementPartners(prev => prev.filter(p => p.id !== id));
    }
  } catch (e) {
    console.error('Failed to delete placement partner:', e);
  }
};

// --- ALUMNI STATE ---
const [alumniStories, setAlumniStories] = useState<AlumniStory[]>([]);
const [alumniStoriesLoading, setAlumniStoriesLoading] = useState<boolean>(false);

const fetchAlumniStories = async () => {
  setAlumniStoriesLoading(true);
  try {
    const res = await fetch('/api/alumni');
    if (res.ok) {
      const data = await res.json();
      setAlumniStories(data);
    }
  } catch (e) {
    console.error('Failed to fetch alumni stories:', e);
  } finally {
    setAlumniStoriesLoading(false);
  }
};

const saveAlumniStory = async (alum: AlumniStory) => {
  try {
    const res = await fetch('/api/alumni', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(alum)
    });
    if (res.ok) {
      const data = await res.json();
      setAlumniStories(prev => {
        const idx = prev.findIndex(a => a.id === data.id);
        if (idx >= 0) {
          return prev.map(a => a.id === data.id ? data : a);
        } else {
          return [...prev, data];
        }
      });
    }
  } catch (e) {
    console.error('Failed to save alumni story:', e);
  }
};

const deleteAlumniStory = async (id: string) => {
  try {
    const res = await fetch(`/api/alumni/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setAlumniStories(prev => prev.filter(a => a.id !== id));
    }
  } catch (e) {
    console.error('Failed to delete alumni story:', e);
  }
};

// Chatbot state
const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
  {
    id: 'msg-init',
    sender: 'bot',
    text: "Greetings! I am LotLite's integrated Academic AI Assistant. Ask me anything about our Bachelor of Business Administration (BBA) or Master of Business Administration (MBA). I can guide your admission process too!",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
]);
const [isBotTyping, setIsBotTyping] = useState<boolean>(false);
const [isChatbotOpen, setChatbotOpenState] = useState<boolean>(false);

const toggleChatbot = () => setChatbotOpenState(prev => !prev);
const setChatbotOpen = (open: boolean) => setChatbotOpenState(open);

const clearChatHistory = () => {
  setChatMessages([
    {
      id: 'msg-init',
      sender: 'bot',
      text: "Chat cleared. I am ready for new queries! What would you like to know about our BBA and MBA programs?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
};

const addMessage = (msg: ChatMessage) => {
  setChatMessages(prev => [...prev, msg]);
};

const sendMessageToBot = async (text: string) => {
  setIsBotTyping(true);
  try {
    const res = await fetch(`${API_BASE}/api/chatbot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: text })
    });
    if (res.ok) {
      const data = await res.json();
      setChatMessages(prev => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          sender: 'bot',
          text: data.reply || "System is online. Let me check.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } else {
      throw new Error('Server returned error status');
    }
  } catch (e: any) {
    setChatMessages(prev => [
      ...prev,
      {
        id: `msg-err-${Date.now()}`,
        sender: 'bot',
        text: e.message || 'AI engine is currently rebooting...',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  } finally {
    setIsBotTyping(false);
  }
};

// Admissions & Ventures States
const [applicants, setApplicants] = useState<Applicant[]>([]);
const [ventures, setVentures] = useState<Venture[]>([]);
const [admissionsLoading, setAdmissionsLoading] = useState<boolean>(false);
const [admissionsError, setAdmissionsError] = useState<string | null>(null);
const [submittingApplication, setSubmittingApplication] = useState<boolean>(false);
const [applicationSuccess, setApplicationSuccess] = useState<boolean>(false);

const fetchApplicants = async () => {
  setAdmissionsLoading(true);
  try {
    const res = await fetch(`${API_BASE}/api/applicants`);
    if (res.ok) {
      const data = await res.json();
      setApplicants(data);
    }
  } catch (e: any) {
    setAdmissionsError(e.message || 'Failed to load applicants');
  } finally {
    setAdmissionsLoading(false);
  }
};

const fetchVentures = async () => {
  setAdmissionsLoading(true);
  try {
    const res = await fetch(`${API_BASE}/api/ventures`);
    if (res.ok) {
      const data = await res.json();
      setVentures(data);
    }
  } catch (e: any) {
    setAdmissionsError(e.message || 'Failed to load ventures');
  } finally {
    setAdmissionsLoading(false);
  }
};

const submitApplicant = async (applicant: Omit<Applicant, 'id' | 'appliedDate' | 'status'>): Promise<Applicant> => {
  setSubmittingApplication(true);
  setApplicationSuccess(false);
  try {
    const res = await fetch(`${API_BASE}/api/applicants`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(applicant)
    });
    if (!res.ok) {
      throw new Error('Failed to submit application');
    }
    const data = await res.json();
    setApplicants(prev => [data, ...prev]);
    setApplicationSuccess(true);
    return data;
  } catch (e: any) {
    setAdmissionsError(e.message || 'Submission failed');
    throw e;
  } finally {
    setSubmittingApplication(false);
  }
};

const updateApplicantStatus = async (id: string, status: Applicant['status']) => {
  try {
    const res = await fetch(`${API_BASE}/api/applicants/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (res.ok) {
      setApplicants(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    }
  } catch (e: any) {
    console.error('Failed to change status:', e);
  }
};

const deleteApplicant = async (id: string) => {
  try {
    const res = await fetch(`${API_BASE}/api/applicants/${id}`, {
      method: 'DELETE'
    });
    if (res.ok) {
      setApplicants(prev => prev.filter(a => a.id !== id));
    }
  } catch (e: any) {
    console.error('Failed to delete applicant:', e);
  }
};

const auditVenture = async (id: string) => {
  try {
    const res = await fetch(`${API_BASE}/api/ventures/${id}/audit`, {
      method: 'PUT'
    });
    if (res.ok) {
      setVentures(prev => prev.map(v => v.id === id ? { ...v, status: 'Audited & Certified' } : v));
    }
  } catch (e: any) {
    console.error('Failed to audit venture:', e);
  }
};

const createVenture = async (venture: Omit<Venture, 'id' | 'status'>): Promise<Venture> => {
  const res = await fetch(`${API_BASE}/api/ventures`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(venture)
  });
  if (!res.ok) {
    throw new Error('Failed to create venture');
  }
  const data = await res.json();
  setVentures(prev => [...prev, data]);
  return data;
};

const updateVenture = (updatedVenture: Venture) => {
  setVentures(prev => prev.map(v => v.id === updatedVenture.id ? updatedVenture : v));
};

  // Run on startup
  useEffect(() => {
    checkLocalAuth();
    fetchBlogs(); // Ensure blogs are loaded so direct links to /blog/:id work
  }, []);

return (
  <AppContext.Provider value={{
    isMenuOpen,
    isInternshipOpen,
    isAdvisorPopupOpen,
    isApplyPopupOpen,
    isDownloadBrochureOpen,
    downloadBrochureDefaultProgram,
    toastMessage,
    statistics,
    setMenuOpen,
    setInternshipPanelOpen,
    setAdvisorPopupOpen,
    setApplyPopupOpen,
    setDownloadBrochureOpen,
    triggerToast,
    clearToast,
    fetchSystemStats,

    // Authentication
    currentUser,
    isAdminLoggedIn,
    isAdminLoginOpen,
    authLoading,
    authError,
    setAdminLoginOpen,
    authenticateAdmin,
    logoutUser,
    checkLocalAuth,
    clearAuthError,

    // FAQ
    faqs,
    faqsLoading,
    fetchFaqs,

    // Blogs
    blogs,
    blogsLoading,
    selectedBlog,
    fetchBlogs,
    setSelectedBlog,
    addNewBlogPost,
    deleteBlogPost,

    // Programs / Courses
    courses,
    coursesLoading,
    fetchCourses,
    saveCourse,
    deleteCourse,

    // Faculty
    faculty,
    facultyLoading,
    fetchFaculty,
    saveFaculty,
    deleteFaculty,

    // Placements
    placementStats,
    placementPartners,
    placementsLoading,
    fetchPlacements,
    savePlacementStats,
    addPlacementPartner,
    deletePlacementPartner,

    // Alumni Success Stories
    alumniStories,
    alumniStoriesLoading,
    fetchAlumniStories,
    saveAlumniStory,
    deleteAlumniStory,

    // Chatbot
    chatMessages,
    isBotTyping,
    isChatbotOpen,
    toggleChatbot,
    setChatbotOpen,
    clearChatHistory,
    addMessage,
    sendMessageToBot,

    // Admissions
    applicants,
    ventures,
    admissionsLoading,
    admissionsError,
    submittingApplication,
    applicationSuccess,
    fetchApplicants,
    fetchVentures,
    submitApplicant,
    updateApplicantStatus,
    deleteApplicant,
    auditVenture,
    createVenture,
    updateVenture,
    websiteData,
    fetchWebsiteData,
  }}>
    {children}
  </AppContext.Provider>
);
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
