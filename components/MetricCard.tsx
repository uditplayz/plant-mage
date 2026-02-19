import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
    label: string;
    value: string | number;
    unit?: string;
    icon: LucideIcon;
    status: 'normal' | 'warning' | 'critical';
}

export function MetricCard({ label, value, unit, icon: Icon, status }: MetricCardProps) {
    const statusColor =
        status === 'warning' ? 'text-amber-500' :
            status === 'critical' ? 'text-red-500' :
                'text-emerald-500';

    const borderColor =
        status === 'warning' ? 'border-amber-500/20' :
            status === 'critical' ? 'border-red-500/20' :
                'border-emerald-500/20';

    return (
        <div className={`bg-slate-900 rounded-xl p-6 border ${borderColor} shadow-lg hover:shadow-xl transition-shadow duration-300 relative overflow-hidden group`}>
            {/* Background Icon Watermark */}
            <div className={`absolute -bottom-4 -right-4 p-4 opacity-5 group-hover:opacity-10 transition-opacity ${statusColor}`}>
                <Icon size={96} />
            </div>

            <div className="flex items-center justify-between mb-4 relative z-10">
                <span className="text-slate-400 font-medium text-sm uppercase tracking-wider">{label}</span>
                <div className={`p-2 rounded-lg bg-slate-800/50 ${statusColor}`}>
                    <Icon size={20} />
                </div>
            </div>

            <div className="flex items-baseline gap-1 relative z-10">
                <span className="text-3xl font-bold text-white tracking-tight">
                    {value}
                </span>
                {unit && <span className="text-slate-500 text-sm font-medium">{unit}</span>}
            </div>

            {status !== 'normal' && (
                <div className="mt-4 flex items-center gap-2 text-xs font-medium text-amber-500 bg-amber-500/10 px-2 py-1 rounded w-fit relative z-10">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
                    ACTION REQUIRED
                </div>
            )}
        </div>
    );
}
