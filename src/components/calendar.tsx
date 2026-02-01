'use client';

import { useState, useEffect } from 'react';
import {
  add,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  parse,
  startOfToday,
} from 'date-fns';

import CalendarHeader from '@/components/calendar/calendar-header';
import CalendarGrid from '@/components/calendar/calendar-grid';
import CleaningSchedule from '@/components/calendar/cleaning-schedule';
import AddCleaningModal from '@/components/calendar/add-cleaning-modal';

import { useCleaningDates } from '@/hooks/use-cleaning-dates';
import { useRouter } from 'next/navigation';

type User = {
  _key?: string;
  role?: string;
  firstName?: string;
  lastName?: string;
};

type Appointment = {
  _key?: string;
  userId: string;
  cleanerId: string;
  startDatetime: string;
  endDatetime: string;
};

export default function Calendar() {
  const [today, setToday] = useState<Date | null>(null);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState<string>('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [cleanerId, setCleanerId] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [startTime, setStartTime] = useState('09:00');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);
  const router = useRouter();

  const subscriptionStart = new Date();
  const subscriptionEnd = addMonths(subscriptionStart, 1);

  const [user] = useState<User>(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedUser = localStorage.getItem('user');
        return storedUser ? (JSON.parse(storedUser) as User) : {};
      } catch {
        return {};
      }
    }
    return {};
  });

  useEffect(() => {
    const todayDate = startOfToday();
    setToday(todayDate);
    setSelectedDay(todayDate);
    setCurrentMonth(format(todayDate, 'MMM-yyyy'));
    setCleanerId(localStorage.getItem('cleaner') || '');
  }, []);

  const firstDayCurrentMonth =
    today && currentMonth
      ? parse(currentMonth, 'MMM-yyyy', new Date())
      : new Date();

  const days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  });

  const { cleaningDates, loading } = useCleaningDates(cleanerId, refreshKey);

  function previousMonth() {
    const firstDayPrevMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayPrevMonth, 'MMM-yyyy'));
  }

  function nextMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'));
  }

  const handleRefresh = () => setRefreshKey((prev) => prev + 1);

  
  const handleSelectDay = (day: Date) => {
    if(day< subscriptionStart || day > subscriptionEnd){
      alert('Datum je van perioda vaše pretplate.');
      return;
    }
    setSelectedDay(day);
  };

  function addAppointmentId(id: string) {
    const stored = localStorage.getItem('appointmentIds');
    const ids= stored ? JSON.parse(stored) as string[] : [];
    if (!ids.includes(id)) {
      ids.push(id);
      localStorage.setItem('appointmentIds', JSON.stringify(ids));
    }
  }

  async function handleAddCleaning() {
    if (!selectedDay) return;

    if(selectedDay < subscriptionStart || selectedDay > subscriptionEnd){
      alert('Datum je van perioda vaše pretplate.');
      return;
    }

    const startDateTime = new Date(selectedDay);
    const [startHour, startMinute] = startTime.split(':');
    startDateTime.setHours(parseInt(startHour), parseInt(startMinute));

    const endDateTime = new Date(startDateTime);
    endDateTime.setHours(endDateTime.getHours() + 2);

    const conflict = cleaningDates.some((cd) => {
      if (!cd.startDatetime || !cd.endDatetime) return false;
      const existingStart = new Date(cd.startDatetime);
      const existingEnd = new Date(cd.endDatetime);
      return existingStart < endDateTime && existingEnd > startDateTime;
    });

    if (conflict) {
      alert('Termin je zauzet. Molimo odaberite drugi termin.');
      return;
    }

    try {
      setIsSubmitting(true);
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      const payload = {
        startDatetime: format(startDateTime, "yyyy-MM-dd'T'HH:mm"),
        endDatetime: format(endDateTime, "yyyy-MM-dd'T'HH:mm"),
        userId: user._key,
        cleanerId,
      };

      let response;
      if (editingAppointment) {
        response = await fetch(`/api/cleaning/${editingAppointment._key}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch('/api/cleaning', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (response.ok) {
        const data = await response.json();

        if(data._key){
          addAppointmentId(data._key);
        }

        if (data.appointmentCount === 3) {
          router.push('/additional-services');
        } else {
          handleRefresh();
          setShowAddForm(false);
          setEditingAppointment(null);
          setStartTime('9:00');
        }
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to add cleaning appointment');
      }
    } catch (error) {
      console.error('Failed to add cleaning:', error);
      alert('Error adding cleaning appointment');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!today) return <div className="p-8"></div>;

  async function handleCancel(id: string) {
    try {
      const response = await fetch(`/api/cleaning/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user }),
      });
      if (response.ok) {
        alert('Termin je uspešno otkazan.');
        handleRefresh();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Neuspešno otkazivanje termina.');
      }
    } catch (error) {
      console.error('Neuspešno otkazivanje termina:', error);
      alert('Greška prilikom otkazivanja termina.');
    }
  }

  return (
    <div className="md:grid md:grid-cols-2 md:divide-x md:divide-gray-200">
      <div className="md:pr-14">
        <CalendarHeader
          currentMonth={firstDayCurrentMonth}
          onPreviousMonth={previousMonth}
          onNextMonth={nextMonth}
        />

        <div className="grid grid-cols-7 mt-10 text-xs text-center text-gray-500">
          <div>Mo</div>
          <div>Tu</div>
          <div>We</div>
          <div>Th</div>
          <div>Fr</div>
          <div>Sa</div>
          <div>Su</div>
        </div>

        <CalendarGrid
          days={days}
          selectedDay={selectedDay}
          currentMonth={firstDayCurrentMonth}
          cleaningDates={cleaningDates}
          onSelectDay={handleSelectDay}
          subscriptionStart={subscriptionStart}
          subscriptionEnd={subscriptionEnd}
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
            {user.role !== 'cleaner' && (
              <button
                type="button"
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 active:scale-90"
                title="Add cleaning appointment"
              >
                <span className="text-lg leading-none">+</span>
              </button>
            )}
          </div>
        </div>

        
        {loading ? (
          <p className="text-gray-400 mt-4">Učitavanje termina...</p>
        ) : (
          <CleaningSchedule
            selectedDay={selectedDay}
            cleaningDates={cleaningDates}
            onCancel={handleCancel}
            onEdit={(appt) => {
              if (appt.userId === user._key) {
                setEditingAppointment(appt as Appointment);
                setShowAddForm(true);
                if(appt.startDatetime){
                  setSelectedDay(new Date(appt.startDatetime));
                  setStartTime(format(new Date(appt.startDatetime), 'HH:mm'));
                }
              }
            }}
          />
        )}
      </section>

      {showAddForm && selectedDay && (
        <AddCleaningModal
          selectedDay={selectedDay}
          startTime={startTime}
          isSubmitting={isSubmitting}
          onStartTimeChange={setStartTime}
          onCancel={() => {
            setShowAddForm(false);
            setEditingAppointment(null);
          }}
          onSubmit={handleAddCleaning}
          editing={!!editingAppointment}
        />
      )}
    </div>
  );
}