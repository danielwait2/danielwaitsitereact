# Daniel Wait Website

A modern personal website built with React, Node.js, and SQLite.

## Features

- **React Frontend**: Modern, responsive UI with React Router
- **Node.js Backend**: Express.js REST API (no longer using Cloudflare Workers)
- **SQLite Database**: Lightweight, file-based database
- **Admin Panel**: Full CRUD operations for managing links
- **Analytics**: Comprehensive site and link analytics
- **Wait List**: Curated collection of interesting links

## Migration Notes

This application has been migrated from Cloudflare Workers to a traditional Node.js/Express setup:

- **API Endpoints**: All API calls now use relative paths (`/api/*`) that proxy to the Express backend
- **Database**: Migrated from Cloudflare KV to SQLite
- **Geographic Data**: Geographic analytics (country, region, city) are optional and can be enhanced with a geolocation service if needed
- **Authentication**: Uses JWT tokens stored in HTTP-only cookies instead of Cloudflare Workers sessions

## Project Structure

```
danielwaitsite/
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── components/    # Reusable components
│       ├── pages/         # Page components
│       └── utils/         # Utility functions
├── server/                 # Node.js backend
│   ├── routes/            # API routes
│   ├── middleware/         # Express middleware
│   └── database.js        # SQLite database setup
└── package.json           # Root package.json
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install root dependencies:
```bash
npm install
```

2. Install client dependencies:
```bash
cd client
npm install
cd ..
```

Or use the convenience script:
```bash
npm run install-all
```

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secret-key-change-in-production
DB_PATH=./database.db
ADMIN_USERNAME=admin
ADMIN_PASSWORD=daniel2025
```

### Running the Application

#### Development Mode

Run both server and client concurrently:
```bash
npm run dev
```

Or run separately:
```bash
# Terminal 1 - Server
npm run server

# Terminal 2 - Client
npm run client
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5001

#### Production Mode

1. Build the React app:
```bash
npm run build
```

2. Start the server:
```bash
NODE_ENV=production npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/check` - Check authentication status
- `POST /api/auth/logout` - Logout

### Links
- `GET /api/links` - Get all links (public)
- `POST /api/links` - Add new link (admin only)
- `PUT /api/links/:id` - Update link (admin only)
- `DELETE /api/links/:id` - Delete link (admin only)
- `POST /api/links/:id/click` - Track link click

### Analytics
- `POST /api/analytics/pageview` - Track page view
- `GET /api/analytics` - Get analytics data (admin only)

## Database Schema

The SQLite database includes the following tables:
- `links` - Wait list links
- `click_analytics` - Link click tracking
- `page_views` - Page view analytics
- `sessions` - User session data
- `admins` - Admin user accounts

## Default Admin Credentials

- Username: `admin` (or as set in `.env`)
- Password: `daniel2025` (or as set in `.env`)

**Important**: Change these in production!

## Deployment

The application can be deployed to any Node.js hosting platform. Make sure to:

1. Set `NODE_ENV=production`
2. Update `JWT_SECRET` to a secure random string
3. Change default admin credentials
4. Configure database path appropriately
5. Build the React app before deployment

## License

MIT

## Author

Daniel Wait - Technology Innovator & Information Systems Expert

