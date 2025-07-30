require('dotenv').config();
const mongoose = require('mongoose');

const checkAndInitDatabase = async () => {
  try {
    const connectionString = process.env.MONGO_URI || 'mongodb://localhost:27017/aodaimaysan';
    await mongoose.connect(connectionString);
    console.log('Connected to MongoDB:', connectionString);

    // Check collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Existing collections:', collections.map(c => c.name));

    // Check if main collections exist and have data
    const stats = {};
    const collectionNames = ['users', 'categories', 'products', 'orders'];
    
    for (const collectionName of collectionNames) {
      try {
        const count = await mongoose.connection.db.collection(collectionName).countDocuments();
        stats[collectionName] = count;
      } catch (error) {
        stats[collectionName] = 0;
      }
    }

    console.log('Collection stats:', stats);

    // Create basic categories if none exist
    if (stats.categories === 0) {
      console.log('Creating basic categories...');
      await mongoose.connection.db.collection('categories').insertMany([
        { name: 'Áo dài', createdAt: new Date(), updatedAt: new Date() },
        { name: 'Đầm', createdAt: new Date(), updatedAt: new Date() },
        { name: 'Váy', createdAt: new Date(), updatedAt: new Date() }
      ]);
      console.log('Categories created successfully');
    }

    // Create admin user if no users exist
    if (stats.users === 0) {
      console.log('Creating admin user...');
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 12);
      
      await mongoose.connection.db.collection('users').insertOne({
        username: 'admin',
        name: 'Administrator',
        email: 'admin@aodaimaysan.com',
        password: hashedPassword,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      console.log('Admin user created:');
      console.log('Email: admin@aodaimaysan.com');
      console.log('Password: admin123');
    }

    console.log('Database initialization completed!');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

checkAndInitDatabase();
