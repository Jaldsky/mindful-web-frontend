/**
 * Domains Chart Component
 * Displays bar chart of domain usage statistics
 */

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { PieChart } from 'lucide-react';
import { DomainUsageStat } from '../../../types';
import { formatTime } from '../../../utils';
import { CHART_CONFIG } from '../../../constants';
import { useChartDimensions } from "../../../hooks";
import { LoadingSpinner } from '../../ui';

interface DomainsChartProps {
  data: DomainUsageStat[];
  loading?: boolean;
  title?: string;
}

const CHART_CONTAINER_HEIGHT = 320;
const Y_AXIS_WIDTH = 100;
const Y_AXIS_FONT_SIZE = 11;

const CHART_COLORS = [
  CHART_CONFIG.COLORS.PRIMARY,
  CHART_CONFIG.COLORS.SECONDARY,
  CHART_CONFIG.COLORS.TERTIARY,
  CHART_CONFIG.COLORS.QUATERNARY,
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: DomainUsageStat;
  }>;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;
  
  const data = payload[0].payload;
  const value = payload[0].value;
  
  return (
    <div className="bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700">
      <p className="font-medium text-gray-900 dark:text-white text-sm mb-1">
        {data.domain}
      </p>
      <p className="text-gray-500 dark:text-gray-400 text-xs">
        {formatTime(value)}
      </p>
    </div>
  );
};

export const DomainsChart: React.FC<DomainsChartProps> = ({ 
  data, 
  loading = false,
  title = 'Time Distribution',
}) => {
  const { height, margin } = useChartDimensions(Math.min(data.length, 10));

  const chartData = data.slice(0, 10); // Show top 10 only

  if (loading && data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <PieChart size={18} className="text-gray-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
          </div>
        </div>
        <div
          className="w-full flex items-center justify-center"
          style={{ height: CHART_CONTAINER_HEIGHT }}
        >
          <LoadingSpinner size="md" />
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <PieChart size={18} className="text-gray-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
          </div>
        </div>
        <div
          className="w-full flex flex-col items-center justify-center gap-2 text-gray-400"
          style={{ height: CHART_CONTAINER_HEIGHT }}
        >
          <PieChart size={32} strokeWidth={1.5} />
          <p className="text-sm">No data to display</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <PieChart size={18} className="text-gray-400" />
          <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
          {data.length > 10 && (
            <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">
              Top 10 of {data.length}
            </span>
          )}
        </div>
      </div>

      {/* Chart */}
      <div
        className="w-full overflow-y-auto overflow-x-hidden px-2"
        style={{ height: CHART_CONTAINER_HEIGHT }}
      >
        <ResponsiveContainer width="100%" height={height}>
          <BarChart 
            data={chartData} 
            layout="vertical" 
            margin={margin}
          >
            <XAxis type="number" hide />
            <YAxis
              dataKey="domain"
              type="category"
              width={Y_AXIS_WIDTH}
              tick={{ 
                fontSize: Y_AXIS_FONT_SIZE,
                fill: 'currentColor',
              }}
              tickLine={false}
              axisLine={false}
              interval={0}
              className="text-gray-600 dark:text-gray-400"
            />
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(0, 0, 0, 0.04)' }}
            />
            <Bar
              dataKey="total_seconds"
              radius={[0, 6, 6, 0]}
              barSize={CHART_CONFIG.BAR_SIZE}
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                  className="transition-opacity hover:opacity-80"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
