'use client';

import { format, parseISO } from 'date-fns';
import Image from 'next/image';
import { useEffect, useState } from 'react';

type CleaningDate = {
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
  cleanerId?: string;
};

type Props = {
  selectedDay: Date | null;
  cleaningDates: CleaningDate[];
  onCancel?: (id: string) => void;
};

type User = {
  _key?: string;
  role?: string;
  firstName?: string;
  lastName?: string;
};

export default function CleaningSchedule({ selectedDay, cleaningDates, onCancel }: Props) {
  const [user]= useState<User>(()=>{
    if(typeof window !== 'undefined'){
      try{
        return JSON.parse(localStorage.getItem('user') || '{}');
      }catch{
        return {};
      }
  }
    return {};
  });

  const selectedDayCleaningDates = selectedDay
    ? cleaningDates.filter(
        (cd) =>
          cd.startDatetime &&
          parseISO(cd.startDatetime).toDateString() === selectedDay.toDateString()
      )
    : [];

  return (
    <div className="mt-6 space-y-4">
      {selectedDayCleaningDates.length > 0 ? (
        selectedDayCleaningDates.map((cd) => {
          const startDt = cd.startDatetime;
          const endDt = cd.endDatetime;
          const startDateTime = startDt ? parseISO(startDt) : new Date();
          const endDateTime = endDt ? parseISO(endDt) : new Date();
          const id = cd.id || cd._key;

          return (
            <div
              key={id}
              className="flex items-center justify-between p-4 rounded-xl shadow-sm border border-gray-200 bg-white hover:shadow-md transition"
            >
              <div className="flex items-center gap-4">
                {cd.imageUrl && (
                  <Image
                    src={cd.imageUrl}
                    alt={cd.name || 'Cleaning'}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="text-gray-900 font-semibold">
                    {cd.user?.firstName} {cd.user?.lastName}
                  </p>
                  <p className="text-gray-600 text-sm">
                    <time dateTime={startDt}>{format(startDateTime, 'HH:mm')}</time> –{' '}
                    <time dateTime={endDt}>{format(endDateTime, 'HH:mm')}</time>
                  </p>
                </div>
              </div>

              {user.role === 'cleaner' && cd.cleanerId === user._key && (
                <button
                  onClick={() => onCancel && id && onCancel(id)}
                  className="px-3 py-1 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition"
                >
                  Otkaži
                </button>
              )}
            </div>
          );
        })
      ) : (
        <p className="text-gray-400 text-center">Trenutno nema čišćenja za ovaj dan.</p>
      )}
    </div>
  );
}