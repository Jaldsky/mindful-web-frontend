import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Analytics } from '../../../src/pages/main/Analytics';
import * as hooks from '../../../src/hooks';
import type {
  UseAnalyticsReturn,
  UseAnalyticsSummaryReturn,
  UseDateRangeReturn,
} from '../../../src/hooks';
import { ThemeProvider, LocaleProvider, AuthProvider } from '../../../src/contexts';

describe('Analytics page – period & filters UI', () => {
  const createDateRangeMock = (): UseDateRangeReturn => ({
    dateRange: { start: '2025-01-01', end: '2025-01-07' },
    setDateRange: vi.fn(),
    setStartDate: vi.fn(),
    setEndDate: vi.fn(),
    selectQuickRange: vi.fn(),
    resetToDefault: vi.fn(),
  });

  const createAnalyticsMock = (): UseAnalyticsReturn => ({
    data: [],
    pagination: null,
    loading: false,
    loadingMore: false,
    hasMore: false,
    error: null,
    refetch: vi.fn().mockResolvedValue(undefined),
    loadMore: vi.fn(),
  });

  const createSummaryMock = (): UseAnalyticsSummaryReturn => ({
    data: null,
    loading: false,
    error: null,
  });

  const renderAnalytics = () => {
    vi.spyOn(hooks, 'useDateRange').mockReturnValue(createDateRangeMock());
    vi.spyOn(hooks, 'useAnalytics').mockReturnValue(createAnalyticsMock());
    vi.spyOn(hooks, 'useAnalyticsSummary').mockReturnValue(createSummaryMock());
    vi.spyOn(hooks, 'useHomeEntranceAnimation').mockReturnValue(true);

    return render(
      <BrowserRouter>
        <ThemeProvider>
          <LocaleProvider>
            <AuthProvider>
              <Analytics />
            </AuthProvider>
          </LocaleProvider>
        </ThemeProvider>
      </BrowserRouter>,
    );
  };

  it('renders period and filters section with key controls', () => {
    renderAnalytics();

    expect(screen.getByText(/Период и фильтры|Analysis period/i)).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(/Фильтрация по домену|Filter by domain/i),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Сортировка по:|Sort by field:/i),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Порядок:|Order:/i),
    ).toBeInTheDocument();
  });

  it('shows green outline and arrow for sort select on hover', () => {
    const { container } = renderAnalytics();

    const sortHelper = screen.getByText(/Сортировка по:|Sort by field:/i);
    const sortContainer = sortHelper.closest('div')?.parentElement;
    expect(sortContainer).not.toBeNull();

    const interactivePart = sortContainer!.querySelector('select')?.parentElement as HTMLElement | null;
    expect(interactivePart).not.toBeNull();

    fireEvent.mouseEnter(interactivePart!);

    const outline = container.querySelector('.analytics-hover-outline--sort') as HTMLElement | null;
    expect(outline).not.toBeNull();
    expect(outline!.style.opacity).toBe('1');

    const select = interactivePart!.querySelector('select') as HTMLSelectElement | null;
    expect(select).not.toBeNull();
    expect(select!.style.backgroundImage).toContain('svg');
  });

  it('toggles sort order when clicking order button', () => {
    renderAnalytics();

    const orderButton = screen.getByRole('button', {
      name: /По убыванию|Descending|По возрастанию|Ascending/i,
    });

    const initialLabel = orderButton.textContent;
    fireEvent.click(orderButton);
    const afterClickLabel = orderButton.textContent;

    expect(afterClickLabel).not.toBe(initialLabel);
  });
});

