'use client';

import { format } from 'date-fns';
import ChevronLeftIcon from '@/components/icons/chevron-left-icon';
import ChevronRightIcon from '@/components/icons/chevron-right-icon';

type Props = {
  currentMonth: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
};

export default function CalendarHeader({
  currentMonth,
  onPreviousMonth,
  onNextMonth,
}: Props) {
  return (
    <div className="flex items-center">
      <h2 className="flex-auto font-semibold text-gray-900">
        {format(currentMonth, 'MMMM yyyy')}
      </h2>
      <button
        type="button"
        onClick={onPreviousMonth}
        className="p-1.5 text-gray-400 hover:text-gray-500"
      >
        <span className="sr-only">Previous month</span>
        <ChevronLeftIcon className="w-5 h-5" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={onNextMonth}
        className="ml-2 p-1.5 text-gray-400 hover:text-gray-500"
      >
        <span className="sr-only">Next month</span>
        <ChevronRightIcon className="w-5 h-5" aria-hidden="true" />
      </button>
    </div>
  );
}