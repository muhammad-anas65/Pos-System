import React, { useState, useMemo } from 'react';
import { CompletedOrder, Product, Currency } from '../types';
import { formatCurrency } from '../utils/formatters';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DashboardProps {
    completedOrders: CompletedOrder[];
    products: Product[];
    currency: Currency;
}

type TimePeriod = 'day' | 'week' | 'month';

const StatCard: React.FC<{ title: string; value: string | number; }> = ({ title, value }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</h3>
        <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{value}</p>
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ completedOrders, products, currency }) => {
    const [timePeriod, setTimePeriod] = useState<TimePeriod>('day');

    const filteredData = useMemo(() => {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        startOfWeek.setHours(0,0,0,0);
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const filteredOrders = completedOrders.filter(order => {
            const orderDate = new Date(order.date);
            if (timePeriod === 'day') return orderDate >= startOfDay;
            if (timePeriod === 'week') return orderDate >= startOfWeek;
            if (timePeriod === 'month') return orderDate >= startOfMonth;
            return true;
        });

        const totalRevenue = filteredOrders.reduce((acc, order) => acc + order.total, 0);
        const totalOrders = filteredOrders.length;
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        const productSales: { [key: string]: { quantity: number; name: string } } = {};
        const categorySales: { [key: string]: number } = {};

        for (const order of filteredOrders) {
            for (const item of order.cartItems) {
                // Product Sales
                if (productSales[item.id]) {
                    productSales[item.id].quantity += item.quantity;
                } else {
                    productSales[item.id] = { quantity: item.quantity, name: item.name };
                }
                // Category Sales
                const revenue = item.price * item.quantity;
                if(categorySales[item.category]) {
                    categorySales[item.category] += revenue;
                } else {
                    categorySales[item.category] = revenue;
                }
            }
        }

        const topProducts = Object.values(productSales)
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 5);
            
        const topCategories = Object.entries(categorySales)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);


        return {
            totalRevenue,
            totalOrders,
            averageOrderValue,
            topProducts,
            topCategories
        };

    }, [completedOrders, timePeriod]);

    const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

    return (
        <main className="p-6 bg-gray-50 dark:bg-gray-900/50" style={{ height: 'calc(100vh - 64px)', overflowY: 'auto' }}>
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Admin Dashboard</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            Showing data for: <span className="font-semibold text-primary">{timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1)}</span>
                        </p>
                    </div>
                    <div className="flex items-center bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
                        {(['day', 'week', 'month'] as TimePeriod[]).map(period => (
                             <button
                                key={period}
                                onClick={() => setTimePeriod(period)}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none ${
                                    timePeriod === period
                                    ? 'bg-white dark:bg-gray-800 text-primary shadow'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                                }`}
                            >
                                {period.charAt(0).toUpperCase() + period.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatCard title="Total Revenue" value={formatCurrency(filteredData.totalRevenue, currency)} />
                    <StatCard title="Total Orders" value={filteredData.totalOrders} />
                    <StatCard title="Avg. Order Value" value={formatCurrency(filteredData.averageOrderValue, currency)} />
                </div>
                
                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Selling Products</h3>
                         {filteredData.topProducts.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={filteredData.topProducts} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2}/>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', border: 'none' }}
                                        labelStyle={{ color: '#E5E7EB' }}
                                        formatter={(value) => `${value} units`}
                                    />
                                    <Bar dataKey="quantity" fill="#4f46e5" name="Units Sold" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                         ) : (
                            <div className="h-[300px] flex items-center justify-center text-gray-500 dark:text-gray-400">
                                No sales data for this period.
                            </div>
                         )}
                    </div>
                    <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sales by Category</h3>
                        {filteredData.topCategories.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={filteredData.topCategories}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                        nameKey="name"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {filteredData.topCategories.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value: number) => formatCurrency(value, currency)}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                         ) : (
                             <div className="h-[300px] flex items-center justify-center text-gray-500 dark:text-gray-400">
                                No sales data for this period.
                            </div>
                         )}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Dashboard;
