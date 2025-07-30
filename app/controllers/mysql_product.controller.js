const Product = require('../models/mysql_product.model');

// 1. CREATE: Tạo một sản phẩm mới
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, imageUrl, images } = req.body;
    const newProduct = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      imageUrl,
      images: images || [], // Mảng các hình ảnh
    });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi tạo sản phẩm', error: error.message });
  }
};

// 2. READ: Lấy tất cả sản phẩm
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách sản phẩm', error: error.message });
  }
};

// 3. READ: Lấy một sản phẩm theo ID
exports.getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy thông tin sản phẩm', error: error.message });
  }
};

// 4. UPDATE: Cập nhật một sản phẩm theo ID
exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const updateData = req.body;
    const [updatedRows] = await Product.update(updateData, { where: { id: productId } });
    if (!updatedRows) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm để cập nhật' });
    }
    const updatedProduct = await Product.findByPk(productId);
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật sản phẩm', error: error.message });
  }
};

// 5. DELETE: Xóa một sản phẩm theo ID
exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const deletedRows = await Product.destroy({ where: { id: productId } });
    if (!deletedRows) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm để xóa' });
    }
    res.status(200).json({ message: 'Sản phẩm đã được xóa thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa sản phẩm', error: error.message });
  }
}; 