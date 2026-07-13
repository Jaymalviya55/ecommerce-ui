import { AlertTriangle, MoreHorizontal, PackageX } from 'lucide-react';
import type { AnalyticsData } from './types';

interface InventoryAlertsListProps {
  data: AnalyticsData['lowStockProducts'];
}

export const InventoryAlertsList = ({ data }: InventoryAlertsListProps) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)]">
      <div className="flex justify-between items-center mb-6">
         <div className="flex items-center gap-2">
             <AlertTriangle size={18} className="text-amber-500" />
             <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Inventory Alerts</h3>
         </div>
         <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"><MoreHorizontal size={18}/></button>
      </div>

      {data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.map(product => (
            <div key={product.id} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-default">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className="w-10 h-10 rounded-md object-cover bg-slate-200 dark:bg-slate-800" />
              ) : (
                <div className="w-10 h-10 rounded-md bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                  <PackageX className="text-slate-400" size={16} />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{product.name}</p>
                <div className="flex items-center mt-0.5">
                  <span className={`inline-flex items-center text-[10px] font-bold uppercase tracking-wider ${product.stockQuantity === 0 ? 'text-rose-500' : 'text-amber-500'}`}>
                    {product.stockQuantity === 0 ? 'Out of Stock' : `${product.stockQuantity} Left`}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[200px] text-slate-400">
          <PackageX size={28} className="mb-2 opacity-50" />
          <p className="text-sm font-medium">Inventory Healthy</p>
          <p className="text-[11px] mt-0.5 opacity-70">All products are sufficiently stocked.</p>
        </div>
      )}
    </div>
  );
};
