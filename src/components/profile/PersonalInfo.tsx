import { useState, useEffect } from 'react';
import { useProfileStore } from '../../store/useProfileStore';
import { useAuthStore } from '../../store/useAuthStore';
import toast from 'react-hot-toast';

export const PersonalInfo = () => {
  const { profile, isLoading, fetchProfile, updateProfile } = useProfileStore();
  const { isAdmin, userEmail } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    phoneNumber: ''
  });

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        gender: profile.gender || '',
        phoneNumber: profile.phoneNumber || ''
      });
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      // Error handled by store
    }
  };

  if (isLoading && !profile) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Old User Profile Section (Restored) */}
      <div className="bg-white/80 dark:bg-slate-800/40 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 overflow-hidden rounded-2xl shadow-xl dark:shadow-2xl">
        <div className="px-6 py-6">
          <h3 className="text-xl leading-6 font-semibold text-slate-900 dark:text-slate-100">User Profile</h3>
          <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">Personal details and secure information.</p>
        </div>
        <div className="border-t border-slate-200 dark:border-slate-700/50">
          <dl>
            <div className="bg-slate-50 dark:bg-slate-800/30 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-slate-600 dark:text-slate-400">Email address</dt>
              <dd className="mt-1 text-sm text-slate-900 dark:text-slate-200 sm:mt-0 sm:col-span-2 font-medium">{userEmail}</dd>
            </div>
            <div className="bg-white dark:bg-transparent px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-slate-600 dark:text-slate-400">Security Status</dt>
              <dd className="mt-1 text-sm text-emerald-500 dark:text-emerald-400 font-medium flex items-center gap-2 sm:mt-0 sm:col-span-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></div>
                Fully Authenticated (JWT)
              </dd>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/30 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-slate-600 dark:text-slate-400">Account Type</dt>
              <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                {isAdmin ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 dark:bg-primary/20 text-primary border border-primary/20 dark:border-primary/30 shadow-inner">
                    Admin User
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-200 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600/50">
                    Standard User
                  </span>
                )}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="bg-white/80 dark:bg-slate-800/40 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 rounded-2xl shadow-xl dark:shadow-2xl overflow-hidden">
        <div className="px-6 py-6 border-b border-slate-200 dark:border-slate-700/50 flex justify-between items-center">
          <div>
            <h3 className="text-xl leading-6 font-semibold text-slate-900 dark:text-slate-100">Personal Information</h3>
            <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">Manage your personal details here.</p>
          </div>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            Edit
          </button>
        )}
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                disabled={!isEditing}
                className="mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-white shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-60"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                disabled={!isEditing}
                className="mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-white shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-60"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Your Gender</label>
            <div className="flex items-center space-x-6">
              {['Male', 'Female', 'Other'].map((g) => (
                <label key={g} className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={formData.gender === g}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="h-4 w-4 text-primary focus:ring-primary border-slate-300 disabled:opacity-60"
                  />
                  <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">{g}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
              <input
                type="email"
                value={profile?.email || ''}
                disabled={true}
                className="mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm text-slate-500 dark:text-slate-400 shadow-sm cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-slate-500">Email cannot be changed directly.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Mobile Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                disabled={!isEditing}
                className="mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-white shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-60"
              />
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-4 pt-4 border-t border-slate-200 dark:border-slate-700/50">
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    firstName: profile?.firstName || '',
                    lastName: profile?.lastName || '',
                    gender: profile?.gender || '',
                    phoneNumber: profile?.phoneNumber || ''
                  });
                }}
                className="px-6 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </form>

        <div className="mt-12 border-t border-slate-200 dark:border-slate-700/50 pt-8">
          <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6">FAQs</h4>
          
          <div className="space-y-6">
            <div>
              <h5 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">What happens when I update my email address (or mobile number)?</h5>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Your login email id (or mobile number) changes, likewise. You'll receive all your account related communication on your updated email address (or mobile number).
              </p>
            </div>
            
            <div>
              <h5 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">When will my account be updated with the new email address (or mobile number)?</h5>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                It happens as soon as you confirm the verification code sent to your email (or mobile) and save the changes.
              </p>
            </div>
            
            <div>
              <h5 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">What happens to my existing account when I update my email address (or mobile number)?</h5>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Updating your email address (or mobile number) doesn't invalidate your account. Your account remains fully functional. You'll continue seeing your Order history, saved information and personal details.
              </p>
            </div>
          </div>
        </div>

        </div>
      </div>
    </div>
  );
};
