import { useState, useEffect } from 'react';
import { Star, MessageSquare, Package } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

interface UserReview {
  id: number;
  productId: number;
  productName: string;
  productImageUrl: string | null;
  rating: number;
  comment: string;
  createdAt: string;
}

export const MyReviews = () => {
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyReviews = async () => {
      try {
        const response = await axiosClient.get('/reviews/me');
        setReviews(response.data);
      } catch (err: any) {
        setError(err.response?.data || err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMyReviews();
  }, []);

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            size={16} 
            className={star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-300 dark:text-slate-600"} 
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white/80 dark:bg-slate-800/40 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 rounded-2xl shadow-xl dark:shadow-2xl overflow-hidden">
      <div className="p-6 border-b border-slate-200 dark:border-slate-700/50 flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <MessageSquare size={24} className="text-primary" />
            My Reviews
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage all the product reviews you've written.</p>
        </div>
        <div className="bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-sm font-semibold">
          {reviews.length} Reviews
        </div>
      </div>

      <div className="p-0">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="m-6 text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-400/10 p-4 rounded-xl border border-red-200 dark:border-red-400/20">{error}</div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-16 text-slate-500 dark:text-slate-400">
            <MessageSquare size={48} className="mx-auto mb-4 opacity-50 text-slate-400 dark:text-slate-500" />
            <p className="text-lg font-medium text-slate-700 dark:text-slate-300">You haven't written any reviews yet.</p>
            <p className="text-sm mt-1">Share your thoughts on products you've purchased!</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-slate-700/50">
            {reviews.map((review) => (
              <div key={review.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex flex-col md:flex-row gap-6">
                
                {/* Product Info */}
                <div className="flex items-center gap-4 md:w-1/3 flex-shrink-0">
                  <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 flex items-center justify-center overflow-hidden">
                    {review.productImageUrl ? (
                      <img src={review.productImageUrl} alt={review.productName} className="w-full h-full object-cover" />
                    ) : (
                      <Package className="text-slate-400" size={24} />
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold mb-1">Reviewed Product</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 leading-tight">{review.productName}</p>
                  </div>
                </div>

                {/* Review Content */}
                <div className="flex-1 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-700/50 pt-4 md:pt-0 md:pl-6">
                  <div className="flex justify-between items-start mb-3">
                    {renderStars(review.rating)}
                    <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full font-medium">
                      {new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  
                  <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                    "{review.comment}"
                  </p>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
