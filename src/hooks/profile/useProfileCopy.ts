import { useState } from 'react';

interface UseProfileCopyParams {
  userId: string | null;
}

export const useProfileCopy = ({ userId }: UseProfileCopyParams) => {
  const [copiedUserId, setCopiedUserId] = useState(false);

  const handleCopyUserId = async () => {
    if (!userId) return;
    try {
      await navigator.clipboard.writeText(userId);
      setCopiedUserId(true);
      setTimeout(() => setCopiedUserId(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return { copiedUserId, handleCopyUserId };
};
