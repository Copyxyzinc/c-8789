import { useEffect, useCallback } from 'react';
import { useDebounce } from './useDebounce';

interface UseAutoSaveProps {
  data: string;
  key: string;
  delay?: number;
}

export function useAutoSave({ data, key, delay = 1000 }: UseAutoSaveProps) {
  const debouncedData = useDebounce(data, delay);

  useEffect(() => {
    if (debouncedData) {
      localStorage.setItem(`draft_${key}`, debouncedData);
    }
  }, [debouncedData, key]);

  const clearDraft = useCallback(() => {
    localStorage.removeItem(`draft_${key}`);
  }, [key]);

  const getDraft = useCallback(() => {
    return localStorage.getItem(`draft_${key}`) || '';
  }, [key]);

  return { clearDraft, getDraft };
}