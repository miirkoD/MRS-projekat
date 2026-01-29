'use client';

import { format } from 'date-fns';

type Props = {
  selectedDay: Date;
  startTime: string;
  isSubmitting: boolean;
  onStartTimeChange: (time: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
};

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
    <div className="fixed inset-0 bg-gray-200 bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md flex flex-col max-h-[90vh] animate-in fade-in zoom-in border border-gray-100">
        
        <div className="overflow-y-auto flex-1 p-8">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Zakazivanje čišćenja</h3>
            <p className="text-gray-500 mt-2">
              {format(selectedDay, 'EEEE, MMMM dd, yyyy')}
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Odaberite vreme početka čišćenja
            </label>
            <div className="flex gap-2 items-center">
              <div className="flex-1">
                <label className="block text-xs text-gray-600 mb-1">Sat</label>
                <input
                  type="number"
                  min="8"
                  max="19"
                  value={hours}
                  onChange={(e) => {
                    const hour = e.target.value.padStart(2, '0');
                    onStartTimeChange(`${hour}:${minutes}`);
                  }}
                  className="w-full px-3 py-3 text-lg text-center text-gray-900 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                />
              </div>

              <div className="flex items-center text-2xl text-gray-400 mt-5">:</div>

              <div className="flex-1">
                <label className="block text-xs text-gray-600 mb-1">Minut</label>
                <select
                  value={minutes}
                  onChange={(e) => {
                    const mins = e.target.value;
                    onStartTimeChange(`${hours}:${mins}`);
                  }}
                  className="w-full px-3 py-3 text-lg text-center text-gray-900 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                >
                  <option value="00">00</option>
                  <option value="30">30</option>
                </select>
              </div>
            </div>

            <p className="text-sm text-gray-600 mt-3">
              <span className="font-semibold">Početak:</span> {startTime}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Trajanje čišćenja: 2 sata (završava u{' '}
              <span className="font-semibold text-gray-700">{endTime}</span>)
            </p>
          </div>
        </div>

        <div className="flex gap-3 p-8 pt-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
          >
            Otkaži
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="flex-1 px-4 py-3 text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap shadow-sm"
          >
            {isSubmitting ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
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