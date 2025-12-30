import { useState, useEffect, useMemo } from 'react';
import BlogPostModal from '../components/BlogPostModal';

interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  published_at: string | null;
  image: string;
  alt: string;
  status: 'published' | 'draft' | 'scheduled';
  category: string;
}

const BlogManagement = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'published' | 'draft' | 'scheduled'>('all');

  // Dynamic stats calculated from posts
  const stats = useMemo(() => ({
    total: posts.length,
    published: posts.filter(p => p.status === 'published').length,
    drafts: posts.filter(p => p.status === 'draft').length,
    scheduled: posts.filter(p => p.status === 'scheduled').length,
  }), [posts]);

  // Filtered posts based on active filter
  const filteredPosts = useMemo(() => {
    if (activeFilter === 'all') return posts;
    return posts.filter(p => p.status === activeFilter);
  }, [posts, activeFilter]);

  // Category stats from posts
  const categoryStats = useMemo(() => {
    const counts: Record<string, number> = {};
    posts.forEach(post => {
      if (post.category) {
        counts[post.category] = (counts[post.category] || 0) + 1;
      }
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [posts]);

  const fetchPosts = () => {
    fetch('/.netlify/functions/post')
      .then(res => res.json())
      .then(setPosts)
      .catch(err => console.error('Error fetching posts:', err));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const savePost = async (post: BlogPost) => {
    await fetch('/.netlify/functions/post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post),
    });
    fetchPosts();
  };

  const handleNewPost = () => {
    setEditingPost(null);
    setIsModalOpen(true);
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPost(null);
  };

  const handleDeletePost = async (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      await fetch(`/.netlify/functions/post?id=${id}`, {
        method: 'DELETE',
      });
      fetchPosts();
    }
  };

  const EditIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  );

  const DeleteIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    </svg>
  );

  const PlusIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );

  const getStatusBadge = (status: BlogPost['status']) => {
    const badges = {
      published: 'cs-badge-success',
      draft: 'cs-badge-warning',
      scheduled: 'cs-badge-info'
    };
    return badges[status] || 'cs-badge-default';
  };

  return (
    <div className="cs-blog-management-view">
      <div className="cs-view-header">
        <div>
          <h1 className="cs-view-title">Blog Management</h1>
          <p className="cs-view-subtitle">Create and manage your blog posts</p>
        </div>
        <button className="cs-button" onClick={handleNewPost}>
          <PlusIcon />
          <span>New Post</span>
        </button>
      </div>

      <div className="cs-blog-stats">
        <div className="cs-blog-stat-card">
          <h3 className="cs-stat-number">{stats.total}</h3>
          <p className="cs-stat-label">Total Posts</p>
        </div>
        <div className="cs-blog-stat-card">
          <h3 className="cs-stat-number">{stats.published}</h3>
          <p className="cs-stat-label">Published</p>
        </div>
        <div className="cs-blog-stat-card">
          <h3 className="cs-stat-number">{stats.drafts}</h3>
          <p className="cs-stat-label">Drafts</p>
        </div>
        <div className="cs-blog-stat-card">
          <h3 className="cs-stat-number">{stats.scheduled}</h3>
          <p className="cs-stat-label">Scheduled</p>
        </div>
      </div>

      <div className="cs-blog-section">
        <div className="cs-section-header">
          <h2 className="cs-section-title">Recent Posts</h2>
          <div className="cs-blog-filters">
            <button 
              className={`cs-filter-btn ${activeFilter === 'all' ? 'cs-filter-btn--active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              All
            </button>
            <button 
              className={`cs-filter-btn ${activeFilter === 'published' ? 'cs-filter-btn--active' : ''}`}
              onClick={() => setActiveFilter('published')}
            >
              Published
            </button>
            <button 
              className={`cs-filter-btn ${activeFilter === 'draft' ? 'cs-filter-btn--active' : ''}`}
              onClick={() => setActiveFilter('draft')}
            >
              Drafts
            </button>
            <button 
              className={`cs-filter-btn ${activeFilter === 'scheduled' ? 'cs-filter-btn--active' : ''}`}
              onClick={() => setActiveFilter('scheduled')}
            >
              Scheduled
            </button>
          </div>
        </div>

        <div className="cs-blog-list">
          {filteredPosts.length === 0 && (
            <div className="cs-empty-state">
              <p>No posts found. {activeFilter !== 'all' ? 'Try a different filter or ' : ''}Click "New Post" to create one.</p>
            </div>
          )}
          {filteredPosts.map((post) => (
            <div key={post.id} className="cs-blog-post-card">
              <div className="cs-blog-post-header">
                <div>
                  <h3 className="cs-blog-post-title">{post.title}</h3>
                  <p className="cs-blog-post-excerpt">{post.excerpt}</p>
                </div>
                <span className={`cs-status-badge ${getStatusBadge(post.status)}`}>
                  {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                </span>
              </div>
              <div className="cs-blog-post-meta">
                <div className="cs-blog-post-info">
                  <span className="cs-meta-item">
                    <strong>Author:</strong> {post.author}
                  </span>
                  <span className="cs-meta-item">
                    <strong>Date:</strong> {post.published_at ? new Date(post.published_at).toLocaleDateString() : 'Not set'}
                  </span>
                  <span className="cs-meta-item">
                    <strong>Category:</strong> {post.category}
                  </span>
                </div>
                <div className="cs-blog-post-actions">
                  <button className="cs-icon-button cs-icon-button--primary" title="Edit" onClick={() => handleEditPost(post)}>
                    <EditIcon />
                  </button>
                  <button className="cs-icon-button cs-icon-button--danger" title="Delete" onClick={() => post.id && handleDeletePost(post.id)}>
                    <DeleteIcon />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="cs-blog-section">
        <div className="cs-section-header">
          <h2 className="cs-section-title">Categories</h2>
          <button className="cs-button-secondary">Manage Categories</button>
        </div>

        <div className="cs-category-grid">
          {categoryStats.length === 0 && (
            <p className="cs-empty-text">No categories yet. Create posts with categories to see them here.</p>
          )}
          {categoryStats.map(({ name, count }) => (
            <div key={name} className="cs-category-card">
              <h4 className="cs-category-name">{name}</h4>
              <p className="cs-category-count">{count} {count === 1 ? 'post' : 'posts'}</p>
            </div>
          ))}
        </div>
      </div>

      <BlogPostModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={savePost}
        post={editingPost}
      />
    </div>
  );
};

export default BlogManagement;
