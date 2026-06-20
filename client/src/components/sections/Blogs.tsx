import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, Plus, X, Loader2, Sparkles, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../AppContext';

export default function Blogs() {
  const navigate = useNavigate();
  const {
    blogs: blogPosts,
    blogsLoading: isLoading,
    fetchBlogs,
    addNewBlogPost,
    triggerToast
  } = useApp();

  const [isOpenForm, setIsOpenForm] = useState(false);
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('PropTech');
  const [author, setAuthor] = useState('');

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !excerpt || !content || !author) {
      triggerToast({
        title: "Validation Error",
        description: "Please fill out all blog post details before publishing.",
        type: "error"
      });
      return;
    }

    try {
      await addNewBlogPost({
        title,
        excerpt,
        content,
        category,
        author
      });

      triggerToast({
        title: "Chronicle Published",
        description: `Successfully published: "${title}"`,
        type: "success"
      });

      // Reset
      setTitle('');
      setExcerpt('');
      setContent('');
      setAuthor('');
      setIsOpenForm(false);
    } catch (err: any) {
      triggerToast({
        title: "Error Publishing",
        description: err.message || "Failed to publish article",
        type: "error"
      });
    }
  };

  return (
    <section className="py-16 md:py-24 bg-transparent relative overflow-hidden scroll-mt-20" id="blogs">
      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        {/* Header Block */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8" data-aos="fade-up">
          <div>
            <span className="text-wine text-[10px] font-bold uppercase tracking-[0.4em] block mb-4">INSIGHTS & PERSPECTIVES</span>
            <h2 className="text-4xl md:text-5xl text-black font-serif leading-tight">Lotlite <span className="text-wine">Chronicles</span></h2>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsOpenForm(true)}
              className="px-4 py-2 bg-wine text-white rounded-xl text-xs uppercase font-extrabold tracking-widest hover:bg-black transition-colors flex items-center gap-2 cursor-pointer shadow-lg shadow-wine/10"
            >
              <Plus size={14} /> Write Chronicle
            </button>
          </div>
        </div>

        {/* Loading / Empty State */}
        {isLoading && blogPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-wine mb-4" size={32} />
            <p className="font-mono text-xs uppercase tracking-widest text-[#a3a3a3]">Refreshing academic journals...</p>
          </div>
        ) : blogPosts.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-3xl bg-neutral-50/50">
            <BookOpen className="text-neutral-300 mx-auto mb-4" size={40} />
            <p className="text-neutral-500 text-sm font-medium">No chronicles published yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {blogPosts.map((post, idx) => (
              <motion.div
                key={post.id}
                onClick={() => navigate(`/blog/${post.id}`)}
                whileHover={{ y: -5 }}
                className="group cursor-pointer bg-[#ffffff] p-5 rounded-2xl border border-border shadow-sm flex flex-col justify-between"
                data-aos="fade-up"
                data-aos-delay={idx * 100}
              >
                <div>
                  <div className="relative aspect-[16/10] bg-neutral-50 rounded-xl mb-5 overflow-hidden border border-border/80 flex items-center justify-center">
                    <div className="absolute inset-0 bg-wine/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center text-wine/10 font-serif text-6xl select-none group-hover:scale-110 transition-transform">
                      {post.title[0]}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-wine text-[9px] font-extrabold uppercase tracking-widest bg-wine-light/30 px-2 py-0.5 rounded-md">{post.category}</span>
                      <span className="text-neutral-400 text-[10px] uppercase tracking-widest font-mono font-bold">{post.date}</span>
                    </div>
                    <h3 className="text-xl font-bold font-sans text-neutral-900 group-hover:text-wine transition-colors leading-tight line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-[#737373] text-xs leading-relaxed line-clamp-3">
                      {post.excerpt?.replace(/[#*`~_]/g, '')?.replace(/>\s?/g, '')}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-dashed border-border/80 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-widest font-mono font-black text-neutral-400">By {post.author || 'Coordinator'}</span>
                  <span className="text-black font-extrabold text-[10px] uppercase tracking-widest group-hover:text-wine transition-all flex items-center gap-1">
                    Read More <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Chronicle Composition Modal Form */}
      <AnimatePresence>
        {isOpenForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl w-full max-w-lg border border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="bg-wine p-5 flex items-center justify-between text-white relative">
                <div className="absolute inset-0 bg-neutral-950/5 pointer-events-none" />
                <div className="flex items-center gap-2 relative z-10">
                  <BookOpen size={20} className="shrink-0 text-white animate-pulse" />
                  <div>
                    <h3 className="font-serif font-black text-sm sm:text-base tracking-wide">Write Academy Chronicle</h3>
                    <p className="text-[9px] uppercase tracking-widest font-mono text-zinc-300 mt-0.5">Publish Insights to Lotlite Hub</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpenForm(false)}
                  className="p-1.5 rounded-xl hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-widest text-[#404040] mb-2 font-mono">Article Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Navigating Real Estate Securitization"
                    className="w-full px-4 py-2.5 text-xs bg-neutral-50 border border-neutral-200 focus:border-wine hover:border-black/10 outline-none rounded-xl transition-colors font-bold uppercase tracking-wide text-neutral-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-[#404040] mb-2 font-mono">Author Name</label>
                    <input
                      type="text"
                      required
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="Your Name / Designation"
                      className="w-full px-4 py-2.5 text-xs bg-neutral-50 border border-neutral-200 focus:border-wine hover:border-black/10 outline-none rounded-xl transition-colors font-bold uppercase tracking-wide text-neutral-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-[#404040] mb-2 font-mono">Industry Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs bg-neutral-50 border border-neutral-200 focus:border-wine outline-none rounded-xl font-bold uppercase tracking-wide text-neutral-800 cursor-pointer"
                    >
                      <option value="PropTech">PropTech</option>
                      <option value="Education">Education</option>
                      <option value="Growth">Growth</option>
                      <option value="REIT Strategy">REIT Strategy</option>
                      <option value="Venture Capital">Venture Capital</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-widest text-[#404040] mb-2 font-mono">Brief Excerpt</label>
                  <input
                    type="text"
                    required
                    maxLength={130}
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="A quick 1-sentence hook summarize the main insight..."
                    className="w-full px-4 py-2.5 text-xs bg-neutral-50 border border-neutral-200 focus:border-wine hover:border-black/10 outline-none rounded-xl transition-colors font-bold tracking-wide text-neutral-800"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-widest text-[#404040] mb-2 font-mono">Chronicle Content</label>
                  <textarea
                    required
                    rows={4}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Describe how modern technology, scaling procedures, or finance metrics apply..."
                    className="w-full px-4 py-2.5 text-xs bg-neutral-50 border border-neutral-200 focus:border-wine hover:border-black/10 outline-none rounded-xl transition-colors font-medium tracking-wide text-neutral-800 resize-none min-h-[100px]"
                  />
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsOpenForm(false)}
                    className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-black font-extrabold text-[10px] uppercase tracking-wider rounded-xl cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-wine hover:bg-black text-[#ffffff] font-extrabold text-[10px] uppercase tracking-widest rounded-xl flex items-center gap-1.5 cursor-pointer transition-all shadow-md shadow-wine/10"
                  >
                    <Sparkles size={12} className="fill-amber-300 stroke-amber-300" /> Publish Article
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}