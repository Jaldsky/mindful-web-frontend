import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Layout } from '../../components/layout';
import { useAnalytics, useDateRange, useTranslation, useHomeEntranceAnimation } from '../../hooks';
import { StatsCard, DomainsUsageChart, DomainsUsageTable } from '../../components/analytics';
import { ErrorMessage, Card, LoadingSpinner } from '../../components/ui';
import { Clock, Globe, Activity, TrendingUp, Calendar, Search, Loader2, PieChart, BarChart3 } from 'lucide-react';
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

  const [committedRange, setCommittedRange] = useState({ start: dateRange.start, end: dateRange.end });
  
  
  const { data, pagination, loading, loadingMore, hasMore, error, loadMore } = useAnalytics({
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
  };

  const stats = useMemo(() => {
    const totalSeconds = data.reduce((acc, item) => acc + item.total_seconds, 0);
    const avgSecondsPerDomain = data.length > 0 ? Math.round(totalSeconds / data.length) : 0;
    return {
      totalDomains: pagination?.total_items || 0,
      activeTime: formatTime(totalSeconds),
      domainsTracked: data.length,
      avgTime: formatTime(avgSecondsPerDomain),
    };
  }, [data, pagination?.total_items]);

  const [minLoadingComplete, setMinLoadingComplete] = useState(true);
  const loadingStartedRef = useRef(false);

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
                marginBottom: 'var(--spacing-md)',
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.5,
              }}
            >
              {t('analytics.periodDescription')}
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
                    padding: '0 8px',
                    color: 'var(--color-text-tertiary)', 
                    fontWeight: 500,
                    borderLeft: '1px solid var(--border-color)',
                    borderRight: '1px solid var(--border-color)',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'var(--color-bg-tertiary)',
                  }}
                >
                  →
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
                    borderRadius: 0,
                    transition: 'box-shadow 0.2s ease',
                  }}
                />
                <button
                  onClick={handleSearch}
                  style={{
                    padding: 0,
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 500,
                    border: 'none',
                    borderLeft: '1px solid var(--border-color)',
                    borderRadius: '0 var(--border-radius-md) var(--border-radius-md) 0',
                    backgroundColor: isDark ? '#388E3C' : 'var(--color-primary)',
                    color: isDark ? '#e8f5e9' : 'white',
                    cursor: 'pointer',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    whiteSpace: 'nowrap',
                    width: 100,
                    height: '100%',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: isDark ? '#388E3C' : 'var(--color-primary)',
                    opacity: isSearchHovered ? 0.95 : 1,
                    transition: 'opacity var(--transition-normal), background-color var(--transition-normal), border-color var(--transition-normal)',
                  }}
                  onMouseEnter={() => setIsSearchHovered(true)}
                  onMouseLeave={() => setIsSearchHovered(false)}
                >
                  <span style={{ 
                    display: 'block',
                    textAlign: 'center',
                    width: '100%',
                    lineHeight: '1.5',
                    transform: isSearchHovered ? 'translateX(8px)' : 'translateX(0)',
                    transition: 'transform var(--transition-normal)',
                  }}>
                    {t('analytics.search')}
                  </span>

                  <span
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      left: '10px',
                      top: '50%',
                      transform: isSearchHovered ? 'translate(0, -50%)' : 'translate(-6px, -50%)',
                      opacity: isSearchHovered ? 1 : 0,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'opacity var(--transition-normal), transform var(--transition-normal)',
                      pointerEvents: 'none',
                    }}
                  >
                    <Search size={16} />
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
            value={loading ? '—' : stats.totalDomains}
            variant="teal"
            loading={loading}
          />
          <StatsCard
            icon={Activity}
            label={t('analytics.domainsTracked')}
            value={loading ? '—' : stats.domainsTracked}
            variant="sky"
            loading={loading}
          />
          <StatsCard
            icon={Clock}
            label={t('analytics.activeTime')}
            value={loading ? '—' : stats.activeTime}
            variant="primary"
            loading={loading}
          />
          <StatsCard
            icon={TrendingUp}
            label={t('analytics.avgTime')}
            value={loading ? '—' : stats.avgTime}
            variant="indigo"
            loading={loading}
          />
        </div>

        {error && <ErrorMessage message={error} />}

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
