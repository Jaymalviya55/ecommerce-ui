import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface Product {
    id: number;
    name: string;
    imageUrl?: string;
    price: number;
}

interface BentoGridProps {
    categoriesMap: Map<string, Product[]>;
}

export const BentoGrid = ({ categoriesMap }: BentoGridProps) => {
    const categories = Array.from(categoriesMap.entries()).filter(([_, prods]) => prods.length > 0);
    
    if (categories.length === 0) return null;

    // Define bento grid layout classes based on index
    // 0: Large square (spans 2 cols, 2 rows)
    // 1: Tall rectangle (spans 1 col, 2 rows)
    // 2: Wide rectangle (spans 2 cols, 1 row)
    // 3: Standard square
    // 4+: Standard square
    const getBentoClasses = (index: number) => {
        switch (index % 5) {
            case 0: return "md:col-span-2 md:row-span-2 min-h-[400px] md:min-h-[600px]";
            case 1: return "md:col-span-1 md:row-span-2 min-h-[300px] md:min-h-[600px]";
            case 2: return "md:col-span-2 md:row-span-1 min-h-[250px] md:min-h-[300px]";
            default: return "md:col-span-1 md:row-span-1 min-h-[250px] md:min-h-[300px]";
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 auto-rows-min">
            {categories.map(([categoryName, products], index) => {
                const displayProduct = products[0]; // Use the first product's image for the category
                const bgImage = displayProduct.imageUrl || "https://images.unsplash.com/photo-1616024933948-c8402c8152e8?q=80&w=1000&auto=format&fit=crop";

                return (
                    <motion.div
                        key={categoryName}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className={`relative rounded-[2.5rem] overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-200/50 dark:border-slate-700/50 ${getBentoClasses(index)}`}
                    >
                        <Link to={`/category/${categoryName.toLowerCase()}`} className="block w-full h-full">
                            <div 
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                                style={{ backgroundImage: `url(${bgImage})` }}
                            />
                            {/* Glass gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                            
                            {/* Content */}
                            <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                <h3 className="text-3xl sm:text-4xl font-black text-white mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    {categoryName}
                                </h3>
                                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-75">
                                    <span className="text-slate-200 font-semibold text-lg">
                                        Explore {products.length} Products
                                    </span>
                                    <ArrowRight size={20} className="text-white" />
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                );
            })}
        </div>
    );
};
