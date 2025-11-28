#!/bin/bash
# Quick setup script for danielwait.com on your server
# Run this on your server: bash SERVER_SETUP.sh

set -e

echo "🚀 Setting up danielwait.com site..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Create directory
echo -e "${YELLOW}Creating directory...${NC}"
sudo mkdir -p /var/www/danielwait-site
sudo chown -R $USER:$USER /var/www/danielwait-site
cd /var/www/danielwait-site

# Clone repository
echo -e "${YELLOW}Cloning repository...${NC}"
if [ -d ".git" ]; then
    echo "Repository already exists, pulling latest..."
    git pull origin main
else
    git clone https://github.com/danielwait2/danielwaitsitereact.git .
fi

# Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
npm run install-all

# Build React app
echo -e "${YELLOW}Building React app...${NC}"
npm run build

# Set up environment file
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Creating .env file...${NC}"
    cp .env.example .env
    echo -e "${GREEN}⚠️  Please edit .env file with your settings!${NC}"
    echo "   Run: nano .env"
else
    echo ".env file already exists, skipping..."
fi

# Install PM2 if not installed
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}Installing PM2...${NC}"
    sudo npm install -g pm2
fi

# Start with PM2
echo -e "${YELLOW}Starting server with PM2...${NC}"
pm2 start server/index.js --name danielwait-site || pm2 restart danielwait-site
pm2 save

echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Edit .env file: nano /var/www/danielwait-site/.env"
echo "2. Set up Nginx config (see NGINX_SETUP.md)"
echo "3. Get SSL certificate: sudo certbot --nginx -d danielwait.com -d www.danielwait.com"
echo ""
echo "Check PM2 status: pm2 status"
echo "View logs: pm2 logs danielwait-site"

