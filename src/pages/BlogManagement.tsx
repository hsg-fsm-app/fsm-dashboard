import { useState } from 'react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  status: 'published' | 'draft' | 'scheduled';
  category: string;
}

const BlogManagement = () => {
  const [posts] = useState<BlogPost[]>([
    {
      id: '1',
      title: '10 Tips for a Successful Home Renovation',
      excerpt: 'Learn the essential tips for planning and executing a home renovation project...',
      author: 'John Doe',
      date: '2024-12-15',
      status: 'published',
      category: 'Renovation'
    },
    {
      id: '2',
      title: 'Modern Kitchen Design Trends 2024',
      excerpt: 'Explore the latest trends in kitchen design and how to incorporate them...',
      author: 'Jane Smith',
      date: '2024-12-10',
      status: 'published',
      category: 'Design'
    },
    {
      id: '3',
      title: 'Choosing the Right Materials for Your Project',
      excerpt: 'A comprehensive guide to selecting the best materials for different applications...',
      author: 'John Doe',
      date: '2024-12-20',
      status: 'draft',
      category: 'Materials'
    },
  ]);

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
        <button className="cs-button">
          <PlusIcon />
          <span>New Post</span>
        </button>
      </div>

      <div className="cs-blog-stats">
        <div className="cs-blog-stat-card">
          <h3 className="cs-stat-number">12</h3>
          <p className="cs-stat-label">Total Posts</p>
        </div>
        <div className="cs-blog-stat-card">
          <h3 className="cs-stat-number">8</h3>
          <p className="cs-stat-label">Published</p>
        </div>
        <div className="cs-blog-stat-card">
          <h3 className="cs-stat-number">3</h3>
          <p className="cs-stat-label">Drafts</p>
        </div>
        <div className="cs-blog-stat-card">
          <h3 className="cs-stat-number">1</h3>
          <p className="cs-stat-label">Scheduled</p>
        </div>
      </div>

      <div className="cs-blog-section">
        <div className="cs-section-header">
          <h2 className="cs-section-title">Recent Posts</h2>
          <div className="cs-blog-filters">
            <button className="cs-filter-btn cs-filter-btn--active">All</button>
            <button className="cs-filter-btn">Published</button>
            <button className="cs-filter-btn">Drafts</button>
            <button className="cs-filter-btn">Scheduled</button>
          </div>
        </div>

        <div className="cs-blog-list">
          {posts.map((post) => (
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
                    <strong>Date:</strong> {new Date(post.date).toLocaleDateString()}
                  </span>
                  <span className="cs-meta-item">
                    <strong>Category:</strong> {post.category}
                  </span>
                </div>
                <div className="cs-blog-post-actions">
                  <button className="cs-icon-button cs-icon-button--primary" title="Edit">
                    <EditIcon />
                  </button>
                  <button className="cs-icon-button cs-icon-button--danger" title="Delete">
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
          <div className="cs-category-card">
            <h4 className="cs-category-name">Renovation</h4>
            <p className="cs-category-count">5 posts</p>
          </div>
          <div className="cs-category-card">
            <h4 className="cs-category-name">Design</h4>
            <p className="cs-category-count">3 posts</p>
          </div>
          <div className="cs-category-card">
            <h4 className="cs-category-name">Materials</h4>
            <p className="cs-category-count">2 posts</p>
          </div>
          <div className="cs-category-card">
            <h4 className="cs-category-name">Tips & Guides</h4>
            <p className="cs-category-count">2 posts</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogManagement;
