import { useState, useEffect } from 'react';
import { Star, MessageCircle, Edit2, X, PenLine } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import axiosClient from '../api/axiosClient';

interface Review {
  id: number;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string | null;
}

interface ProductReviewsProps {
  productId: number;
}

export const ProductReviews = ({ productId }: ProductReviewsProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const { isAuthenticated, userId } = useAuthStore();
  
  // State for Review Form
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingReviewId(null);
    setRating(5);
    setComment('');
    setError('');
  };

  const fetchReviews = async () => {
    try {
      const res = await axiosClient.get(`/products/${productId}/reviews`);
      setReviews(res.data.reviews);
      setAverageRating(res.data.averageRating);
      setTotalReviews(res.data.totalReviews);
    } catch (err) {
      console.error('Failed to fetch reviews', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (productId) fetchReviews();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      const payload = { rating, comment };
      
      if (editingReviewId) {
        await axiosClient.put(`/products/${productId}/reviews/${editingReviewId}`, payload);
      } else {
        await axiosClient.post(`/products/${productId}/reviews`, payload);
      }
      
      handleCloseForm();
      fetchReviews();
    } catch (err: any) {
      setError(typeof err.response?.data === 'string' ? err.response.data : err.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (review: Review) => {
    setEditingReviewId(review.id);
    setRating(review.rating);
    setComment(review.comment);
    setIsFormOpen(true);
  };

  const userReview = reviews.find(r => r.userId === userId);

  return (
    <div className="mt-8 sm:mt-10 bg-white/80 dark:bg-slate-800/40 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 rounded-2xl p-4 sm:p-5 shadow-xl dark:shadow-2xl mb-8 sm:mb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 pb-4 border-b border-slate-200 dark:border-slate-700/50">
        <div className="w-full">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <MessageCircle className="text-primary" size={20} />
            Customer Reviews
          </h2>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 sm:mt-3">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map(star => (
                <Star 
                  key={star} 
                  size={16} 
                  className={`sm:w-5 sm:h-5 ${star <= averageRating ? "text-yellow-400 fill-yellow-400" : "text-slate-300 dark:text-slate-600"}`} 
                />
              ))}
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-xl font-bold text-slate-900 dark:text-white">{averageRating.toFixed(1)}</span>
              <span className="text-xs sm:text-base text-slate-600 dark:text-slate-300">out of 5</span>
            </div>
            <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">({totalReviews} reviews)</span>
          </div>
        </div>
        
        {isAuthenticated && !isFormOpen && (
          <button 
            onClick={() => {
              if (userReview) {
                handleEditClick(userReview);
              } else {
                setEditingReviewId(null);
                setRating(5);
                setComment('');
                setIsFormOpen(true);
              }
            }}
            className="w-full sm:w-auto justify-center mt-4 sm:mt-0 bg-primary hover:bg-primary-hover text-white px-4 py-2.5 sm:px-8 sm:py-2.5 rounded-lg sm:rounded-xl text-sm font-bold transition-all shadow-lg shadow-primary/20 whitespace-nowrap flex items-center gap-2"
          >
            {userReview ? (
              <>
                <Edit2 size={18} />
                Edit Your Review
              </>
            ) : (
              <>
                <PenLine size={18} />
                Write a Review
              </>
            )}
          </button>
        )}
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="mb-8 bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700/50">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{editingReviewId ? 'Edit Your Review' : 'Write a Review'}</h3>
            <button type="button" onClick={handleCloseForm} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>
          
          {error && <div className="mb-4 text-red-400 bg-red-900/20 p-3 rounded-lg text-sm border border-red-900/50">{error}</div>}

          <div className="mb-5">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Overall Rating</label>
            <div className="flex gap-1 sm:gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star size={28} className={star <= rating ? "text-yellow-400 fill-yellow-400" : "text-slate-300 dark:text-slate-600"} />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Your Review</label>
            <textarea
              required
              rows={3}
              maxLength={1000}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none resize-none"
              placeholder="What did you like or dislike? What should other shoppers know?"
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handleCloseForm}
              className="w-full sm:w-auto px-5 py-2.5 sm:py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-300 dark:border-transparent transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto justify-center px-5 py-2.5 sm:py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? 'Saving...' : (editingReviewId ? 'Update' : 'Submit')}
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : reviews.length === 0 ? (
        !isFormOpen && (
          <div className="text-center py-8 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-200 dark:border-slate-700/50">
            <MessageCircle size={32} className="mx-auto text-slate-400 dark:text-slate-600 mb-2" />
            <p className="text-slate-600 dark:text-slate-300 font-medium">No reviews yet.</p>
            <p className="text-slate-500 text-sm">Be the first to share your thoughts!</p>
          </div>
        )
      ) : (
        <div className="space-y-3">
          {reviews.map(review => (
            <div key={review.id} className="bg-white dark:bg-slate-900/30 border border-slate-200 dark:border-slate-700/50 rounded-xl p-4 sm:p-5 transition-all hover:bg-slate-50 dark:hover:bg-slate-900/50 group shadow-sm dark:shadow-none">
              <div className="flex justify-between items-start mb-3 gap-2 sm:gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-full bg-gradient-to-tr from-primary to-primary-hover flex items-center justify-center text-white font-black text-lg sm:text-xl shadow-lg shadow-primary/20">
                    {review.userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-sm sm:text-base leading-tight">{review.userName}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      {review.updatedAt && ' (Edited)'}
                    </p>
                  </div>
                </div>
                
                <div className="flex shrink-0 mt-1 sm:mt-0">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star key={star} size={14} className={`sm:w-4 sm:h-4 ${star <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-300 dark:text-slate-700"}`} />
                  ))}
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
