# 📖 Tài liệu API Server E-Commerce (Node.js + Express + SQLite)

Tài liệu này cung cấp toàn bộ thông tin về các đầu API phục vụ cho **Bài tập Capstone Tuần 7: Dự án E-Commerce CRUD**.

---

## 1. Cách khởi động Server

Mở terminal tại thư mục project API Server mà bạn vừa clone về và chạy:

```bash
# 1. Cài đặt thư viện (chỉ cần chạy lần đầu tiên)
npm install

# 2. Khởi động server
npm start

# Hoặc chạy chế độ dev (tự reload khi sửa file code - Node 18+)
npm run dev

# Muốn reset lại dữ liệu mẫu ban đầu bất kỳ lúc nào:
npm run seed
```

Khi khởi động thành công, server sẽ chạy tại địa chỉ: **`http://localhost:3000`**.

---

## 2. Tài khoản kiểm thử mặc định (Seed Data)

Hệ thống đã tự động tạo sẵn 2 tài khoản mẫu trong cơ sở dữ liệu SQLite:

| Vai trò (Role) | Email | Mật khẩu | Quyền hạn |
| :--- | :--- | :--- | :--- |
| **Seller (Người bán)** | `seller@vmo.vn` | `123456` | Quản lý kho sản phẩm (Thêm/Sửa/Xóa), xem và duyệt trạng thái đơn hàng |
| **Buyer (Người mua)** | `buyer@vmo.vn` | `123456` | Đặt hàng từ giỏ hàng, xem lịch sử đơn hàng cá nhân |
| **Khách vãng lai** | *(Không cần đăng nhập)* | - | Xem danh sách sản phẩm, tìm kiếm, lọc, xem chi tiết |

---

## 3. Cách gửi Header xác thực (Bearer Token) trên Frontend

Đối với các API yêu cầu đăng nhập (Seller / Buyer), bạn cần truyền token vào header `Authorization` khi gọi `fetch()`:

```javascript
const token = localStorage.getItem('ACCESS_TOKEN');

const response = await fetch('http://localhost:3000/api/products', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}` // Bắt buộc cú pháp: Bearer <token>
  },
  body: JSON.stringify(productData)
});

