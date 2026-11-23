import fallbackImg from '../../assets/fallback.jpg';
import { showAlert } from '../ui/Alert.jsx';
import { useCart } from '../../hooks/useCart.js'
import { formatVND } from '../../utils/formatCurrency.js';
export function ProductCard({ product }) {
    const { AddToCard, openCart } = useCart();
    const priceVN = formatVND(product.price);
    const AddToCart = () => {
        AddToCard(product);
        openCart(true);
        showAlert("Đã thêm vào giỏ hàng!", "success");
    };
    return (
        <div className="bg-white rounded shadow p-4 flex flex-col h-full">
            <img
                className="w-full h-56.25 object-cover rounded mb-3"
                src={product.image}
                alt={product.name}
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = fallbackImg;
                }}
            />
            <span className="text-xs font-medium bg-blue-200 text-blue-700 px-2 py-1 rounded w-fit mb-2">{product.category}</span>
            <p className="font-bold text-lg mb-1 line-clamp-2 h-14">{product.name}</p>
            <p className="text-gray-900 text-sm mb-3 line-clamp-3 min-h-11 text-justify wrap-break-words">{product.description}</p>

            <div className="mt-auto flex flex-col">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-red-600 font-bold text-lg">{priceVN}</span>
                    <span className="text-blue-500 font-medium text-sm  pr-2">Kho: {product.stock}</span>
                </div>
                <button
                    disabled={product.stock === 0}
                    onClick={AddToCart}
                    className={`py-2 rounded font-bold text-white ${product.stock === 0
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 cursor-pointer"
                        }`}
                >
                    {product.stock === 0 ? "Đã hết hàng" : "Thêm vào giỏ"}
                </button>
            </div>
        </div>
    )
}