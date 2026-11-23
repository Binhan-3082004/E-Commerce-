
import fallbackImg from '../assets/fallback.jpg';
import { useMyOrders } from '../hooks/useMyOrder.js'
import { formatVND } from '../utils/formatCurrency.js';
import { statusColor } from '../utils/statusColor.js';
import { useState } from 'react';
export function HistoryCard({ onCloseForm }) {
    const { orders, loading, error } = useMyOrders();
    const [isHiden, setIsHidden] = useState(null)
    const [findOrder, setFindOrder] = useState("")
    const btnStatus = [
        { label: "Tất cả", value: null },
        { label: " Chờ xác nhận", value: "pending" },
        { label: " Đang giao", value: "shipping" },
        { label: "Đã giao", value: "completed" }
    ]
    const [buttonStatus, setButtonStatus] = useState(null)
    const keyword = findOrder.trim().toLowerCase();

    const filteredOrders = orders.filter((order) => {
        const matchesStatus = buttonStatus === null || order.status === buttonStatus;

        const matchesOrderId =
            `#vmo${order.id}`.includes(keyword) ||
            String(order.id).includes(keyword);

        const matchesProduct = order.items.some((item) =>
            item.product_name.toLowerCase().includes(keyword)
        );

        return matchesStatus && (matchesOrderId || matchesProduct);
    });
    return (
        <div className=' fixed inset-0 bg-black/50 z-9999 flex items-center justify-center p-4'>
            <div className='bg-white rounded-2xl shadow-2xl w-full max-w-187.5 overflow-hidden'>
                <div className="flex items-center justify-between px-6 pt-5 pb-3">
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-500" fill="none"
                                viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                            </svg>
                        </div>
                        <span className="text-blue-500 text-xs font-bold uppercase tracking-wide">VMO SHOP</span>
                    </div>
                    <button onClick={onCloseForm} className="text-gray-400 hover:text-gray-700 text-2xl cursor-pointer">&times;</button>
                </div>
                <div className="px-6 pb-2">
                    <h2 className="text-2xl font-bold text-gray-900">Lịch sử đơn hàng</h2>
                    <p className="text-gray-500 text-sm mt-1 mb-1">
                        Xem lại các đơn đã đặt và theo dõi trạng thái giao hàng của bạn.
                    </p>
                </div>
                <div className="px-6 w-180 pb-4 space-y-4 mt-2 max-h-[80vh] ">
                    <div className="relative">
                        <input
                            value={findOrder}
                            onChange={(e) => setFindOrder(e.target.value)}
                            type="text"
                            placeholder="Tìm theo mã đơn hàng hoặc tên sản phẩm"
                            className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-800 placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition" />
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                                stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                        </div>
                    </div>
                    <div className="flex gap-2.5 overflow-x-auto pb-1">
                        {btnStatus.map((status) => (
                            <button
                                key={status.value}
                                onClick={() => setButtonStatus(status.value)}
                                className={`border border-gray-200 text-xs px-3.5 py-2 rounded-xl whitespace-nowrap
                        ${buttonStatus === status.value
                                        ? "bg-blue-50 text-blue-600 font-semibold"
                                        : "bg-white text-gray-600 font-medium hover:bg-blue-50 hover:text-blue-600"
                                    }`}
                            >
                                {status.label}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="w-183.75 px-6 space-y-4 mb-6 h-96 overflow-y-auto">
                    {loading && <p>Đang tải đơn hàng...</p>}
                    {error && <p>{error}</p>}

                    {!loading && !error && filteredOrders.map((order) => (
                        <div key={order.id}>
                            <div className="border border-gray-200 rounded-xl overflow-hidden mb-4">
                                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
                                    <span className="text-sm font-bold text-gray-700">#VMO{order.id}</span>
                                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </div>
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex items-center gap-3 py-2 px-4 border-b border-gray-50 last:border-0">
                                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 text-gray-300">
                                            <img
                                                className="object-cover w-full h-full rounded "
                                                src={item.product_img}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = fallbackImg;
                                                }}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-800">{item.product_name}</p>
                                            <p className="text-xs text-blue-500">Số lượng: {item.quantity}</p>
                                        </div>
                                        <p className="text-sm font-bold text-gray-700">
                                            {formatVND(item.product_price * item.quantity)}
                                        </p>
                                    </div>

                                ))}
                                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                                    <div>
                                        <p className="mb-1 text-sm font-bold text-gray-600">Tổng tiền: <strong className="ml-0.5 text-red-500">{formatVND(order.total_price)}</strong></p>
                                        <p className="text-gray-500 text-xs mt-1">{order.items.reduce((total, item) => total + item.quantity, 0)} sản phẩm · Miễn phí giao hàng</p>
                                    </div>
                                    <div>
                                        <button onClick={() => setIsHidden(isHiden === order.id ? null : order.id)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl cursor-pointer">
                                            {isHiden ? "Ẩn chi tiết đơn hàng" : "Xem chi tiết đơn hàng"}
                                        </button>
                                    </div>
                                </div>
                                <div style={{ display: isHiden === order.id ? "block" : "none" }}
                                    className='px-4 py-3 bg-gray-50 border-t border-blue-100 text-xs text-black space-y-1'>
                                    <p>Số điện thoại: <span className='text-blue-500 ml-0.5'>{order.phone}</span></p>
                                    <p>Ngày đặt: <span className='text-blue-500 ml-0.5'>{order.created_at ? new Date(order.created_at).toLocaleString("vi-VN") : "Không có"}</span></p>
                                    <p>Địa chỉ: <span className='text-blue-500 ml-0.5'>{order.shipping_address}</span></p>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}