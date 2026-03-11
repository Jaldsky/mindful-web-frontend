import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Layout } from '../../components/layout';
import { useAnalytics, useAnalyticsSummary, useDateRange, useTranslation, useHomeEntranceAnimation } from '../../hooks';
import { StatsCard, DomainsUsageChart, DomainsUsageTable } from '../../components/analytics';
import { ErrorMessage, Card, LoadingSpinner } from '../../components/ui';
import {
  Clock,
  Globe,
  Activity,
  TrendingUp,
  Calendar,
  Search,
  Loader2,
  PieChart,
  BarChart3,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { formatTime } from '../../utils';
import { DATE_RANGES } from '../../constants';
import { useTheme } from '../../contexts';

const ANALYTICS_GRADIENT = 'linear-gradient(90deg, #4CAF50, #81C784, #4CAF50, #2E7D32, #4CAF50)';

const TEAL_COLOR = { bg: '#E0F7FA', text: '#0D9488' }; // Бирюзовый - спокойный
const BLUE_COLOR = { bg: '#E3F2FD', text: '#2563EB' }; // Синий - спокойный
const INDIGO_COLOR = { bg: '#EEF2FF', text: '#4F46E5' }; // Индиго - спокойный

export const Analytics: React.FC = () => {
  const { t } = useTranslation();
  const isVisible = useHomeEntranceAnimation();
  const { dateRange, setStartDate, setEndDate, selectQuickRange } = useDateRange(DATE_RANGES.DAYS_7);
  const { isDark } = useTheme();
  const [isSearchHovered, setIsSearchHovered] = useState(false);
  const [isSortHovered, setIsSortHovered] = useState(false);
  const [domainSearchInput, setDomainSearchInput] = useState('');
  const [sortBy, setSortBy] = useState<'total_seconds' | 'domain' | 'category'>('total_seconds');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  const [committedRange, setCommittedRange] = useState({ start: dateRange.start, end: dateRange.end });
  const [committedDomainsFilters, setCommittedDomainsFilters] = useState<{
    per_page: number;
    sort_by: 'total_seconds' | 'domain' | 'category';
    order: 'asc' | 'desc';
    search: string | null;
  }>({
    per_page: 50,
    sort_by: 'total_seconds',
    order: 'desc',
    search: null,
  });

  const { data, pagination, loading, loadingMore, hasMore, error, loadMore } = useAnalytics({
    from: committedRange.start,
    to: committedRange.end,
    per_page: committedDomainsFilters.per_page,
    sort_by: committedDomainsFilters.sort_by,
    order: committedDomainsFilters.order,
    search: committedDomainsFilters.search,
  });
  const { data: summaryData, error: summaryError } = useAnalyticsSummary({
    from: committedRange.start,
    to: committedRange.end,
  });

  const handleQuickRange = (days: number) => {
    selectQuickRange(days);
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    setCommittedRange({
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0],
    });
  };

  const handleSearch = () => {
    setCommittedRange({ start: dateRange.start, end: dateRange.end });
    setCommittedDomainsFilters({
      per_page: 50,
      sort_by: sortBy,
      order,
      search: domainSearchInput.trim() || null,
    });
  };

  const stats = useMemo(() => {
    if (!summaryData) {
      return {
        totalDomains: '-',
        activeTime: '-',
        domainsTracked: '-',
        avgTime: '-',
      };
    }

    return {
      totalDomains: summaryData.total_domains,
      activeTime: formatTime(summaryData.total_seconds),
      domainsTracked: summaryData.total_domains,
      avgTime: formatTime(summaryData.avg_seconds_per_domain),
    };
  }, [summaryData]);

  const analyticsError = error || summaryError;

  const [minLoadingComplete, setMinLoadingComplete] = useState(true);
  const loadingStartedRef = useRef(false);
  const sortSelectRef = useRef<HTMLSelectElement | null>(null);

  useEffect(() => {
    if (loading && data.length === 0 && !loadingStartedRef.current) {
      loadingStartedRef.current = true;
      setMinLoadingComplete(false);
      setTimeout(() => {
        setMinLoadingComplete(true);
      }, 2000);
    }
    if (!loading && data.length > 0) {
      loadingStartedRef.current = false;
    }
  }, [loading, data.length]);

  useEffect(() => {
    loadingStartedRef.current = false;
  }, [committedRange]);

  const showLoading = (loading || !minLoadingComplete) && data.length === 0;
  const showEmptyState = !loading && minLoadingComplete && !error && data.length === 0;
  const showContent = data.length > 0;

  return (
    <Layout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
        <Card 
          noPadding 
          className="overflow-hidden"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.4s ease, transform 0.4s ease',
          }}
        >
          <div
            style={{
              height: 4,
              background: ANALYTICS_GRADIENT,
              backgroundSize: '300% 100%',
              animation: 'gradientMove 10s ease infinite',
            }}
          />
          
          <div 
            style={{ 
              padding: 'var(--spacing-lg) var(--spacing-xl)',
              textAlign: 'center',
            }}
          >
            <h1
              style={{
                color: 'var(--color-primary)',
                fontSize: 'clamp(22px, 2.4vw, 32px)',
                fontWeight: 700,
                lineHeight: 1.15,
                margin: 0,
                marginBottom: '8px',
              }}
            >
              {t('navigation.analytics')}
            </h1>
            <p
              style={{
                color: 'var(--color-text-light)',
                fontSize: 'var(--font-size-sm)',
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              {t('analytics.subtitle')}
            </p>
          </div>
        </Card>

        <Card
          noPadding
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.4s ease 50ms, transform 0.4s ease 50ms',
          }}
        >
          <div style={{ padding: 'var(--spacing-lg)' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)',
                marginBottom: 'var(--spacing-xs)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 32,
                  height: 32,
                  borderRadius: 'var(--border-radius-md)',
                  backgroundColor: TEAL_COLOR.bg,
                  color: TEAL_COLOR.text,
                  flexShrink: 0,
                }}
              >
                <Calendar size={16} />
              </div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 'var(--font-size-lg)',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                  flexShrink: 0,
                }}
              >
                {t('analytics.periodTitle')}
              </h2>
              <div
                style={{
                  flex: 1,
                  height: 2,
                  marginLeft: 'var(--spacing-md)',
                  background: `linear-gradient(90deg, ${TEAL_COLOR.text}, transparent)`,
                  borderRadius: 1,
                }}
              />
            </div>

            <p
              style={{
                margin: 0,
                marginTop: 'var(--spacing-xs)',
                marginBottom: 'var(--spacing-md)',
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.5,
              }}
            >
              {t('analytics.periodDescription')}
            </p>

            <div
              className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-start"
              style={{ gap: 'var(--spacing-lg)' }}
            >
              <div
                className="inline-flex"
                style={{
                  borderRadius: 'var(--border-radius-md)',
                  overflow: 'hidden',
                  border: '1px solid var(--border-color)',
                  height: 40,
                }}
              >
                {[
                  { days: 1, label: t('analytics.days1'), width: 80 },
                  { days: 7, label: t('analytics.days7'), width: 72 },
                  { days: 30, label: t('analytics.days30'), width: 76 },
                  { days: 90, label: t('analytics.days90'), width: 76 },
                  { days: 180, label: t('analytics.days180'), width: 100 },
                  { days: 365, label: t('analytics.days365'), width: 60 },
                ].map((range, index, arr) => {
                  const isFirst = index === 0;
                  const isLast = index === arr.length - 1;
                  const borderRadius = isFirst
                    ? 'var(--border-radius-md) 0 0 var(--border-radius-md)'
                    : isLast
                      ? '0 var(--border-radius-md) var(--border-radius-md) 0'
                      : '0';

                  return (
                    <button
                      key={range.days}
                      onClick={() => handleQuickRange(range.days)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = 'inset 0 0 0 2px var(--color-primary)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      style={{
                        padding: 0,
                        fontSize: 'var(--font-size-sm)',
                        fontWeight: 500,
                        border: 'none',
                        borderRight: index < arr.length - 1 ? '1px solid var(--border-color)' : 'none',
                        borderRadius,
                        backgroundColor: 'var(--color-bg-secondary)',
                        color: 'var(--color-text-primary)',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        width: range.width,
                        height: '100%',
                        textAlign: 'center',
                        transition: 'box-shadow 0.2s ease',
                      }}
                    >
                      {range.label}
                    </button>
                  );
                })}
              </div>

              <div
                className="inline-flex items-center"
                style={{
                  borderRadius: 'var(--border-radius-md)',
                  overflow: 'hidden',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--color-bg-secondary)',
                  height: 40,
                }}
              >
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setStartDate(e.target.value)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.currentTarget.showPicker();
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = 'inset 0 0 0 2px var(--color-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  max={dateRange.end}
                  style={{
                    padding: '0 12px',
                    fontSize: 'var(--font-size-sm)',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: 'var(--color-text-primary)',
                    outline: 'none',
                    cursor: 'pointer',
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    height: '100%',
                    borderRadius: 'var(--border-radius-md) 0 0 var(--border-radius-md)',
                    transition: 'box-shadow 0.2s ease',
                  }}
                />
                <span
                  style={{
                    padding: '0 12px',
                    color: 'var(--color-text-tertiary)',
                    fontWeight: 500,
                    borderLeft: '1px solid var(--border-color)',
                    borderRight: '1px solid var(--border-color)',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'var(--color-bg-tertiary)',
                    gap: 6,
                    fontSize: 'var(--font-size-sm)',
                    minWidth: 170,
                    maxWidth: 170,
                    boxSizing: 'border-box',
                    textAlign: 'center',
                  }}
                >
                  <span>{t('analytics.dateRangeFromLabel')}</span>
                  <span>→</span>
                  <span>{t('analytics.dateRangeToLabel')}</span>
                </span>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setEndDate(e.target.value)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.currentTarget.showPicker();
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = 'inset 0 0 0 2px var(--color-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  min={dateRange.start}
                  max={new Date().toISOString().split('T')[0]}
                  style={{
                    padding: '0 12px',
                    fontSize: 'var(--font-size-sm)',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: 'var(--color-text-primary)',
                    outline: 'none',
                    cursor: 'pointer',
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    height: '100%',
                    borderRadius: '0 var(--border-radius-md) var(--border-radius-md) 0',
                    transition: 'box-shadow 0.2s ease',
                  }}
                />
              </div>
            </div>

            <div
              style={{
                marginTop: 'var(--spacing-lg)',
                paddingTop: 'var(--spacing-md)',
                borderTop: '1px solid var(--border-color)',
              }}
            >
              <p
                style={{
                  margin: 0,
                  marginTop: 'var(--spacing-xs)',
                  marginBottom: 'var(--spacing-md)',
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.5,
                }}
              >
                {t('analytics.filtersHint')}
              </p>

              <div
                className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-start"
                style={{ gap: 'var(--spacing-lg)' }}
              >
                {/* Search */}
                <div
                  style={{
                    display: 'inline-flex',
                    borderRadius: 'var(--border-radius-md)',
                    overflow: 'hidden',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--color-bg-secondary)',
                    height: 40,
                    boxShadow: 'none',
                    transition: 'box-shadow 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = 'inset 0 0 0 2px var(--color-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <input
                    type="text"
                    value={domainSearchInput}
                    onChange={(e) => setDomainSearchInput(e.target.value)}
                    placeholder={t('analytics.domainSearchPlaceholder')}
                    style={{
                      height: '100%',
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: 'var(--color-text-primary)',
                      padding: '0 12px',
                      outline: 'none',
                      fontSize: 'var(--font-size-sm)',
                      flex: '0 0 260px',
                      maxWidth: 260,
                    }}
                  />
                </div>

                {/* Sort */}
                <div
                  style={{
                    display: 'inline-flex',
                    borderRadius: 'var(--border-radius-md)',
                    overflow: 'hidden',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--color-bg-secondary)',
                    height: 40,
                    position: 'relative',
                  }}
                >
                  <div
                    className="analytics-hover-outline analytics-hover-outline--sort"
                    aria-hidden
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      bottom: 0,
                      left: 130,
                      borderRadius: '0 var(--border-radius-md) var(--border-radius-md) 0',
                      boxShadow: 'inset 0 0 0 2px var(--color-primary)',
                      opacity: isSortHovered ? 1 : 0,
                      pointerEvents: 'none',
                      transition: 'opacity 0.2s ease',
                      zIndex: 2,
                    }}
                  />
                  <span
                    style={{
                      padding: '0 12px',
                      fontSize: 'var(--font-size-sm)',
                      color: 'var(--color-text-tertiary)',
                      whiteSpace: 'nowrap',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      fontWeight: 500,
                      minWidth: 130,
                      maxWidth: 130,
                      boxSizing: 'border-box',
                      textAlign: 'left',
                      backgroundColor: 'var(--color-bg-tertiary)',
                      borderRight: '1px solid var(--border-color)',
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    {t('analytics.sortByHelper')}
                  </span>
                  <div
                    style={{
                      position: 'relative',
                      display: 'inline-flex',
                      alignItems: 'stretch',
                      backgroundColor: 'var(--color-bg-secondary)',
                      height: '100%',
                      zIndex: 1,
                      width: 190,
                    }}
                    onMouseEnter={() => setIsSortHovered(true)}
                    onMouseLeave={() => setIsSortHovered(false)}
                    onMouseDown={() => {
                      if (sortSelectRef.current) {
                        sortSelectRef.current.focus();
                      }
                    }}
                  >
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as 'total_seconds' | 'domain' | 'category')}
                      ref={sortSelectRef}
                      style={{
                        height: '100%',
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: 'var(--color-text-primary)',
                        padding: '0 32px 0 12px',
                        outline: 'none',
                        fontSize: 'var(--font-size-sm)',
                        fontWeight: 500,
                        minWidth: 0,
                        cursor: 'pointer',
                        appearance: 'none',
                        flex: 1,
                        backgroundImage: isSortHovered
                          ? "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M6 9l6 6 6-6' fill='none' stroke='%2316a34a' stroke-width='2.7' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")"
                          : 'none',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 10px center',
                        backgroundSize: '20px 20px',
                      }}
                    >
                      <option value="total_seconds">{t('analytics.sortByTime')}</option>
                      <option value="domain">{t('analytics.sortByDomain')}</option>
                      <option value="category">{t('analytics.sortByCategory')}</option>
                    </select>
                  </div>
                </div>

                {/* Order */}
                <div
                  style={{
                    display: 'inline-flex',
                    borderRadius: 'var(--border-radius-md)',
                    overflow: 'hidden',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--color-bg-secondary)',
                    height: 40,
                    position: 'relative',
                  }}
                >
                  <div
                    className="analytics-hover-outline analytics-hover-outline--order"
                    aria-hidden
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      bottom: 0,
                      left: 90,
                      borderRadius: '0 var(--border-radius-md) var(--border-radius-md) 0',
                      boxShadow: 'inset 0 0 0 2px var(--color-primary)',
                      opacity: 0,
                      pointerEvents: 'none',
                      transition: 'opacity 0.2s ease',
                      zIndex: 2,
                    }}
                  />
                  <span
                    style={{
                      padding: '0 12px',
                      fontSize: 'var(--font-size-sm)',
                      fontWeight: 500,
                      color: 'var(--color-text-tertiary)',
                      whiteSpace: 'nowrap',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      minWidth: 90,
                      maxWidth: 90,
                      boxSizing: 'border-box',
                      textAlign: 'left',
                      backgroundColor: 'var(--color-bg-tertiary)',
                      borderRight: '1px solid var(--border-color)',
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    {t('analytics.sortOrderHelper')}
                  </span>
                  <button
                    type="button"
                    onClick={() => setOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
                    title={order === 'asc' ? t('analytics.sortOrderAsc') : t('analytics.sortOrderDesc')}
                    onMouseEnter={(e) => {
                      const root = e.currentTarget.parentElement;
                      const outline = root?.querySelector('.analytics-hover-outline--order') as HTMLElement | null;
                      if (outline) outline.style.opacity = '1';
                    }}
                    onMouseLeave={(e) => {
                      const root = e.currentTarget.parentElement;
                      const outline = root?.querySelector('.analytics-hover-outline--order') as HTMLElement | null;
                      if (outline) outline.style.opacity = '0';
                    }}
                    style={{
                      height: '100%',
                      padding: '0 8px',
                      border: 'none',
                      borderRadius: '0 var(--border-radius-md) var(--border-radius-md) 0',
                      backgroundColor: 'var(--color-bg-secondary)',
                      color: 'var(--color-text-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      cursor: 'pointer',
                      fontSize: 'var(--font-size-sm)',
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                      width: 190,
                      minWidth: 190,
                      maxWidth: 190,
                      flex: '0 0 190px',
                      boxSizing: 'border-box',
                      overflow: 'hidden',
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        width: '100%',
                        justifyContent: 'flex-start',
                        gap: 6,
                      }}
                    >
                      <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {order === 'asc' ? t('analytics.sortOrderAsc') : t('analytics.sortOrderDesc')}
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}>
                        {order === 'asc' ? (
                          <ArrowUp size={14} strokeWidth={2.4} style={{ color: 'var(--color-success)' }} />
                        ) : (
                          <ArrowDown size={14} strokeWidth={2.4} style={{ color: 'var(--color-success)' }} />
                        )}
                      </span>
                    </span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleSearch}
                  className="btn-base analytics-search-button"
                  style={{
                    padding: '0 16px',
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 700,
                    borderRadius: 'var(--border-radius-md)',
                    border: '1px solid transparent',
                    backgroundColor: isDark ? '#388E3C' : 'var(--color-primary)',
                    color: isDark ? '#e8f5e9' : 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                    height: 40,
                    minWidth: 140,
                    maxWidth: 140,
                    boxSizing: 'border-box',
                    opacity: isSearchHovered ? 0.95 : 1,
                    transition:
                      'opacity var(--transition-normal), background-color var(--transition-normal), border-color var(--transition-normal), box-shadow var(--transition-normal)',
                    boxShadow: isSearchHovered ? '0 0 0 2px rgba(76, 175, 80, 0.25)' : 'none',
                  }}
                  onMouseEnter={() => setIsSearchHovered(true)}
                  onMouseLeave={() => setIsSearchHovered(false)}
                >
                  <span className="analytics-search-button__icon" aria-hidden>
                    <Search size={16} strokeWidth={2.6} color="white" />
                  </span>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      lineHeight: '1.5',
                    }}
                  >
                    {t('analytics.search')}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </Card>

        <div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          style={{
            gap: 'var(--spacing-lg)',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.4s ease 100ms, transform 0.4s ease 100ms',
          }}
        >
          <StatsCard
            icon={Globe}
            label={t('analytics.totalDomains')}
            value={stats.totalDomains}
            variant="teal"
            loading={false}
          />
          <StatsCard
            icon={Activity}
            label={t('analytics.domainsTracked')}
            value={stats.domainsTracked}
            variant="sky"
            loading={false}
          />
          <StatsCard
            icon={Clock}
            label={t('analytics.activeTime')}
            value={stats.activeTime}
            variant="primary"
            loading={false}
          />
          <StatsCard
            icon={TrendingUp}
            label={t('analytics.avgTime')}
            value={stats.avgTime}
            variant="indigo"
            loading={false}
          />
        </div>

        {analyticsError && <ErrorMessage message={analyticsError} />}

        {(showLoading || showEmptyState) && (
          <Card
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 'var(--spacing-xl)',
              minHeight: 200,
            }}
          >
            <style>{`
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
              @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
            `}</style>
            
            {showLoading && (
              <Loader2 
                size={32} 
                style={{ 
                  color: 'var(--color-primary)',
                  animation: 'spin 1s linear infinite',
                }} 
              />
            )}
            
            {showEmptyState && (
              <p
                style={{
                  color: 'var(--color-text-secondary)',
                  fontSize: 'var(--font-size-md)',
                  textAlign: 'center',
                  margin: 0,
                  animation: 'fadeIn 0.3s ease',
                }}
              >
                {t('analytics.noData')}
              </p>
            )}
          </Card>
        )}

        {showContent && (
          <Card
            noPadding
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.4s ease 150ms, transform 0.4s ease 150ms',
            }}
          >
            <div style={{ padding: 'var(--spacing-lg)' }}>

              <div style={{
                marginBottom: 'var(--spacing-xl)',
              }}>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-sm)',
                    marginBottom: 'var(--spacing-xs)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 32,
                      height: 32,
                      borderRadius: 'var(--border-radius-md)',
                      backgroundColor: BLUE_COLOR.bg,
                      color: BLUE_COLOR.text,
                      flexShrink: 0,
                    }}
                  >
                    <PieChart size={16} />
                  </div>
                  <h2
                    style={{
                      margin: 0,
                      fontSize: 'var(--font-size-lg)',
                      fontWeight: 600,
                      color: 'var(--color-text-primary)',
                      flexShrink: 0,
                    }}
                  >
                    {t('analytics.chartTitle')}
                  </h2>
                  <div
                    style={{
                      flex: 1,
                      height: 2,
                      marginLeft: 'var(--spacing-md)',
                      background: `linear-gradient(90deg, ${BLUE_COLOR.text}, transparent)`,
                      borderRadius: 1,
                    }}
                  />
                </div>

                <p
                  style={{
                    margin: 0,
                    marginBottom: 'var(--spacing-md)',
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.5,
                  }}
                >
                  {t('analytics.chartDescription')}
                </p>
                
                {loading && data.length === 0 ? (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 320,
                    marginTop: 'var(--spacing-md)',
                  }}>
                    <LoadingSpinner size="md" />
                  </div>
                ) : data.length === 0 ? (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 'var(--spacing-sm)',
                    height: 320,
                    color: 'var(--color-text-tertiary)',
                    marginTop: 'var(--spacing-md)',
                  }}>
                    <PieChart size={32} strokeWidth={1.5} />
                    <p style={{ fontSize: 'var(--font-size-sm)', margin: 0 }}>
                      No data to display
                    </p>
                  </div>
                ) : (
                  <div style={{ marginTop: 'var(--spacing-md)' }}>
                    <DomainsUsageChart data={data} />
                  </div>
                )}
              </div>

              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-sm)',
                    marginBottom: 'var(--spacing-xs)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 32,
                      height: 32,
                      borderRadius: 'var(--border-radius-md)',
                      backgroundColor: INDIGO_COLOR.bg,
                      color: INDIGO_COLOR.text,
                      flexShrink: 0,
                    }}
                  >
                    <BarChart3 size={16} />
                  </div>
                  <h2
                    style={{
                      margin: 0,
                      fontSize: 'var(--font-size-lg)',
                      fontWeight: 600,
                      color: 'var(--color-text-primary)',
                      flexShrink: 0,
                    }}
                  >
                    {t('analytics.tableTitle')}
                  </h2>
                  <div
                    style={{
                      flex: 1,
                      height: 2,
                      marginLeft: 'var(--spacing-md)',
                      background: `linear-gradient(90deg, ${INDIGO_COLOR.text}, transparent)`,
                      borderRadius: 1,
                    }}
                  />
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                    gap: 'var(--spacing-md)',
                    marginBottom: 'var(--spacing-md)',
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: 'var(--font-size-sm)',
                      color: 'var(--color-text-secondary)',
                      lineHeight: 1.5,
                      flex: 1,
                    }}
                  >
                    {t('analytics.tableDescription')}
                  </p>
                  {data.length > 0 && (
                    <div
                      style={{
                        fontSize: 'var(--font-size-xs)',
                        color: 'var(--color-text-tertiary)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {t('analytics.domainsCount', {
                        shown: data.length,
                        total: pagination?.total_items ?? data.length,
                      })}
                    </div>
                  )}
                </div>
                
                <div>
                  <DomainsUsageTable 
                    data={data}
                    loading={loading}
                    loadingMore={loadingMore}
                    hasMore={hasMore}
                    onLoadMore={loadMore}
                  />
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
};
