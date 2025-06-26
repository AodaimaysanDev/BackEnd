// ------------------------------------------------------------------
// FILE: app/controllers/product.controller.js
// MỤC ĐÍCH: Chứa tất cả logic để xử lý dữ liệu sản phẩm.
// ------------------------------------------------------------------
const Product = require('../models/product.model.js');

// 1. CREATE: Tạo một sản phẩm mới
exports.createProduct = async (req, res) => {
  try {
    // Lấy dữ liệu từ body của request
    const { name, description, price, category, stock, imageUrl } = req.body;

    // Tạo một đối tượng sản phẩm mới dựa trên model
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      stock,
      imageUrl,
    });

    // Lưu sản phẩm mới vào database
    const savedProduct = await newProduct.save();

    // Trả về sản phẩm đã tạo với status code 201 (Created)
    res.status(201).json(savedProduct);
  } catch (error) {
    // Nếu có lỗi, trả về status 500 (Internal Server Error) và thông báo lỗi
    res.status(500).json({ message: 'Lỗi khi tạo sản phẩm', error: error.message });
  }
};

// 2. READ: Lấy tất cả sản phẩm
exports.getAllProducts = async (req, res) => {
  try {
    // Dùng model để tìm tất cả các document trong collection 'products'
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách sản phẩm', error: error.message });
  }
};

// 3. READ: Lấy một sản phẩm theo ID
exports.getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      // Nếu không tìm thấy sản phẩm, trả về lỗi 404 (Not Found)
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

    // Tìm và cập nhật sản phẩm. Tùy chọn { new: true } để kết quả trả về là sản phẩm sau khi đã cập nhật.
    const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, { new: true, runValidators: true });

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm để cập nhật' });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật sản phẩm', error: error.message });
  }
};

// 5. DELETE: Xóa một sản phẩm theo ID
exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm để xóa' });
    }

    res.status(200).json({ message: 'Sản phẩm đã được xóa thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa sản phẩm', error: error.message });
  }
};