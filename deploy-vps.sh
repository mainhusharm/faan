#!/bin/bash

# VPS Deployment Script for EdTech Platform
# Run this script on your VPS after SSH connection

echo "🚀 Starting EdTech Platform Deployment on VPS..."

# Update system
echo "📦 Updating system packages..."
apt update && apt upgrade -y

# Install Node.js 18.x
echo "📦 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Install PM2 for process management
echo "📦 Installing PM2..."
npm install -g pm2

# Install Nginx
echo "📦 Installing Nginx..."
apt install nginx -y

# Install Git
echo "📦 Installing Git..."
apt install git -y

# Create application directory
echo "📁 Creating application directory..."
mkdir -p /var/www/edtech-platform
chown -R $USER:$USER /var/www/edtech-platform

# Clone repository
echo "📥 Cloning repository..."
cd /var/www/edtech-platform
git clone https://github.com/jittush326/faan.git .

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building application..."
npm run build

# Configure Nginx
echo "⚙️ Configuring Nginx..."
cat > /etc/nginx/sites-available/edtech-platform << 'EOF'
server {
    listen 80;
    server_name 69.176.84.253 yourdomain.com;
    root /var/www/edtech-platform/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Handle static assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
EOF

# Enable the site
ln -s /etc/nginx/sites-available/edtech-platform /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
nginx -t

# Restart Nginx
systemctl restart nginx
systemctl enable nginx

# Configure firewall
echo "🔥 Configuring firewall..."
ufw allow 'Nginx Full'
ufw allow ssh
ufw --force enable

# Create PM2 ecosystem file
echo "⚙️ Creating PM2 configuration..."
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'edtech-platform',
    script: 'npm',
    args: 'run preview',
    cwd: '/var/www/edtech-platform',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
EOF

# Start the application with PM2
echo "🚀 Starting application..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup

echo "✅ Deployment completed!"
echo "🌐 Your application should be accessible at: http://69.176.84.253"
echo "📊 Monitor with: pm2 monit"
echo "📝 View logs with: pm2 logs edtech-platform"
echo ""
echo "🔧 Next steps:"
echo "1. Point your domain to 69.176.84.253"
echo "2. Run: sudo certbot --nginx -d yourdomain.com (for SSL)"
echo "3. Check logs: pm2 logs edtech-platform"
