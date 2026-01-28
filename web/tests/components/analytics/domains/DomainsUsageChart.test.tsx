import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { DomainsUsageChart } from '../../../../src/components/analytics/domains/DomainsUsageChart';
import type { DomainUsageStat } from '../../../src/types/api';

describe('DomainsUsageChart', () => {
  it('renders without crashing', () => {
    const data: DomainUsageStat[] = [
      { domain: 'github.com', total_seconds: 3600 },
    ];

    expect(() => render(<DomainsUsageChart data={data} />)).not.toThrow();
  });

  it('renders container', () => {
    const data: DomainUsageStat[] = [{ domain: 'example.com', total_seconds: 60 }];
    const { container } = render(<DomainsUsageChart data={data} />);
    expect(container.firstChild).toBeTruthy();
  });
});

