import { useEffect, useState } from 'react';

export const useProfileErrorState = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isErrorVisible, setIsErrorVisible] = useState(false);

  useEffect(() => {
    if (serverError) {
      setIsErrorVisible(true);
    } else {
      setIsErrorVisible(false);
    }
  }, [serverError]);

  const hideError = () => {
    setIsErrorVisible(false);
    setTimeout(() => setServerError(null), 300);
  };

  return { serverError, isErrorVisible, setServerError, hideError };
};
