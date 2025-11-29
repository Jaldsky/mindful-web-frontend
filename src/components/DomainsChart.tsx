/**
 * Domains Chart Component
 * Displays bar chart of domain usage statistics
 */

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DomainUsageStat } from '../types/api';
import { formatTime } from '../utils/dateUtils';
import { CHART_CONFIG } from '../constants';

interface DomainsChartProps {
  data: DomainUsageStat[];
}

export const DomainsChart: React.FC<DomainsChartProps> = ({ data }) => {
  const chartHeight = data.length > 0 
    ? Math.max(CHART_CONFIG.MIN_HEIGHT, data.length * CHART_CONFIG.BAR_HEIGHT_MULTIPLIER) 
    : CHART_CONFIG.MIN_HEIGHT;

  return (
    <div className="bg-background-primary p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
      <h2 className="text-lg font-bold mb-6">Top Domains by Duration</h2>
      <div className="h-[350px] w-full overflow-y-auto overflow-x-hidden">
        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart 
            data={data} 
            layout="vertical" 
            margin={{ 
              left: CHART_CONFIG.MARGIN.LEFT, 
              right: CHART_CONFIG.MARGIN.RIGHT, 
              top: CHART_CONFIG.MARGIN.TOP, 
              bottom: data.length > 8 ? CHART_CONFIG.MARGIN.BOTTOM : 0 
            }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.2} />
            <XAxis type="number" hide />
            <YAxis 
              dataKey="domain" 
              type="category" 
              width={120} 
              tick={{ fontSize: 11 }}
              interval={0}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              formatter={(value: number) => formatTime(value)}
            />
            <Bar dataKey="total_seconds" radius={[0, 4, 4, 0]} barSize={CHART_CONFIG.BAR_SIZE}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#4CAF50' : '#2196F3'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

