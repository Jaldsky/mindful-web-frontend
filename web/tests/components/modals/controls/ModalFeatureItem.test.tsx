import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ModalFeatureItem } from '../../../../src/components/modals/controls/ModalFeatureItem';

describe('ModalFeatureItem', () => {
  it('renders feature text', () => {
    render(<ModalFeatureItem text="Test feature" />);
    expect(screen.getByText('Test feature')).toBeInTheDocument();
  });

  it('renders feature icon', () => {
    render(<ModalFeatureItem text="Test feature" />);
    expect(screen.getByText('◆')).toBeInTheDocument();
  });

  it('renders multiple features independently', () => {
    const { rerender } = render(<ModalFeatureItem text="Feature 1" />);
    expect(screen.getByText('Feature 1')).toBeInTheDocument();
    
    rerender(<ModalFeatureItem text="Feature 2" />);
    expect(screen.getByText('Feature 2')).toBeInTheDocument();
  });

  it('handles long text', () => {
    const longText = 'This is a very long feature description that should still render correctly without breaking the layout';
    render(<ModalFeatureItem text={longText} />);
    expect(screen.getByText(longText)).toBeInTheDocument();
  });
});
