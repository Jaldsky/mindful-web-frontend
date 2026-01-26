import React, { useMemo } from 'react';
import { Layout } from '../../components/layout';
import { useAnalytics, useDateRange, useTranslation } from '../../hooks';
import { DateRangeSelector, StatsCard, DomainsChart, DomainsTable } from '../../components/analytics';
import { LoadingSpinner, ErrorMessage, EmptyState, PageHeader, Card } from '../../components/ui';
import { Clock, Globe, MousePointer2 } from 'lucide-react';
import { formatTime } from '../../utils';
import { DATE_RANGES } from '../../constants';

export const Analytics: React.FC = () => {
  const { t } = useTranslation();
  const { dateRange, setStartDate, setEndDate, selectQuickRange } = useDateRange(DATE_RANGES.DAYS_7);
  
  const { data, loading, error } = useAnalytics({
    from: dateRange.start,
    to: dateRange.end,
    page: 1,
  });

  const chartData = useMemo(() => data?.data || [], [data?.data]);
  
  const stats = useMemo(() => {
    const totalSeconds = chartData.reduce((acc, item) => acc + item.total_seconds, 0);
    return {
      totalDomains: data?.pagination.total_items || 0,
      activeTime: formatTime(totalSeconds),
      domainsTracked: chartData.length,
    };
  }, [chartData, data?.pagination.total_items]);

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner size="lg" className="h-64" />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <PageHeader
          title={t('navigation.analytics')}
          subtitle={t('home.subtitle')}
          right={
            <div className="w-full sm:w-auto">
              <Card className="p-3" noPadding>
                <DateRangeSelector
                  dateRange={dateRange}
                  onStartDateChange={setStartDate}
                  onEndDateChange={setEndDate}
                  onQuickSelect={selectQuickRange}
                />
              </Card>
            </div>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard
            icon={Globe}
            label={t('analytics.totalDomains')}
            value={stats.totalDomains}
            variant="primary"
          />
          <StatsCard
            icon={Clock}
            label={t('analytics.activeTime')}
            value={stats.activeTime}
            variant="success"
          />
          <StatsCard
            icon={MousePointer2}
            label={t('analytics.domainsTracked')}
            value={stats.domainsTracked}
            variant="secondary"
          />
        </div>

        {error && <ErrorMessage message={error} />}

        {!error && !loading && chartData.length === 0 && (
          <Card>
            <EmptyState message={t('analytics.noData')} />
          </Card>
        )}

        {chartData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DomainsChart data={chartData} />
            <DomainsTable data={chartData} />
          </div>
        )}
      </div>
    </Layout>
  );
};
