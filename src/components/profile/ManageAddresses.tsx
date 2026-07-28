import { useState, useEffect } from 'react';
import { useProfileStore, type Address } from '../../store/useProfileStore';
import { Plus, MapPin, Trash2, Edit2, Star } from 'lucide-react';
import toast from 'react-hot-toast';

export const ManageAddresses = () => {
  const { addresses, isLoading, fetchAddresses, addAddress, updateAddress, deleteAddress } = useProfileStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    alternatePhone: '',
    pincode: '',
    locality: '',
    streetAddress: '',
    city: '',
    state: '',
    landmark: '',
    addressType: 'Home',
    isDefault: false
  });

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const resetForm = () => {
    setFormData({
      fullName: '',
      phoneNumber: '',
      alternatePhone: '',
      pincode: '',
      locality: '',
      streetAddress: '',
      city: '',
      state: '',
      landmark: '',
      addressType: 'Home',
      isDefault: false
    });
    setEditingId(null);
    setIsFormOpen(false);
  };

  const handleEdit = (address: Address) => {
    setFormData({
      fullName: address.fullName,
      phoneNumber: address.phoneNumber,
      alternatePhone: address.alternatePhone || '',
      pincode: address.pincode,
      locality: address.locality,
      streetAddress: address.streetAddress,
      city: address.city,
      state: address.state,
      landmark: address.landmark || '',
      addressType: address.addressType,
      isDefault: address.isDefault
    });
    setEditingId(address.id);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this address?')) {
      try {
        await deleteAddress(id);
        toast.success('Address deleted');
      } catch (e) {
        toast.error('Failed to delete address');
      }
    }
  };

  const handleSetDefault = async (address: Address) => {
    if (address.isDefault) return;
    try {
      await updateAddress(address.id, { ...address, isDefault: true });
      toast.success('Default address updated');
    } catch (e) {
      toast.error('Failed to set default address');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value 
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateAddress(editingId, formData);
        toast.success('Address updated successfully');
      } else {
        await addAddress(formData);
        toast.success('Address added successfully');
      }
      resetForm();
    } catch (error) {
      toast.error('Failed to save address');
    }
  };

  if (isLoading && addresses.length === 0) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 dark:bg-slate-800/40 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 rounded-2xl shadow-xl dark:shadow-2xl overflow-hidden">
      <div className="px-6 py-6 border-b border-slate-200 dark:border-slate-700/50 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
        <div>
          <h3 className="text-xl leading-6 font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <MapPin size={24} className="text-primary" />
            Manage Addresses
          </h3>
        </div>
      </div>

      <div className="p-6">
        {!isFormOpen && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="w-full mb-6 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-4 flex items-center justify-center gap-2 text-primary hover:bg-primary/5 hover:border-primary transition-colors font-medium"
          >
            <Plus size={20} /> Add A New Address
          </button>
        )}

        {isFormOpen && (
          <div className="mb-8 bg-slate-50 dark:bg-slate-800/30 p-6 rounded-xl border border-slate-200 dark:border-slate-700/50">
            <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 uppercase text-xs tracking-wider">
              {editingId ? 'Edit Address' : 'Add New Address'}
            </h4>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    required
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    value={formData.pincode}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Locality</label>
                  <input
                    type="text"
                    name="locality"
                    required
                    value={formData.locality}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Address (Area and Street)</label>
                <textarea
                  name="streetAddress"
                  required
                  rows={3}
                  value={formData.streetAddress}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">City/District/Town</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">State</label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Landmark (Optional)</label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Alternate Phone (Optional)</label>
                  <input
                    type="tel"
                    name="alternatePhone"
                    value={formData.alternatePhone}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Address Type</label>
                <div className="flex items-center space-x-6">
                  {['Home', 'Work'].map((t) => (
                    <label key={t} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="addressType"
                        value={t}
                        checked={formData.addressType === t}
                        onChange={handleChange}
                        className="h-4 w-4 text-primary focus:ring-primary border-slate-300"
                      />
                      <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">{t} (All day delivery)</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="pt-2">
                 <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="isDefault"
                      checked={formData.isDefault}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded"
                    />
                    <span className="ml-2 text-sm text-slate-700 dark:text-slate-300 font-medium">Make this my default address</span>
                  </label>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  {isLoading ? 'Saving...' : 'Save Address'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-4">
          {addresses.map((address) => (
            <div key={address.id} className="border border-slate-200 dark:border-slate-700 rounded-xl p-5 hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors group relative">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                      {address.addressType}
                    </span>
                    {address.isDefault && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <Star size={12} className="fill-emerald-600 dark:fill-emerald-400" /> Default
                      </span>
                    )}
                  </div>
                  
                  <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-4">
                    {address.fullName} 
                    <span className="font-medium">{address.phoneNumber}</span>
                  </p>
                  
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-lg leading-relaxed">
                    {address.streetAddress}, {address.locality}, {address.city}, {address.state} - <span className="font-semibold">{address.pincode}</span>
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                    {!address.isDefault && (
                        <button 
                            onClick={() => handleSetDefault(address)}
                            className="hidden sm:block text-xs font-semibold text-slate-500 hover:text-primary transition-colors border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg"
                        >
                            Set Default
                        </button>
                    )}
                    <button 
                        onClick={() => handleEdit(address)}
                        className="p-2 text-slate-400 hover:text-primary transition-colors bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm"
                    >
                        <Edit2 size={16} />
                    </button>
                    <button 
                        onClick={() => handleDelete(address.id)}
                        className="p-2 text-slate-400 hover:text-rose-500 transition-colors bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
