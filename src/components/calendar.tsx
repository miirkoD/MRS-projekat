"use client";

import { useState, useEffect } from "react";
import {
    add,
    eachDayOfInterval,
    endOfMonth,
    format,
    getDay,
    isEqual,
    isSameDay,
    isSameMonth,
    isToday,
    parse,
    parseISO,
    startOfToday,
} from "date-fns";

import ChevronLeftIcon from "@/components/icons/chevron-left-icon";
import ChevronRightIcon from "@/components/icons/chevron-right-icon";
import CleaningDate from "@/components/cleaning-date";

function classNames(...classes: (string | undefined | false | null)[]): string {
    return classes.filter(Boolean).join(" ");
}

const colStartClasses = [
    "col-start-1",
    "col-start-2",
    "col-start-3",
    "col-start-4",
    "col-start-5",
    "col-start-6",
    "col-start-7",
];

export default function Calendar() {
    const [today, setToday] = useState<Date | null>(null);
    const [selectedDay, setSelectedDay] = useState<Date | null>(null);
    const [currentMonth, setCurrentMonth] = useState<string>("");
    const [refreshKey, setRefreshKey] = useState(0);
    const [cleaningDates, setCleaningDates] = useState<Array<{
        id?: string;
        name?: string;
        imageUrl?: string;
        startDatetime?: string;
        endDatetime?: string;
        _key?: string;
        _id?: string;
        _rev?: string;
    }>>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [startTime, setStartTime] = useState("09:00");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const todayDate = startOfToday();
        setToday(todayDate);
        setSelectedDay(todayDate);
        setCurrentMonth(format(todayDate, "MMM-yyyy"));
    }, []);

    const firstDayCurrentMonth = today && currentMonth ? parse(currentMonth, "MMM-yyyy", new Date()) : new Date();

    const handleRefresh = () => {
        setRefreshKey((prev) => prev + 1);
    };

    const handleAddCleaning = async () => {
        if (!selectedDay) return;
        
        try {
            setIsSubmitting(true);
            const startDateTime = new Date(selectedDay);
            const [startHour, startMinute] = startTime.split(":");
            startDateTime.setHours(parseInt(startHour), parseInt(startMinute));

            const endDateTime = new Date(startDateTime);
            endDateTime.setHours(endDateTime.getHours() + 2);

            const response = await fetch("/api/cleaning", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    startDateTime: startDateTime.toISOString(),
                    endDateTime: endDateTime.toISOString(),
                }),
            });

            if (response.ok) {
                setShowAddForm(false);
                setStartTime("09:00");
                handleRefresh();
            } else {
                alert("Failed to add cleaning appointment");
            }
        } catch (error) {
            console.error("Failed to add cleaning:", error);
            alert("Error adding cleaning appointment");
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        const fetchCleaningDates = async () => {
            try {
                setLoading(true);
                const response = await fetch("/api/cleaning");
                if (response.ok) {
                    const data = await response.json();
                    console.log("=== FETCHED CLEANING DATA ===");
                    console.log("Raw data:", data);
                    console.log("Total appointments:", data.length);
                    data.forEach((appointment: any, index: number) => {
                        console.log(`\n--- Appointment ${index + 1} ---`);
                        console.log("Full object:", appointment);
                        console.log("Start Datetime:", appointment.startDatetime);
                        console.log("End Datetime:", appointment.endDatetime);
                        console.log("ID:", appointment.id || appointment._key);
                    });
                    console.log("=== END FETCH ===\n");
                    setCleaningDates(data);
                } else {
                    console.error("Failed to fetch cleaning dates, status:", response.status);
                }
            } catch (error) {
                console.error("Failed to fetch cleaning dates:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCleaningDates();
    }, [refreshKey]);

    const days = eachDayOfInterval({
        start: firstDayCurrentMonth,
        end: endOfMonth(firstDayCurrentMonth),
    });

    function previousMonth() {
        const firstDayPrevMonth = add(firstDayCurrentMonth, { months: -1 });
        setCurrentMonth(format(firstDayPrevMonth, "MMM-yyyy"));
    }

    function nextMonth() {
        const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
        setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
    }

    const selectedDayCleaningDates = selectedDay ? cleaningDates.filter((cleaningDate) => {
        const startDt = cleaningDate.startDatetime;
        return startDt && isSameDay(parseISO(startDt), selectedDay);
    }) : [];

    // Samo da vidim da li radi sve
    useEffect(() => {
        if (selectedDay) {
            console.log("\n=== SELECTED DAY DEBUG ===");
            console.log("Selected day:", format(selectedDay, "yyyy-MM-dd EEEE"));
            console.log("All cleaning dates:", cleaningDates);
            console.log("Matching appointments for selected day:", selectedDayCleaningDates);
            cleaningDates.forEach((appointment) => {
                const startDt = appointment.startDatetime;
                if (startDt) {
                    const appointmentDate = parseISO(startDt);
                    console.log(`  - ${format(appointmentDate, "yyyy-MM-dd")} - Matches: ${isSameDay(appointmentDate, selectedDay)}`);
                }
            });
            console.log("=== END DEBUG ===\n");
        }
    }, [selectedDay, cleaningDates]);

    if (!today) {
        return <div className="p-8"></div>; 
    }

    return (
        <div className="md:grid md:grid-cols-2 md:divide-x md:divide-gray-200">
            <div className="md:pr-14">
                <div className="flex items-center">
                    <h2 className="flex-auto font-semibold text-gray-900">
                        {format(firstDayCurrentMonth, "MMMM yyyy")}
                    </h2>
                    <button
                        type="button"
                        onClick={previousMonth}
                        className="p-1.5 text-gray-400 hover:text-gray-500"
                    >
                        <span className="sr-only">Previous month</span>
                        <ChevronLeftIcon className="w-5 h-5" aria-hidden="true" />
                    </button>
                    <button
                        type="button"
                        onClick={nextMonth}
                        className="ml-2 p-1.5 text-gray-400 hover:text-gray-500"
                    >
                        <span className="sr-only">Next month</span>
                        <ChevronRightIcon className="w-5 h-5" aria-hidden="true" />
                    </button>
                </div>

                <div className="grid grid-cols-7 mt-10 text-xs text-center text-gray-500">
                    <div>Mo</div>
                    <div>Tu</div>
                    <div>We</div>
                    <div>Th</div>
                    <div>Fr</div>
                    <div>Sa</div>
                    <div>Su</div>
                </div>

                <div className="grid grid-cols-7 mt-2 text-sm">
                    {days.map((day, dayIdx) => (
                        <div
                            key={day.toString()}
                            className={classNames(
                                dayIdx === 0 && colStartClasses[(getDay(day) + 6) % 7],
                                "py-1.5"
                            )}
                        >
                            <button
                                type="button"
                                onClick={() => setSelectedDay(day)}
                                className={classNames(
                                    selectedDay && isEqual(day, selectedDay) && "text-white",
                                    selectedDay && !isEqual(day, selectedDay) &&
                                    isToday(day) &&
                                    "text-green-700",
                                    selectedDay && !isEqual(day, selectedDay) &&
                                    !isToday(day) &&
                                    isSameMonth(day, firstDayCurrentMonth) &&
                                    "text-gray-900",
                                    selectedDay && !isEqual(day, selectedDay) &&
                                    !isToday(day) &&
                                    !isSameMonth(day, firstDayCurrentMonth) &&
                                    "text-gray-400",
                                    selectedDay && isEqual(day, selectedDay) && isToday(day) && "bg-green-300",
                                    selectedDay &&
                                    isEqual(day, selectedDay) &&
                                    !isToday(day) &&
                                    "bg-gray-900",
                                    selectedDay && !isEqual(day, selectedDay) && "hover:bg-gray-200",
                                    selectedDay && (isEqual(day, selectedDay) || isToday(day)) && "font-semibold",
                                    "mx-auto flex h-8 w-8 items-center justify-center rounded-full"
                                )}
                            >
                                <time dateTime={format(day, "yyyy-MM-dd")}>
                                    {format(day, "d")}
                                </time>
                            </button>

                            {/* Da se zna koji dan ima događaj */}
                            <div className="flex justify-center mt-1">
                                {cleaningDates.some((cleaningDate) =>
                                    cleaningDate.startDatetime && isSameDay(parseISO(cleaningDate.startDatetime), day)
                                ) && <div className="w-2 h-2 rounded-full bg-blue-500"></div>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* raspord da izabran dan */}
            <section className="mt-12 md:mt-0 md:pl-14">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <h2 className="font-semibold text-gray-900">
                            Raspored čišćenja za{" "}
                            {selectedDay && (
                                <time dateTime={format(selectedDay, "yyyy-MM-dd")}>
                                    {format(selectedDay, "MMM dd, yyyy")}
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
                <ol className="mt-4 space-y-1 text-sm leading-6 text-gray-500">
                    {selectedDayCleaningDates.length > 0 ? (
                        selectedDayCleaningDates.map((cleaningDate) => {
                            const startDt = cleaningDate.startDatetime;
                            const endDt = cleaningDate.endDatetime;
                            const startDateTime = startDt ? parseISO(startDt) : new Date();
                            const endDateTime = endDt ? parseISO(endDt) : new Date();
                            const id = cleaningDate.id || cleaningDate._key;
                            
                            return (
                                <li key={id} className="flex items-center px-4 py-2 space-x-4 group rounded-xl focus-within:bg-gray-100 hover:bg-gray-100 bg-blue-50">
                                    {cleaningDate.imageUrl && (
                                        <img
                                            src={cleaningDate.imageUrl}
                                            alt={cleaningDate.name || "Cleaning"}
                                            className="flex-none w-10 h-10 rounded-full"
                                        />
                                    )}
                                    <div className="flex-auto">
                                        <p className="text-gray-900 font-medium">{cleaningDate.name || "Cleaning Appointment"}</p>
                                        <p className="mt-0.5 text-gray-600">
                                            <time dateTime={startDt}>
                                                {format(startDateTime, "HH:mm")}
                                            </time>
                                            {" - "}
                                            <time dateTime={endDt}>
                                                {format(endDateTime, "HH:mm")}
                                            </time>
                                        </p>
                                    </div>
                                </li>
                            );
                        })
                    ) : (
                        <p className="text-gray-400">Trenutno nema čišćenja za ovaj dan.</p>
                    )}
                </ol>
            </section>

            {showAddForm && selectedDay && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col max-h-[90vh] animate-in fade-in zoom-in">
                        {/* Scrollable content */}
                        <div className="overflow-y-auto flex-1 p-8">
                            <div className="mb-6">
                                <h3 className="text-2xl font-bold text-gray-900">
                                    Zakazivanje čišćenja
                                </h3>
                                <p className="text-gray-500 mt-2">
                                    {format(selectedDay, "EEEE, MMMM dd, yyyy")}
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
                                            value={startTime.split(":")[0]}
                                            onChange={(e) => {
                                                const hour = e.target.value.padStart(2, "0");
                                                const minutes = startTime.split(":")[1];
                                                setStartTime(`${hour}:${minutes}`);
                                            }}
                                            className="w-full px-3 py-3 text-lg text-center text-gray-900 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                        />
                                    </div>
                                    <div className="flex items-center text-2xl text-gray-400 mt-5">:</div>
                                    <div className="flex-1">
                                        <label className="block text-xs text-gray-600 mb-1">Minut</label>
                                        <select
                                            value={startTime.split(":")[1]}
                                            onChange={(e) => {
                                                const hour = startTime.split(":")[0];
                                                const minutes = e.target.value;
                                                setStartTime(`${hour}:${minutes}`);
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
                                    Trajanje čišćenja: 2 sata (završava u{" "}
                                    <span className="font-semibold text-gray-700">
                                        {(() => {
                                            const [hours, minutes] = startTime.split(":");
                                            const endHour = (parseInt(hours) + 2) % 24;
                                            return `${endHour.toString().padStart(2, "0")}:${minutes}`;
                                        })()}
                                    </span>
                                    )
                                </p>
                            </div>
                        </div>

                        {/* Fixed buttons */}
                        <div className="flex gap-3 p-8 pt-4 border-t border-gray-200 bg-white">
                            <button
                                type="button"
                                onClick={() => setShowAddForm(false)}
                                disabled={isSubmitting}
                                className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
                            >
                                Otkaži
                            </button>
                            <button
                                type="button"
                                onClick={handleAddCleaning}
                                disabled={isSubmitting}
                                className="flex-1 px-4 py-3 text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap"
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                        Booking...
                                    </>
                                ) : (
                                    "Book Cleaning"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}