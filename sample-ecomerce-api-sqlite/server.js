/**
 * ==============================================================================
 * DỰ ÁN CAPSTONE: E-COMMERCE API SERVER (Express + SQLite)
 * ==============================================================================
 * Thư viện sử dụng:
 * - express: Xây dựng RESTful API Server
 * - cors: Cho phép các ứng dụng Frontend gọi API mà không bị chặn CORS
 * - better-sqlite3: Tương tác với cơ sở dữ liệu SQLite siêu nhanh và đồng bộ
 * - jsonwebtoken (JWT): Quản lý phiên đăng nhập và phân quyền (RBAC)
 * - bcryptjs: Mã hóa mật khẩu an toàn
 * - validator : Kiểm tra mật khẩu 
 * ==============================================================================
 */

const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');
const validator = require('validator');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'vmo-super-secret-key-capstone-2026';
const DB_PATH = path.join(__dirname, 'ecommerce.db');


// ==========================================
// 1. CẤU HÌNH MIDDLEWARE
// ==========================================
app.use(cors()); // Cho phép mọi origin (hỗ trợ Live Server / localhost / file://)
app.use(express.json()); // Phân tích JSON body của request

// Middleware log request đơn giản để TTS dễ quan sát trên terminal
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// ==========================================
// 2. KHỞI TẠO CƠ SỞ DỮ LIỆU SQLITE
// ==========================================
const db = new Database(DB_PATH);

// Bật chế độ ghi nhật ký WAL (Write-Ahead Logging) để tăng hiệu năng SQLite
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

function initializeDatabase(forceReset = false) {
  if (forceReset) {
    console.log('🔄 Đang tiến hành reset lại toàn bộ cơ sở dữ liệu...');
    db.exec(`
      DROP TABLE IF EXISTS order_items;
      DROP TABLE IF EXISTS orders;
      DROP TABLE IF EXISTS products;
      DROP TABLE IF EXISTS users;
    `);
  }

  // Tạo bảng Users
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('buyer', 'seller', 'guest')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Tạo bảng Products
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL CHECK(price >= 0),
      category TEXT NOT NULL,
      image TEXT,
      description TEXT,
      stock INTEGER NOT NULL DEFAULT 10 CHECK(stock >= 0),
      created_by INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
    );
  `);

  // Tạo bảng Orders
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      buyer_id INTEGER NOT NULL,
      total_price REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'shipping', 'completed', 'cancelled')),
      shipping_address TEXT,
      phone TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // Tạo bảng Order Items (Chi tiết đơn hàng)
  db.exec(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER,
      product_img TEXT,
      product_name TEXT NOT NULL,
      product_price REAL NOT NULL,
      quantity INTEGER NOT NULL CHECK(quantity > 0),
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
    );
  `);

  // Kiểm tra nếu chưa có tài khoản thì nạp Seed Data mẫu
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (userCount === 0) {
    seedInitialData();
  }
}

