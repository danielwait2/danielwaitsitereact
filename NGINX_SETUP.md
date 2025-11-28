# Nginx Configuration for Multiple Sites

This guide helps you set up both `waitfamily.com` and `danielwait.com` on the same server.

## Server Structure

```
/var/www/
├── html/                    # Default site (if needed)
├── wait-family-site/        # waitfamily.com site
└── danielwait-site/         # danielwait.com site (to be created)
```

## Step 1: Create Directory for danielwait.com

```bash
cd /var/www
sudo mkdir -p danielwait-site
sudo chown -R danielwait1216:danielwait1216 danielwait-site
cd danielwait-site
```

## Step 2: Clone Repository

```bash
git clone https://github.com/danielwait2/danielwaitsitereact.git .
```

## Step 3: Install Dependencies and Build

```bash
npm run install-all
npm run build
```

## Step 4: Create Nginx Configuration

Create `/etc/nginx/sites-available/danielwait.com`:

```nginx
# danielwait.com - React + Node.js API
server {
    listen 80;
    server_name danielwait.com www.danielwait.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name danielwait.com www.danielwait.com;

    # SSL certificates (will be added by Certbot)
    ssl_certificate /etc/letsencrypt/live/danielwait.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/danielwait.com/privkey.pem;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Root directory
    root /var/www/danielwait-site/client/build;
    index index.html;

    # Logging
    access_log /var/log/nginx/danielwait.com.access.log;
    error_log /var/log/nginx/danielwait.com.error.log;

    # API routes - proxy to Node.js server
    location /api/ {
        proxy_pass http://localhost:5002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # Serve React app static files
    location / {
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
}
```

Create `/etc/nginx/sites-available/waitfamily.com` (if not exists):

```nginx
# waitfamily.com - Existing site
server {
    listen 80;
    server_name waitfamily.com www.waitfamily.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name waitfamily.com www.waitfamily.com;

    # SSL certificates
    ssl_certificate /etc/letsencrypt/live/waitfamily.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/waitfamily.com/privkey.pem;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Root directory
    root /var/www/wait-family-site;
    index index.html index.php;

    # Logging
    access_log /var/log/nginx/waitfamily.com.access.log;
    error_log /var/log/nginx/waitfamily.com.error.log;

    # PHP support (if needed)
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    # Serve static files
    location / {
        try_files $uri $uri/ =404;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

## Step 5: Enable Sites

```bash
# Enable danielwait.com
sudo ln -s /etc/nginx/sites-available/danielwait.com /etc/nginx/sites-enabled/

# Enable waitfamily.com (if not already enabled)
sudo ln -s /etc/nginx/sites-available/waitfamily.com /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

## Step 6: Set Up SSL Certificates

```bash
# For danielwait.com
sudo certbot --nginx -d danielwait.com -d www.danielwait.com

# For waitfamily.com (if not already done)
sudo certbot --nginx -d waitfamily.com -d www.waitfamily.com
```

## Step 7: Set Up Environment Variables

```bash
cd /var/www/danielwait-site
cp .env.example .env
nano .env
```

Update `.env`:
```env
PORT=5001
NODE_ENV=production
DB_PATH=/var/www/danielwait-site/database.db
JWT_SECRET=your-random-secret-key-here
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password
ALLOWED_ORIGINS=https://danielwait.com,https://www.danielwait.com
```

## Step 8: Set Up PM2 Process Manager

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start the Node.js server
cd /var/www/danielwait-site
pm2 start server/index.js --name danielwait-site

# Save PM2 configuration
pm2 save

# Set up PM2 to start on boot
pm2 startup
# Follow the instructions it provides
```

## Step 9: Verify Everything Works

1. **Check Nginx status**: `sudo systemctl status nginx`
2. **Check PM2 status**: `pm2 status`
3. **Check PM2 logs**: `pm2 logs danielwait-site`
4. **Test sites**:
   - Visit `https://waitfamily.com` - should show wait-family-site
   - Visit `https://danielwait.com` - should show React app

## Maintenance Commands

### Update danielwait.com site:
```bash
cd /var/www/danielwait-site
git pull origin main
npm run install-all
npm run build
pm2 restart danielwait-site
```

### View logs:
```bash
# Nginx logs
sudo tail -f /var/log/nginx/danielwait.com.error.log

# PM2 logs
pm2 logs danielwait-site
```

### Restart services:
```bash
# Restart Nginx
sudo systemctl restart nginx

# Restart Node.js app
pm2 restart danielwait-site
```

## Troubleshooting

### Port 5001 already in use:
```bash
# Find what's using the port
sudo lsof -i :5001
# Kill the process or change PORT in .env
```

### Nginx 502 Bad Gateway:
- Check if Node.js server is running: `pm2 status`
- Check server logs: `pm2 logs danielwait-site`
- Verify PORT in .env matches proxy_pass in Nginx config

### SSL certificate issues:
```bash
# Renew certificates
sudo certbot renew

# Test renewal
sudo certbot renew --dry-run
```

