// import { showAlert } from '../ui.js';
import fallbackImg from '../../../assets/fallback.jpg';
import { getProducts } from "../../../services/api";
import { useState, useEffect } from "react";
import { formatVND } from '../../../utils/formatCurrency';
import { AddProduct } from './AddProduct'
import { ChangeProduct } from './ChangeProduct';
import { DeleteProduct } from './DeleteProduct';
export function ProductPage() {
    const PAGE_SIZE = 5;
    const [currentPage, setCurrentpage] = useState(1)
    const [showForm, setShowForm] = useState(false)
    const [showFormChange, setshowFormChange] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [showFormDelete, setshowFormDelete] = useState(false)
    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [setError] = useState('');
    const totalStock = products.reduce((sum, products) => {
        return sum + Number(products.stock || 0)
    }, 0)
    const lowStock = products.filter(
        product => product.stock > 0 && product.stock <= 5
    ).length;
    const noStock = products.filter(
        product => product.stock === 0
    ).length
    const totalPages = Math.ceil(products.length / PAGE_SIZE);
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const pageProducts = products.slice(startIndex, startIndex + PAGE_SIZE);
    useEffect(() => {
        async function fetchProducts() {
            try {
                const data = await getProducts();
                setProducts(data.products);
                setTotal(data.total)
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, []);
    const stats = [
        {
            id: 'stat-total',
            title: 'Tổng sản phẩm',
            value: loading ? '...' : total,
            subtext: `Tổng ${total}  sản phẩm trên trang`,
            icon: (
                <>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                </>
            ),
        },
        {
            id: 'stat-stock',
            title: 'Tổng tồn kho',
            value: loading ? '...' : totalStock,
            subtext: 'Sản phẩm sẵn sàng bán',
            icon: (
                <>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8l1 12a2 2 0 002 2h8a2 2 0 002-2l1-12" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 12v6m4-6v6" />
                </>
            ),
        },
        {
            id: 'stat-low',
            title: 'Sắp hết hàng',
            value: loading ? '...' : lowStock,
            subtext: 'Tồn kho từ 1–5 sản phẩm',
            icon: (
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            ),
        },
        {
            id: 'stat-out',
            title: loading ? '...' : 'Hết hàng',
            value: noStock,
            subtext: 'Cần bổ sung tồn kho',
            icon: (
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            ),
        },
    ];
    return (
        <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <span>Quản trị</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                <span className="text-gray-800 font-medium">Sản phẩm</span>
                <div className="ml-auto flex items-center gap-2 text-gray-400 text-xs">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                </div>
            </div>

            <div className="flex items-center justify-between mb-6">
                <div className="flex-1" >
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý sản phẩm</h1>
                    <p className="text-sm text-gray-500 mt-1">Theo dõi danh mục, giá bán và tồn kho của cửa hàng.</p>
                </div>
                <button onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Thêm sản phẩm
                </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6" id="stats-cards">
                {stats.map((item) => (
                    <div key={item.id} id={item.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs sm:text-sm font-medium text-gray-900">{item.title}</p>
                            <p className="text-xl sm:text-2xl font-bold text-blue-600 mt-1">{item.value}</p>
                            <p className="text-xs text-gray-900 font-medium mt-1">{item.subtext}</p>
                        </div>
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                {item.icon}
                            </svg>
                        </div>
                    </div>
                ))}
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <span className="font-bold text-gray-900 text-base">Tất cả sản phẩm</span>
                        <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-2.5 py-0.5 rounded-full">{total} sản phẩm</span>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 px-4 sm:px-5 py-3 border-b border-gray-100">
                    <div className="relative sm:flex-1">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
                        </svg>
                        <input type="text" placeholder="Tìm theo tên hoặc mã sản phẩm..."
                            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                </div>
                <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 px-5 py-3 text-xs font-bold text-black uppercase tracking-wider border-b border-gray-100">
                    <span>Tên sản phẩm</span>
                    <span className="text-center">Giá bán</span>
                    <span className="text-center">Tồn kho</span>
                    <span className="text-center">Danh mục</span>
                    <span className=" text-center">Thao tác</span>
                </div>
                {pageProducts.map((item) => (
                    <div key={item.id} className=" grid grid-cols-[2fr_1fr_1fr_1fr_1fr] items-center gap-4 px-5 py-4 ">
                        <div className="flex items-center gap-3 min-w-0">
                            <img
                                className="object-cover rounded-xl w-10 h-10  shrink-0"
                                src={item.image}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = fallbackImg;
                                }}
                            />
                            <div className=' items-center '>
                                <p className="text-sm font-bold truncate">{item.name}</p>
                                <p className='text-xs text-blue-400'>ID: #{item.id}</p>
                            </div>

                        </div>

                        <p className='text-sm font-semibold text-black text-center block'> {formatVND(item.price)}</p>
                        <p className='text-sm font-semibold text-black text-center '>{item.stock} sản phẩm</p>
                        <p className='text-sm text-black font-semibold text-center block truncate'>{item.category}</p>

                        <div className="flex items-center gap-2 text-right">
                            <button onClick={() => { setshowFormChange(true); setSelectedProduct(item) }} className=" flex-1 px-2.5 flex items-center justify-center gap-1.5 text-blue-600 hover:bg-blue-50 border border-blue-200 rounded-xl py-2 text-sm font-medium transition-colors">
                                <svg className="w-3.5 h-3.0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Sửa
                            </button>
                            <button onClick={() => { setSelectedProduct(item); setshowFormDelete(true) }} className=" flex-1 px-2.5 flex items-center justify-center gap-1.5 text-red-600 hover:bg-red-50 border border-red-200 rounded-xl py-2 text-sm font-medium transition-colors">
                                <svg className="w-3.5 h-3.0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Xóa
                            </button>
                        </div>
                    </div>
                ))}
                {/* Phân trang */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100 text-sm text-gray-500">
                        <span>
                            Hiển thị {startIndex + 1}–{Math.min(startIndex + PAGE_SIZE, products.length)} trong {products.length} sản phẩm
                        </span>
                        <div className="flex items-center gap-1">
                            {/* Nút Trước */}
                            <button
                                onClick={() => setCurrentpage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                ← trước
                            </button>

                            {/* Số trang */}
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentpage(page)}
                                    className={`px-3 py-1.5 rounded-lg border font-medium transition-colors ${currentPage === page
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}

                            {/* Nút Sau */}
                            <button
                                onClick={() => setCurrentpage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Sau →
                            </button>
                        </div>
                    </div>
                )}
            </div>
            {showForm && <AddProduct onClose={() => setShowForm(false)} />}
            {showFormChange && < ChangeProduct product={selectedProduct} onClose={() => setshowFormChange(false)} />}
            {showFormDelete && < DeleteProduct product={selectedProduct} onClose={() => setshowFormDelete(false)} />}

        </div>
    )
}