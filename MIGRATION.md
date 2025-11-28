# Migration from Cloudflare Workers to Node.js/Express

## Overview

This project has been completely migrated from Cloudflare Workers (with KV storage) to a traditional Node.js/Express backend with SQLite database.

## Key Changes

### API Endpoints

**Before (Cloudflare Workers):**
- All API calls went to: `https://danielwaitwebsite.danielwait1216.workers.dev/api/*`

**After (Node.js/Express):**
- All API calls now use relative paths: `/api/*`
- In development: Proxy configured in `client/package.json` forwards to `http://localhost:5000`
- In production: Express serves both API and React app from the same domain

### Database

**Before:**
- Cloudflare KV (key-value store)
- Data stored as JSON strings in KV

**After:**
- SQLite database (`database.db`)
- Proper relational database with tables:
  - `links` - Wait list links
  - `click_analytics` - Link click tracking
  - `page_views` - Page view analytics
  - `sessions` - User session data
  - `admins` - Admin user accounts

### Authentication

**Before:**
- Cloudflare Workers cookies (`admin_authenticated=true`)

**After:**
- JWT tokens stored in HTTP-only cookies
- More secure authentication system
- Token expiration (24 hours)

### Geographic Analytics

**Before:**
- Used Cloudflare headers (`CF-IPCountry`, `CF-Region`, `CF-IPCity`, etc.)
- Automatic geographic data from Cloudflare's edge network

**After:**
- Geographic fields are optional (can be null)
- To add geographic data, you can:
  1. Use a geolocation API service (e.g., ipapi.co, ip-api.com)
  2. Use MaxMind GeoIP database
  3. Leave as null (analytics will still work without geographic breakdowns)

### File Structure Changes

**Removed/No Longer Used:**
- `wrangler.toml` - Cloudflare Workers configuration
- `index.js` (old Cloudflare Worker) - Replaced with Express server
- Cloudflare KV namespaces

**New Files:**
- `server/` - Express backend
  - `index.js` - Main server file
  - `database.js` - SQLite database setup
  - `routes/` - API route handlers
  - `middleware/` - Express middleware
- `client/` - React frontend
  - `src/utils/api.js` - Centralized axios configuration
  - All React components and pages

## API Endpoints (Unchanged Interface)

The API endpoints remain the same, just the base URL changed:

- `GET /api/links` - Get all links
- `POST /api/links` - Add new link (admin)
- `PUT /api/links/:id` - Update link (admin)
- `DELETE /api/links/:id` - Delete link (admin)
- `POST /api/links/:id/click` - Track link click
- `POST /api/auth/login` - Admin login
- `GET /api/auth/check` - Check auth status
- `POST /api/auth/logout` - Logout
- `POST /api/analytics/pageview` - Track page view
- `GET /api/analytics` - Get analytics data (admin)

## Deployment Changes

**Before:**
- Deployed to Cloudflare Workers
- Static files served from Cloudflare Pages/Workers

**After:**
- Can be deployed to any Node.js hosting:
  - Heroku
  - Railway
  - DigitalOcean App Platform
  - AWS Elastic Beanstalk
  - VPS (PM2, Docker, etc.)
- Build React app: `npm run build`
- Start server: `npm start` (production mode)

## Environment Variables

New `.env` file required:
```env
PORT=5000
NODE_ENV=production
JWT_SECRET=your-secret-key-change-in-production
DB_PATH=./database.db
ADMIN_USERNAME=admin
ADMIN_PASSWORD=daniel2025
```

## Benefits of Migration

1. **Full Control**: Complete control over server and database
2. **Better Performance**: Direct database access (no KV latency)
3. **More Features**: Can add any Node.js package/feature
4. **Easier Development**: Standard Node.js development workflow
5. **Cost**: Potentially lower costs (depending on hosting)
6. **Scalability**: Can scale database independently

## Migration Checklist

- [x] Create Express backend
- [x] Set up SQLite database schema
- [x] Migrate API routes
- [x] Update frontend API calls
- [x] Implement authentication
- [x] Migrate analytics tracking
- [x] Update all components
- [x] Remove Cloudflare-specific code
- [x] Update documentation

## Next Steps

1. Test all functionality locally
2. Set up production environment
3. Migrate any existing data from Cloudflare KV (if needed)
4. Update DNS/deployment configuration
5. Remove old Cloudflare Workers deployment


