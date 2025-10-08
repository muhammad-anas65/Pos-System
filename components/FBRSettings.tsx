import React from 'react';
import { FbrSettings } from '../types';

interface FBRSettingsProps {
    settings: FbrSettings;
    onSettingsChange: (newSettings: FbrSettings) => void;
    apiStatus: 'idle' | 'loading' | 'success' | 'error';
}

const FBRSettings: React.FC<FBRSettingsProps> = ({ settings, onSettingsChange, apiStatus }) => {
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        
        let processedValue: string | number | boolean = value;
        if (type === 'checkbox') {
            processedValue = checked;
        } else if (type === 'number') {
            processedValue = name === 'manualTaxRate' ? parseFloat(value) / 100 : parseFloat(value);
            if (isNaN(processedValue as number)) {
                processedValue = 0;
            }
        }

        onSettingsChange({
            ...settings,
            [name]: processedValue,
        });
    };

    const getStatusIndicator = () => {
        if (!settings.enabled) {
            return <span className="text-sm text-gray-500 dark:text-gray-400">Disabled</span>;
        }
        switch (apiStatus) {
            case 'loading':
                return <span className="text-sm text-yellow-500">Connecting...</span>;
            case 'success':
                return <span className="text-sm text-green-500">Connected</span>;
            case 'error':
                 return <span className="text-sm text-red-500">Connection Failed</span>;
            case 'idle':
            default:
                return <span className="text-sm text-gray-500 dark:text-gray-400">Idle</span>;
        }
    }


    return (
        <main className="p-4 sm:p-6" style={{ height: 'calc(100vh - 64px)' }}>
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">FBR Tax Integration</h1>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                    {/* Enable/Disable Toggle */}
                    <div className="flex items-center justify-between pb-4 border-b dark:border-gray-700">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">FBR Integration Status</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Enable to fetch tax rates automatically from FBR.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            {getStatusIndicator()}
                            <label htmlFor="fbr-enabled-toggle" className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    id="fbr-enabled-toggle" 
                                    className="sr-only peer"
                                    name="enabled"
                                    checked={settings.enabled}
                                    onChange={handleChange}
                                />
                                <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                            </label>
                        </div>
                    </div>

                    {/* FBR Credentials */}
                    <div className={`mt-6 space-y-4 transition-opacity ${!settings.enabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
                         <h3 className="text-lg font-medium text-gray-900 dark:text-white">FBR Credentials</h3>
                         <div>
                            <label htmlFor="ntn" className="block text-sm font-medium text-gray-700 dark:text-gray-300">National Tax Number (NTN)</label>
                            <input
                                type="text"
                                name="ntn"
                                id="ntn"
                                value={settings.ntn}
                                onChange={handleChange}
                                disabled={!settings.enabled}
                                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary sm:text-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 disabled:bg-gray-200 dark:disabled:bg-gray-700/50"
                            />
                        </div>
                        <div>
                            <label htmlFor="posId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">POS ID</label>
                            <input
                                type="text"
                                name="posId"
                                id="posId"
                                value={settings.posId}
                                onChange={handleChange}
                                disabled={!settings.enabled}
                                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary sm:text-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 disabled:bg-gray-200 dark:disabled:bg-gray-700/50"
                            />
                        </div>
                        <div>
                            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300">API Key</label>
                            <input
                                type="password"
                                name="apiKey"
                                id="apiKey"
                                value={settings.apiKey}
                                onChange={handleChange}
                                disabled={!settings.enabled}
                                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary sm:text-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 disabled:bg-gray-200 dark:disabled:bg-gray-700/50"
                            />
                        </div>
                    </div>
                    
                    {/* Fallback Tax Rate */}
                     <div className="mt-6 pt-6 border-t dark:border-gray-700 space-y-2">
                         <h3 className="text-lg font-medium text-gray-900 dark:text-white">Fallback Settings</h3>
                         <p className="text-sm text-gray-500 dark:text-gray-400">This tax rate will be used if FBR Integration is disabled or the API is unavailable.</p>
                         <div>
                            <label htmlFor="manualTaxRate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Manual Tax Rate (%)</label>
                            <input
                                type="number"
                                name="manualTaxRate"
                                id="manualTaxRate"
                                value={(settings.manualTaxRate * 100).toFixed(2)}
                                onChange={handleChange}
                                step="0.01"
                                className="mt-1 block w-full max-w-xs px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary sm:text-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                            />
                        </div>
                     </div>
                </div>
            </div>
        </main>
    )
}

export default FBRSettings;
