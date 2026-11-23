import { useState } from 'react';
import { useProducts } from '../hooks/useProducts.js';
import { FilterBar } from '../components/product/FilterBar.jsx';
import { ProductGrid } from '../components/product/ProductGrid.jsx';


export function HomePage({ searchQuery }) {
    const [category, setCategory] = useState('');
    const [sort, setSort] = useState('');

    const { products, loading, error, categories } = useProducts(searchQuery, category, sort);

    return (
        <main className='p-8'>
            <FilterBar
                categories={categories}
                category={category}
                sort={sort}
                onCategory={setCategory}
                onSort={setSort}
            />
            {error && <p className="text-red-500 mb-4">⚠️ {error}</p>}
            <ProductGrid products={products} loading={loading} />
        </main>
    );
}
