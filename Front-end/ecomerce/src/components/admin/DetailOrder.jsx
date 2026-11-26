// import { adminUpdateOrderStatus } from '../../services/apiAdmin'
import { Link, useLocation } from 'react-router-dom'
import { formatVND } from '../../utils/formatCurrency'
import fallbackImg from '../../assets/fallback.jpg';
export function DetailOrder() {
    const { state } = useLocation();
    const product = state?.product
    return (
        <div>
            <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-5">
                <span>Quản trị</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
                <span>Đơn hàng</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokelinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-gray-900 font-bold">Đơn hàng #OD{product?.id}</span>
            </nav>
            <Link to={'/admin/order'}
                className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-sm font-semibold mb-4 transition-colors group">
                <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Tất cả đơn hàng
            </Link>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-gray-900">Sản phẩm trong đơn</h2>
                    <span className="text-sm font-medium text-blue-500">{product?.items?.length} sản phẩm</span>
                </div>

                <div className="divide-y divide-gray-50">
                    {product?.items?.length === 0 && (
                        <div className="flex flex-col items-center py-8 text-gray-400">
                            <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                            </svg>
                            <p className="text-sm">Không có sản phẩm trong đơn hàng</p>
                        </div>
                    )}
                    {product?.items?.map((item) => (
                        <div key={item.product_id} className="flex items-center gap-4 py-3">
                            <div className="w-14 h-14 rounded-xlshrink-0 flex items-center justify-center text-lg font-bold ">
                                <img
                                    className="object-cover w-full h-full rounded "
                                    src={item.product_img}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = fallbackImg;
                                    }}
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-gray-900 truncate">{item.product_name}</p>
                                <p className="text-xs text-blue-600 mt-0.5">Mã SP: #{item.product_id}</p>
                            </div>
                            <div className="text-right shrink-0">
                                <p className="text-sm font-bold text-gray-900">{formatVND((item.product_price) * Number(item.quantity))}</p>
                                <p className="text-xs text-blue-600 mt-0.5">  {item.quantity} sản phẩm</p>
                            </div>
                        </div>
                    ))}
                </div>



                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                    <span className="text-sm font-medium text-blue-500">Tổng cộng</span>
                    <span className="text-lg font-extrabold text-gray-900">{formatVND(product?.total_price)}</span>
                </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
                <div className="flex items-center gap-2 mb-4">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <h2 className="font-bold text-gray-900">Thông tin giao hàng</h2>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-3">
                    <div>
                        <p className="text-xs text-blue-600 mb-0.5">Khách hàng</p>
                        <p className="text-sm font-semibold text-gray-900">{product?.buyer_name}</p>
                    </div>
                    <div>
                        <p className="text-xs text-blue-600 mb-0.5">Số điện thoại</p>
                        <p className="text-sm font-semibold text-gray-900">{product?.phone}</p>
                    </div>
                </div>

                <div className="mb-1 ">
                    <p className="text-xs text-blue-600 mb-0.5">Địa chỉ nhận hàng</p>
                    <p className="text-sm font-semibold text-gray-900">{product?.shipping_address}</p>
                </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="font-bold text-gray-900">Thay đổi trạng thái đơn hàng</h2>
                    <div className="flex items-center gap-2">
                        
                        <button
                            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed ${action.cls}">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            
                        </button>
                        <span className="text-sm font-medium italic ${status === 'completed' ? 'text-green-600' : 'text-red-600'}">
                        </span>
                    </div>
                </div>


                <div className="mt-5 pt-4 border-t border-gray-100">
                </div>
            </div>
        </div>
    )
}