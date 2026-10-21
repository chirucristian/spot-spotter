import { useCallback, useEffect, useRef, useState } from 'react';

export function useToast(autoDismissMs = 3200) {
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  const showToast = useCallback(
    (msg: string) => {
      setToastMsg(msg);
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
      timerRef.current = window.setTimeout(() => {
        setToastMsg(null);
      }, autoDismissMs);
    },
    [autoDismissMs]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  return { toastMsg, showToast };
}
