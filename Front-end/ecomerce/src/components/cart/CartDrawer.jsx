
import { useCart } from '../../hooks/useCart.js';
import fallbackImg from '../../assets/fallback.jpg';
import { useAuth } from '../../hooks/useAuth.js'
import { formatVND } from '../../utils/formatCurrency.js';

export function CartDrawer({ onAccountClick, onAccountClick1 }) {
    const {
        cart,
        closeCart,
        openCart,
        removeProduct,
        updateQuanty,
        totalPrice,


    } = useCart();
    const { isAuthenticated } = useAuth();
    function onclick() {
        if (!isAuthenticated) {
            openCart(false)
            onAccountClick();
            return;
        }
        if (isAuthenticated) {
            onAccountClick1();
            return;
        }

    }
    return (
        <>
            {closeCart && (
                <div
                    className="fixed inset-0 bg-black/40 z-40"
                    onClick={() => openCart(false)}
                />
            )}

            {/* === DRAWER PANEL === */}
            <div className={`
            fixed inset-y-0 right-0 z-50
            flex h- w-screedvhn max-w-full flex-col overflow-hidden
           bg-white shadow-2xl transition-transform duration-300
            sm:w-105
           ${closeCart ? 'translate-x-0' : 'translate-x-full'}
           `}>

                {/* --- HEADER --- */}
                <div className="bg-blue-600 text-white px-4 py-4 flex justify-between items-center">
                    <h2 className="text-lg font-bold">Giỏ hàng của bạn</h2>
                    <button
                        onClick={() => openCart(false)}
                        className="text-white text-xl font-bold hover:text-gray-200"
                    >
                        ×
                    </button>
                </div>

                {/* --- DANH SÁCH SẢN PHẨM (cuộn được) --- */}
                <div className="flex-1 overflow-y-auto px-4 py-2">
                    {cart.length === 0 ? (
                        // Giỏ trống
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <span className="text-5xl mb-3">🛒</span>
                            <p>Giỏ hàng của bạn đang trống</p>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item.id} className="flex gap-3 py-4 border-b border-gray-200">

                                {/* Ảnh sản phẩm */}
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-16 h-16 object-cover rounded bg-gray-100"
                                    onError={(e) => { e.target.src = fallbackImg; }}
                                />

                                {/* Thông tin */}
                                <div className="flex-1">
                                    {/* Tên*/}
                                    <div className="flex justify-between items-start">
                                        <p className="font-bold text-sm line-clamp-2 pr-2">{item.name}</p>

                                    </div>

                                    {/* Danh mục */}
                                    <p className="text-xs text-gray-400 mt-0.5">{item.category}</p>

                                    {/* Giá */}
                                    <p className="text-red-600 font-bold text-sm mt-1">
                                        {formatVND(item.price)}
                                    </p>

                                    {/* Nút tăng giảm số lượng xóa */}
                                    <div className='flex justify-between items-center mt-2'>
                                        <div className="flex items-center gap-2 ">
                                            <button
                                                onClick={() => updateQuanty(item.id, item.quantity - 1, item.stock)}
                                                className="w-7 h-7 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100 font-bold"
                                            >
                                                −
                                            </button>
                                            <span className="w-6 text-center font-semibold">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuanty(item.id, item.quantity + 1, item.stock)}
                                                disabled={item.quantity >= item.stock}
                                                className={`w-7 h-7 border border-gray-300 rounded flex items-center justify-center font-bold ${item.quantity >= item.stock
                                                    ? 'opacity-50 cursor-not-allowed bg-gray-600 text-gray-400'
                                                    : 'hover:bg-gray-100'
                                                    }`}
                                            >
                                                +
                                            </button>
                                        </div>
                                        {item.quantity >= item.stock && (
                                            <p className="text-red-500 text-xs font-bold ">
                                                Quá số lượng tồn kho
                                            </p>
                                        )}
                                        <button
                                            onClick={() => removeProduct(item.id)}
                                            className="text-gray-400 hover:text-red-500 shrink-0 mb-2"
                                            title="Xóa sản phẩm"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* --- FOOTER: Tổng tiền + Thanh toán --- */}
                {cart.length > 0 && (
                    <div className="border-t border-gray-200 px-4 py-4">
                        <div className="flex justify-between items-center mb-4">
                            <span className="font-bold text-base">Tổng cộng:</span>
                            <span className="font-bold text-base">{formatVND(totalPrice)}</span>
                        </div>
                        <button onClick={onclick} className="w-full bg-blue-600 text-white py-3 rounded font-bold text-base hover:bg-blue-700 transition">
                            Thanh toán

                        </button>
                    </div>
                )}
            </div>
        </>
    );
}