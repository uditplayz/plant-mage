'use client';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';
import { TelemetryData } from '@/lib/api';

interface HistoryChartProps {
    data: TelemetryData[];
}

export function HistoryChart({ data }: HistoryChartProps) {
    // Data comes in descending order (latest first). 
    // We want to chart it chronologically (oldest to newest), so we reverse a copy.
    const chartData = [...data].reverse().map(d => ({
        ...d,
        time: new Date(d.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }));

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Moisture Trends</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis
                            dataKey="time"
                            stroke="#94a3b8"
                            tick={{ fontSize: 12 }}
                            tickMargin={10}
                        />
                        <YAxis
                            stroke="#94a3b8"
                            tick={{ fontSize: 12 }}
                            unit="%"
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9' }}
                            itemStyle={{ color: '#f1f5f9' }}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="moisturePercent"
                            stroke="#06b6d4"
                            strokeWidth={3}
                            dot={false}
                            name="Moisture (%)"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
