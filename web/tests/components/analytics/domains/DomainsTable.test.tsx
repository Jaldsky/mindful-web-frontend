import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DomainsTable } from '../../../../src/components/analytics/domains/DomainsTable';
import { DomainUsageStat } from '../../../src/types/api';

describe('DomainsTable', () => {
  const mockData: DomainUsageStat[] = [
    { domain: 'github.com', category: 'Development', total_seconds: 3600 },
    { domain: 'stackoverflow.com', category: 'Development', total_seconds: 1800 },
    { domain: 'youtube.com', total_seconds: 900 },
  ];

  it('renders table with data', () => {
    render(<DomainsTable data={mockData} />);
    
    expect(screen.getByText('github.com')).toBeInTheDocument();
    expect(screen.getByText('stackoverflow.com')).toBeInTheDocument();
    expect(screen.getByText('youtube.com')).toBeInTheDocument();
  });

  it('displays categories', () => {
    render(<DomainsTable data={mockData} />);
    
    const developmentElements = screen.getAllByText('Development');
    expect(developmentElements).toHaveLength(2);
  });

  it('does not render category line when missing', () => {
    render(<DomainsTable data={mockData} />);
    
    const rows = screen.getAllByRole('row');
    const youtubeRow = rows.find(row => row.textContent?.includes('youtube.com'));
    expect(youtubeRow).toBeDefined();
    expect(screen.queryByText('-')).not.toBeInTheDocument();
  });

  it('shows empty state when no data', () => {
    render(<DomainsTable data={[]} />);
    
    expect(screen.getByText('No activity recorded')).toBeInTheDocument();
  });

  it('renders table headers', () => {
    render(<DomainsTable data={mockData} />);
    
    expect(screen.getByText('Domain')).toBeInTheDocument();
    expect(screen.getByText('Usage')).toBeInTheDocument();
    expect(screen.getByText('Time')).toBeInTheDocument();
  });

  it('renders title', () => {
    render(<DomainsTable data={mockData} />);
    
    expect(screen.getByText('Activity Details')).toBeInTheDocument();
  });
});