// Nạp dữ liệu mẫu ban đầu
function seedInitialData() {
  console.log('🌱 Đang nạp dữ liệu mẫu (Seed data)...');

  const defaultPasswordHash = bcrypt.hashSync('123456', 10);

  // 1. Tạo tài khoản mẫu
  const insertUser = db.prepare(`
    INSERT INTO users (name, email, password, role) 
    VALUES (@name, @email, @password, @role)
  `);

  const sellerResult = insertUser.run({
    name: 'Cửa hàng VMO Tech (Seller)',
    email: 'seller@vmo.vn',
    password: defaultPasswordHash,
    role: 'seller'
  });

  const buyerResult = insertUser.run({
    name: 'Nguyễn Văn A (Buyer)',
    email: 'buyer@vmo.vn',
    password: defaultPasswordHash,
    role: 'buyer'
  });

  const sellerId = sellerResult.lastInsertRowid;
  const buyerId = buyerResult.lastInsertRowid;

  // 2. Tạo sản phẩm mẫu đa dạng ngành hàng
  const sampleProducts = [
    {
      name: 'Bàn phím cơ Không dây Keychron K2 V2',
      price: 1850000,
      category: 'Bàn phím',
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
      description: 'Bàn phím cơ Bluetooth layout 84 phím, Gateron switch gõ êm mượt, pin trâu 4000mAh, tương thích Mac/Windows.',
      stock: 25,
      created_by: sellerId
    },
    {
      name: 'Chuột Logitech MX Master 3S Ergonomic',
      price: 2490000,
      category: 'Chuột máy tính',
      image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80',
      description: 'Cảm biến 8K DPI mọi bề mặt, con lăn MagSpeed siêu tốc, bấm êm Quiet Clicks chống ồn tối đa.',
      stock: 18,
      created_by: sellerId
    },
    {
      name: 'Tai nghe Sony WH-1000XM5 Chống ồn',
      price: 6990000,
      category: 'Âm thanh',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
      description: 'Tai nghe chụp tai chống ồn hàng đầu thế giới, âm thanh Hi-Res Audio, thời lượng pin lên đến 30 giờ.',
      stock: 12,
      created_by: sellerId
    },
    {
      name: 'Màn hình Dell UltraSharp U2723QE 4K IPS Black',
      price: 13500000,
      category: 'Màn hình',
      image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80',
      description: 'Kích thước 27 inch độ phân giải 4K, công nghệ tấm nền IPS Black tỷ lệ tương phản 2000:1, màu sắc chính xác tuyệt đối.',
      stock: 8,
      created_by: sellerId
    },
    {
      name: 'Đèn bàn thông minh Yeelight Screenbar Pro',
      price: 1190000,
      category: 'Phụ kiện',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
      description: 'Đèn treo màn hình chống chói mắt, điều chỉnh nhiệt độ màu linh hoạt, có núm xoay điều khiển không dây.',
      stock: 30,
      created_by: sellerId
    },
    {
      name: 'Ghế công thái học Ergonomic Sihoo M57',
      price: 3650000,
      category: 'Nội thất',
      image: 'https://images.unsplash.com/photo-1580481077194-436f528004f5?w=600&auto=format&fit=crop&q=80',
      description: 'Lưới thoáng khí toàn phần, tựa thắt lưng đa hướng hỗ trợ cột sống, kê tay 3D, chân nhôm đúc chịu tải cao.',
      stock: 5,
      created_by: sellerId
    },
    {
      name: 'Cáp sạc nhanh Anker PowerLine III Flow USB-C to C',
      price: 280000,
      category: 'Phụ kiện',
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80',
      description: 'Chất liệu silicon siêu mềm mịn, chống rối hoàn hảo, hỗ trợ công suất sạc PD lên tới 100W.',
      stock: 45,
      created_by: sellerId
    },
    {
      name: 'Loa Bluetooth Marshall Emberton II',
      price: 3890000,
      category: 'Âm thanh',
      image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80',
      description: 'Thiết kế cổ điển đặc trưng Marshall, âm thanh True Stereophonic 360 độ, kháng nước kháng bụi chuẩn IP67.',
      stock: 14,
      created_by: sellerId
    }
  ];

  const insertProduct = db.prepare(`
    INSERT INTO products (name, price, category, image, description, stock, created_by)
    VALUES (@name, @price, @category, @image, @description, @stock, @created_by)
  `);

  const insertManyProducts = db.transaction((products) => {
    for (const prod of products) insertProduct.run(prod);
  });
  insertManyProducts(sampleProducts);

  // 3. Tạo 1 đơn hàng mẫu cho Buyer
  const insertOrder = db.prepare(`
    INSERT INTO orders (buyer_id, total_price, status, shipping_address, phone)
    VALUES (?, ?, 'completed', 'Tòa nhà VMO Holdings, Duy Tân, Cầu Giấy, Hà Nội', '0987654321')
  `);
  const orderResult = insertOrder.run(buyerId, 4340000);
  const orderId = orderResult.lastInsertRowid;

  const insertItem = db.prepare(`
    INSERT INTO order_items (order_id, product_id, product_name, product_price, product_img, quantity)
    VALUES (?, ?, ?, ?, ?,?)
  `);
  insertItem.run(orderId, 1, 'Bàn phím cơ Không dây Keychron K2 V2', 1850000, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80', 1);
  insertItem.run(orderId, 2, 'Chuột Logitech MX Master 3S Ergonomic', 2490000, 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80', 1);

  console.log('✅ Nạp dữ liệu mẫu hoàn tất!');
  console.log('👉 Tài khoản Seller: seller@vmo.vn / 123456');
  console.log('👉 Tài khoản Buyer:  buyer@vmo.vn  / 123456');
}

// Xử lý flag --reset khi chạy npm run seed
const shouldReset = process.argv.includes('--reset');
initializeDatabase(shouldReset);

// ==========================================
// 3. AUTHENTICATION & AUTHORIZATION MIDDLEWARES
// ==========================================

// Middleware xác thực JWT Token từ Header: Authorization: Bearer <token>
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Lấy token sau "Bearer "

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Vui lòng đăng nhập để truy cập tài nguyên này (Missing Bearer Token)'
    });
  }

  jwt.verify(token, JWT_SECRET, (err, userPayload) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn (Invalid/Expired Token)'
      });
    }
    req.user = userPayload; // Lưu thông tin người dùng vào request: { id, email, role, name }
    next();
  });
}

