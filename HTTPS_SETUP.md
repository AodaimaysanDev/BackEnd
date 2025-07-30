# HTTPS Setup Guide

This guide explains how to fix the Mixed Content error and enable HTTPS for your backend API.

## Problem
Your frontend is deployed on HTTPS (https://aodaimaysancodinh.netlify.app/) but trying to make requests to HTTP endpoints (http://206.189.148.163:8080). This causes Mixed Content errors in browsers.

## Solutions

### Option 1: Use nginx as reverse proxy (Recommended for production)

1. **Install nginx on your VPS:**
   ```bash
   sudo apt update
   sudo apt install nginx
   ```

2. **Get SSL certificate using Let's Encrypt:**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d 206.189.148.163
   ```

3. **Copy the nginx configuration:**
   ```bash
   sudo cp nginx.conf /etc/nginx/sites-available/aodaimaysan
   sudo ln -s /etc/nginx/sites-available/aodaimaysan /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

4. **Your API will be available at:**
   - HTTPS: https://206.189.148.163/api/products
   - HTTP requests will be automatically redirected to HTTPS

### Option 2: Use self-signed certificates (For testing)

1. **Generate SSL certificates:**
   ```bash
   # On Linux/Mac
   ./generate-ssl.sh
   
   # On Windows
   generate-ssl.bat
   ```

2. **Start HTTPS server:**
   ```bash
   # For MongoDB version
   node server_https.js
   
   # For MySQL version
   node mysql_server_https.js
   ```

3. **Your API will be available at:**
   - HTTP: http://206.189.148.163:8080
   - HTTPS: https://206.189.148.163:8443

### Option 3: Use a domain with SSL

1. **Point a domain to your VPS IP (206.189.148.163)**
2. **Use Let's Encrypt to get free SSL certificates**
3. **Update your frontend .env.production:**
   ```
   VITE_BACKEND_API_URL=https://yourdomain.com
   ```

## Frontend Configuration

The frontend has been updated with:

1. **Development environment (.env):**
   ```
   VITE_BACKEND_API_URL=http://localhost:8080
   ```

2. **Production environment (.env.production):**
   ```
   VITE_BACKEND_API_URL=https://206.189.148.163:8080
   ```

3. **Netlify configuration (netlify.toml):**
   ```toml
   [build.environment]
   VITE_BACKEND_API_URL = "https://206.189.148.163:8080"
   ```

## Important Notes

1. **For production, use Option 1 with nginx and Let's Encrypt**
2. **Self-signed certificates will show security warnings in browsers**
3. **Make sure your backend CORS settings allow your frontend domain**
4. **After implementing HTTPS, redeploy your frontend on Netlify**

## Testing

After setting up HTTPS:

1. **Test your API endpoint:**
   ```bash
   curl -k https://206.189.148.163:8443/api/products
   ```

2. **Check in browser console for any remaining Mixed Content errors**

3. **Verify that API calls work from your deployed frontend**

## Troubleshooting

- **Certificate errors:** Make sure certificates are properly generated and paths are correct
- **CORS errors:** Update CORS settings to include your frontend domain
- **Port issues:** Ensure firewalls allow traffic on HTTPS ports (443 or 8443)
