import { useEffect } from 'react';

export function useScrollLock(isLocked: boolean) {
  useEffect(() => {
    document.body.style.overflow = isLocked ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isLocked]);
}
