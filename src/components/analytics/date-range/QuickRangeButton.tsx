/**
 * Quick Range Button Component
 * Button for quick date range selection
 */

import React from 'react';
import { Button } from '../../ui';

interface QuickRangeButtonProps {
  label: string;
  onClick: () => void;
}

export const QuickRangeButton: React.FC<QuickRangeButtonProps> = ({
  label,
  onClick,
}) => {
  return (
    <Button variant="outline" size="sm" onClick={onClick}>
      {label}
    </Button>
  );
};
