import { Dispatch, SetStateAction, useCallback, useReducer, useRef } from 'react';
import { AUTH_VALIDATION } from '../../components/auth/constants';
import { isApiError, extractErrorMessage } from '../../utils';

interface UseEmailVerificationParams {
  verifyEmail: (email: string, code: string) => Promise<void>;
  resendCode: (email: string) => Promise<void>;
  reloadProfile: () => Promise<void>;
  setEmail: Dispatch<SetStateAction<string | null>>;
  t: (key: string, params?: Record<string, string | number>) => string;
}

export const useEmailVerification = ({
  verifyEmail,
  resendCode,
  reloadProfile,
  setEmail,
  t,
}: UseEmailVerificationParams) => {
  type VerificationState = {
    isOpen: boolean;
    code: string;
    error: string;
    info: string;
    infoTone: 'success' | 'error';
    isVerifying: boolean;
    isResending: boolean;
    isSuccess: boolean;
  };

  type VerificationAction =
    | { type: 'OPEN'; info: string }
    | { type: 'CLOSE' }
    | { type: 'SET_CODE'; code: string }
    | { type: 'VERIFY_START' }
    | { type: 'VERIFY_SUCCESS'; info: string }
    | { type: 'VERIFY_ERROR'; error: string }
    | { type: 'RESEND_START' }
    | { type: 'RESEND_SUCCESS'; info: string }
    | { type: 'RESEND_TOO_MANY'; info: string }
    | { type: 'RESEND_ERROR'; error: string };

  const initialState: VerificationState = {
    isOpen: false,
    code: '',
    error: '',
    info: '',
    infoTone: 'success',
    isVerifying: false,
    isResending: false,
    isSuccess: false,
  };

  const reducer = (state: VerificationState, action: VerificationAction): VerificationState => {
    switch (action.type) {
      case 'OPEN':
        return {
          ...state,
          isOpen: true,
          code: '',
          error: '',
          info: action.info,
          infoTone: 'success',
          isSuccess: false,
        };
      case 'CLOSE':
        return { ...initialState };
      case 'SET_CODE':
        return { ...state, code: action.code };
      case 'VERIFY_START':
        return { ...state, isVerifying: true, error: '', info: '', infoTone: 'success' };
      case 'VERIFY_SUCCESS':
        return {
          ...state,
          isVerifying: false,
          isSuccess: true,
          info: action.info,
          infoTone: 'success',
        };
      case 'VERIFY_ERROR':
        return { ...state, isVerifying: false, error: action.error };
      case 'RESEND_START':
        return { ...state, isResending: true, error: '', info: '', infoTone: 'success' };
      case 'RESEND_SUCCESS':
        return { ...state, isResending: false, info: action.info, infoTone: 'success' };
      case 'RESEND_TOO_MANY':
        return { ...state, isResending: false, error: '', info: action.info, infoTone: 'error' };
      case 'RESEND_ERROR':
        return { ...state, isResending: false, error: action.error };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const pendingEmailRef = useRef<string | null>(null);

  const openVerification = useCallback(
    (pendingEmail: string, infoMessage: string) => {
      pendingEmailRef.current = pendingEmail;
      dispatch({ type: 'OPEN', info: infoMessage });
    },
    []
  );

  const handleCloseVerification = useCallback(() => {
    dispatch({ type: 'CLOSE' });
  }, []);

  const handleVerifyEmail = useCallback(async () => {
    const pendingEmail = pendingEmailRef.current;
    if (!pendingEmail) return;
    if (!state.code) {
      dispatch({ type: 'VERIFY_ERROR', error: t('auth.errors.codeRequired') });
      return;
    }
    if (state.code.length < AUTH_VALIDATION.CODE_LENGTH) {
      dispatch({ type: 'VERIFY_ERROR', error: t('auth.errors.codeTooShort') });
      return;
    }

    dispatch({ type: 'VERIFY_START' });

    try {
      await verifyEmail(pendingEmail, state.code);
      await reloadProfile();
      setEmail(pendingEmail);
      dispatch({ type: 'VERIFY_SUCCESS', info: t('profile.verifyEmailSuccess') });

      setTimeout(() => {
        handleCloseVerification();
      }, 900);
    } catch (error: unknown) {
      if (isApiError(error)) {
        const details = error.details as { code?: string; message?: string } | undefined;
        if (
          details?.code === 'VERIFICATION_CODE_INVALID' ||
          details?.code === 'INVALID_VERIFICATION_CODE' ||
          details?.message === 'Verification code is invalid'
        ) {
          dispatch({ type: 'VERIFY_ERROR', error: t('auth.errors.codeInvalid') });
        } else {
          dispatch({ type: 'VERIFY_ERROR', error: error.message || details?.message || t('auth.genericError') });
        }
        return;
      }
      dispatch({ type: 'VERIFY_ERROR', error: extractErrorMessage(error) || t('auth.genericError') });
    }
  }, [
    state.code,
    verifyEmail,
    reloadProfile,
    setEmail,
    t,
    handleCloseVerification,
  ]);

  const handleResendCode = useCallback(async () => {
    const pendingEmail = pendingEmailRef.current;
    if (!pendingEmail) return;
    dispatch({ type: 'RESEND_START' });

    try {
      await resendCode(pendingEmail);
      dispatch({ type: 'RESEND_SUCCESS', info: t('auth.resendSuccess') });
    } catch (error: unknown) {
      if (isApiError(error)) {
        const details = error.details as { code?: string; message?: string } | undefined;
        if (details?.code === 'TOO_MANY_ATTEMPTS') {
          dispatch({
            type: 'RESEND_TOO_MANY',
            info: details.message || error.message || t('profile.verifyEmailTooOften'),
          });
          return;
        }
        dispatch({ type: 'RESEND_ERROR', error: error.message || details?.message || t('auth.genericError') });
        return;
      }
      dispatch({ type: 'RESEND_ERROR', error: extractErrorMessage(error) || t('auth.genericError') });
    }
  }, [resendCode, t]);

  return {
    isVerificationOpen: state.isOpen,
    verificationCode: state.code,
    setVerificationCode: (code: string) => dispatch({ type: 'SET_CODE', code }),
    verificationError: state.error,
    verificationInfo: state.info,
    verificationInfoTone: state.infoTone,
    verificationSuccess: state.isSuccess,
    isVerifying: state.isVerifying,
    isResending: state.isResending,
    openVerification,
    handleVerifyEmail,
    handleResendCode,
    handleCloseVerification,
  };
};
