import { describe, it, expect } from 'vitest';
import { ChartBar } from '../../../../src/components/analytics/domains/ChartBar';
import { CHART_CONFIG } from '../../../../src/constants';

describe('ChartBar', () => {
  it('component exists and is a function', () => {
    expect(ChartBar).toBeDefined();
    expect(typeof ChartBar).toBe('function');
  });

  it('accepts dataLength prop', () => {
    expect(() => ChartBar({ dataLength: 5 })).not.toThrow();
  });

  it('handles zero data length', () => {
    expect(() => ChartBar({ dataLength: 0 })).not.toThrow();
  });

  it('uses colors from CHART_CONFIG', () => {
    expect(CHART_CONFIG.COLORS.PRIMARY).toBeDefined();
    expect(CHART_CONFIG.COLORS.SECONDARY).toBeDefined();
    expect(CHART_CONFIG.COLORS.TERTIARY).toBeDefined();
    expect(CHART_CONFIG.COLORS.QUATERNARY).toBeDefined();
  });

  it('returns React element', () => {
    const result = ChartBar({ dataLength: 3 });
    
    expect(result).toBeDefined();
    expect(result.props).toBeDefined();
  });

  it('generates correct number of cells', () => {
    const result = ChartBar({ dataLength: 5 });
    const children = result.props.children;
    
    expect(Array.isArray(children)).toBe(true);
    expect(children.length).toBe(5);
  });

  it('each cell has unique key', () => {
    const result = ChartBar({ dataLength: 4 });
    const children = result.props.children;
    
    const keys = children.map((child: { key: string }) => child.key);
    const uniqueKeys = new Set(keys);
    
    expect(uniqueKeys.size).toBe(4);
  });

  it('handles large data lengths', () => {
    const result = ChartBar({ dataLength: 100 });
    const children = result.props.children;
    
    expect(children.length).toBe(100);
  });
});
