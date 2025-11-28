# Deployment Guide for Traditional Server

This guide explains how to deploy the site to your own server (not Cloudflare Workers or GitHub Actions).

## Prerequisites

- Node.js 18+ installed on your server
- npm or yarn package manager
- A domain name (optional, can use IP address)
- Server with ports 80/443 available (or configure reverse proxy)

## Step 1: Clone Repository

```bash
git clone https://github.com/danielwait2/danielwaitsitereact.git
cd danielwaitsitereact
```

## Step 2: Install Dependencies

```bash
npm run install-all
```

This installs dependencies for both the root server and the React client.

## Step 3: Build React App

```bash
npm run build
```

This creates the production build in `client/build/` directory.

## Step 4: Configure Environment Variables

Copy the example environment file and edit it:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
PORT=6000
NODE_ENV=production
DB_PATH=./database.db
JWT_SECRET=your-random-secret-key-here
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password
ALLOWED_ORIGINS=https://danielwait.com,https://www.danielwait.com
```

**Important:** Change `JWT_SECRET` to a random string and `ADMIN_PASSWORD` to a secure password!

## Step 5: Start the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
NODE_ENV=production npm start
```

The server will:
- Start on port 5001 (or PORT from .env)
- Serve the React app from `client/build/`
- Handle API routes at `/api/*`
- Create SQLite database automatically

## Step 6: Set Up Process Manager (Production)

For production, use a process manager like PM2:

```bash
npm install -g pm2
pm2 start server/index.js --name danielwait-site
pm2 save
pm2 startup
```

## Step 7: Set Up Reverse Proxy (Nginx)

If you want to use port 80/443, set up Nginx as a reverse proxy:

```nginx
server {
    listen 80;
    server_name danielwait.com www.danielwait.com;

    location / {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Step 8: Set Up SSL Certificate (Optional but Recommended)

Use Let's Encrypt with Certbot:

```bash
sudo certbot --nginx -d danielwait.com -d www.danielwait.com
```

## File Structure

```
danielwaitsitereact/
├── client/              # React frontend
│   ├── build/          # Production build (generated)
│   ├── src/            # React source code
│   └── package.json
├── server/              # Express backend
│   ├── index.js        # Main server file
│   ├── database.js     # SQLite database
│   ├── routes/         # API routes
│   └── middleware/    # Express middleware
├── database.db         # SQLite database (created automatically)
├── .env               # Environment variables (create from .env.example)
├── package.json       # Root package.json
└── DEPLOYMENT.md      # This file
```

## API Endpoints

All API endpoints are served from `/api/*`:

- `GET /api/links` - Get all wait list links
- `POST /api/links` - Add new link (admin only)
- `PUT /api/links/:id` - Update link (admin only)
- `DELETE /api/links/:id` - Delete link (admin only)
- `POST /api/auth/login` - Admin login
- `GET /api/auth/check` - Check authentication status
- `POST /api/auth/logout` - Logout
- `POST /api/analytics/pageview` - Track page view
- `GET /api/analytics` - Get analytics data (admin only)

## Troubleshooting

### Port Already in Use
Change the PORT in `.env` file or kill the process using that port.

### Database Issues
The database is created automatically. If you need to reset it, delete `database.db` and restart the server.

### React App Not Loading
Make sure you've run `npm run build` to create the production build in `client/build/`.

### CORS Errors
Update `ALLOWED_ORIGINS` in `.env` to include your domain.

## Maintenance

### Update the Site
```bash
git pull
npm run install-all
npm run build
pm2 restart danielwait-site
```

### View Logs
```bash
pm2 logs danielwait-site
```

### Backup Database
```bash
cp database.db database.db.backup
```

## Security Notes

1. **Change default passwords** in `.env`
2. **Use strong JWT_SECRET** (random string)
3. **Keep dependencies updated**: `npm audit` and `npm update`
4. **Use HTTPS** in production (Let's Encrypt)
5. **Restrict CORS** origins in production
6. **Use firewall** to restrict server access
7. **Regular backups** of `database.db`

