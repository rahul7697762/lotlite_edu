import React, { useState, useEffect } from 'react';
import { FileText, Send, Loader2, Save, Check, Edit3, Trash2, UserCircle, Upload } from 'lucide-react';
import AuthorManagement from './AuthorManagement';

const BlogGeneration = () => {
  const [activeTab, setActiveTab] = useState<'blog' | 'author' | 'published'>('blog');
  const [formData, setFormData] = useState({
    topic: '',
    audience: 'Property Investors and First-time Homebuyers',
    industry: 'Real Estate',
    keywords: 'Pune real estate, property investment Pune, best places to invest in Pune',
    language: 'English',
    length: 'Medium (500-1000 words)',
    style: 'Professional and Data-driven',
    image_option: 'auto'
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedBlog, setGeneratedBlog] = useState<any>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editMode, setEditMode] = useState(false); // true = editing published blog (no config sidebar)
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleBlogImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.url) {
          setGeneratedBlog((prev: any) => ({ ...prev, imageUrl: data.url }));
        } else {
          alert('Failed to upload image. Check console for details.');
        }
      } else {
        alert('Failed to upload image.');
      }
    } catch (err) {
      alert('Error uploading image.');
    } finally {
      setIsUploadingImage(false);
    }
  };
  
  const [publishedBlogs, setPublishedBlogs] = useState<any[]>([]);
  const [isLoadingBlogs, setIsLoadingBlogs] = useState(false);

  const fetchPublishedBlogs = async () => {
    setIsLoadingBlogs(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/blog`);
      const data = await res.json();
      setPublishedBlogs(data);
    } catch (err) {
      console.error('Error fetching blogs:', err);
    } finally {
      setIsLoadingBlogs(false);
    }
  };

  useEffect(() => {
    fetchPublishedBlogs();
  }, []);

  const handleEditPublished = (blog: any) => {
    setGeneratedBlog(blog);
    setIsEditing(true);
    setEditMode(true);
    setSaveSuccess(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeletePublished = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;
    try {
      await fetch(`${import.meta.env.VITE_API_URL || ''}/api/blog/${id}`, { method: 'DELETE' });
      fetchPublishedBlogs();
    } catch (err) {
      console.error('Error deleting:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.topic.trim()) return;
    
    setIsGenerating(true);
    setSaveSuccess(false);
    setIsEditing(false);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/blog/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      if (data.success || data.article) {
        setGeneratedBlog(data);
      } else {
        alert('Failed to generate blog. Please try again.');
      }
    } catch (error) {
      console.error('Error generating blog:', error);
      alert('An error occurred while generating the blog.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!generatedBlog) return;
    
    setIsSaving(true);
    try {
      const blogToSave = {
        ...formData,
        ...generatedBlog,
        isPublished: true
      };
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/blog/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blogToSave)
      });
      
      if (response.ok) {
        setSaveSuccess(true);
        fetchPublishedBlogs();
      } else {
        alert('Failed to save the blog.');
      }
    } catch (error) {
      console.error('Error saving blog:', error);
      alert('An error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto w-full bg-transparent relative z-10">
      {/* Page Header with Tabs */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 text-wine font-black text-[9px] uppercase tracking-widest">
              <FileText size={12} />
              <span>Marketing Content Engine</span>
            </div>
            <h1 className="text-3xl font-serif font-black tracking-tight text-black mt-2">
              Blog Studio
            </h1>
            <p className="text-xs text-zinc-500 mt-1 uppercase font-mono tracking-widest font-semibold">
              Generate, edit, and publish blogs using AI coordinates.
            </p>
          </div>
        </div>
        {/* Tab Switcher */}
        <div className="flex items-center gap-1 border-b border-border/60 mb-6">
          <button
            onClick={() => setActiveTab('blog')}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-black uppercase tracking-wider border-b-2 -mb-px transition-colors cursor-pointer ${
              activeTab === 'blog'
                ? 'border-wine text-wine'
                : 'border-transparent text-zinc-400 hover:text-black'
            }`}
          >
            <FileText size={14} /> Blog Generation
          </button>
          <button
            onClick={() => setActiveTab('author')}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-black uppercase tracking-wider border-b-2 -mb-px transition-colors cursor-pointer ${
              activeTab === 'author'
                ? 'border-wine text-wine'
                : 'border-transparent text-zinc-400 hover:text-black'
            }`}
          >
            <UserCircle size={14} /> Author Profile
          </button>
          <button
            onClick={() => setActiveTab('published')}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-black uppercase tracking-wider border-b-2 -mb-px transition-colors cursor-pointer ${
              activeTab === 'published'
                ? 'border-wine text-wine'
                : 'border-transparent text-zinc-400 hover:text-black'
            }`}
          >
            <FileText size={14} /> Published Blogs
            {publishedBlogs.length > 0 && (
              <span className="ml-1.5 bg-wine text-white text-[9px] font-black rounded-full px-1.5 py-0.5 leading-none">{publishedBlogs.length}</span>
            )}
          </button>
        </div>
      </div>

      {/* Author Tab */}
      {activeTab === 'author' && <AuthorManagement />}

      {/* Blog Generation Tab */}
      {activeTab === 'blog' && (<>

        {/* Edit Mode: full-width editor, no config sidebar */}
        {editMode && generatedBlog ? (
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => { setGeneratedBlog(null); setEditMode(false); setIsEditing(false); }}
                className="text-xs uppercase tracking-wider text-zinc-400 hover:text-black font-black flex items-center gap-1 border border-border rounded-xl px-3.5 py-2 hover:bg-white bg-zinc-50 transition-all cursor-pointer"
              >
                ← Back
              </button>
              <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-widest font-semibold">Editing: {generatedBlog.seoTitle || generatedBlog.topic}</span>
            </div>
            <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-border shadow-card p-6">
              <div className="flex justify-between items-center mb-6 border-b border-border/50 pb-4">
                <h2 className="text-lg font-bold text-gray-900 leading-tight">{generatedBlog.seoTitle || generatedBlog.topic}</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`flex items-center gap-1.5 px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-colors cursor-pointer ${
                      isEditing ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                    }`}
                  >
                    <Edit3 size={12} /> {isEditing ? 'Preview' : 'Edit'}
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving || saveSuccess}
                    className={`flex items-center gap-1.5 px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl text-white transition-colors cursor-pointer ${
                      saveSuccess ? 'bg-emerald-600' : 'bg-wine hover:bg-black'
                    } disabled:opacity-50`}
                  >
                    {isSaving ? <><Loader2 size={12} className="animate-spin" /> Saving...</> : saveSuccess ? <><Check size={12} /> Saved!</> : <><Save size={12} /> Save & Publish</>}
                  </button>
                </div>
              </div>
              <div className="prose max-w-none text-gray-800">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">Cover Image URL (Base64 or Link)</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={generatedBlog.imageUrl || ''}
                          onChange={(e) => setGeneratedBlog((prev: any) => ({...prev, imageUrl: e.target.value}))}
                          className="flex-1 px-4 py-2.5 border border-border rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-wine/10 focus:border-wine bg-zinc-50/50 font-mono"
                          placeholder="Paste image URL or Base64 string here..."
                        />
                        <div className="relative overflow-hidden shrink-0">
                          <button
                            type="button"
                            className="h-full px-4 bg-zinc-100 hover:bg-zinc-200 border border-border rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer flex items-center gap-2"
                            disabled={isUploadingImage}
                          >
                            {isUploadingImage ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                            Upload
                          </button>
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={handleBlogImageUpload} 
                            disabled={isUploadingImage}
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">Article HTML / Markdown Content</label>
                      <textarea
                        value={generatedBlog.markdown || generatedBlog.article || ''}
                        onChange={(e) => setGeneratedBlog({...generatedBlog, article: e.target.value, markdown: e.target.value})}
                        className="w-full px-4 py-3.5 border border-border rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-wine/10 focus:border-wine bg-zinc-50/50 font-mono min-h-[500px]"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    {generatedBlog.imageUrl && (
                      <div className="mb-6 rounded-2xl overflow-hidden border border-border/80">
                        <img src={generatedBlog.imageUrl} alt="Cover" className="w-full h-auto max-h-[300px] object-cover" />
                      </div>
                    )}
                    <div className="text-zinc-800 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: (generatedBlog.article || '').replace(/\n/g, '<br/>') }} />
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
          <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-border shadow-card p-6">
            <h2 className="text-xs font-black text-black uppercase tracking-widest mb-4 border-b border-border/60 pb-2">Configuration</h2>
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">Topic</label>
                <input
                  type="text"
                  name="topic"
                  value={formData.topic}
                  onChange={handleChange}
                  placeholder="Why Pune is the Best City..."
                  className="w-full px-4 py-2.5 border border-border rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-wine/10 focus:border-wine bg-zinc-50/50"
                  required
                />
              </div>
              
              <div>
                <label className="block text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">Audience</label>
                <input
                  type="text"
                  name="audience"
                  value={formData.audience}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-border rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-wine/10 focus:border-wine bg-zinc-50/50"
                />
              </div>

              <div>
                <label className="block text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">Industry</label>
                <input
                  type="text"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-border rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-wine/10 focus:border-wine bg-zinc-50/50"
                />
              </div>

              <div>
                <label className="block text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">Keywords</label>
                <input
                  type="text"
                  name="keywords"
                  value={formData.keywords}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-border rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-wine/10 focus:border-wine bg-zinc-50/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">Language</label>
                  <input
                    type="text"
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-border rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-wine/10 focus:border-wine bg-zinc-50/50"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">Length</label>
                  <select
                    name="length"
                    value={formData.length}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-border rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-wine/10 focus:border-wine bg-white cursor-pointer"
                  >
                    <option value="Short (300-500 words)">Short</option>
                    <option value="Medium (500-1000 words)">Medium</option>
                    <option value="Long (1000+ words)">Long</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">Style</label>
                <input
                  type="text"
                  name="style"
                  value={formData.style}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-border rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-wine/10 focus:border-wine bg-zinc-50/50"
                />
              </div>

              <button
                type="submit"
                disabled={isGenerating || !formData.topic.trim()}
                className="w-full flex items-center justify-center gap-2 bg-wine hover:bg-black text-white px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 mt-4"
              >
                {isGenerating ? (
                  <><Loader2 className="animate-spin" size={14} /> Generating...</>
                ) : (
                  <><Send size={14} /> Generate Article</>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          {generatedBlog ? (
            <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-border shadow-card p-6">
              <div className="flex justify-between items-center mb-6 border-b border-border/50 pb-4">
                <h2 className="text-base font-bold text-gray-900 leading-tight">{generatedBlog.seoTitle || formData.topic}</h2>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setGeneratedBlog(null)}
                    className="px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-zinc-600 bg-zinc-100 hover:bg-zinc-200 rounded-xl transition-all cursor-pointer"
                  >
                    Discard
                  </button>
                  <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className={`flex items-center gap-1.5 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-colors cursor-pointer ${
                      isEditing ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                    }`}
                  >
                    <Edit3 size={12} /> {isEditing ? 'Preview' : 'Edit'}
                  </button>
                  <button 
                    onClick={handleSave}
                    disabled={isSaving || saveSuccess}
                    className={`flex items-center gap-1.5 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl text-white transition-colors cursor-pointer ${
                      saveSuccess ? 'bg-emerald-600' : 'bg-wine hover:bg-black'
                    } disabled:opacity-50`}
                  >
                    {isSaving ? (
                      <><Loader2 size={12} className="animate-spin" /> Saving...</>
                    ) : saveSuccess ? (
                      <><Check size={12} /> Saved!</>
                    ) : (
                      <><Save size={12} /> Save & Publish</>
                    )}
                  </button>
                </div>
              </div>
              
              <div className="prose max-w-none text-gray-800">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">Cover Image URL (Base64 or Link)</label>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={generatedBlog.imageUrl || ''} 
                          onChange={(e) => setGeneratedBlog((prev: any) => ({...prev, imageUrl: e.target.value}))}
                          className="flex-1 px-4 py-2.5 border border-border rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-wine/10 focus:border-wine bg-zinc-50/50 font-mono"
                          placeholder="Paste image URL or Base64 string here..."
                        />
                        <div className="relative overflow-hidden shrink-0">
                          <button
                            type="button"
                            className="h-full px-4 bg-zinc-100 hover:bg-zinc-200 border border-border rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer flex items-center gap-2"
                            disabled={isUploadingImage}
                          >
                            {isUploadingImage ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                            Upload
                          </button>
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={handleBlogImageUpload} 
                            disabled={isUploadingImage}
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">Article HTML / Markdown Content</label>
                      <textarea 
                        value={generatedBlog.markdown || generatedBlog.article || ''} 
                        onChange={(e) => setGeneratedBlog({...generatedBlog, article: e.target.value, markdown: e.target.value})}
                        className="w-full px-4 py-3.5 border border-border rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-wine/10 focus:border-wine bg-zinc-50/50 font-mono min-h-[400px]"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    {generatedBlog.imageUrl && (
                      <div className="mb-6 rounded-2xl overflow-hidden border border-border/80">
                        <img src={generatedBlog.imageUrl} alt="Generated Cover" className="w-full h-auto max-h-[300px] object-cover" />
                      </div>
                    )}
                    <div className="text-zinc-800 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: generatedBlog.article.replace(/\n/g, '<br/>') }} />
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] bg-white/50 backdrop-blur-md rounded-2xl border border-dashed border-border flex flex-col items-center justify-center text-zinc-400">
              <FileText size={48} className="mb-4 text-wine/40" />
              <p className="text-xs font-bold uppercase tracking-wider">Editor Panel Ready</p>
              <p className="text-[11px] mt-1 text-zinc-500 text-center max-w-xs">Configure settings and click generate to generate a new blog article.</p>
            </div>
          )}
        </div>
      </div>
        )}

      </>) }

      {/* Published Blogs Tab */}
      {activeTab === 'published' && (
        <div>
          {isLoadingBlogs ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="animate-spin text-wine" size={28} />
            </div>
          ) : publishedBlogs.length > 0 ? (
            <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-border overflow-hidden shadow-card">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-50/50 border-b border-border/80 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                    <th className="p-4">Title</th>
                    <th className="p-4">Category / Topic</th>
                    <th className="p-4">Date</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {publishedBlogs.map((blog) => (
                    <tr key={blog._id} className="hover:bg-white/80 transition-colors">
                      <td className="p-4 text-xs font-bold text-gray-900">
                        {blog.seoTitle || blog.topic || blog.title}
                      </td>
                      <td className="p-4 text-xs text-gray-600">
                        <span className="bg-wine-light border border-wine/10 text-wine px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider">{blog.industry || blog.category || 'General'}</span>
                      </td>
                      <td className="p-4 text-xs text-zinc-500 font-mono">
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 flex justify-end gap-2">
                        <button 
                          onClick={() => { handleEditPublished(blog); setActiveTab('blog'); }}
                          className="p-2 text-wine hover:bg-wine-light rounded-lg transition-colors cursor-pointer"
                          title="Edit Blog"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button 
                          onClick={() => handleDeletePublished(blog._id)}
                          className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Blog"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white/50 backdrop-blur-md rounded-2xl border border-dashed border-border p-16 text-center text-zinc-500">
              <FileText size={32} className="mx-auto mb-3 text-wine/40" />
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">No published blogs found</p>
              <p className="text-[11px] mt-1">Generate a blog and save it to publish.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default BlogGeneration;
