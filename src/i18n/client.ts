'use client';

import { useParams } from 'next/navigation';
import { useLocale } from 'next-intl';

export function useTranslation() {
  const locale = useLocale();
  const params = useParams();
  
  return {
    locale,
    params
  };
} 