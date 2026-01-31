'use client';

import { format, parseISO } from 'date-fns';
import Image from 'next/image';
import { useState } from 'react';

type CleaningDate = {
  _key?: string;
  name?: string;
  imageUrl?: string;
  startDatetime?: string;
  endDatetime?: string;
  userId?: string;
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
  onEdit?: (cd: CleaningDate) => void;
};

type User = {
  _key?: string;
  role?: string;
  firstName?: string;
  lastName?: string;
};

export default function CleaningSchedule({ selectedDay, cleaningDates, onCancel, onEdit }: Props) {
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
          const startDateTime = cd.startDatetime ? parseISO(cd.startDatetime) : null;
          const endDateTime = cd.endDatetime ? parseISO(cd.endDatetime) : null;
          const id = cd._key;

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
                    <time dateTime={cd.startDatetime || ''}>{startDateTime ? format(startDateTime, 'HH:mm') : ''}</time> {' '}
                    -{' '}
                    <time dateTime={cd.endDatetime || ''}>{endDateTime ? format(endDateTime, 'HH:mm') : ''}</time>
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
              {user.role === 'cleaner' && cd.cleanerId === user._key && id && (
                <button
                  onClick={() => onCancel && id && onCancel(id)}
                  className="px-3 py-1 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition"
                >
                  Otkaži
                </button>
              )}

              {user._key && cd.userId === user._key && id && (
                <button
                  onClick={() => onEdit && onEdit(cd)}
                  className="px-3 py-1 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition ml-2"
                >
                  Izmeni
                </button>
              )}
            </div>
            </div>
          );
        })
      ) : (
        <p className="text-gray-400 text-center">Trenutno nema čišćenja za ovaj dan.</p>
      )}
    </div>
  );
}