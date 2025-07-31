require('dotenv').config();
const sequelize = require('../app/config/mysql.config');

const addSizeColorFields = async () => {
  try {
    console.log('🔗 Connecting to MySQL database...');
    await sequelize.authenticate();
    console.log('✅ Connected to MySQL successfully');

    console.log('🔄 Adding size and color fields to products table...');

    // Add size column
    await sequelize.query(`
      ALTER TABLE products 
      ADD COLUMN IF NOT EXISTS size JSON DEFAULT '[]'
    `);
    console.log('✅ Added size column');

    // Add color column
    await sequelize.query(`
      ALTER TABLE products 
      ADD COLUMN IF NOT EXISTS color JSON DEFAULT '[]'
    `);
    console.log('✅ Added color column');

    console.log('🎉 Migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
};

// Run the migration
if (require.main === module) {
  addSizeColorFields();
}

module.exports = addSizeColorFields;
