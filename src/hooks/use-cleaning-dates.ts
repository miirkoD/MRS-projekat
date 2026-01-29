'use client';

import { useState, useEffect } from 'react';

export type CleaningDate = {
  id?: string;
  _key?: string;
  name?: string;
  imageUrl?: string;
  startDatetime?: string;
  endDatetime?: string;
  user?: {
    firstName?: string;
    lastName?: string;
  };
};

export function useCleaningDates(cleanerId: string, refreshKey: number) {
  const [cleaningDates, setCleaningDates] = useState<CleaningDate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCleaningDates = async () => {
      try {
        setLoading(true);
        const url = cleanerId
          ? `/api/cleaning?cleaner=${cleanerId}`
          : '/api/cleaning';

        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setCleaningDates(data);
        } else {
          console.error('Failed to fetch cleaning dates, status:', response.status);
        }
      } catch (error) {
        console.error('Failed to fetch cleaning dates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCleaningDates();
  }, [refreshKey, cleanerId]);

  return { cleaningDates, loading };
}