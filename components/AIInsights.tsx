import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { AISettings, CompletedOrder, Product } from '../types';
import { BrainIcon } from './icons';

interface AIInsightsProps {
    settings: AISettings;
    onSettingsChange: (newSettings: AISettings) => void;
    completedOrders: CompletedOrder[];
    products: Product[];
}

const AIInsights: React.FC<AIInsightsProps> = ({ settings, onSettingsChange, completedOrders, products }) => {
    const [report, setReport] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onSettingsChange({ ...settings, enabled: e.target.checked });
        if (!e.target.checked) {
            setReport('');
            setError(null);
        }
    };

    const generateReport = async () => {
        setIsLoading(true);
        setError(null);
        setReport('');

        if (!process.env.API_KEY) {
            setError("API key is not configured. Please set the API_KEY environment variable.");
            setIsLoading(false);
            return;
        }

        const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

        const salesDataSummary = completedOrders.map(order => ({
            date: order.date.toISOString().split('T')[0],
            total: order.total,
            items: order.cartItems.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                category: item.category,
            })),
        }));
        
        const productDataSummary = products.map(p => ({
            name: p.name,
            category: p.category,
            price: p.price,
            stock: p.stock
        }));

        const prompt = `
            Analyze the following POS sales data for a small cafe and provide business insights.
            The data includes a list of all completed orders and a list of all available products.

            **Sales Data:**
            ${JSON.stringify(salesDataSummary, null, 2)}

            **Product Catalog:**
            ${JSON.stringify(productDataSummary, null, 2)}

            **Analysis Request:**
            Based on the data provided, please generate a report with the following sections:
            1.  **Top 3 Best-Selling Products:** List the top 3 products by total quantity sold.
            2.  **Top 3 Most Profitable Products:** List the top 3 products by total revenue (quantity * price).
            3.  **Actionable Suggestions:** Provide 3-4 specific, actionable suggestions to improve sales or profitability. For example, suggest product bundles, promotions for underperforming items, or stock management alerts.
            4.  **Brief Sales Forecast:** Provide a short, high-level sales trend prediction for the next period (e.g., week or month).

            Format the entire response as plain text or simple markdown. Do not use complex formatting.
        `;

        try {
            const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: prompt,
            });
            setReport(response.text);
        } catch (e) {
            console.error(e);
            setError('Failed to generate the report. Please check the console for details.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="p-6" style={{ height: 'calc(100vh - 64px)', overflowY: 'auto' }}>
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                        <BrainIcon className="w-8 h-8"/>
                        AI Business Insights
                    </h1>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                    <div className="flex items-center justify-between pb-4 border-b dark:border-gray-700">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">AI Analytics</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Enable to generate sales analysis and suggestions.</p>
                        </div>
                        <label htmlFor="ai-enabled-toggle" className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                id="ai-enabled-toggle"
                                className="sr-only peer"
                                name="enabled"
                                checked={settings.enabled}
                                onChange={handleToggleChange}
                            />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                        </label>
                    </div>

                    <div className="mt-6">
                        {!settings.enabled ? (
                            <div className="text-center py-10">
                                <p className="text-gray-500 dark:text-gray-400">AI Insights are currently disabled.</p>
                                <p className="text-sm text-gray-400 dark:text-gray-500">Enable the toggle above to get started.</p>
                            </div>
                        ) : (
                            <div>
                                <div className="text-center mb-6">
                                    <button
                                        onClick={generateReport}
                                        disabled={isLoading}
                                        className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors duration-200 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-wait"
                                    >
                                        {isLoading ? 'Generating Report...' : 'Generate Sales Report'}
                                    </button>
                                </div>
                                {error && <p className="text-red-500 bg-red-100 dark:bg-red-900/30 p-3 rounded-lg text-center">{error}</p>}
                                {report && (
                                    <div className="mt-6 p-4 border rounded-lg bg-gray-50 dark:bg-gray-900/50 dark:border-gray-700">
                                        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Generated Report</h3>
                                        <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 dark:text-gray-300">{report}</pre>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    )
};

export default AIInsights;