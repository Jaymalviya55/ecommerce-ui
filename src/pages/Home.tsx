import { useEffect, useMemo } from 'react';
import { useProductStore } from '../store/useProductStore';
import { CategoryStack } from '../components/CategoryStack';

export const Home = () => {
    const { products, isLoading, error, fetchProducts } = useProductStore();

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const categoriesMap = useMemo(() => {
        const map = new Map<string, any[]>();
        products.forEach(product => {
            const catName = product.category?.name || 'Uncategorized';
            if (!map.has(catName)) {
                map.set(catName, []);
            }
            map.get(catName)!.push(product);
        });
        return map;
    }, [products]);

    if (isLoading) return (
        <div className="flex justify-center items-center h-64 mt-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );
    
    if (error) return (
        <div className="p-8 text-center bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-500 dark:text-rose-400 rounded-2xl max-w-2xl mx-auto mt-20">
            <p className="font-semibold">{error}</p>
        </div>
    );

    return (
        <div className="py-16 max-w-[1750px] w-full mx-auto px-4 sm:px-8 xl:px-16">
            <div className="mb-20 text-center">
                <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">Shop by Category</h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto">Explore our premium collections through interactive stacks.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-12 lg:gap-x-24 xl:gap-x-32 gap-y-32 justify-items-center">
                {Array.from(categoriesMap.entries()).map(([categoryName, catProducts]) => (
                    <CategoryStack 
                        key={categoryName} 
                        categoryName={categoryName} 
                        products={catProducts} 
                    />
                ))}
            </div>
            
            {products.length === 0 && (
                <div className="text-center bg-white/80 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-3xl py-16 mt-8 shadow-sm dark:shadow-none">
                    <p className="text-slate-500 dark:text-slate-400 text-lg">No products found in the database.</p>
                </div>
            )}
        </div>
    );
};
