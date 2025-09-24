#!/bin/bash

# VPS Deployment Script for EdTech Platform
# Run this script on your VPS after setting up Ubuntu

echo "🚀 Starting EdTech Platform Deployment..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
echo "📦 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
echo "📦 Installing PM2..."
sudo npm install -g pm2

# Install Nginx
echo "📦 Installing Nginx..."
sudo apt install nginx -y

# Install Git
echo "📦 Installing Git..."
sudo apt install git -y

# Create application directory
echo "📁 Creating application directory..."
sudo mkdir -p /var/www/edtech-platform
sudo chown -R $USER:$USER /var/www/edtech-platform

# Clone repository (replace with your actual repository URL)
echo "📥 Cloning repository..."
cd /var/www/edtech-platform
git clone https://github.com/YOUR_USERNAME/REPOSITORY_NAME.git .

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building application..."
npm run build

# Configure Nginx
echo "⚙️ Configuring Nginx..."
sudo tee /etc/nginx/sites-available/edtech-platform << EOF
server {
    listen 80;
    server_name YOUR_DOMAIN_OR_IP;
    root /var/www/edtech-platform/dist;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Handle static assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Enable the site
sudo ln -s /etc/nginx/sites-available/edtech-platform /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx

# Create PM2 ecosystem file
echo "⚙️ Creating PM2 configuration..."
tee ecosystem.config.js << EOF
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
echo "🌐 Your application should be accessible at: http://YOUR_DOMAIN_OR_IP"
echo "📊 Monitor with: pm2 monit"
echo "📝 View logs with: pm2 logs edtech-platform"