// Middleware kiểm tra quyền theo Role
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Bạn không có quyền thực hiện hành động này. Yêu cầu một trong các quyền: [${allowedRoles.join(', ')}]`
      });
    }
    next();
  };
}

// ==========================================
// 4. API ROUTES
// ==========================================

// --- Health Check ---
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'E-Commerce API Server đang hoạt động tốt!',
    timestamp: new Date().toISOString()
  });
});

// --- Nhóm 1: AUTHENTICATION (Xác thực) ---

/**
 * POST /api/auth/register
 * Đăng ký tài khoản mới.
 * Body: { name, email, password, role } (role: 'buyer' hoặc 'seller', mặc định 'buyer')
 */
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, password, role = 'buyer' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ Tên, Email và Mật khẩu'
      });
    }
    const isPasswordValid = validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1, // Ít nhất 1 chữ cái thường
      minUppercase: 1, // Không bắt buộc chữ hoa (bạn có thể đổi thành 1 nếu muốn)
      minNumbers: 1,   // Ít nhất 1 chữ số
      minSymbols: 1   // Không bắt buộc ký tự đặc biệt
    });
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu phải có ít nhất 8 ký tự và bao gồm cả chữ và số'
      });
    }

    const assignedRole = ['buyer', 'seller'].includes(role) ? role : 'buyer';

    // Kiểm tra email đã tồn tại chưa
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase().trim());
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Email này đã được đăng ký trên hệ thống'
      });
    }
    // Kiểm tra tên đã tồn tại chưa
    const existing2 = db.prepare('SELECT id FROM users WHERE email = ?').get(name.trim());
    if (existing2) {
      return res.status(400).json({
        success: false,
        message: 'Tên này đã được đăng ký trên hệ thống'
      });
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const result = db.prepare(`
      INSERT INTO users (name, email, password, role)
      VALUES (?, ?, ?, ?)
    `).run(name.trim(), email.toLowerCase().trim(), hashedPassword, assignedRole);

    const newUser = {
      id: result.lastInsertRowid,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      role: assignedRole
    };

    const token = jwt.sign(newUser, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      message: 'Đăng ký tài khoản thành công',
      token,
      user: newUser
    });
  } catch (error) {
    console.error('Lỗi register:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
  }
});

/**
 * POST /api/auth/login
 * Đăng nhập hệ thống.
 * Body: { email, password }
 */
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp Email và Mật khẩu'
      });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim());
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không chính xác'
      });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không chính xác'
      });
    }

    const userPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      message: 'Đăng nhập thành công',
      token,
      user: userPayload
    });
  } catch (error) {
    console.error('Lỗi login:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
  }
});

/**
 * GET /api/auth/me
 * Lấy thông tin tài khoản hiện tại từ Token
 */
app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = db.prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?').get(req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
  }
  res.json({ success: true, user });
});

// --- Nhóm 2: PRODUCTS (Quản lý Sản phẩm) ---

/**
 * GET /api/categories
 * Lấy danh sách các danh mục sản phẩm hiện có
 */
app.get('/api/categories', (req, res) => {
  try {
    const categories = db.prepare(`SELECT DISTINCT category FROM products WHERE category IS NOT NULL AND category != '' ORDER BY category ASC`).all();
    res.json({
      success: true,
      categories: categories.map(c => c.category)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/products
 * Lấy danh sách sản phẩm (Hỗ trợ tìm kiếm, lọc danh mục, sắp xếp)
 * Query params: ?search=...&category=...&sort=price_asc|price_desc|newest
 */
app.get('/api/products', (req, res) => {
  try {
    const { search, category, sort } = req.query;

    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (search && search.trim()) {
      query += ' AND (name LIKE ? OR description LIKE ?)';
      const searchPattern = `%${search.trim()}%`;
      params.push(searchPattern, searchPattern);
    }

    if (category && category.trim()) {
      query += ' AND category = ?';
      params.push(category.trim());
    }

    if (sort === 'price_asc') {
      query += ' ORDER BY price ASC';
    } else if (sort === 'price_desc') {
      query += ' ORDER BY price DESC';
    } else {
      query += ' ORDER BY id DESC'; // Mặc định sản phẩm mới nhất lên đầu
    }

    const products = db.prepare(query).all(...params);

    res.json({
      success: true,
      total: products.length,
      products
    });
  } catch (error) {
    console.error('Lỗi get products:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi lấy danh sách sản phẩm' });
  }
});

/**
 * GET /api/products/:id
 * Xem chi tiết 1 sản phẩm
 */
app.get('/api/products/:id', (req, res) => {
  try {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại' });
    }
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/products
 * Thêm sản phẩm mới vào kho (Chỉ dành cho SELLER)
 * Body: { name, price, category, image, description, stock }
 */
app.post('/api/products', authenticateToken, authorizeRoles('seller'), (req, res) => {
  try {
    const { name, price, category, image, description, stock = 10 } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ success: false, message: 'Tên sản phẩm không được để trống' });
    }

    const parsedPrice = Number(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return res.status(400).json({ success: false, message: 'Giá sản phẩm phải là một số không âm' });
    }

    const parsedStock = Number(stock);
    if (isNaN(parsedStock) || parsedStock < 0) {
      return res.status(400).json({ success: false, message: 'Số lượng tồn kho phải là một số không âm' });
    }

    const insert = db.prepare(`
      INSERT INTO products (name, price, category, image, description, stock, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insert.run(
      name.trim(),
      parsedPrice,
      (category && category.trim()) || 'Khác',
      image ? image.trim() : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
      description ? description.trim() : '',
      parsedStock,
      req.user.id
    );

    const newProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({
      success: true,
      message: 'Thêm sản phẩm mới thành công',
      product: newProduct
    });
  } catch (error) {
    console.error('Lỗi create product:', error);
    res.status(500).json({ success: false, message: 'Lỗi khi tạo mới sản phẩm' });
  }
});

