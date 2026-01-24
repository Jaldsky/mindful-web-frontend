/**
 * Domains Chart Component
 * Displays bar chart of domain usage statistics
 */

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DomainUsageStat } from '../../../types';
import { formatTime } from '../../../utils';
import { CHART_CONFIG } from '../../../constants';
import { useChartDimensions } from "../../../hooks";
import { Card } from '../../ui';
import { ChartBar } from './ChartBar';

interface DomainsChartProps {
  data: DomainUsageStat[];
}

const CHART_CONTAINER_HEIGHT = 350;
const Y_AXIS_WIDTH = 120;
const Y_AXIS_FONT_SIZE = 11;
const TOOLTIP_STYLE = {
  borderRadius: '8px',
  border: 'none',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
};

export const DomainsChart: React.FC<DomainsChartProps> = ({ data }) => {
  const { height, margin } = useChartDimensions(data.length);

  return (
    <Card title="Top Domains by Duration">
      <div
        className="w-full overflow-y-auto overflow-x-hidden"
        style={{ height: CHART_CONTAINER_HEIGHT }}
      >
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={data} layout="vertical" margin={margin}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.2} />
            <XAxis type="number" hide />
            <YAxis
              dataKey="domain"
              type="category"
              width={Y_AXIS_WIDTH}
              tick={{ fontSize: Y_AXIS_FONT_SIZE }}
              interval={0}
            />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              formatter={(value: number) => formatTime(value)}
            />
            <Bar
              dataKey="total_seconds"
              radius={[0, 4, 4, 0]}
              barSize={CHART_CONFIG.BAR_SIZE}
            >
              <ChartBar dataLength={data.length} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
