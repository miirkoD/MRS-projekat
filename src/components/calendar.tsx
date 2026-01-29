'use client';

import { useState, useEffect } from 'react';
import { add, eachDayOfInterval, endOfMonth, format, parse, startOfToday } from 'date-fns';

import CalendarHeader from '@/components/calendar/calendar-header';
import CalendarGrid from '@/components/calendar/calendar-grid';
import CleaningSchedule from '@/components/calendar/cleaning-schedule';
import AddCleaningModal from '@/components/calendar/add-cleaning-modal';

import { useCleaningDates } from '@/hooks/use-cleaning-dates';
import { useRouter } from 'next/navigation';

export default function Calendar() {
  const [today, setToday] = useState<Date | null>(null);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState<string>('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [cleanerId, setCleanerId] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [startTime, setStartTime] = useState('09:00');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router=useRouter();

  // inicijalizacija
  useEffect(() => {
    const todayDate = startOfToday();
    setToday(todayDate);
    setSelectedDay(todayDate);
    setCurrentMonth(format(todayDate, 'MMM-yyyy'));
    setCleanerId(localStorage.getItem('cleaner') || '');
  }, []);

  const firstDayCurrentMonth =
    today && currentMonth ? parse(currentMonth, 'MMM-yyyy', new Date()) : new Date();

  const { cleaningDates, loading } = useCleaningDates(cleanerId, refreshKey);

  const days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  });

  function previousMonth() {
    const firstDayPrevMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayPrevMonth, 'MMM-yyyy'));
  }

  function nextMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'));
  }

  const handleRefresh = () => setRefreshKey((prev) => prev + 1);

  async function handleAddCleaning() {
    if (!selectedDay) return;
    const startDateTime = new Date(selectedDay);
    const [startHour, startMinute] = startTime.split(':');
    startDateTime.setHours(parseInt(startHour), parseInt(startMinute));

    const conflict= cleaningDates.some(cd=>{
      if(!cd.startDatetime) return false;
      const existing=new Date(cd.startDatetime);
      return(
        existing.getFullYear()===startDateTime.getFullYear()&&
        existing.getMonth()===startDateTime.getMonth()&&
        existing.getDate()===startDateTime.getDate()&&
        existing.getHours()===startDateTime.getHours()&&
        existing.getMinutes()===startDateTime.getMinutes()
      );
    });

    if(conflict){
      alert('Već postoji zakazano čišćenje u ovom terminu. Molimo odaberite drugo vreme.');
      return;
    }

    try {
      setIsSubmitting(true);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const endDateTime = new Date(startDateTime);
      endDateTime.setHours(endDateTime.getHours() + 2);

      const response = await fetch('/api/cleaning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startDatetime: format(startDateTime, "yyyy-MM-dd'T'HH:mm"),
          endDatetime: format(endDateTime, "yyyy-MM-dd'T'HH:mm"),
          userId: `users/${user._key}`,
          cleanerId,
        }),
      });

      if (response.ok) {
        setShowAddForm(false);
        setStartTime('09:00');
        handleRefresh();
        router.push('/additional-services');
      } else {
        alert('Failed to add cleaning appointment');
      }
    } catch (error) {
      console.error('Failed to add cleaning:', error);
      alert('Error adding cleaning appointment');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!today) return <div className="p-8"></div>;

  return (
    <div className="md:grid md:grid-cols-2 md:divide-x md:divide-gray-200">
      <div className="md:pr-14">
        <CalendarHeader
          currentMonth={firstDayCurrentMonth}
          onPreviousMonth={previousMonth}
          onNextMonth={nextMonth}
        />

        <div className="grid grid-cols-7 mt-10 text-xs text-center text-gray-500">
          <div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div><div>Su</div>
        </div>

        <CalendarGrid
          days={days}
          selectedDay={selectedDay}
          currentMonth={firstDayCurrentMonth}
          cleaningDates={cleaningDates}
          onSelectDay={setSelectedDay}
        />
      </div>

      <section className="mt-12 md:mt-0 md:pl-14">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-gray-900">
              Raspored čišćenja za{' '}
              {selectedDay && (
                <time dateTime={format(selectedDay, 'yyyy-MM-dd')}>
                  {format(selectedDay, 'MMM dd, yyyy')}
                </time>
              )}
            </h2>
            <button
              type="button"
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center justify-center w-8 h-8 text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 hover:text-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 active:scale-90"
              title="Add cleaning appointment"
            >
              <span className="text-lg leading-none">+</span>
            </button>
          </div>
        </div>

        <CleaningSchedule selectedDay={selectedDay} cleaningDates={cleaningDates} />
      </section>

      {showAddForm && selectedDay && (
        <AddCleaningModal
          selectedDay={selectedDay}
          startTime={startTime}
          isSubmitting={isSubmitting}
          onStartTimeChange={setStartTime}
          onCancel={() => setShowAddForm(false)}
          onSubmit={handleAddCleaning}
        />
      )}
    </div>
  );
}