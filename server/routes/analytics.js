const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const db = require('../database');

// Track page view
router.post('/pageview', async (req, res) => {
  try {
    const {
      page,
      sessionId,
      referrer,
      userAgent,
      screenWidth,
      screenHeight,
      country,
      region,
      city,
      timezone,
      latitude,
      longitude
    } = req.body;

    if (!page || !sessionId) {
      return res.status(400).json({ error: 'Page and sessionId are required' });
    }

    // Filter out admin pages
    if (page.includes('/admin') || page.includes('admin')) {
      return res.json({ success: true, skipped: 'admin page' });
    }

    // Insert page view
    await db.run(
      `INSERT INTO page_views 
       (page, session_id, referrer, user_agent, screen_width, screen_height, 
        country, region, city, timezone, latitude, longitude) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [page, sessionId, referrer || null, userAgent || null, screenWidth || null, screenHeight || null,
       country || null, region || null, city || null, timezone || null, latitude || null, longitude || null]
    );

    // Update or create session
    const existingSession = await db.get('SELECT * FROM sessions WHERE session_id = ?', [sessionId]);
    
    if (existingSession) {
      await db.run(
        'UPDATE sessions SET last_activity = datetime("now") WHERE session_id = ?',
        [sessionId]
      );
    } else {
      await db.run(
        `INSERT INTO sessions 
         (session_id, referrer, user_agent, screen_size, country, region, city, timezone, coordinates) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          sessionId,
          referrer || null,
          userAgent || null,
          screenWidth && screenHeight ? `${screenWidth}x${screenHeight}` : null,
          country || null,
          region || null,
          city || null,
          timezone || null,
          latitude && longitude ? JSON.stringify({ lat: latitude, lng: longitude }) : null
        ]
      );
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error tracking pageview:', error);
    res.status(500).json({ error: 'Failed to track pageview' });
  }
});

