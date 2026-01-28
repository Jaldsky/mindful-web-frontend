/**
 * Domains Usage Chart (embedded)
 * Used in Analytics "Time Distribution" section.
 *
 * Key UX goals:
 * - Use a single, consistent green bar color
 * - Show all items; scroll when needed
 * - Avoid a huge empty hover/tooltip area when only 1-2 rows
 */
import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { DomainUsageStat } from '../../../types';
import { formatTime } from '../../../utils';
import { CHART_CONFIG } from '../../../constants';
import { useChartDimensions } from '../../../hooks';
type CustomTooltipProps = {
  active?: boolean;
  payload?: Array<{ value?: number; payload?: unknown }>;
};

const CHART_CONTAINER_MAX_HEIGHT = 320;
const Y_AXIS_WIDTH = 100;
const Y_AXIS_FONT_SIZE = 11;
const MIN_CHART_HEIGHT = 80;

const GREEN_FROM = '#4CAF50';

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const p = payload[0]?.payload as DomainUsageStat | undefined;
  const value = payload[0]?.value as number | undefined;
  if (!p || typeof value !== 'number') return null;

  return (
    <div className="bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700">
      <p className="font-medium text-gray-900 dark:text-white text-sm mb-1">
        {p.domain}
      </p>
      <p className="text-gray-500 dark:text-gray-400 text-xs">
        {formatTime(value)}
      </p>
    </div>
  );
}

export function DomainsUsageChart({ data }: { data: DomainUsageStat[] }) {
  const dataLength = data.length;
  const { margin } = useChartDimensions(dataLength);

  const desiredChartHeight = useMemo(
    () => Math.max(MIN_CHART_HEIGHT, dataLength * CHART_CONFIG.BAR_HEIGHT_MULTIPLIER),
    [dataLength]
  );
  const containerHeight = Math.min(CHART_CONTAINER_MAX_HEIGHT, desiredChartHeight);
  const shouldScroll = desiredChartHeight > containerHeight;

  return (
    <div
      className={`w-full overflow-x-hidden px-2 ${shouldScroll ? 'overflow-y-auto' : ''}`}
      style={{ height: containerHeight }}
    >
      <ResponsiveContainer width="100%" height={shouldScroll ? desiredChartHeight : '100%'}>
        <BarChart
          data={data}
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
            fill={GREEN_FROM}
            minPointSize={3}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
