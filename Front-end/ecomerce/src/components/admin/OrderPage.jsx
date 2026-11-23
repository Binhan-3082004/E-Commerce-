import { useState, useEffect } from "react";
import { adminGetOrders } from "../../services/apiAdmin";
export function OrderPage() {
    const [orders, setOrder] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [setError] = useState('');
    const pending = orders.filter(
        orders => orders.status === "pending"
    ).length;
    const shipping = orders.filter(
        orders => orders.status === "shipping"
    ).length;
    const completed = orders.filter(
        orders => orders.status === "completed"
    ).length;

    useEffect(() => {
        async function fetchOrder() {
            try {
                const data = await adminGetOrders();
                setOrder(data.orders);
                setTotal(data.total)
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchOrder();
    }, []);
    const stats = [
        {
            id: 'stat-total',
            title: 'Tổng đơn hàng',
            value: loading ? '...' : total,
            subtext: `Tổng  ${total} đơn hàng trên trang`,
            icon: (
                <>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </>
            ),
        },
        {
            id: 'stat-stock',
            title: 'Chờ xác nhận ',
            value: loading ? '...' : pending,
            subtext: 'Cần kiểm tra và duyệt',
            icon: (
                <>
                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </>
            ),
        },
        {
            id: 'stat-low',
            title: 'Đang giao hàng',
            value: loading ? '...' : shipping,
            subtext: 'Đã bàn giao vận chuyển',
            icon: (
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            ),
        },
        {
            id: 'stat-out',
            title: 'Đã giao hàng',
            value: loading ? '...' : completed,
            subtext: 'Giao hàng thành công',
            icon: (
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            ),
        },
    ];
    return (
        <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <span>Quản trị</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-gray-900 font-medium">Đơn hàng</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Tất cả đơn hàng</h1>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">Theo dõi, quản lý và xử lý đơn hàng của cửa hàng</p>
                </div>
                <button id="btn-export"
                    className="flex items-center gap-2 border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-semibold text-sm shadow-sm transition-colors self-start sm:self-auto">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Xuất danh sách
                </button>
            </div>
            {/* box đơn hàng */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6" id="stats-cards">
                {stats.map((item) => (
                    <div key={item.id} id={item.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs sm:text-sm font-medium text-gray-500">{item.title}</p>
                            <p className="text-xl sm:text-2xl font-bold text-blue-600 mt-1">{item.value}</p>
                            <p className="text-xs text-gray-400 mt-1">{item.subtext}</p>
                        </div>
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                {item.icon}
                            </svg>
                        </div>
                    </div>
                ))}
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col flex-1">

                <div className="flex items-center justify-between px-4 sm:px-5 pt-4 sm:pt-5 pb-3 sm:pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <span className="font-bold text-gray-900 text-sm sm:text-base">Danh sách đơn hàng</span>
                        <span id="badge-total" className="bg-blue-50 text-blue-600 text-xs font-semibold px-2.5 py-0.5 rounded-full">{total} đơn hàng</span>
                    </div>
                </div>
            </div>
        </div>
    )
}