/**
 * PUT /api/products/:id
 * Cập nhật thông tin sản phẩm (Chỉ dành cho SELLER)
 * Body: { name, price, category, image, description, stock }
 */
app.put('/api/products/:id', authenticateToken, authorizeRoles('seller'), (req, res) => {
  try {
    const productId = req.params.id;
    const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(productId);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Sản phẩm cần sửa không tồn tại' });
    }

    const { name, price, category, image, description, stock } = req.body;

    const updatedName = name !== undefined ? name.trim() : existing.name;
    const updatedPrice = price !== undefined ? Number(price) : existing.price;
    const updatedCategory = category !== undefined ? category.trim() : existing.category;
    const updatedImage = image !== undefined ? image.trim() : existing.image;
    const updatedDescription = description !== undefined ? description.trim() : existing.description;
    const updatedStock = stock !== undefined ? Number(stock) : existing.stock;

    if (!updatedName) {
      return res.status(400).json({ success: false, message: 'Tên sản phẩm không được rỗng' });
    }
    if (isNaN(updatedPrice) || updatedPrice < 0) {
      return res.status(400).json({ success: false, message: 'Giá sản phẩm không hợp lệ' });
    }
    if (isNaN(updatedStock) || updatedStock < 0) {
      return res.status(400).json({ success: false, message: 'Số lượng kho không hợp lệ' });
    }

    db.prepare(`
      UPDATE products
      SET name = ?, price = ?, category = ?, image = ?, description = ?, stock = ?
      WHERE id = ?
    `).run(updatedName, updatedPrice, updatedCategory, updatedImage, updatedDescription, updatedStock, productId);

    const updatedProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(productId);

    res.json({
      success: true,
      message: 'Cập nhật thông tin sản phẩm thành công',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Lỗi update product:', error);
    res.status(500).json({ success: false, message: 'Lỗi khi cập nhật sản phẩm' });
  }
});

/**
 * DELETE /api/products/:id
 * Xóa sản phẩm khỏi hệ thống (Chỉ dành cho SELLER)
 */
app.delete('/api/products/:id', authenticateToken, authorizeRoles('seller'), (req, res) => {
  try {
    const productId = req.params.id;
    const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(productId);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại để xóa' });
    }

    db.prepare('DELETE FROM products WHERE id = ?').run(productId);

    res.json({
      success: true,
      message: `Đã xóa sản phẩm "${existing.name}" thành công`
    });
  } catch (error) {
    console.error('Lỗi delete product:', error);
    res.status(500).json({ success: false, message: 'Lỗi khi xóa sản phẩm' });
  }
});

