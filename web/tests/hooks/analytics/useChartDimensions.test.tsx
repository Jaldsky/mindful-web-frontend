import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useChartDimensions } from '../../../src/hooks';
import { CHART_CONFIG } from '../../../src/constants';

describe('useChartDimensions', () => {
  it('returns minimum height for empty data', () => {
    const { result } = renderHook(() => useChartDimensions(0));
    
    expect(result.current.height).toBe(CHART_CONFIG.MIN_HEIGHT);
  });

  it('calculates height based on data length', () => {
    const dataLength = 10;
    const { result } = renderHook(() => useChartDimensions(dataLength));
    
    const expectedHeight = dataLength * CHART_CONFIG.BAR_HEIGHT_MULTIPLIER;
    expect(result.current.height).toBe(expectedHeight);
  });

  it('uses minimum height when calculated height is smaller', () => {
    const dataLength = 1;
    const { result } = renderHook(() => useChartDimensions(dataLength));
    
    const calculatedHeight = dataLength * CHART_CONFIG.BAR_HEIGHT_MULTIPLIER;
    expect(calculatedHeight).toBeLessThan(CHART_CONFIG.MIN_HEIGHT);
    expect(result.current.height).toBe(CHART_CONFIG.MIN_HEIGHT);
  });

  it('returns default margins for small datasets', () => {
    const { result } = renderHook(() => useChartDimensions(5));
    
    expect(result.current.margin).toEqual({
      left: CHART_CONFIG.MARGIN.LEFT,
      right: CHART_CONFIG.MARGIN.RIGHT,
      top: CHART_CONFIG.MARGIN.TOP,
      bottom: 0,
    });
  });

  it('returns bottom margin for large datasets', () => {
    const dataLength = CHART_CONFIG.SCROLLABLE_THRESHOLD + 1;
    const { result } = renderHook(() => useChartDimensions(dataLength));
    
    expect(result.current.margin.bottom).toBe(CHART_CONFIG.MARGIN.BOTTOM);
  });

  it('applies bottom margin at threshold', () => {
    const { result } = renderHook(() => 
      useChartDimensions(CHART_CONFIG.SCROLLABLE_THRESHOLD)
    );
    
    expect(result.current.margin.bottom).toBe(0);
  });

  it('applies bottom margin above threshold', () => {
    const { result } = renderHook(() => 
      useChartDimensions(CHART_CONFIG.SCROLLABLE_THRESHOLD + 1)
    );
    
    expect(result.current.margin.bottom).toBe(CHART_CONFIG.MARGIN.BOTTOM);
  });

  it('includes all margin values', () => {
    const { result } = renderHook(() => useChartDimensions(5));
    
    expect(result.current.margin).toHaveProperty('left');
    expect(result.current.margin).toHaveProperty('right');
    expect(result.current.margin).toHaveProperty('top');
    expect(result.current.margin).toHaveProperty('bottom');
  });

  it('memoizes result for same data length', () => {
    const { result, rerender } = renderHook(
      ({ dataLength }) => useChartDimensions(dataLength),
      { initialProps: { dataLength: 10 } }
    );
    
    const firstResult = result.current;
    
    // Rerender with same data length
    rerender({ dataLength: 10 });
    
    // Should be the same object reference (memoized)
    expect(result.current).toBe(firstResult);
  });

  it('recalculates when data length changes', () => {
    const { result, rerender } = renderHook(
      ({ dataLength }) => useChartDimensions(dataLength),
      { initialProps: { dataLength: 5 } }
    );
    
    const firstHeight = result.current.height;
    
    // Change data length
    rerender({ dataLength: 10 });
    
    expect(result.current.height).not.toBe(firstHeight);
    expect(result.current.height).toBe(10 * CHART_CONFIG.BAR_HEIGHT_MULTIPLIER);
  });

  it('handles negative data length gracefully', () => {
    const { result } = renderHook(() => useChartDimensions(-5));
    
    expect(result.current.height).toBe(CHART_CONFIG.MIN_HEIGHT);
  });

  it('handles very large data lengths', () => {
    const largeDataLength = 1000;
    const { result } = renderHook(() => useChartDimensions(largeDataLength));
    
    const expectedHeight = largeDataLength * CHART_CONFIG.BAR_HEIGHT_MULTIPLIER;
    expect(result.current.height).toBe(expectedHeight);
    expect(result.current.margin.bottom).toBe(CHART_CONFIG.MARGIN.BOTTOM);
  });
});
