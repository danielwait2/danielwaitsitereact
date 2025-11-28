# Quick Setup Guide

## Initial Setup

1. **Install Dependencies**

   ```bash
   npm run install-all
   ```

2. **Create Environment File**

   ```bash
   cp .env.example .env
   ```

   Then edit `.env` and update the values as needed.

3. **Copy Assets** (if not already done)
   ```bash
   cp -r public/assets client/public/assets
   cp public/assets/favicon.ico client/public/favicon.ico
   ```

## Running the Application

### Development Mode

```bash
npm run dev
```

This starts both the server (port 5000) and React app (port 3000).

### Production Build

```bash
npm run build
npm start
```

## First Time Setup

1. The database will be automatically created on first run
2. Default admin user will be created:
   - Username: `admin` (or as set in `.env`)
   - Password: `daniel2025` (or as set in `.env`)

**Important**: Change these credentials in production!

## Access Points

- Frontend: http://localhost:3000
- Backend API: http://localhost:5001
- Admin Panel: http://localhost:3000/admin-login

## Troubleshooting

### Port Already in Use

If port 5001 or 3000 is already in use, you can:

- Change `PORT` in `.env` for the backend (default is 5001 to avoid macOS AirPlay conflict)
- Set `PORT=3001` in `client/.env` for the frontend

### Database Issues

Delete `database.db` and restart the server to recreate the database.

### Assets Not Loading

Make sure assets are copied to `client/public/assets/`:

```bash
cp -r public/assets client/public/assets
```
