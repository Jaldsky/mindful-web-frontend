import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Logo } from '../../../../src/components/layout/header/Logo';

const renderLogo = () => {
  return render(
    <BrowserRouter>
      <Logo />
    </BrowserRouter>
  );
};

describe('Logo', () => {
  it('renders the logo text', () => {
    renderLogo();
    expect(screen.getByText(/Mindful Web/i)).toBeInTheDocument();
  });

  it('renders a link to home page', () => {
    renderLogo();
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/');
  });

  it('contains the emoji', () => {
    renderLogo();
    expect(screen.getByText(/🧘/)).toBeInTheDocument();
  });
});
