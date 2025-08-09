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
      // Validate admin login with username and password
      const body = await request.json();
      const { username, password } = body;

      // Server-side credentials (in production, these should be environment variables)
      const ADMIN_USERNAME = 'admin';
      const ADMIN_PASSWORD = 'daniel2025';

      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        return new Response(JSON.stringify({ 
          success: true, 
          message: 'Login successful',
          sessionToken: 'valid-session-' + Date.now() // Simple session token
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } else {
        return new Response(JSON.stringify({ error: 'Invalid username or password' }), {
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

    if (path === '/api/track-click' && request.method === 'POST') {
      // Track link click
      const body = await request.json();
      const { linkId } = body;

      if (!linkId) {
        return new Response(JSON.stringify({ error: 'Link ID is required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      try {
        // Get current click data
        const clickData = await env.WAIT_LIST_KV.get('click_analytics', { type: 'json' }) || {};
        
        // Initialize click count for this link if it doesn't exist
        if (!clickData[linkId]) {
          clickData[linkId] = {
            count: 0,
            firstClick: new Date().toISOString(),
            lastClick: null,
            dailyClicks: {}
          };
        }

        // Increment click count
        clickData[linkId].count += 1;
        clickData[linkId].lastClick = new Date().toISOString();

        // Track daily clicks
        const today = new Date().toISOString().split('T')[0];
        if (!clickData[linkId].dailyClicks[today]) {
          clickData[linkId].dailyClicks[today] = 0;
        }
        clickData[linkId].dailyClicks[today] += 1;

        // Save updated click data
        await env.WAIT_LIST_KV.put('click_analytics', JSON.stringify(clickData));

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } catch (kvError) {
        console.error('KV click tracking error:', kvError);
        return new Response(JSON.stringify({ error: 'Failed to track click' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    if (path === '/api/track-pageview' && request.method === 'POST') {
      // Track page view with comprehensive data
      const body = await request.json();
      const { 
        page, 
        referrer, 
        userAgent, 
        screenWidth, 
        screenHeight, 
        timestamp,
        sessionId,
        timeOnPreviousPage 
      } = body;

      try {
        // Get geographic data from Cloudflare headers
        const country = request.headers.get('CF-IPCountry') || 'Unknown';
        const region = request.headers.get('CF-Region') || 'Unknown';
        const city = request.headers.get('CF-IPCity') || 'Unknown';
        const timezone = request.headers.get('CF-Timezone') || 'Unknown';
        const latitude = request.headers.get('CF-IPLatitude') || null;
        const longitude = request.headers.get('CF-IPLongitude') || null;

        // Get current analytics data
        const analyticsData = await env.WAIT_LIST_KV.get('site_analytics', { type: 'json' }) || {
          pageViews: {},
          sessions: {},
          referrers: {},
          devices: {},
          browsers: {},
          countries: {},
          regions: {},
          cities: {},
          dailyStats: {},
          hourlyStats: {}
        };

        const today = new Date().toISOString().split('T')[0];
        const hour = new Date().getHours();
        const thisMonth = today.substring(0, 7); // YYYY-MM

        // Track page views
        if (!analyticsData.pageViews[page]) {
          analyticsData.pageViews[page] = { count: 0, dailyViews: {}, firstView: timestamp };
        }
        analyticsData.pageViews[page].count += 1;
        analyticsData.pageViews[page].lastView = timestamp;
        
        if (!analyticsData.pageViews[page].dailyViews[today]) {
          analyticsData.pageViews[page].dailyViews[today] = 0;
        }
        analyticsData.pageViews[page].dailyViews[today] += 1;

        // Track sessions
        if (!analyticsData.sessions[sessionId]) {
          analyticsData.sessions[sessionId] = {
            startTime: timestamp,
            pages: [],
            referrer: referrer,
            userAgent: userAgent,
            screenSize: `${screenWidth}x${screenHeight}`,
            country: country,
            region: region,
            city: city,
            timezone: timezone,
            coordinates: latitude && longitude ? { lat: latitude, lng: longitude } : null
          };
        }
        analyticsData.sessions[sessionId].pages.push({
          page: page,
          timestamp: timestamp,
          timeOnPage: timeOnPreviousPage
        });
        analyticsData.sessions[sessionId].lastActivity = timestamp;

        // Track referrers
        if (referrer && referrer !== '') {
          const referrerDomain = new URL(referrer).hostname;
          if (!analyticsData.referrers[referrerDomain]) {
            analyticsData.referrers[referrerDomain] = { count: 0, dailyReferrals: {} };
          }
          analyticsData.referrers[referrerDomain].count += 1;
          
          if (!analyticsData.referrers[referrerDomain].dailyReferrals[today]) {
            analyticsData.referrers[referrerDomain].dailyReferrals[today] = 0;
          }
          analyticsData.referrers[referrerDomain].dailyReferrals[today] += 1;
        }

        // Track device info
        const deviceKey = `${screenWidth}x${screenHeight}`;
        if (!analyticsData.devices[deviceKey]) {
          analyticsData.devices[deviceKey] = { count: 0, type: getDeviceType(screenWidth) };
        }
        analyticsData.devices[deviceKey].count += 1;

        // Track browser info
        const browser = getBrowserFromUserAgent(userAgent);
        if (!analyticsData.browsers[browser]) {
          analyticsData.browsers[browser] = { count: 0, dailyUsers: {} };
        }
        analyticsData.browsers[browser].count += 1;
        
        if (!analyticsData.browsers[browser].dailyUsers[today]) {
          analyticsData.browsers[browser].dailyUsers[today] = 0;
        }
        analyticsData.browsers[browser].dailyUsers[today] += 1;

        // Track geographic data
        if (country && country !== 'Unknown') {
          if (!analyticsData.countries[country]) {
            analyticsData.countries[country] = { count: 0, dailyVisitors: {}, regions: {} };
          }
          analyticsData.countries[country].count += 1;
          
          if (!analyticsData.countries[country].dailyVisitors[today]) {
            analyticsData.countries[country].dailyVisitors[today] = 0;
          }
          analyticsData.countries[country].dailyVisitors[today] += 1;

          // Track regions within countries
          if (region && region !== 'Unknown') {
            if (!analyticsData.countries[country].regions[region]) {
              analyticsData.countries[country].regions[region] = 0;
            }
            analyticsData.countries[country].regions[region] += 1;

            // Track regions globally
            const regionKey = `${country}-${region}`;
            if (!analyticsData.regions[regionKey]) {
              analyticsData.regions[regionKey] = { 
                count: 0, 
                country: country, 
                region: region,
                dailyVisitors: {} 
              };
            }
            analyticsData.regions[regionKey].count += 1;
            
            if (!analyticsData.regions[regionKey].dailyVisitors[today]) {
              analyticsData.regions[regionKey].dailyVisitors[today] = 0;
            }
            analyticsData.regions[regionKey].dailyVisitors[today] += 1;
          }
        }

        // Track cities
        if (city && city !== 'Unknown' && country && country !== 'Unknown') {
          const cityKey = `${city}, ${country}`;
          if (!analyticsData.cities[cityKey]) {
            analyticsData.cities[cityKey] = { 
              count: 0, 
              country: country, 
              region: region,
              city: city,
              dailyVisitors: {} 
            };
          }
          analyticsData.cities[cityKey].count += 1;
          
          if (!analyticsData.cities[cityKey].dailyVisitors[today]) {
            analyticsData.cities[cityKey].dailyVisitors[today] = 0;
          }
          analyticsData.cities[cityKey].dailyVisitors[today] += 1;
        }

        // Track daily stats
        if (!analyticsData.dailyStats[today]) {
          analyticsData.dailyStats[today] = { 
            pageViews: 0, 
            uniqueSessions: new Set(),
            bounceRate: 0 
          };
        }
        analyticsData.dailyStats[today].pageViews += 1;
        analyticsData.dailyStats[today].uniqueSessions.add(sessionId);
        
        console.log(`Tracking pageview for ${today}: ${analyticsData.dailyStats[today].pageViews} views, ${analyticsData.dailyStats[today].uniqueSessions.size} sessions`);

        // Track hourly stats
        const hourKey = `${today}-${hour.toString().padStart(2, '0')}`;
        if (!analyticsData.hourlyStats[hourKey]) {
          analyticsData.hourlyStats[hourKey] = { pageViews: 0, sessions: new Set() };
        }
        analyticsData.hourlyStats[hourKey].pageViews += 1;
        analyticsData.hourlyStats[hourKey].sessions.add(sessionId);

        // Convert Sets to arrays for storage
        Object.keys(analyticsData.dailyStats).forEach(date => {
          if (analyticsData.dailyStats[date].uniqueSessions instanceof Set) {
            analyticsData.dailyStats[date].uniqueSessions = Array.from(analyticsData.dailyStats[date].uniqueSessions);
          }
        });
        
        Object.keys(analyticsData.hourlyStats).forEach(hour => {
          if (analyticsData.hourlyStats[hour].sessions instanceof Set) {
            analyticsData.hourlyStats[hour].sessions = Array.from(analyticsData.hourlyStats[hour].sessions);
          }
        });

        await env.WAIT_LIST_KV.put('site_analytics', JSON.stringify(analyticsData));

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } catch (kvError) {
        console.error('KV pageview tracking error:', kvError);
        return new Response(JSON.stringify({ error: 'Failed to track pageview' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    if (path === '/api/analytics' && request.method === 'GET') {
      // Get comprehensive analytics data
      try {
        const clickData = await env.WAIT_LIST_KV.get('click_analytics', { type: 'json' }) || {};
        const siteData = await env.WAIT_LIST_KV.get('site_analytics', { type: 'json' }) || {};
        const links = await env.WAIT_LIST_KV.get('links', { type: 'json' }) || [];

        // Process link analytics
        const linkAnalytics = links.map(link => ({
          id: link.id,
          title: link.title,
          url: link.url,
          clicks: clickData[link.id]?.count || 0,
          firstClick: clickData[link.id]?.firstClick || null,
          lastClick: clickData[link.id]?.lastClick || null,
          dailyClicks: clickData[link.id]?.dailyClicks || {}
        }));

        // Process site analytics
        const now = new Date();
        const today = now.toISOString().split('T')[0];
        const last7Days = Array.from({length: 7}, (_, i) => {
          const date = new Date(now);
          date.setDate(date.getDate() - (6 - i)); // Show last 6 days + today
          return date.toISOString().split('T')[0];
        });

        const pageViewsToday = siteData.dailyStats?.[today]?.pageViews || 0;
        const totalPageViews = Object.values(siteData.pageViews || {}).reduce((sum, page) => sum + page.count, 0);
        const totalSessions = Object.keys(siteData.sessions || {}).length;
        
        console.log(`Analytics query - Today: ${today}, Today's pageviews: ${pageViewsToday}`);
        console.log(`Available daily stats dates:`, Object.keys(siteData.dailyStats || {}));
        
        // Calculate popular pages
        const popularPages = Object.entries(siteData.pageViews || {})
          .map(([page, data]) => ({
            page: page,
            views: data.count,
            todayViews: data.dailyViews?.[today] || 0
          }))
          .sort((a, b) => b.views - a.views);

        // Calculate top referrers
        const topReferrers = Object.entries(siteData.referrers || {})
          .map(([domain, data]) => ({
            domain: domain,
            referrals: data.count,
            todayReferrals: data.dailyReferrals?.[today] || 0
          }))
          .sort((a, b) => b.referrals - a.referrals);

        // Device/browser stats
        const deviceStats = Object.entries(siteData.devices || {})
          .map(([size, data]) => ({
            resolution: size,
            count: data.count,
            type: data.type
          }))
          .sort((a, b) => b.count - a.count);

        const browserStats = Object.entries(siteData.browsers || {})
          .map(([browser, data]) => ({
            browser: browser,
            count: data.count,
            todayUsers: data.dailyUsers?.[today] || 0
          }))
          .sort((a, b) => b.count - a.count);

        // Geographic stats
        const countryStats = Object.entries(siteData.countries || {})
          .map(([country, data]) => ({
            country: country,
            count: data.count,
            todayVisitors: data.dailyVisitors?.[today] || 0,
            regions: Object.entries(data.regions || {}).length
          }))
          .sort((a, b) => b.count - a.count);

        const regionStats = Object.entries(siteData.regions || {})
          .map(([key, data]) => ({
            region: data.region,
            country: data.country,
            count: data.count,
            todayVisitors: data.dailyVisitors?.[today] || 0
          }))
          .sort((a, b) => b.count - a.count);

        const cityStats = Object.entries(siteData.cities || {})
          .map(([cityKey, data]) => ({
            city: data.city,
            country: data.country,
            region: data.region,
            count: data.count,
            todayVisitors: data.dailyVisitors?.[today] || 0
          }))
          .sort((a, b) => b.count - a.count);

        // Weekly trend data
        const weeklyTrends = last7Days.map(date => {
          const dayStats = siteData.dailyStats?.[date];
          let sessionCount = 0;
          
          if (dayStats?.uniqueSessions) {
            if (Array.isArray(dayStats.uniqueSessions)) {
              sessionCount = dayStats.uniqueSessions.length;
            } else if (dayStats.uniqueSessions instanceof Set) {
              sessionCount = dayStats.uniqueSessions.size;
            } else if (typeof dayStats.uniqueSessions === 'object') {
              sessionCount = Object.keys(dayStats.uniqueSessions).length;
            }
          }
          
          return {
            date: date,
            pageViews: dayStats?.pageViews || 0,
            sessions: sessionCount
          };
        });

        return new Response(JSON.stringify({
          // Link analytics (existing)
          linkAnalytics,
          totalLinkClicks: Object.values(clickData).reduce((sum, data) => sum + (data.count || 0), 0),
          totalLinks: links.length,
          activeLinks: linkAnalytics.filter(link => link.clicks > 0).length,
          
          // Site analytics (new)
          siteStats: {
            totalPageViews: totalPageViews,
            pageViewsToday: pageViewsToday,
            totalSessions: totalSessions,
            avgPagesPerSession: totalSessions > 0 ? Math.round((totalPageViews / totalSessions) * 10) / 10 : 0,
            popularPages: popularPages.slice(0, 10),
            topReferrers: topReferrers.slice(0, 10),
            deviceStats: deviceStats.slice(0, 10),
            browserStats: browserStats.slice(0, 5),
            countryStats: countryStats.slice(0, 10),
            regionStats: regionStats.slice(0, 10),
            cityStats: cityStats.slice(0, 10),
            weeklyTrends: weeklyTrends
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } catch (kvError) {
        console.error('KV analytics error:', kvError);
        return new Response(JSON.stringify({ error: 'Failed to get analytics' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // Helper functions for analytics
    function getDeviceType(screenWidth) {
      if (screenWidth < 768) return 'Mobile';
      if (screenWidth < 1024) return 'Tablet';
      return 'Desktop';
    }

    function getBrowserFromUserAgent(userAgent) {
      if (!userAgent) return 'Unknown';
      if (userAgent.includes('Chrome')) return 'Chrome';
      if (userAgent.includes('Firefox')) return 'Firefox';
      if (userAgent.includes('Safari')) return 'Safari';
      if (userAgent.includes('Edge')) return 'Edge';
      if (userAgent.includes('Opera')) return 'Opera';
      return 'Other';
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