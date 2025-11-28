# Port Configuration

This site uses the following ports to avoid conflicts with other services:

## Development Ports
- **Frontend (React)**: Port `4000` (default React port is 3000)
- **Backend (Node.js)**: Port `6000` (default was 5001/5002)

## Production Ports
- **Backend (Node.js)**: Port `6000` (configured in `.env`)
- **Frontend**: Served by Nginx (port 80/443) from `client/build/` directory

## Configuration Files

### Frontend Development Port
Set in `client/.env`:
```
PORT=4000
```

### Backend Port
Set in root `.env`:
```
PORT=6000
```

### Nginx Proxy
Configured in `/etc/nginx/sites-available/danielwait.com`:
```nginx
proxy_pass http://localhost:6000;
```

## Changing Ports

If you need to change ports:

1. **Backend**: Update `PORT` in `.env` file
2. **Frontend Dev**: Update `PORT` in `client/.env` file
3. **Nginx**: Update `proxy_pass` in Nginx config
4. **Restart**: `pm2 restart danielwait-site` and `sudo systemctl reload nginx`