const data = await response.json();
```

---

## 4. Danh sách chi tiết các API Endpoints

### 🔐 A. Authentication (Xác thực tài khoản)

#### 1. Đăng nhập (`POST /api/auth/login`)
- **Quyền:** Public
- **Request Body:**
  ```json
  {
    "email": "seller@vmo.vn",
    "password": "123456"
  }
  ```
- **Response thành công (200 OK):**
  ```json
  {
    "success": true,
    "message": "Đăng nhập thành công",
    "token": "eyJhbGciOiJIUzI1NiIsInR5c...",
    "user": {
      "id": 1,
      "name": "Cửa hàng VMO Tech (Seller)",
      "email": "seller@vmo.vn",
      "role": "seller"
    }
  }
  ```

#### 2. Đăng ký tài khoản (`POST /api/auth/register`)
- **Quyền:** Public
- **Request Body:**
  ```json
  {
    "name": "Nguyễn Văn B",
    "email": "buyer2@vmo.vn",
    "password": "password123",
    "role": "buyer" // "buyer" hoặc "seller" (mặc định "buyer")
  }
  ```
- **Response thành công (201 Created):** Trả về token và thông tin user tương tự như Login.

#### 3. Lấy thông tin cá nhân (`GET /api/auth/me`)
- **Quyền:** Bắt buộc đăng nhập (`Buyer` hoặc `Seller`)
- **Header:** `Authorization: Bearer <token>`

---

### 📦 B. Products (Quản lý sản phẩm)

#### 1. Lấy danh sách sản phẩm (`GET /api/products`)
- **Quyền:** Public
- **Query Parameters (tùy chọn):**
  - `search`: Từ khóa tìm kiếm theo tên hoặc mô tả (Ví dụ: `?search=chuột`)
  - `category`: Lọc theo danh mục chính xác (Ví dụ: `?category=Bàn phím`)
  - `sort`: Sắp xếp (`price_asc`, `price_desc`, `newest`)
- **Ví dụ gọi:** `GET http://localhost:3000/api/products?category=Bàn phím&sort=price_asc`
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "total": 8,
    "products": [
      {
        "id": 1,
        "name": "Bàn phím cơ Không dây Keychron K2 V2",
        "price": 1850000,
        "category": "Bàn phím",
        "image": "https://images.unsplash.com/...",
        "description": "Bàn phím cơ Bluetooth...",
        "stock": 25,
        "created_by": 1,
        "created_at": "2026-09-22 09:12:49"
      }
    ]
  }
  ```

#### 2. Xem chi tiết 1 sản phẩm (`GET /api/products/:id`)
- **Quyền:** Public
- **Response:** Trả về đối tượng `{ success: true, product: { ... } }`

#### 3. Lấy danh sách tất cả các danh mục (`GET /api/categories`)
- **Quyền:** Public
- **Response:**
  ```json
  {
    "success": true,
    "categories": ["Âm thanh", "Bàn phím", "Chuột máy tính", "Màn hình", "Nội thất", "Phụ kiện"]
  }
  ```

#### 4. Thêm sản phẩm mới vào kho (`POST /api/products`)
- **Quyền:** **Chỉ dành cho SELLER**
- **Header:** `Authorization: Bearer <seller_token>`
- **Request Body:**
  ```json
  {
    "name": "Webcam Logitech C920 Pro",
    "price": 1750000,
    "category": "Phụ kiện",
    "image": "https://images.unsplash.com/...",
    "description": "Độ phân giải Full HD 1080p...",
    "stock": 20
  }
  ```
- **Response (201 Created):** Trả về sản phẩm vừa tạo.

#### 5. Cập nhật thông tin sản phẩm (`PUT /api/products/:id`)
- **Quyền:** **Chỉ dành cho SELLER**
- **Header:** `Authorization: Bearer <seller_token>`
- **Request Body:** Gửi các trường cần cập nhật (ví dụ: `name`, `price`, `stock`, v.v.)
- **Response (200 OK):** Trả về thông tin sản phẩm sau khi đã sửa.

#### 6. Xóa sản phẩm khỏi kho (`DELETE /api/products/:id`)
- **Quyền:** **Chỉ dành cho SELLER**
- **Header:** `Authorization: Bearer <seller_token>`
- **Response (200 OK):** `{ "success": true, "message": "Đã xóa sản phẩm thành công" }`

---

### 🛒 C. Orders & Checkout (Đặt hàng & Quản lý đơn)

#### 1. Đặt hàng mới (`POST /api/orders`)
- **Quyền:** **Đã đăng nhập (BUYER)**
- **Header:** `Authorization: Bearer <buyer_token>`
- **Request Body:**
  ```json
  {
    "shippingAddress": "Tầng 5, Tòa VMO Duy Tân, Hà Nội",
    "phone": "0988123456",
    "items": [
      { "productId": 1, "quantity": 1 },
      { "productId": 2, "quantity": 2 }
    ]
  }
  ```
  *(Hệ thống sẽ tự động kiểm tra số lượng tồn kho `stock`, giảm tồn kho tương ứng và tính tổng tiền).*
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Đặt hàng thành công! Đơn hàng của bạn đang được xử lý",
    "orderId": 2,
    "totalPrice": 6830000,
    "status": "pending"
  }
  ```

#### 2. Xem lịch sử mua hàng cá nhân (`GET /api/orders/my-orders`)
- **Quyền:** **BUYER**
- **Header:** `Authorization: Bearer <buyer_token>`
- **Response:** Danh sách đơn hàng mà tài khoản này đã đặt kèm theo danh sách các món hàng bên trong từng đơn.

#### 3. Xem tất cả đơn hàng của cửa hàng (`GET /api/orders`)
- **Quyền:** **Chỉ dành cho SELLER**
- **Header:** `Authorization: Bearer <seller_token>`
- **Response:** Danh sách tất cả đơn hàng kèm theo tên, email của người mua và danh sách mặt hàng.

#### 4. Cập nhật trạng thái đơn hàng (`PATCH /api/orders/:id/status`)
- **Quyền:** **Chỉ dành cho SELLER**
- **Header:** `Authorization: Bearer <seller_token>`
- **Request Body:**
  ```json
  {
    "status": "shipping" 
  }
  ```
  *(Các giá trị hợp lệ: `"pending"`, `"shipping"`, `"completed"`, `"cancelled"`)*

---

### 🛠️ D. Dev Utility (Hỗ trợ trong lúc làm bài)

#### Reset toàn bộ Database về mặc định (`POST /api/dev/reset`)
- **URL:** `http://localhost:3000/api/dev/reset`
- **Method:** `POST` (Không cần token, không cần body)
- **Mô tả:** Nếu trong quá trình test TTS xóa nhầm hết sản phẩm hoặc thêm dữ liệu rác, chỉ cần bấm gọi API này (hoặc chạy `npm run seed`) là dữ liệu sẽ quay về trạng thái ban đầu ngay lập tức.