// --- Nhóm 3: ORDERS & CHECKOUT (Đặt hàng & Quản lý đơn) ---

/**
 * POST /api/orders
 * Đặt hàng mới (Thanh toán từ giỏ hàng) - Dành cho BUYER hoặc bất kỳ user đã đăng nhập
 * Body: {
 *   items: [ { productId: 1, quantity: 2 }, ... ],
 *   shippingAddress: "...",
 *   phone: "..."
 * }
 */
app.post('/api/orders', authenticateToken, (req, res) => {
  try {
    const { items, shippingAddress, phone } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Giỏ hàng của bạn đang trống, vui lòng chọn ít nhất 1 sản phẩm'
      });
    }

    // Kiểm tra hàng hóa và tính tổng tiền trong transaction
    const executeOrderTransaction = db.transaction(() => {
      let totalPrice = 0;
      const orderItemsToInsert = [];

      for (const item of items) {
        const prod = db.prepare('SELECT * FROM products WHERE id = ?').get(item.productId);
        if (!prod) {
          throw new Error(`Sản phẩm với mã ID ${item.productId} không tồn tại`);
        }

        const qty = Number(item.quantity);
        if (isNaN(qty) || qty <= 0) {
          throw new Error(`Số lượng mua của sản phẩm "${prod.name}" không hợp lệ`);
        }

        if (prod.stock < qty) {
          throw new Error(`Sản phẩm "${prod.name}" chỉ còn ${prod.stock} cái trong kho (Bạn yêu cầu: ${qty})`);
        }

        totalPrice += prod.price * qty;
        orderItemsToInsert.push({
          productId: prod.id,
          productImg: prod.image,
          productName: prod.name,
          productPrice: prod.price,
          quantity: qty
        });

        // Giảm số lượng tồn kho tương ứng
        db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?').run(qty, prod.id);
      }

      // Tạo đơn hàng mới
      const insertOrder = db.prepare(`
        INSERT INTO orders (buyer_id, total_price, status, shipping_address, phone)
        VALUES (?, ?, 'pending', ?, ?)
      `);
      const orderResult = insertOrder.run(
        req.user.id,
        totalPrice,
        shippingAddress ? shippingAddress.trim() : 'Địa chỉ mặc định',
        phone ? phone.trim() : '0000000000'
      );

      const newOrderId = orderResult.lastInsertRowid;

      // Lưu chi tiết từng món đồ trong đơn
      const insertOrderItem = db.prepare(`
        INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity,product_img)
        VALUES (?, ?, ?, ?, ?, ?)
      `);

      for (const orderItem of orderItemsToInsert) {
        insertOrderItem.run(
          newOrderId,
          orderItem.productId,
          orderItem.productName,
          orderItem.productPrice,
          orderItem.quantity,
          orderItem.productImg

        );
      }

      return { newOrderId, totalPrice, items: orderItemsToInsert };
    });

    const result = executeOrderTransaction();

    res.status(201).json({
      success: true,
      message: 'Đặt hàng thành công! Đơn hàng của bạn đang được xử lý',
      orderId: result.newOrderId,
      totalPrice: result.totalPrice,
      status: 'pending'
    });
  } catch (error) {
    console.error('Lỗi tạo đơn hàng:', error.message);
    res.status(400).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/orders/my-orders
 * Lấy danh sách lịch sử đơn hàng của người mua hiện tại (BUYER)
 */
app.get('/api/orders/my-orders', authenticateToken, (req, res) => {
  try {
    const orders = db.prepare(`
      SELECT * FROM orders 
      WHERE buyer_id = ? 
      ORDER BY id DESC
    `).all(req.user.id);

    const getItems = db.prepare('SELECT * FROM order_items WHERE order_id = ?');

    const ordersWithItems = orders.map(order => ({
      ...order,
      items: getItems.all(order.id)
    }));

    res.json({
      success: true,
      total: ordersWithItems.length,
      orders: ordersWithItems
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/orders 
 * Lấy toàn bộ đơn hàng của hệ thống (Chỉ dành cho SELLER để quản lý đơn)
 */
app.get('/api/orders', authenticateToken, authorizeRoles('seller'), (req, res) => {
  try {
    const orders = db.prepare(`
      SELECT o.*, u.name as buyer_name, u.email as buyer_email 
      FROM orders o
      JOIN users u ON o.buyer_id = u.id
      ORDER BY o.id DESC
    `).all();

    const getItems = db.prepare('SELECT * FROM order_items WHERE order_id = ?');

    const ordersWithDetails = orders.map(order => ({
      ...order,
      items: getItems.all(order.id)
    }));

    res.json({
      success: true,
      total: ordersWithDetails.length,
      orders: ordersWithDetails
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
/**
 * GET /api/clients : Lấy toàn bộ danh sách người dùng 
 */
app.get('/api/clients', authenticateToken, authorizeRoles('seller'), (req, res) => {
  try {
    const clients = db.prepare('SELECT id, name, email, role,created_at FROM users').all();
    res.json({
      success: true,
      total: clients.length,
      clients: clients
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
/**
 * PATCH /api/clients/id : Sửa quyền của người dùng 
 * Cập nhật quyền của người dùng (chỉ dành cho seller)
 * Body: {role: 'seller', 'buyer'}
 *  */

app.patch('/api/clients/:id/role', authenticateToken, authorizeRoles('seller'), (req, res) => {
  try {
    const { role } = req.body;
    const validRole = ['seller', 'buyer']
    if (!role || !validRole.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Quyền không hợp lệ. Chỉ chấp nhận một trong các giá trị: [${validRole.join(', ')}]`
      });
    }
    const findUser = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
    if (!findUser) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng ' });
    }
    if (findUser.id === req.user.id) {
      return res.status(403).json({ success: false, message: 'Không thể thay đổi quyền của chính mình' });
    }
    db.prepare('UPDATE users SET role = ? WHERE id = ?').run(role, req.params.id);
    res.json({
      success: true,
      message: `Cập nhật quyền người dùng #${req.params.id} sang "${role}" thành công`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
})

/**
 * PATCH /api/orders/:id/status
 * Cập nhật trạng thái đơn hàng (Chỉ dành cho SELLER)
 * Body: { status: 'pending' | 'shipping' | 'completed' | 'cancelled' }
 */
app.patch('/api/orders/:id/status', authenticateToken, authorizeRoles('seller'), (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'shipping', 'completed', 'cancelled'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Trạng thái không hợp lệ. Chỉ chấp nhận một trong các giá trị: [${validStatuses.join(', ')}]`
      });
    }

    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
    }

    db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, req.params.id);

    res.json({
      success: true,
      message: `Cập nhật trạng thái đơn hàng #${req.params.id} sang "${status}" thành công`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- Nhóm 4: DEV UTILITIES (Hỗ trợ TTS trong quá trình học và test) ---

/**
 * POST /api/dev/reset
 * Reset lại toàn bộ cơ sở dữ liệu về trạng thái nạp dữ liệu mẫu ban đầu
 */
app.post('/api/dev/reset', (req, res) => {
  try {
    initializeDatabase(true);
    res.json({
      success: true,
      message: 'Đã reset cơ sở dữ liệu về trạng thái mẫu ban đầu thành công!'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 5. KHỞI ĐỘNG SERVER
// ==========================================
app.listen(PORT, () => {
  console.log('====================================================');
  console.log(`🚀 E-Commerce API Server đang chạy tại: http://localhost:${PORT}`);
  console.log(`📖 Tài liệu Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📦 Danh sách sản phẩm:     http://localhost:${PORT}/api/products`);
  console.log('====================================================');
});
