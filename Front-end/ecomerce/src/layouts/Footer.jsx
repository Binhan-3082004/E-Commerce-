export function Footer() {
    return (
        <footer className="bg-blue-600 w-full text-white mt-5">
            <div className="px-5 md:px-16 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">

    
                <div className="flex flex-col gap-3">
                    <p className="text-2xl font-bold">VMO SHOP</p>
                    <p className="text-sm text-white">Công nghệ cho cuộc sống mỗi ngày.</p>
                    <a href="#" className="text-sm inline-flex items-center gap-1 hover:underline">
                        Về VMO Shop →
                    </a>
                </div>
                <div className="flex flex-col gap-2">
                    <p className="font-semibold mb-2">Mua sắm</p>
                    <a href="#" className="text-sm text-white/80 hover:text-white">Tất cả sản phẩm</a>
                    <a href="#" className="text-sm text-white/80 hover:text-white">Laptop</a>
                    <a href="#" className="text-sm text-white/80 hover:text-white">Âm thanh</a>
                    <a href="#" className="text-sm text-white/80 hover:text-white">Phụ kiện</a>
                </div>
                <div className="flex flex-col gap-2">
                    <p className="font-semibold mb-2">Hỗ trợ & chính sách</p>
                    <a href="#" className="text-sm text-white/80 hover:text-white">Hướng dẫn mua hàng</a>
                    <a href="#" className="text-sm text-white/80 hover:text-white">Giao hàng & thanh toán</a>
                    <a href="#" className="text-sm text-white/80 hover:text-white">Chính sách đổi trả</a>
                    <a href="#" className="text-sm text-white/80 hover:text-white">Chính sách bảo hành</a>
                    <a href="#" className="text-sm text-white/80 hover:text-white">Chính sách bảo mật</a>
                </div>
                <div className="flex flex-col gap-3">
                    <p className="font-semibold">Kết nối với VMO Shop</p>
                    <p className="text-sm text-white">Cần tư vấn sản phẩm hoặc hỗ trợ đơn hàng? Kết nối với cửa hàng.</p>
                    <button className="bg-white text-blue-600 font-medium px-4 py-2 rounded-lg text-sm w-fit hover:bg-blue-50 transition shadow">
                        Liên hệ cửa hàng
                    </button>
                    <a href="#" className="text-sm text-white/80 hover:text-white inline-flex items-center gap-2 mt-1">
                        <span>✉</span> Gửi góp ý cho VMO Shop
                    </a>
                </div>

            </div>

            <div className="border-t border-blue-500 px-5 md:px-16 py-6 flex flex-col md:flex-row justify-between items-center text-sm text-white/70">
                <p>© 2026 VMO Shop. Bảo lưu mọi quyền.</p>
                <a href="#" className="hover:text-white mt-2 md:mt-0">Điều khoản sử dụng</a>
            </div>
        </footer>
    )
}
