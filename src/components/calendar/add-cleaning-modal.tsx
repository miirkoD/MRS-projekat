'use client';

import { addHours, format, parse } from 'date-fns';

type Props = {
  selectedDay: Date;
  startTime: string;
  isSubmitting: boolean;
  onStartTimeChange: (time: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
};

const slots = ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00'];

export default function AddCleaningModal({
  selectedDay,
  startTime,
  isSubmitting,
  onStartTimeChange,
  onCancel,
  onSubmit,
}: Props) {
  const [hours, minutes] = startTime.split(':');
  const endHour = (parseInt(hours) + 2) % 24;
  const endTime = `${endHour.toString().padStart(2, '0')}:${minutes}`;

  return (
    <div className='fixed inset-0 bg-gray-200 bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm'>
      <div className='bg-white rounded-2xl shadow-xl w-full max-w-md flex flex-col max-h-[90vh] animate-in fade-in zoom-in border border-gray-100'>
        <div className='overflow-y-auto flex-1 p-8'>
          <div className='mb-6'>
            <h3 className='text-2xl font-bold text-gray-900'>
              Zakazivanje čišćenja
            </h3>
            <p className='text-gray-500 mt-2'>
              {format(selectedDay, 'EEEE, MMMM dd, yyyy')}
            </p>
          </div>

          <div className='mb-6'>
            <label className='block text-sm font-semibold text-gray-700 mb-3'>
              Odaberite termin čišćenja
            </label>
            <div className='grid grid-cols-2 gap-3'>
              {slots.map((slot) => {
                const slotStart = parse(slot, 'HH:mm', new Date());
                const slotEnd = addHours(slotStart, 2);
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => onStartTimeChange(slot)}
                    className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                      startTime == slot
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-300'
                    }`}
                  >
                    {slot}-{format(slotEnd, 'HH:mm')}
                  </button>
                );
              })}
            </div>

            {startTime && (
              <p className='text-sm text-gray-600 mt-3'>
                Izabrali ste termin od{' '}
                <span className='font-semibold'>{startTime}</span>
                od <span className='font-semibold'>{endTime}</span>
              </p>
            )}
          </div>
        </div>

        <div className='flex gap-3 p-8 pt-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl'>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className='flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium disabled:opacity-50'
          >
            Otkaži
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className='flex-1 px-4 py-3 text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap shadow-sm'
          >
            {isSubmitting ? (
              <>
                <span className='inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></span>
                Booking...
              </>
            ) : (
              'Book Cleaning'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
