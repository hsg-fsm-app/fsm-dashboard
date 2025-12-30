/**
 * CHAT SESSION MANAGEMENT (MVP - No JWT)
 * 
 * Simplified version without JWT for MVP testing.
 * Sessions are created by admin, accessed via simple ID.
 * 
 * Endpoints:
 * - GET: List all sessions or get single session by id
 * - POST: Create new chat session
 * - DELETE: Close session (soft delete)
 */

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
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  try {
    // ==========================================
    // GET - List sessions or get single session
    // ==========================================
    if (event.httpMethod === 'GET') {
      const { id } = event.queryStringParameters || {};

      // Get single session by ID
      if (id) {
        const { data, error } = await supabase
          .from('chat_sessions')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        return {
          statusCode: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        };
      }

      // List all sessions (admin dashboard)
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      };
    }

    // ==========================================
    // POST - Create new chat session
    // ==========================================
    if (event.httpMethod === 'POST') {
      if (!event.body) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'Request body required' })
        };
      }

      const { customer_name, customer_email, metadata } = JSON.parse(event.body);

      // Create the session
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({
          status: 'open',
          customer_name: customer_name || 'Guest',
          customer_email: customer_email || null,
          metadata: metadata || {}
        })
        .select()
        .single();

      if (error) throw error;

      // Generate simple shareable link (MVP - no JWT)
      const baseUrl = process.env.URL || 'http://localhost:8888';
      const chatLink = `${baseUrl}/chat?chatId=${data.id}`;

      return {
        statusCode: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: true,
          session: data,
          chatLink,
          message: 'Chat session created. Share the link with customer.'
        })
      };
    }

    // ==========================================
    // DELETE - Close/archive session
    // ==========================================
    if (event.httpMethod === 'DELETE') {
      const { id } = event.queryStringParameters || {};

      if (!id) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'Session ID required' })
        };
      }

      // Soft delete - just mark as closed
      const { error } = await supabase
        .from('chat_sessions')
        .update({ status: 'closed' })
        .eq('id', id);

      if (error) throw error;

      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: true, message: 'Session closed' })
      };
    }

    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  } catch (error) {
    console.error('Chat session error:', error);
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
