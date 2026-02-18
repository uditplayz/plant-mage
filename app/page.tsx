'use client';

import { useEffect, useState } from 'react';
import {
    Droplets,
    Activity,
    Database,
    TrendingUp,
    Clock,
    RefreshCcw // Imported new icon
} from 'lucide-react';
import { MetricCard } from '../components/MetricCard';
import { HistoryChart } from '../components/HistoryChart';
import { fetchTelemetry, TelemetryData } from '../lib/api';

export default function Home() {
    const [data, setData] = useState<TelemetryData[]>([]);
    // Start with loading true, but we will fetch immediately
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false); // State for manual refresh spin

    const refreshData = async () => {
        setIsRefreshing(true);
        const telemetry = await fetchTelemetry();
        setData(telemetry);
        setLoading(false);
        setIsRefreshing(false);
    };

    useEffect(() => {
        refreshData();
        // Auto refresh every 10 minutes (600,000 ms)
        const interval = setInterval(refreshData, 600000);
        return () => clearInterval(interval);
    }, []);

    if (loading && data.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400">
                <Activity className="animate-spin mr-2" /> Loading Telemetry...
            </div>
        );
    }

    const latest = data[0]; // First item is latest

    return (
        <main className="min-h-screen bg-slate-950 p-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex justify-between items-center border-b border-slate-800 pb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-100 tracking-tight">Plant Monitor</h1>
                        <p className="text-slate-400 mt-1">Device: 00:70:07:82:B3:80</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            Live Connection
                        </div>
                        {/* Manual Refresh Button */}
                        <button
                            onClick={refreshData}
                            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
                            disabled={isRefreshing}
                            title="Refresh Data"
                        >
                            <RefreshCcw size={20} className={isRefreshing ? 'animate-spin' : ''} />
                        </button>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

                {/* Info Row (Timestamp / Version) */}
                <div className="flex gap-4 text-sm text-slate-500 bg-slate-900/50 p-4 rounded-lg border border-slate-800/50">
                    <div className="flex items-center gap-2">
                        <Clock size={16} />
                        Last Updated: {latest ? new Date(latest.timestamp * 1000).toLocaleString() : '--'}
                    </div>
                    <div className="ml-auto">
                        Node Version: {latest?.nodeVersion ?? 'N/A'}
                    </div>
                </div>

                {/* Charts Layout */}
                <div className="grid grid-cols-1 gap-6">
                    <HistoryChart data={data} />
                </div>

            </div>
        </main>
    );
}
