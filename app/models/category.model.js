const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Vui lòng nhập tên danh mục'],
      trim: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;
