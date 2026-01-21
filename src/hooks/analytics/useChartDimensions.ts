/**
 * Chart Dimensions Hook
 * Calculates responsive chart dimensions based on data
 */

import { useMemo } from 'react';
import { CHART_CONFIG } from '../../constants';
import type { ChartDimensions } from '../types';

export const useChartDimensions = (dataLength: number): ChartDimensions => {
  return useMemo(() => {
    const height = dataLength > 0
      ? Math.max(
          CHART_CONFIG.MIN_HEIGHT,
          dataLength * CHART_CONFIG.BAR_HEIGHT_MULTIPLIER
        )
      : CHART_CONFIG.MIN_HEIGHT;

    const margin = {
      left: CHART_CONFIG.MARGIN.LEFT,
      right: CHART_CONFIG.MARGIN.RIGHT,
      top: CHART_CONFIG.MARGIN.TOP,
      bottom: dataLength > CHART_CONFIG.SCROLLABLE_THRESHOLD
        ? CHART_CONFIG.MARGIN.BOTTOM
        : 0,
    };

    return { height, margin };
  }, [dataLength]);
};
