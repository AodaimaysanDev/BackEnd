const Category = require('../models/category.model.js');

// 1. CREATE: Tạo một danh mục mới
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const newCategory = new Category({ name });
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi tạo danh mục', error: error.message });
  }
};

// 2. READ: Lấy tất cả danh mục
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách danh mục', error: error.message });
  }
};

// 3. READ: Lấy một danh mục theo ID
exports.getCategoryById = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Không tìm thấy danh mục' });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy thông tin danh mục', error: error.message });
  }
};

// 4. UPDATE: Cập nhật một danh mục theo ID
exports.updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const updateData = req.body;
    const updatedCategory = await Category.findByIdAndUpdate(categoryId, updateData, { new: true, runValidators: true });
    if (!updatedCategory) {
      return res.status(404).json({ message: 'Không tìm thấy danh mục để cập nhật' });
    }
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật danh mục', error: error.message });
  }
};

// 5. DELETE: Xóa một danh mục theo ID
exports.deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const deletedCategory = await Category.findByIdAndDelete(categoryId);
    if (!deletedCategory) {
      return res.status(404).json({ message: 'Không tìm thấy danh mục để xóa' });
    }
    res.status(200).json({ message: 'Danh mục đã được xóa thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa danh mục', error: error.message });
  }
};
