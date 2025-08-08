// Cloudflare Worker for Wait List API
export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      const path = url.pathname;
      
      console.log('Worker request:', path, request.method);

      // Test route
      if (path === '/test') {
        return new Response('Worker is working!', {
          headers: { 'Content-Type': 'text/plain' }
        });
      }

      // Handle API routes
      if (path.startsWith('/api/')) {
        console.log('API request:', path, request.method, request.url);
        return handleAPI(request, env, path);
      }

      // Serve static files
      return env.ASSETS.fetch(request);
    } catch (error) {
      console.error('Worker error:', error);
      return new Response('Worker error: ' + error.message, { status: 500 });
    }
  }
};

async function handleAPI(request, env, path) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': 'https://danielwait.com',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Checking GET /api/links, path:', path, 'method:', request.method);
    if (path === '/api/links' && request.method === 'GET') {
      // Get all links
      try {
        const links = await env.WAIT_LIST_KV.get('links', { type: 'json' }) || [];
        return new Response(JSON.stringify(links), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } catch (kvError) {
        console.error('KV get error:', kvError);
        return new Response(JSON.stringify([]), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    console.log('Checking POST /api/login, path:', path, 'method:', request.method);
    if (path === '/api/login' && request.method === 'POST') {
      // Validate admin login
      const body = await request.json();
      const { password } = body;

      if (password === 'daniel2025') {
        return new Response(JSON.stringify({ success: true, message: 'Login successful' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } else {
        return new Response(JSON.stringify({ error: 'Invalid password' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    console.log('Checking POST /api/links, path:', path, 'method:', request.method);
    if (path === '/api/links' && request.method === 'POST') {
      // Add new link
      const body = await request.json();
      const { title, url, description } = body;

      // Validate required fields
      if (!title || !url) {
        return new Response(JSON.stringify({ error: 'Title and URL are required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // No password check needed since admin page is already protected by login

      try {
        const links = await env.WAIT_LIST_KV.get('links', { type: 'json' }) || [];
        const newLink = {
          id: Date.now(),
          title: title.trim(),
          url: url.trim(),
          description: description ? description.trim() : '',
          date: new Date().toISOString().split('T')[0]
        };

        links.unshift(newLink);
        await env.WAIT_LIST_KV.put('links', JSON.stringify(links));

        return new Response(JSON.stringify(newLink), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } catch (kvError) {
        console.error('KV operation error:', kvError);
        return new Response(JSON.stringify({ error: 'Failed to save link' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    if (path.startsWith('/api/links/') && request.method === 'PUT') {
      // Update link
      const id = parseInt(path.split('/').pop());
      const body = await request.json();
      const { title, url, description } = body;

      // Validate required fields
      if (!title || !url) {
        return new Response(JSON.stringify({ error: 'Title and URL are required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // No password check needed since admin page is already protected by login

      try {
        const links = await env.WAIT_LIST_KV.get('links', { type: 'json' }) || [];
        const linkIndex = links.findIndex(link => link.id === id);
        
        if (linkIndex === -1) {
          return new Response(JSON.stringify({ error: 'Link not found' }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // Update the link
        links[linkIndex] = {
          ...links[linkIndex],
          title: title.trim(),
          url: url.trim(),
          description: description ? description.trim() : ''
        };

        await env.WAIT_LIST_KV.put('links', JSON.stringify(links));

        return new Response(JSON.stringify(links[linkIndex]), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } catch (kvError) {
        console.error('KV update error:', kvError);
        return new Response(JSON.stringify({ error: 'Failed to update link' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    if (path.startsWith('/api/links/') && request.method === 'DELETE') {
      // Delete link
      const id = parseInt(path.split('/').pop());
      // No password check needed since admin page is already protected by login

      try {
        const links = await env.WAIT_LIST_KV.get('links', { type: 'json' }) || [];
        const filteredLinks = links.filter(link => link.id !== id);
        await env.WAIT_LIST_KV.put('links', JSON.stringify(filteredLinks));

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } catch (kvError) {
        console.error('KV delete error:', kvError);
        return new Response(JSON.stringify({ error: 'Failed to delete link' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    console.log('API route not found:', path);
    return new Response('Not Found', { status: 404, headers: corsHeaders });
  } catch (error) {
    console.error('API error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}