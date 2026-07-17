import { useEffect, useMemo } from 'react';
import { useProductStore } from '../store/useProductStore';
import { useAuthStore } from '../store/useAuthStore';
import { CategoryStack } from '../components/CategoryStack';
import { Navigate } from 'react-router-dom';

export const Home = () => {
    const { products, isLoading, error, fetchProducts } = useProductStore();
    const { roles, isAdmin } = useAuthStore();

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

    const isWarehouseOnly = roles.includes('FulfillmentStaff') && !isAdmin;
    if (isWarehouseOnly) {
        return <Navigate to="/fulfillment" replace />;
    }

    if (isLoading) return (
        <div className="py-16 max-w-[1750px] w-full mx-auto px-4 sm:px-8 xl:px-16">
            <div className="mb-20 text-center">
                <div className="h-12 w-72 bg-slate-200 dark:bg-slate-700 rounded-xl mx-auto mb-4 animate-pulse"></div>
                <div className="h-6 w-96 bg-slate-200 dark:bg-slate-700 rounded-lg mx-auto animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-12 lg:gap-x-24 xl:gap-x-32 gap-y-32 justify-items-center">
                {[1, 2, 3].map(i => (
                    <div key={i} className="w-[280px] sm:w-[320px] h-[440px] bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl animate-pulse"></div>
                ))}
            </div>
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
