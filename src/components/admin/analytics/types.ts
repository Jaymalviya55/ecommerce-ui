export interface AnalyticsData {
  totalRevenue: number;
  revenueGrowth: number;
  totalOrders: number;
  ordersGrowth: number;
  averageOrderValue: number;
  aovGrowth: number;
  totalCustomers: number;
  customersGrowth: number;
  dailySales: { date: string; revenue: number }[];
  categorySales: { name: string; value: number }[];
  topProducts: { id: number; name: string; category: string; imageUrl: string | null; price: number; sales: number; totalRevenue: number }[];
  locationSales: { location: string; revenue: number; percentage: number }[];
  recentOrders: { id: number; customerEmail: string; totalAmount: number; status: string; date: string }[];
  lowStockProducts: { id: number; name: string; imageUrl: string | null; stockQuantity: number }[];
}
