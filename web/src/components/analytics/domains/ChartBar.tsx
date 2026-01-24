/**
 * Chart Bar Component
 * Renders individual bars in the chart with color rotation
 */

import React from 'react';
import { Cell } from 'recharts';
import { CHART_CONFIG } from '../../../constants';

interface ChartBarProps {
  dataLength: number;
}

const CHART_COLORS = [
  CHART_CONFIG.COLORS.PRIMARY,
  CHART_CONFIG.COLORS.SECONDARY,
  CHART_CONFIG.COLORS.TERTIARY,
  CHART_CONFIG.COLORS.QUATERNARY,
];

export const ChartBar: React.FC<ChartBarProps> = ({ dataLength }) => {
  return (
    <>
      {Array.from({ length: dataLength }).map((_, index) => (
        <Cell
          key={`cell-${index}`}
          fill={CHART_COLORS[index % CHART_COLORS.length]}
        />
      ))}
    </>
  );
};