// Get analytics data (admin only)
router.get('/', authenticate, async (req, res) => {
  try {
    // Get link analytics
    const linkAnalytics = await db.all(`
      SELECT 
        l.id,
        l.title,
        l.url,
        COUNT(ca.id) as clicks,
        MIN(ca.clicked_at) as first_click,
        MAX(ca.clicked_at) as last_click
      FROM links l
      LEFT JOIN click_analytics ca ON l.id = ca.link_id
      GROUP BY l.id
      ORDER BY clicks DESC
    `);

    // Get daily click counts for each link
    const dailyClicks = await db.all(`
      SELECT 
        link_id,
        DATE(clicked_at) as date,
        COUNT(*) as count
      FROM click_analytics
      GROUP BY link_id, DATE(clicked_at)
    `);

    // Organize daily clicks by link_id
    const dailyClicksByLink = {};
    dailyClicks.forEach(dc => {
      if (!dailyClicksByLink[dc.link_id]) {
        dailyClicksByLink[dc.link_id] = {};
      }
      dailyClicksByLink[dc.link_id][dc.date] = dc.count;
    });

    // Add daily clicks to link analytics
    const linkAnalyticsWithDaily = linkAnalytics.map(link => ({
      ...link,
      dailyClicks: dailyClicksByLink[link.id] || {}
    }));

    // Get site statistics
    const totalPageViews = await db.get('SELECT COUNT(*) as count FROM page_views');
    const totalSessions = await db.get('SELECT COUNT(*) as count FROM sessions');
    
    const today = new Date().toISOString().split('T')[0];
    const pageViewsToday = await db.get(
      'SELECT COUNT(*) as count FROM page_views WHERE DATE(viewed_at) = ?',
      [today]
    );

    // Get popular pages
    const popularPages = await db.all(`
      SELECT 
        page,
        COUNT(*) as views,
        COUNT(DISTINCT session_id) as unique_sessions
      FROM page_views
      GROUP BY page
      ORDER BY views DESC
      LIMIT 10
    `);

    // Get page views for today for popular pages
    const todayPageViews = await db.all(`
      SELECT 
        page,
        COUNT(*) as today_views
      FROM page_views
      WHERE DATE(viewed_at) = ?
      GROUP BY page
    `, [today]);

    const todayViewsMap = {};
    todayPageViews.forEach(tpv => {
      todayViewsMap[tpv.page] = tpv.today_views;
    });

    const popularPagesWithToday = popularPages.map(page => ({
      ...page,
      todayViews: todayViewsMap[page.page] || 0
    }));

    // Get top referrers
    const topReferrers = await db.all(`
      SELECT 
        referrer,
        COUNT(*) as referrals
      FROM page_views
      WHERE referrer IS NOT NULL AND referrer != ''
      GROUP BY referrer
      ORDER BY referrals DESC
      LIMIT 10
    `);

    // Get device stats
    const deviceStats = await db.all(`
      SELECT 
        screen_width || 'x' || screen_height as resolution,
        COUNT(*) as count
      FROM page_views
      WHERE screen_width IS NOT NULL AND screen_height IS NOT NULL
      GROUP BY screen_width || 'x' || screen_height
      ORDER BY count DESC
      LIMIT 10
    `);

    // Add device type
    const deviceStatsWithType = deviceStats.map(device => ({
      ...device,
      type: device.resolution ? 
        (parseInt(device.resolution.split('x')[0]) < 768 ? 'Mobile' :
         parseInt(device.resolution.split('x')[0]) < 1024 ? 'Tablet' : 'Desktop') :
        'Unknown'
    }));

    // Get browser stats (simplified from user_agent)
    const browserStats = await db.all(`
      SELECT 
        CASE 
          WHEN user_agent LIKE '%Chrome%' THEN 'Chrome'
          WHEN user_agent LIKE '%Firefox%' THEN 'Firefox'
          WHEN user_agent LIKE '%Safari%' THEN 'Safari'
          WHEN user_agent LIKE '%Edge%' THEN 'Edge'
          WHEN user_agent LIKE '%Opera%' THEN 'Opera'
          ELSE 'Other'
        END as browser,
        COUNT(*) as count
      FROM page_views
      WHERE user_agent IS NOT NULL
      GROUP BY browser
      ORDER BY count DESC
      LIMIT 5
    `);

    // Get geographic stats
    const countryStats = await db.all(`
      SELECT 
        country,
        COUNT(*) as count
      FROM page_views
      WHERE country IS NOT NULL AND country != 'Unknown'
      GROUP BY country
      ORDER BY count DESC
      LIMIT 10
    `);

    const regionStats = await db.all(`
      SELECT 
        region,
        country,
        COUNT(*) as count
      FROM page_views
      WHERE region IS NOT NULL AND region != 'Unknown'
      GROUP BY region, country
      ORDER BY count DESC
      LIMIT 10
    `);

    const cityStats = await db.all(`
      SELECT 
        city,
        country,
        region,
        COUNT(*) as count
      FROM page_views
      WHERE city IS NOT NULL AND city != 'Unknown'
      GROUP BY city, country, region
      ORDER BY count DESC
      LIMIT 10
    `);

    // Get 30-day trends
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toISOString().split('T')[0];
    });

    const dailyTrends = await Promise.all(last30Days.map(async (date) => {
      const pageViews = await db.get(
        'SELECT COUNT(*) as count FROM page_views WHERE DATE(viewed_at) = ?',
        [date]
      );
      const sessions = await db.get(
        'SELECT COUNT(DISTINCT session_id) as count FROM page_views WHERE DATE(viewed_at) = ?',
        [date]
      );

      return {
        date,
        pageViews: pageViews.count,
        sessions: sessions.count,
        displayDate: new Date(date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        })
      };
    }));

    // Calculate averages
    const totalLinks = await db.get('SELECT COUNT(*) as count FROM links');
    const activeLinks = linkAnalytics.filter(link => link.clicks > 0).length;
    const totalLinkClicks = linkAnalytics.reduce((sum, link) => sum + link.clicks, 0);
    const avgClicksPerLink = totalLinks.count > 0 ? 
      Math.round((totalLinkClicks / totalLinks.count) * 10) / 10 : 0;
    const avgPagesPerSession = totalSessions.count > 0 ?
      Math.round((totalPageViews.count / totalSessions.count) * 10) / 10 : 0;

    res.json({
      linkAnalytics: linkAnalyticsWithDaily,
      totalLinkClicks,
      totalLinks: totalLinks.count,
      activeLinks,
      avgClicksPerLink,
      siteStats: {
        totalPageViews: totalPageViews.count,
        pageViewsToday: pageViewsToday.count,
        totalSessions: totalSessions.count,
        avgPagesPerSession,
        popularPages: popularPagesWithToday,
        topReferrers: topReferrers.map(ref => {
          try {
            return {
              domain: ref.referrer ? new URL(ref.referrer).hostname : 'Direct',
              referrals: ref.referrals,
              todayReferrals: 0 // Could be calculated if needed
            };
          } catch (e) {
            return {
              domain: 'Direct',
              referrals: ref.referrals,
              todayReferrals: 0
            };
          }
        }),
        deviceStats: deviceStatsWithType,
        browserStats,
        countryStats,
        regionStats,
        cityStats,
        dailyTrends
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

module.exports = router;

