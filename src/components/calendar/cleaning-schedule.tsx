'use client';

import { format, parseISO } from 'date-fns';
import Image from 'next/image';

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
};

type Props = {
  selectedDay: Date | null;
  cleaningDates: CleaningDate[];
};

export default function CleaningSchedule({ selectedDay, cleaningDates }: Props) {
  const selectedDayCleaningDates = selectedDay
    ? cleaningDates.filter((cd) =>
        cd.startDatetime && parseISO(cd.startDatetime).toDateString() === selectedDay.toDateString()
      )
    : [];

  return (
    <ol className="mt-4 space-y-1 text-sm leading-6 text-gray-500">
      {selectedDayCleaningDates.length > 0 ? (
        selectedDayCleaningDates.map((cd) => {
          const startDt = cd.startDatetime;
          const endDt = cd.endDatetime;
          const startDateTime = startDt ? parseISO(startDt) : new Date();
          const endDateTime = endDt ? parseISO(endDt) : new Date();
          const id = cd.id || cd._key;

          return (
            <li
              key={id}
              className="flex items-center px-4 py-2 space-x-4 group rounded-xl focus-within:bg-gray-100 hover:bg-gray-100 bg-blue-50"
            >
              {cd.imageUrl && (
                <Image
                  src={cd.imageUrl}
                  alt={cd.name || 'Cleaning'}
                  className="flex-none w-10 h-10 rounded-full"
                />
              )}
              <div className="flex-auto">
                <p className="text-gray-900 font-medium">
                  {cd.user?.firstName} {cd.user?.lastName}
                </p>
                <p className="mt-0.5 text-gray-600">
                  <time dateTime={startDt}>{format(startDateTime, 'HH:mm')}</time> -{' '}
                  <time dateTime={endDt}>{format(endDateTime, 'HH:mm')}</time>
                </p>
              </div>
            </li>
          );
        })
      ) : (
        <p className="text-gray-400">Trenutno nema čišćenja za ovaj dan.</p>
      )}
    </ol>
  );
}