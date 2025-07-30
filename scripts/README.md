# Database Initialization Scripts

This folder contains scripts to initialize your MongoDB database with default data.

## Scripts Available

### 1. init-database.js (Full Setup)
Complete database initialization with all features:
- Creates default categories
- Creates admin user
- Creates sample products with proper relationships
- Comprehensive error handling and logging

**Usage:**
```bash
cd backend
npm run init-db
```

### 2. quick-init.js (Minimal Setup)
Quick initialization for basic setup:
- Creates basic categories only
- Creates admin user only
- Minimal logging

**Usage:**
```bash
cd backend
npm run quick-init
```

## Default Admin Account
After running either script, you can login with:
- **Email:** admin@aodaimaysan.com
- **Password:** admin123

## Environment Requirements
Make sure your `.env` file contains:
```
MONGO_URI=mongodb://localhost:27017/aodaimaysan
# Or your VPS MongoDB connection string
```

## VPS Deployment
1. Upload your project to VPS
2. Install dependencies: `npm install`
3. Set up your environment variables
4. Run initialization: `npm run init-db`
5. Start your server: `npm start`

## Notes
- Scripts will only create data if collections are empty
- Safe to run multiple times
- Check console output for any errors
- Make sure MongoDB is running before executing scripts
