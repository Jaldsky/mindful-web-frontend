import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TableRow } from '../../../../src/components/analytics/domains/TableRow';
import { DomainUsageStat } from '../../../src/types/api';

describe('TableRow', () => {
  const mockItem: DomainUsageStat = {
    domain: 'example.com',
    category: 'Productivity',
    total_seconds: 3600,
  };

  it('renders domain name', () => {
    render(
      <table>
        <tbody>
          <TableRow item={mockItem} />
        </tbody>
      </table>
    );
    
    expect(screen.getByText('example.com')).toBeInTheDocument();
  });

  it('renders category', () => {
    render(
      <table>
        <tbody>
          <TableRow item={mockItem} />
        </tbody>
      </table>
    );
    
    expect(screen.getByText('Productivity')).toBeInTheDocument();
  });

  it('renders formatted duration', () => {
    render(
      <table>
        <tbody>
          <TableRow item={mockItem} />
        </tbody>
      </table>
    );
    
    // formatTime(3600) returns "1h" when minutes are 0
    expect(screen.getByText('1h')).toBeInTheDocument();
  });

  it('does not render category line when category is null', () => {
    const itemWithoutCategory: DomainUsageStat = {
      ...mockItem,
      category: null,
    };
    
    render(
      <table>
        <tbody>
          <TableRow item={itemWithoutCategory} />
        </tbody>
      </table>
    );
    
    expect(screen.queryByText('-')).not.toBeInTheDocument();
  });

  it('applies hover styling classes', () => {
    const { container } = render(
      <table>
        <tbody>
          <TableRow item={mockItem} />
        </tbody>
      </table>
    );
    
    const row = container.querySelector('tr');
    expect(row).toHaveClass('group');
    expect(row).toHaveClass('hover:bg-gray-50/50');
    expect(row).toHaveClass('transition-all');
  });
});
