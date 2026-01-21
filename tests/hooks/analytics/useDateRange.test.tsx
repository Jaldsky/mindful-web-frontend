import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDateRange } from '../../../src/hooks';

describe('useDateRange', () => {
  it('initializes with default 7 days range', () => {
    const { result } = renderHook(() => useDateRange());
    
    expect(result.current.dateRange.start).toBeDefined();
    expect(result.current.dateRange.end).toBeDefined();
    
    const start = new Date(result.current.dateRange.start);
    const end = new Date(result.current.dateRange.end);
    const diffDays = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    expect(diffDays).toBe(7); // 7 days difference
  });

  it('updates start date', () => {
    const { result } = renderHook(() => useDateRange());
    
    act(() => {
      result.current.setStartDate('2024-01-01');
    });
    
    expect(result.current.dateRange.start).toBe('2024-01-01');
  });

  it('updates end date', () => {
    const { result } = renderHook(() => useDateRange());
    
    act(() => {
      result.current.setEndDate('2024-12-31');
    });
    
    expect(result.current.dateRange.end).toBe('2024-12-31');
  });

  it('sets date range for specified number of days', () => {
    const { result } = renderHook(() => useDateRange());
    
    act(() => {
      result.current.selectQuickRange(30);
    });
    
    const start = new Date(result.current.dateRange.start);
    const end = new Date(result.current.dateRange.end);
    const diffDays = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    expect(diffDays).toBe(30); // 30 days difference
  });

  it('sets custom date range', () => {
    const { result } = renderHook(() => useDateRange());
    
    act(() => {
      result.current.setDateRange({ start: '2024-01-01', end: '2024-01-31' });
    });
    
    expect(result.current.dateRange.start).toBe('2024-01-01');
    expect(result.current.dateRange.end).toBe('2024-01-31');
  });
});
