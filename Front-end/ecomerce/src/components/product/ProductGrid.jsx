import { Skeleton } from '../ui/Skeleton.jsx';
import { ProductCard } from './ProductCard.jsx';


export function ProductGrid({ products, loading }) {

    if (loading) {
        return (
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                <Skeleton />
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <p className="text-center text-gray-400 mt-16 text-lg">
                Không tìm thấy sản phẩm nào 
            </p>
        );
    }
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}
