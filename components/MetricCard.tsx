'use client';

import { LucideIcon } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface MetricCardProps {
    label: string;
    value: string | number;
    unit?: string;
    icon: LucideIcon;
    status: 'normal' | 'warning' | 'critical';
}

export function MetricCard({ label, value, unit, icon: Icon, status }: MetricCardProps) {
    const statusStyles = {
        normal: 'bg-slate-900 border-slate-800 text-slate-100',
        warning: 'bg-yellow-950/20 border-yellow-900/50 text-yellow-500',
        critical: 'bg-red-950/20 border-red-900/50 text-red-500',
    };

    return (
        <div className={twMerge(clsx("border rounded-xl p-6 shadow-sm transition-all", statusStyles[status]))}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-400">{label}</p>
                    <div className="mt-2 flex items-baseline gap-1">
                        <span className="text-3xl font-bold tracking-tight">
                            {value}
                        </span>
                        {unit && <span className="text-sm text-slate-500">{unit}</span>}
                    </div>
                </div>
                <div className={clsx("p-2 rounded-lg bg-slate-800/50")}>
                    <Icon size={20} />
                </div>
            </div>
        </div>
    );
}
