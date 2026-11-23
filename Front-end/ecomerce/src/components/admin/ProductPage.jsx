// import { showAlert } from '../ui.js';

export function ProductPage() {



    const stats = [
        {
            id: 'stat-total',
            title: 'Tổng sản phẩm',
            value: '...',
            subtext: 'Trong ... danh mục',
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
            value: '...',
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
            value: '...',
            subtext: 'Tồn kho từ 1–5 sản phẩm',
            icon: (
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            ),
        },
        {
            id: 'stat-out',
            title: 'Hết hàng',
            value: '...',
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
                <button
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
                            <p className="text-xs sm:text-sm font-medium text-gray-500">{item.title}</p>
                            <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{item.value}</p>
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
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <span className="font-bold text-gray-900 text-base">Tất cả sản phẩm</span>
                        <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-2.5 py-0.5 rounded-full">...</span>
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
            </div>

        </div>
    )
}