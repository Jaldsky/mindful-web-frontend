import React, { useMemo } from 'react';
import { Layout } from '../../components/layout';
import { useAnalytics, useDateRange, useTranslation } from '../../hooks';
import { DateRangeSelector, StatsCard, DomainsChart, DomainsTable } from '../../components/analytics';
import { LoadingSpinner, ErrorMessage, EmptyState } from '../../components/ui';
import { Clock, Globe, MousePointer2 } from 'lucide-react';
import { formatTime } from '../../utils/dateUtils';
import { DATE_RANGES } from '../../constants';

export const Dashboard: React.FC = () => {
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
        <DateRangeSelector
          dateRange={dateRange}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onQuickSelect={selectQuickRange}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard
            icon={Globe}
            label={t('dashboard.totalDomains')}
            value={stats.totalDomains}
            variant="primary"
          />
          <StatsCard
            icon={Clock}
            label={t('dashboard.activeTime')}
            value={stats.activeTime}
            variant="success"
          />
          <StatsCard
            icon={MousePointer2}
            label={t('dashboard.domainsTracked')}
            value={stats.domainsTracked}
            variant="secondary"
          />
        </div>

        {error && <ErrorMessage message={error} />}

        {!error && !loading && chartData.length === 0 && (
          <EmptyState message={t('dashboard.noData')} />
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
