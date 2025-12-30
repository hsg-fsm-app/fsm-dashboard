import { useState, useEffect } from 'react';
import '@styles/components/BlogPostModal.css';

interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  image: string;
  alt: string;
  status: 'published' | 'draft' | 'scheduled';
  category: string;
  published_at: string | null;
}

interface BlogPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (post: BlogPost) => Promise<void>;
  post?: BlogPost | null;
}

const emptyPost: BlogPost = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  author: '',
  image: '',
  alt: '',
  status: 'draft',
  category: '',
  published_at: null,
};

const BlogPostModal: React.FC<BlogPostModalProps> = ({ isOpen, onClose, onSave, post }) => {
  const [formData, setFormData] = useState<BlogPost>(emptyPost);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'media' | 'seo'>('content');

  useEffect(() => {
    if (post) {
      setFormData(post);
    } else {
      setFormData(emptyPost);
    }
  }, [post, isOpen]);

  const handleChange = (field: keyof BlogPost, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-generate slug from title
    if (field === 'title') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content) {
      alert('Title and content are required');
      return;
    }

    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Error saving post. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const CloseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );

  return (
    <div className="cs-modal-overlay" onClick={onClose}>
      <div className="cs-modal" onClick={e => e.stopPropagation()}>
        <div className="cs-modal-header">
          <h2 className="cs-modal-title">
            {post?.id ? 'Edit Post' : 'Create New Post'}
          </h2>
          <button className="cs-modal-close" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        <div className="cs-modal-tabs">
          <button 
            className={`cs-modal-tab ${activeTab === 'content' ? 'cs-modal-tab--active' : ''}`}
            onClick={() => setActiveTab('content')}
          >
            Content
          </button>
          <button 
            className={`cs-modal-tab ${activeTab === 'media' ? 'cs-modal-tab--active' : ''}`}
            onClick={() => setActiveTab('media')}
          >
            Media
          </button>
          <button 
            className={`cs-modal-tab ${activeTab === 'seo' ? 'cs-modal-tab--active' : ''}`}
            onClick={() => setActiveTab('seo')}
          >
            SEO & Meta
          </button>
        </div>

        <form onSubmit={handleSubmit} className="cs-modal-body">
          {activeTab === 'content' && (
            <div className="cs-modal-content-tab">
              <div className="cs-form-row">
                <div className="cs-form-group cs-form-group--full">
                  <label className="cs-form-label">Title *</label>
                  <input
                    type="text"
                    className="cs-form-input"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="Enter post title"
                    required
                  />
                </div>
              </div>

              <div className="cs-form-row cs-form-row--two">
                <div className="cs-form-group">
                  <label className="cs-form-label">Slug</label>
                  <input
                    type="text"
                    className="cs-form-input"
                    value={formData.slug}
                    onChange={(e) => handleChange('slug', e.target.value)}
                    placeholder="post-url-slug"
                  />
                </div>
                <div className="cs-form-group">
                  <label className="cs-form-label">Author</label>
                  <input
                    type="text"
                    className="cs-form-input"
                    value={formData.author}
                    onChange={(e) => handleChange('author', e.target.value)}
                    placeholder="Author name"
                  />
                </div>
              </div>

              <div className="cs-form-row cs-form-row--two">
                <div className="cs-form-group">
                  <label className="cs-form-label">Category</label>
                  <select
                    className="cs-form-input cs-form-select"
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                  >
                    <option value="">Select category</option>
                    <option value="Renovation">Renovation</option>
                    <option value="Design">Design</option>
                    <option value="Materials">Materials</option>
                    <option value="Tips & Guides">Tips & Guides</option>
                  </select>
                </div>
                <div className="cs-form-group">
                  <label className="cs-form-label">Status</label>
                  <select
                    className="cs-form-input cs-form-select"
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>
              </div>

              <div className="cs-form-group">
                <label className="cs-form-label">Excerpt</label>
                <textarea
                  className="cs-form-input cs-form-textarea"
                  value={formData.excerpt}
                  onChange={(e) => handleChange('excerpt', e.target.value)}
                  placeholder="Brief summary of the post..."
                  rows={3}
                />
              </div>

              <div className="cs-form-group">
                <label className="cs-form-label">Content *</label>
                <textarea
                  className="cs-form-input cs-form-textarea cs-form-textarea--large"
                  value={formData.content}
                  onChange={(e) => handleChange('content', e.target.value)}
                  placeholder="Write your post content here... (HTML supported)"
                  rows={10}
                  required
                />
              </div>
            </div>
          )}

          {activeTab === 'media' && (
            <div className="cs-modal-media-tab">
              <div className="cs-form-group">
                <label className="cs-form-label">Featured Image URL</label>
                <input
                  type="text"
                  className="cs-form-input"
                  value={formData.image}
                  onChange={(e) => handleChange('image', e.target.value)}
                  placeholder="/assets/images/blog/image.jpg"
                />
              </div>

              <div className="cs-form-group">
                <label className="cs-form-label">Image Alt Text</label>
                <input
                  type="text"
                  className="cs-form-input"
                  value={formData.alt}
                  onChange={(e) => handleChange('alt', e.target.value)}
                  placeholder="Describe the image for accessibility"
                />
              </div>

              {formData.image && (
                <div className="cs-image-preview">
                  <label className="cs-form-label">Preview</label>
                  <img 
                    src={formData.image} 
                    alt={formData.alt || 'Preview'} 
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="cs-modal-seo-tab">
              <div className="cs-form-group">
                <label className="cs-form-label">URL Slug</label>
                <div className="cs-url-preview">
                  <span className="cs-url-base">/blog/</span>
                  <input
                    type="text"
                    className="cs-form-input"
                    value={formData.slug}
                    onChange={(e) => handleChange('slug', e.target.value)}
                    placeholder="post-url-slug"
                  />
                </div>
              </div>

              <div className="cs-form-group">
                <label className="cs-form-label">Meta Description (Excerpt)</label>
                <textarea
                  className="cs-form-input cs-form-textarea"
                  value={formData.excerpt}
                  onChange={(e) => handleChange('excerpt', e.target.value)}
                  placeholder="This will appear in search engine results..."
                  rows={3}
                  maxLength={160}
                />
                <span className="cs-form-hint">
                  {formData.excerpt.length}/160 characters
                </span>
              </div>
            </div>
          )}
        </form>

        <div className="cs-modal-footer">
          <button type="button" className="cs-button-secondary" onClick={onClose}>
            Cancel
          </button>
          <button 
            type="submit" 
            className="cs-button" 
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? 'Saving...' : (post?.id ? 'Update Post' : 'Create Post')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogPostModal;
