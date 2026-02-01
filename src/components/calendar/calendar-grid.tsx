'use client';

import {
  format,
  getDay,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  parseISO,
} from 'date-fns';

const colStartClasses = [
  'col-start-1',
  'col-start-2',
  'col-start-3',
  'col-start-4',
  'col-start-5',
  'col-start-6',
  'col-start-7',
];

function classNames(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(' ');
}

type Props = {
  days: Date[];
  selectedDay: Date | null;
  currentMonth: Date;
  cleaningDates: { startDatetime?: string }[];
  onSelectDay: (day: Date) => void;
  subscriptionStart: Date;
  subscriptionEnd: Date;
};

export default function CalendarGrid({
  days,
  selectedDay,
  currentMonth,
  cleaningDates,
  onSelectDay,
  subscriptionStart,
  subscriptionEnd,
}: Props) {
  return (
    <div className="grid grid-cols-7 mt-2 text-sm">
      {days.map((day, dayIdx) => {
        const isDisabled = day < subscriptionStart || day > subscriptionEnd;
        const isSelected = selectedDay && isEqual(day, selectedDay);

        return (
          <div
            key={day.toString()}
            className={classNames(
              dayIdx === 0 && colStartClasses[(getDay(day) + 6) % 7],
              'py-1.5',
            )}
          >
            <button
              type="button"
              onClick={() => !isDisabled && onSelectDay(day)}
              disabled={isDisabled}
              className={classNames(
                isSelected && 'bg-blue-600 text-white',
                !isSelected && isToday(day) && 'text-green-700',
                !isSelected &&
                  !isToday(day) &&
                  isSameMonth(day, currentMonth) &&
                  'text-gray-900',
                !isSelected &&
                  !isToday(day) &&
                  !isSameMonth(day, currentMonth) &&
                  'text-gray-400',
                isSelected && isToday(day) && 'bg-green-300',
                isSelected && !isToday(day) && 'bg-gray-900 text-white',
                !isSelected && !isDisabled && 'hover:bg-gray-200',
                isSelected && 'font-semibold',
                isDisabled && 'text-gray-300 cursor-not-allowed',
                'mx-auto flex h-8 w-8 items-center justify-center rounded-full',
              )}
            >
              <time dateTime={format(day, 'yyyy-MM-dd')}>
                {format(day, 'd')}
              </time>
            </button>
            <div className="flex justify-center mt-1">
              {cleaningDates.some(
                (cleaningDate) =>
                  cleaningDate.startDatetime &&
                  isSameDay(parseISO(cleaningDate.startDatetime), day),
              ) && <div className="w-2 h-2 rounded-full bg-blue-500"></div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
