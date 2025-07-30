require('dotenv').config();
const mongoose = require('mongoose');
const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/aodaimaysan';

mongoose.connect(connectionString)
  .then(async () => {
    console.log('Connected to MongoDB successfully');
    console.log('Connection string used:', connectionString);
    
    // Get categories
    const categories = await mongoose.connection.db.collection('categories').find({}).toArray();
    console.log('Categories in database:', categories);
    
    // If no categories exist, create some default ones
    if (categories.length === 0) {
      console.log('No categories found. Creating default categories...');
      
      const defaultCategories = [
        { name: 'Áo dài', createdAt: new Date(), updatedAt: new Date() },
        { name: 'Đầm', createdAt: new Date(), updatedAt: new Date() },
        { name: 'Váy', createdAt: new Date(), updatedAt: new Date() }
      ];
      
      const result = await mongoose.connection.db.collection('categories').insertMany(defaultCategories);
      console.log('Default categories created:', result);
      
      // Check if categories were created
      const newCategories = await mongoose.connection.db.collection('categories').find({}).toArray();
      console.log('Updated categories list:', newCategories);
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
