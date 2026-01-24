import React from 'react';
import { BaseMessage } from './BaseMessage';
import type { MessageProps } from '../types';

export const InfoMessage: React.FC<MessageProps> = ({ message, className }) => {
  return <BaseMessage message={message} variant="info" className={className} />;
};
