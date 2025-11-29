import React, { useMemo } from 'react';
import { Layout } from '../components/Layout';
import { useAnalytics } from '../hooks/useAnalytics';
import { useDateRange } from '../hooks/useDateRange';
import { DateRangeSelector } from '../components/DateRangeSelector';
import { StatsCard } from '../components/StatsCard';
import { DomainsChart } from '../components/DomainsChart';
import { DomainsTable } from '../components/DomainsTable';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { EmptyState } from '../components/EmptyState';
import { Clock, Globe, MousePointer2 } from 'lucide-react';
import { formatTime } from '../utils/dateUtils';
import { DATE_RANGES } from '../constants';

export const Dashboard: React.FC = () => {
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
            label="Total Domains"
            value={stats.totalDomains}
            iconBgColor="bg-blue-100 dark:bg-blue-900/20"
            iconColor="text-blue-600"
          />
          <StatsCard
            icon={Clock}
            label="Active Time"
            value={stats.activeTime}
            iconBgColor="bg-green-100 dark:bg-green-900/20"
            iconColor="text-green-600"
          />
          <StatsCard
            icon={MousePointer2}
            label="Total Domains Tracked"
            value={stats.domainsTracked}
            iconBgColor="bg-purple-100 dark:bg-purple-900/20"
            iconColor="text-purple-600"
          />
        </div>

        {error && <ErrorMessage message={error} />}

        {!error && !loading && chartData.length === 0 && (
          <EmptyState message="No data available for the selected period. Try selecting a different date range." />
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
