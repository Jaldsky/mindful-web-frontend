import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DomainsUsageTable } from '../../../../src/components/analytics/domains/DomainsUsageTable';
import type { DomainUsageStat } from '../../../src/types/api';

describe('DomainsUsageTable', () => {
  const mockData: DomainUsageStat[] = [
    { domain: 'github.com', category: 'Development', total_seconds: 3600 },
    { domain: 'stackoverflow.com', category: 'Development', total_seconds: 1800 },
    { domain: 'youtube.com', total_seconds: 900 },
  ];

  it('renders table with data', () => {
    render(<DomainsUsageTable data={mockData} />);
    expect(screen.getByText('github.com')).toBeInTheDocument();
    expect(screen.getByText('stackoverflow.com')).toBeInTheDocument();
    expect(screen.getByText('youtube.com')).toBeInTheDocument();
  });

  it('renders headers', () => {
    render(<DomainsUsageTable data={mockData} />);
    expect(screen.getByText('Domain')).toBeInTheDocument();
    expect(screen.getByText('Usage')).toBeInTheDocument();
    expect(screen.getByText('Time')).toBeInTheDocument();
  });

  it('shows empty state when no data', () => {
    render(<DomainsUsageTable data={[]} />);
    expect(screen.getByText('No activity recorded')).toBeInTheDocument();
  });
});

