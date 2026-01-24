import React from 'react';

interface PageHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  right?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, right }) => {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1
          className="font-bold tracking-tight"
          style={{
            color: 'var(--color-text-primary)',
            fontSize: 'clamp(22px, 2.4vw, 32px)',
            lineHeight: 1.15,
            margin: 0,
          }}
        >
          {title}
        </h1>
        {subtitle ? (
          <p
            className="mt-2"
            style={{
              color: 'var(--color-text-secondary)',
              fontSize: 'var(--font-size-sm)',
              lineHeight: 1.5,
              marginBottom: 0,
            }}
          >
            {subtitle}
          </p>
        ) : null}
      </div>

      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
};

