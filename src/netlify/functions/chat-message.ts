/**
 * CHAT MESSAGES MANAGEMENT
 * 
 * Handles message CRUD for chat conversations.
 * 
 * Endpoints:
 * - GET: Fetch messages for a chat session
 * - POST: Send a new message
 */

import { Handler } from '@netlify/functions';
import { supabase } from './lib/supabase';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
};

export const handler: Handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  try {
    // ==========================================
    // GET - Fetch messages for a chat session
    // ==========================================
    if (event.httpMethod === 'GET') {
      const { chatId } = event.queryStringParameters || {};

      if (!chatId) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'chatId is required' })
        };
      }

      // Fetch messages ordered by creation time
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      };
    }

    // ==========================================
    // POST - Send a new message
    // ==========================================
    if (event.httpMethod === 'POST') {
      if (!event.body) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'Request body required' })
        };
      }

      const { chat_id, sender_type, sender_id, content } = JSON.parse(event.body);

      // Validate required fields
      if (!chat_id || !sender_type || !content) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ 
            error: 'Missing required fields',
            required: ['chat_id', 'sender_type', 'content']
          })
        };
      }

      // Insert the message
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          chat_id,
          sender_type,
          sender_id: sender_id || null,
          content: content.trim()
        })
        .select()
        .single();

      if (error) throw error;

      return {
        statusCode: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: true,
          message: data
        })
      };
    }

    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  } catch (error) {
    console.error('Chat message error:', error);
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
