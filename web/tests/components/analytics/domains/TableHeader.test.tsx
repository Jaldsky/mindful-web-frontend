import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TableHeader } from '../../../../src/components/analytics/domains/TableHeader';

describe('TableHeader', () => {
  it('renders all column labels', () => {
    const columns = [
      { label: 'Name' },
      { label: 'Age' },
      { label: 'Email' },
    ];
    
    render(
      <table>
        <TableHeader columns={columns} />
      </table>
    );
    
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('applies left alignment by default', () => {
    const columns = [{ label: 'Test' }];
    
    const { container } = render(
      <table>
        <TableHeader columns={columns} />
      </table>
    );
    
    const th = container.querySelector('th');
    expect(th).not.toHaveClass('text-right');
  });

  it('applies right alignment when specified', () => {
    const columns = [{ label: 'Amount', align: 'right' as const }];
    
    const { container } = render(
      <table>
        <TableHeader columns={columns} />
      </table>
    );
    
    const th = container.querySelector('th');
    expect(th).toHaveClass('text-right');
  });

  it('handles mixed alignments', () => {
    const columns = [
      { label: 'Name', align: 'left' as const },
      { label: 'Amount', align: 'right' as const },
    ];
    
    const { container } = render(
      <table>
        <TableHeader columns={columns} />
      </table>
    );
    
    const headers = container.querySelectorAll('th');
    expect(headers[0]).not.toHaveClass('text-right');
    expect(headers[1]).toHaveClass('text-right');
  });

  it('renders correct number of columns', () => {
    const columns = [
      { label: 'Col1' },
      { label: 'Col2' },
      { label: 'Col3' },
      { label: 'Col4' },
    ];
    
    const { container } = render(
      <table>
        <TableHeader columns={columns} />
      </table>
    );
    
    const headers = container.querySelectorAll('th');
    expect(headers.length).toBe(4);
  });

  it('applies consistent styling to all headers', () => {
    const columns = [{ label: 'Test' }];
    
    const { container } = render(
      <table>
        <TableHeader columns={columns} />
      </table>
    );
    
    const th = container.querySelector('th');
    expect(th).toHaveClass('pb-3');
    expect(th).toHaveClass('font-medium');
    expect(th).toHaveClass('text-gray-500');
  });
});
