import { Handler } from '@netlify/functions';
import { supabase } from './lib/supabase';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
};

export const handler: Handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  try {
    // Get single post by slug
    if (event.httpMethod === 'GET' && event.queryStringParameters?.slug) {
      const slug = event.queryStringParameters.slug;

      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error) {
        return {
          statusCode: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Post not found' })
        };
      }

      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      };
    }

    // Get all posts
    if (event.httpMethod === 'GET') {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      };
    }

    // Create or update post
    if (event.httpMethod === 'POST') {
      if (!event.body) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'Request body is required' })
        };
      }

      const postData = JSON.parse(event.body);

      const { data, error } = await supabase
        .from('blog_posts')
        .upsert(postData)
        .select()
        .single();

      if (error) throw error;

      return {
        statusCode: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: true, data, message: 'Post saved successfully' })
      };
    }

    // Delete post
    if (event.httpMethod === 'DELETE') {
      const id = event.queryStringParameters?.id;

      if (!id) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'Post ID is required' })
        };
      }

      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: true, message: 'Post deleted successfully' })
      };
    }

    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  } catch (error) {
    console.error('Error in posts function:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
}; 


/**
 * supabase schema 
 * create table posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content text not null,
  author text,
  image text,
  alt text,
  category text,
  status text check (status in ('draft', 'published', 'scheduled')) default 'draft',
  published_at timestamptz,
  created_at timestamptz default now()
);

 */

/**
 * HOW THE BLOG SYSTEM WORKS:
 * 
 * 1. Admin Dashboard (BlogManagement.tsx) - React UI for managing blog posts
 *    - Lists all posts with filtering by status (published/draft/scheduled)
 *    - Opens BlogPostModal for creating/editing posts
 * 
 * 2. This Netlify Function - Serverless API endpoint at /.netlify/functions/post
 *    - GET: Fetch all posts or single post by slug
 *    - POST: Create or update post (upsert by id)
 *    - DELETE: Remove post by id
 * 
 * 3. Supabase Database - PostgreSQL table 'posts' stores all blog data
 *    - Auto-generates UUID for each post
 *    - Enforces status constraints (draft/published/scheduled)
 *    - Tracks created_at and published_at timestamps
 * 
 * 4. Public Website Integration - Fetch published posts for display
 *    - GET /.netlify/functions/post?slug=my-post - Single post
 *    - GET /.netlify/functions/post - All posts (filter by status='published' on frontend)
 */