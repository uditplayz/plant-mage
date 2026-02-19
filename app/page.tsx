'use client';

import { useEffect, useState } from 'react';
import {
    Droplets,
    Activity,
    Database,
    TrendingUp,
    Clock,
    RefreshCcw
} from 'lucide-react';
import { MetricCard } from '../components/MetricCard';
import { HistoryChart } from '../components/HistoryChart';
import { fetchTelemetry, TelemetryData } from '../lib/api';

export default function Home() {
    const [data, setData] = useState<TelemetryData[]>([]);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const refreshData = async () => {
        setIsRefreshing(true);
        const telemetry = await fetchTelemetry();
        setData(telemetry);
        setLoading(false);
        setIsRefreshing(false);
    };

    useEffect(() => {
        refreshData();
        const interval = setInterval(refreshData, 600000);
        return () => clearInterval(interval);
    }, []);

    if (loading && data.length === 0) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center text-slate-400">
                <Activity className="animate-spin mr-2" /> Loading Telemetry...
            </div>
        );
    }

    const latest = data[0];

    return (
        <div className="container mx-auto px-6 py-8 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-semibold text-white tracking-tight">Plant Monitor</h1>
                    <p className="text-slate-400 mt-1 text-sm font-mono">Device: 00:70:07:82:B3:80</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-slate-400 bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-800">
                        <div className={`w-2 h-2 rounded-full ${latest ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`}></div>
                        {latest ? 'Live Connection' : 'Offline'}
                    </div>
                    <button
                        onClick={refreshData}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all duration-200 border border-slate-700 shadow-sm"
                        disabled={isRefreshing}
                        title="Refresh Data"
                    >
                        <RefreshCcw size={18} className={isRefreshing ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-2">
                    <MetricCard
                        label="Moisture"
                        value={latest?.moisturePercent ?? '--'}
                        unit="%"
                        icon={Droplets}
                        status={latest && latest.moisturePercent < 15 ? 'warning' : 'normal'}
                    />
                </div>
                <MetricCard
                    label="Raw Sensor Value"
                    value={latest?.rawValue ?? '--'}
                    icon={Database}
                    status="normal"
                />
                <MetricCard
                    label="Drying Rate"
                    value={latest?.dryingRate !== undefined ? latest.dryingRate.toFixed(2) : '--'}
                    unit="/h"
                    icon={TrendingUp}
                    status="normal"
                />
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Charts Section */}
                <div className="lg:col-span-2 bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-lg">
                    <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                        <Activity size={20} className="text-indigo-400" />
                        Moisture History
                    </h2>
                    <HistoryChart data={data} />
                </div>

                {/* System Info Panel */}
                <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-lg h-fit space-y-6">
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <Database size={20} className="text-slate-400" />
                        System Status
                    </h2>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-3 border-b border-slate-800/50">
                            <span className="text-slate-400 text-sm">Last Update</span>
                            <span className="text-white font-mono text-sm flex items-center gap-2">
                                <Clock size={14} className="text-slate-500" />
                                {latest ? new Date(latest.timestamp * 1000).toLocaleTimeString() : '--'}
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-slate-800/50">
                            <span className="text-slate-400 text-sm">Date</span>
                            <span className="text-white font-mono text-sm">
                                {latest ? new Date(latest.timestamp * 1000).toLocaleDateString() : '--'}
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-slate-800/50">
                            <span className="text-slate-400 text-sm">Firmware Version</span>
                            <span className="text-indigo-400 font-mono text-sm bg-indigo-500/10 px-2 py-0.5 rounded">
                                v{latest?.nodeVersion ?? '0.0.0'}
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-3">
                            <span className="text-slate-400 text-sm">Signal Strength</span>
                            <span className="text-emerald-400 font-mono text-sm flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                Excellent
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
