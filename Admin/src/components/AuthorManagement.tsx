import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Save, Check, User, Trash2, Plus, Upload, X, ExternalLink, Globe, Mail } from 'lucide-react';

interface AuthorProfile {
  _id?: string;
  name: string;
  designation: string;
  bio: string;
  avatar: string;
  email: string;
  linkedin: string;
  twitter: string;
  website: string;
}

const emptyProfile: AuthorProfile = {
  name: '',
  designation: '',
  bio: '',
  avatar: '',
  email: '',
  linkedin: '',
  twitter: '',
  website: '',
};

const AuthorManagement = () => {
  const [authors, setAuthors] = useState<AuthorProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<AuthorProfile>(emptyProfile);
  const [isEditing, setIsEditing] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const fetchAuthors = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/author/all`);
      const data = await res.json();
      setAuthors(data);
    } catch (err) {
      console.error('Error fetching authors:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
          setEditingAuthor(prev => ({ ...prev, avatar: data.url }));
        } else {
          console.error('Upload failed:', data.message);
          alert('Failed to upload image. Check console for details.');
        }
      } else {
        console.error('Upload error status:', res.status);
        alert('Failed to upload image.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Error uploading image.');
    }
  };

  const handleSave = async () => {
    if (!editingAuthor.name.trim()) return;
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/author/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingAuthor),
      });
      if (res.ok) {
        setSaveSuccess(true);
        setIsEditing(false);
        setEditingAuthor(emptyProfile);
        fetchAuthors();
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Error saving author:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (author: AuthorProfile) => {
    setEditingAuthor({ ...author });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this author profile?')) return;
    await fetch(`${import.meta.env.VITE_API_URL || ''}/api/author/${id}`, { method: 'DELETE' });
    fetchAuthors();
  };

  const handleNew = () => {
    setEditingAuthor(emptyProfile);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditingAuthor(emptyProfile);
    setIsEditing(false);
  };

  return (
    <div className="bg-transparent">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <p className="text-zinc-500 font-semibold text-xs max-w-lg">Manage blog writer profiles. The active profile will display across all blog articles.</p>
        {!isEditing && (
          <button
            onClick={handleNew}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-wine hover:bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer shadow-md hover:shadow-lg active:scale-95 self-start sm:self-auto"
          >
            <Plus size={14} /> New Author
          </button>
        )}
      </div>

      {/* Editor Form */}
      {isEditing && (
        <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-border shadow-card p-6 mb-8">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/50">
            <h2 className="text-xs font-black text-black uppercase tracking-widest">
              {editingAuthor._id ? 'Edit Author Profile' : 'New Author Profile'}
            </h2>
            <button onClick={handleCancel} className="p-2 text-zinc-400 hover:text-zinc-800 bg-zinc-50 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer">
              <X size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center gap-3">
              <div
                className="w-32 h-32 rounded-full border-2 border-dashed border-border flex items-center justify-center overflow-hidden bg-zinc-50/50 cursor-pointer hover:border-wine transition-all"
                onClick={() => avatarInputRef.current?.click()}
              >
                {editingAuthor.avatar ? (
                  <img src={editingAuthor.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-zinc-400">
                    <Upload size={20} />
                    <span className="text-[9px] font-black uppercase tracking-wider">Upload Photo</span>
                  </div>
                )}
              </div>
              <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
              {editingAuthor.avatar && (
                <button
                  onClick={() => setEditingAuthor(prev => ({ ...prev, avatar: '' }))}
                  className="text-[10px] font-black uppercase tracking-wider text-red-500 hover:text-red-700 cursor-pointer"
                >
                  Remove photo
                </button>
              )}
              <p className="text-[10px] text-zinc-400 text-center font-semibold uppercase tracking-wider">Click circle to upload avatar</p>
            </div>

            {/* Details Fields */}
            <div className="md:col-span-2 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    value={editingAuthor.name}
                    onChange={e => setEditingAuthor(p => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-4 py-2.5 border border-border rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-wine/10 focus:border-wine bg-zinc-50/50 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">Designation</label>
                  <input
                    type="text"
                    value={editingAuthor.designation}
                    onChange={e => setEditingAuthor(p => ({ ...p, designation: e.target.value }))}
                    placeholder="e.g. PropTech Analyst & Writer"
                    className="w-full px-4 py-2.5 border border-border rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-wine/10 focus:border-wine bg-zinc-50/50 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">Bio</label>
                <textarea
                  value={editingAuthor.bio}
                  onChange={e => setEditingAuthor(p => ({ ...p, bio: e.target.value }))}
                  rows={3}
                  placeholder="A short bio about the author..."
                  className="w-full px-4 py-2.5 border border-border rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-wine/10 focus:border-wine bg-zinc-50/50 outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">Email</label>
                  <input
                    type="email"
                    value={editingAuthor.email}
                    onChange={e => setEditingAuthor(p => ({ ...p, email: e.target.value }))}
                    placeholder="author@email.com"
                    className="w-full px-4 py-2.5 border border-border rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-wine/10 focus:border-wine bg-zinc-50/50 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">Website</label>
                  <input
                    type="url"
                    value={editingAuthor.website}
                    onChange={e => setEditingAuthor(p => ({ ...p, website: e.target.value }))}
                    placeholder="https://yoursite.com"
                    className="w-full px-4 py-2.5 border border-border rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-wine/10 focus:border-wine bg-zinc-50/50 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">LinkedIn URL</label>
                  <input
                    type="url"
                    value={editingAuthor.linkedin}
                    onChange={e => setEditingAuthor(p => ({ ...p, linkedin: e.target.value }))}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-4 py-2.5 border border-border rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-wine/10 focus:border-wine bg-zinc-50/50 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">Twitter / X URL</label>
                  <input
                    type="url"
                    value={editingAuthor.twitter}
                    onChange={e => setEditingAuthor(p => ({ ...p, twitter: e.target.value }))}
                    placeholder="https://x.com/..."
                    className="w-full px-4 py-2.5 border border-border rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-wine/10 focus:border-wine bg-zinc-50/50 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border/50">
            <button onClick={handleCancel} className="px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-zinc-500 bg-zinc-100 hover:bg-zinc-200 rounded-xl transition-all cursor-pointer">Cancel</button>
            <button
              onClick={handleSave}
              disabled={isSaving || !editingAuthor.name.trim()}
              className={`flex items-center gap-1.5 px-5 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl text-white transition-colors cursor-pointer ${saveSuccess ? 'bg-emerald-600' : 'bg-wine hover:bg-black'} disabled:opacity-50`}
            >
              {isSaving ? <><Loader2 size={12} className="animate-spin" /> Saving...</> : saveSuccess ? <><Check size={12} /> Saved!</> : <><Save size={12} /> Save Profile</>}
            </button>
          </div>
        </div>
      )}

      {/* Author List */}
      <div>
        <h2 className="text-xs font-black text-black uppercase tracking-widest mb-6">All Author Profiles</h2>
        {isLoading ? (
          <div className="flex justify-center py-16"><Loader2 className="animate-spin text-wine" size={28} /></div>
        ) : authors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {authors.map(author => (
              <div key={author._id} className="bg-white/70 backdrop-blur-md rounded-2xl border border-border p-5 flex items-start gap-4 shadow-card hover:bg-white transition-all">
                {/* Avatar */}
                <div className="w-14 h-14 rounded-full bg-zinc-50 border border-border/80 overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {author.avatar ? (
                    <img src={author.avatar} alt={author.name} className="w-full h-full object-cover" />
                  ) : (
                    <User size={20} className="text-zinc-300" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-sm leading-tight">{author.name}</h3>
                  {author.designation && <p className="text-[10px] font-black uppercase tracking-wider text-wine mt-1">{author.designation}</p>}
                  {author.bio && <p className="text-xs text-zinc-500 mt-2 font-medium line-clamp-2 leading-relaxed">{author.bio}</p>}
                  <div className="flex items-center gap-3 mt-3">
                    {author.linkedin && <a href={author.linkedin} target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-wine transition-colors" title="LinkedIn"><ExternalLink size={13} /></a>}
                    {author.twitter && <a href={author.twitter} target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-wine transition-colors" title="Twitter/X"><ExternalLink size={13} /></a>}
                    {author.website && <a href={author.website} target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-wine transition-colors" title="Website"><Globe size={13} /></a>}
                    {author.email && <a href={`mailto:${author.email}`} className="text-zinc-400 hover:text-wine transition-colors" title="Email"><Mail size={13} /></a>}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-1.5 shrink-0">
                  <button
                    onClick={() => handleEdit(author)}
                    className="p-2 text-wine hover:bg-wine-light rounded-lg transition-colors cursor-pointer"
                    title="Edit"
                  >
                    <Save size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(author._id!)}
                    className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/50 backdrop-blur-md rounded-2xl border border-dashed border-border p-16 text-center text-zinc-500">
            <User size={32} className="mx-auto mb-3 text-wine/40" />
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">No author profiles found</p>
            <p className="text-[11px] mt-1">Create an author profile to display writer bio details on blogs.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthorManagement;
