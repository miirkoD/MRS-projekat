'use client';

import { format } from 'date-fns';

type AddCleaningModalProps = {
  selectedDay: Date;
  startTime: string;
  isSubmitting: boolean;
  onStartTimeChange: (time: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
  editing?: boolean;
};

const slots = ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00'];

export default function AddCleaningModal({
  selectedDay,
  startTime,
  isSubmitting,
  onStartTimeChange,
  onCancel,
  onSubmit,
  editing = false,
}: AddCleaningModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-xl shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          {editing ? 'Izmeni termin' : 'Dodaj termin čišćenja'}
        </h2>

        <p className="mb-4 text-gray-600">
          Datum: <span className="font-medium">{format(selectedDay, 'dd.MM.yyyy')}</span>
        </p>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {slots.map((slot) => (
            <button
              key={slot}
              type="button"
              onClick={() => onStartTimeChange(slot)}
              className={`px-3 py-2 rounded-lg border transition-all
                ${
                  startTime === slot
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300'
                }`}
            >
              {slot}
            </button>
          ))}
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
          >
            Otkaži
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting || !startTime}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
          >
            {editing ? 'Sačuvaj izmene' : 'Dodaj'}
          </button>
        </div>
      </div>
    </div>
  );
}