import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getProductImage } from '../utils/imageMap';

interface Product {
    id: number;
    name: string;
    imageUrl?: string;
    price: number;
}

interface CategoryStackProps {
    categoryName: string;
    products: Product[];
}

export const CategoryStack = ({ categoryName, products }: CategoryStackProps) => {
    // Only use up to 4 products for the stack animation
    const displayProducts = products.slice(0, 4);
    
    if (displayProducts.length === 0) return null;

    const mainProduct = displayProducts[0];
    const stackedProducts = displayProducts.slice(1);

    return (
        <motion.div 
            className="relative w-[280px] sm:w-[320px] mx-auto h-[440px] group cursor-pointer"
            initial="initial"
            whileHover="hover"
        >
            <Link to={`/category/${categoryName.toLowerCase()}`} className="block w-full h-full relative z-10">
                
                {/* Deck Cards (B, C, D) - Rendered first so they are behind */}
                {stackedProducts.map((product, index) => {
                    // z-index: B=30, C=20, D=10
                    const zIndex = 30 - (index * 10);
                    // default positions (peeking out slightly horizontally)
                    const defaultX = (index + 1) * 10; // 10px, 20px, 30px
                    const defaultScale = 1 - ((index + 1) * 0.04); // 0.96, 0.92, 0.88
                    
                    // hover positions (sliding purely left to right without rotation)
                    const hoverX = (index + 1) * 45; // 45px, 90px, 135px
                    
                    return (
                        <motion.div
                            key={product.id}
                            className="absolute inset-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 rounded-3xl overflow-hidden shadow-md flex flex-col"
                            style={{ zIndex, transformOrigin: "left center" }}
                            variants={{
                                initial: { 
                                    x: defaultX, 
                                    y: defaultX * 0.2,
                                    scale: defaultScale,
                                    rotate: 0
                                },
                                hover: { 
                                    x: hoverX, 
                                    y: -hoverX * 0.15,
                                    scale: defaultScale,
                                    rotate: (index + 1) * 3 
                                }
                            }}
                            transition={{ type: "spring", stiffness: 350, damping: 25 }}
                        >
                            <div className="h-56 bg-slate-100 dark:bg-slate-700/30 relative">
                            <img 
                                src={product.imageUrl || getProductImage(product.name)} 
                                alt={product.name} 
                                className="w-full h-full object-cover opacity-60 dark:opacity-40 grayscale-[20%]" 
                                loading="lazy"
                                decoding="async"
                                width={320}
                                height={224}
                            />
                            </div>
                            <div className="flex-1 bg-white dark:bg-slate-800 p-6 flex flex-col justify-center opacity-40">
                                {/* Dummy content area to match portrait height */}
                                <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                                <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-700 rounded"></div>
                            </div>
                            {/* Overlay to make stacked cards recede visually */}
                            <div className="absolute inset-0 bg-slate-900/10 dark:bg-slate-900/40" />
                        </motion.div>
                    );
                })}

                {/* Main Card (A) - Front facing */}
                <motion.div 
                    className="absolute inset-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 rounded-3xl overflow-hidden shadow-xl dark:shadow-2xl z-40 flex flex-col group-hover:-translate-y-2 transition-transform duration-300"
                >
                    <div className="h-56 bg-slate-100 dark:bg-slate-700/30 relative overflow-hidden">
                        <img 
                            src={mainProduct.imageUrl || getProductImage(mainProduct.name)} 
                            alt={mainProduct.name} 
                            className="w-full h-full object-cover" 
                            fetchPriority="high"
                            loading="eager"
                            decoding="async"
                            width={320}
                            height={224}
                        />
                        {/* Dark gradient for text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent" />
                        <h3 className="absolute bottom-5 left-5 text-3xl font-black text-white tracking-tight drop-shadow-md">
                            {categoryName}
                        </h3>
                    </div>
                    
                    
                    <div className="p-6 flex-1 flex flex-col bg-white dark:bg-slate-800">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-xs font-bold tracking-wider text-primary uppercase">Top Product</span>
                        </div>
                        <span className="font-bold text-xl text-slate-900 dark:text-white line-clamp-2 pr-4 mb-2">
                            {mainProduct.name}
                        </span>
                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                            Premium quality selection from our {categoryName} collection.
                        </p>
                    </div>
                </motion.div>

            </Link>
        </motion.div>
    );
};
