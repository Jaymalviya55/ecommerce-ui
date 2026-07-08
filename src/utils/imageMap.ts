export const getProductImage = (name: string): string => {
  const normalizedName = name.toLowerCase();
  
  if (normalizedName.includes('laptop')) {
    return 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80'; // Gaming Laptop
  }
  if (normalizedName.includes('keyboard')) {
    return 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80'; // Mechanical Keyboard
  }
  if (normalizedName.includes('mouse')) {
    return 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80'; // Wireless Mouse
  }
  if (normalizedName.includes('monitor') || normalizedName.includes('display')) {
    return 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80'; // Monitor
  }
  if (normalizedName.includes('shirt') || normalizedName.includes('clothes') || normalizedName.includes('apparel')) {
    return 'https://images.unsplash.com/photo-1720514496268-44bb31c03815?auto=format&fit=crop&w=800&q=80'; // T-shirt
  }
  if (normalizedName.includes('hoodie') || normalizedName.includes('jacket')) {
    return 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80'; // Hoodie
  }
  
  // Generic premium aesthetic for anything else (headphones)
  return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80';
};
