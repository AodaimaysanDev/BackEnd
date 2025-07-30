require('dotenv').config();
const mongoose = require('mongoose');

// Import models
const User = require('../app/models/user.model');
const Category = require('../app/models/category.model');
const Product = require('../app/models/product.model');
const bcrypt = require('bcryptjs');

const initializeDatabase = async () => {
  try {
    // Connect to MongoDB
    const connectionString = process.env.MONGO_URI || 'mongodb://localhost:27017/aodaimaysan';
    await mongoose.connect(connectionString);
    console.log('✅ Connected to MongoDB successfully');
    console.log('📍 Connection string used:', connectionString);

    // Check if database is empty
    const userCount = await User.countDocuments();
    const categoryCount = await Category.countDocuments();
    const productCount = await Product.countDocuments();

    console.log('\n📊 Current database status:');
    console.log(`- Users: ${userCount}`);
    console.log(`- Categories: ${categoryCount}`);
    console.log(`- Products: ${productCount}`);

    let isInitialized = false;

    // Initialize categories if empty
    if (categoryCount === 0) {
      console.log('\n🏗️ Creating default categories...');
      const defaultCategories = [
        { name: 'Áo dài truyền thống' },
        { name: 'Áo dài cách tân' },
        { name: 'Áo dài cưới' },
        { name: 'Áo dài học sinh' },
        { name: 'Áo dài công sở' },
        { name: 'Áo dài lễ hội' }
      ];

      const createdCategories = await Category.insertMany(defaultCategories);
      console.log(`✅ Created ${createdCategories.length} categories`);
      isInitialized = true;
    } else {
      console.log('✅ Categories already exist');
    }

    // Initialize admin user if no users exist
    if (userCount === 0) {
      console.log('\n👤 Creating default admin user...');
      const hashedPassword = await bcrypt.hash('admin123', 12);
      
      const adminUser = new User({
        username: 'admin',
        name: 'Administrator',
        email: 'admin@aodaimaysan.com',
        password: hashedPassword,
        role: 'admin'
      });

      await adminUser.save();
      console.log('✅ Created admin user:');
      console.log('   Email: admin@aodaimaysan.com');
      console.log('   Password: admin123');
      console.log('   Role: admin');
      isInitialized = true;

      // Create a regular user for testing
      const customerPassword = await bcrypt.hash('customer123', 12);
      const customerUser = new User({
        username: 'customer',
        name: 'Khách hàng mẫu',
        email: 'customer@example.com',
        password: customerPassword,
        role: 'user'
      });

      await customerUser.save();
      console.log('✅ Created test customer user:');
      console.log('   Email: customer@example.com');
      console.log('   Password: customer123');
      console.log('   Role: user');
    } else {
      console.log('✅ Users already exist');
    }

    // Initialize sample products if empty
    if (productCount === 0 && categoryCount > 0) {
      console.log('\n🛍️ Creating sample products...');
      
      // Get categories for reference
      const categories = await Category.find();
      const categoryMap = {};
      categories.forEach(cat => {
        categoryMap[cat.name] = cat;
      });

      const sampleProducts = [
        {
          name: 'Áo dài lụa tơ tằm cao cấp',
          description: 'Áo dài được may từ lụa tơ tằm cao cấp, thiết kế truyền thống với họa tiết hoa sen tinh tế. Phù hợp cho các dịp lễ tết, cưới hỏi.',
          price: 1500000,
          category: categoryMap['Áo dài truyền thống']?._id,
          stock: 20,
          size: ['S', 'M', 'L', 'XL'],
          color: ['Đỏ', 'Vàng', 'Xanh', 'Tím'],
          imageUrl: 'https://via.placeholder.com/600x800/FFB6C1/000000?text=Áo+Dài+Lụa+Tơ+Tằm',
          images: [
            'https://via.placeholder.com/600x800/FFB6C1/000000?text=Áo+Dài+Lụa+1',
            'https://via.placeholder.com/600x800/FFC0CB/000000?text=Áo+Dài+Lụa+2'
          ]
        },
        {
          name: 'Áo dài cách tân họa tiết hoa',
          description: 'Áo dài cách tân với thiết kế hiện đại, họa tiết hoa văn độc đáo. Chất liệu vải cotton cao cấp, thoáng mát.',
          price: 800000,
          category: categoryMap['Áo dài cách tân']?._id,
          stock: 15,
          size: ['S', 'M', 'L'],
          color: ['Hồng', 'Xanh lá', 'Trắng'],
          imageUrl: 'https://via.placeholder.com/600x800/98FB98/000000?text=Áo+Dài+Cách+Tân',
          images: [
            'https://via.placeholder.com/600x800/98FB98/000000?text=Cách+Tân+1',
            'https://via.placeholder.com/600x800/90EE90/000000?text=Cách+Tân+2'
          ]
        },
        {
          name: 'Áo dài cưới đỏ truyền thống',
          description: 'Áo dài cưới màu đỏ truyền thống với thêu long phụng kim tuyến. Thiết kế sang trọng cho ngày trọng đại.',
          price: 2500000,
          category: categoryMap['Áo dài cưới']?._id,
          stock: 10,
          size: ['S', 'M', 'L', 'XL'],
          color: ['Đỏ'],
          imageUrl: 'https://via.placeholder.com/600x800/DC143C/FFFFFF?text=Áo+Dài+Cưới',
          images: [
            'https://via.placeholder.com/600x800/DC143C/FFFFFF?text=Cưới+1',
            'https://via.placeholder.com/600x800/B22222/FFFFFF?text=Cưới+2'
          ]
        },
        {
          name: 'Áo dài học sinh trắng',
          description: 'Áo dài học sinh màu trắng tinh khôi, chất liệu vải cotton thoáng mát, phù hợp cho học sinh, sinh viên.',
          price: 450000,
          category: categoryMap['Áo dài học sinh']?._id,
          stock: 50,
          size: ['XS', 'S', 'M', 'L'],
          color: ['Trắng'],
          imageUrl: 'https://via.placeholder.com/600x800/FFFFFF/000000?text=Áo+Dài+Học+Sinh',
          images: [
            'https://via.placeholder.com/600x800/FFFFFF/000000?text=Học+Sinh+1'
          ]
        },
        {
          name: 'Áo dài công sở thanh lịch',
          description: 'Áo dài công sở với thiết kế thanh lịch, phù hợp môi trường làm việc. Chất liệu cao cấp, dễ chăm sóc.',
          price: 650000,
          category: categoryMap['Áo dài công sở']?._id,
          stock: 25,
          size: ['S', 'M', 'L', 'XL'],
          color: ['Xanh navy', 'Đen', 'Xám'],
          imageUrl: 'https://via.placeholder.com/600x800/191970/FFFFFF?text=Áo+Dài+Công+Sở',
          images: [
            'https://via.placeholder.com/600x800/191970/FFFFFF?text=Công+Sở+1',
            'https://via.placeholder.com/600x800/000080/FFFFFF?text=Công+Sở+2'
          ]
        }
      ];

      // Filter out products with invalid categories
      const validProducts = sampleProducts.filter(product => product.category);
      
      if (validProducts.length > 0) {
        const createdProducts = await Product.insertMany(validProducts);
        console.log(`✅ Created ${createdProducts.length} sample products`);
        isInitialized = true;
      } else {
        console.log('⚠️ No valid categories found for creating products');
      }
    } else if (categoryCount === 0) {
      console.log('⚠️ Cannot create products without categories');
    } else {
      console.log('✅ Products already exist');
    }

    // Summary
    console.log('\n📋 Database initialization summary:');
    if (isInitialized) {
      console.log('✅ Database has been initialized with default data');
      console.log('\n🔐 Default login credentials:');
      console.log('👨‍💼 Admin:');
      console.log('   Email: admin@aodaimaysan.com');
      console.log('   Password: admin123');
      console.log('\n👤 Customer (for testing):');
      console.log('   Email: customer@example.com');
      console.log('   Password: customer123');
    } else {
      console.log('✅ Database already contains data');
    }

    // Final counts
    const finalUserCount = await User.countDocuments();
    const finalCategoryCount = await Category.countDocuments();
    const finalProductCount = await Product.countDocuments();

    console.log('\n📊 Final database status:');
    console.log(`- Users: ${finalUserCount}`);
    console.log(`- Categories: ${finalCategoryCount}`);
    console.log(`- Products: ${finalProductCount}`);

  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
};

// Run the initialization
console.log('🚀 Starting database initialization...');
initializeDatabase();
