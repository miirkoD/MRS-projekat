"use client";

import { useState } from "react";
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

// ovo mi je samo radi testa, uzeo sam podatke sa turorijala
const cleaningDates = [
    {
        id: 1,
        name: "Leslie Alexander",
        imageUrl:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?...",
        startDatetime: "2026-01-11T13:00",
        endDatetime: "2026-01-11T14:30",
    },
    {
        id: 2,
        name: "Michael Foster",
        imageUrl:
            "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?...",
        startDatetime: "2026-01-20T09:00",
        endDatetime: "2026-01-20T11:30",
    },
];

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
    const today = startOfToday();
    const [selectedDay, setSelectedDay] = useState(today);
    const [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
    const firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());

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

    const selectedDayCleaningDates = cleaningDates.filter((cleaningDate) =>
        isSameDay(parseISO(cleaningDate.startDatetime), selectedDay)
    );

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
                                    isEqual(day, selectedDay) && "text-white",
                                    !isEqual(day, selectedDay) &&
                                    isToday(day) &&
                                    "text-green-700",
                                    !isEqual(day, selectedDay) &&
                                    !isToday(day) &&
                                    isSameMonth(day, firstDayCurrentMonth) &&
                                    "text-gray-900",
                                    !isEqual(day, selectedDay) &&
                                    !isToday(day) &&
                                    !isSameMonth(day, firstDayCurrentMonth) &&
                                    "text-gray-400",
                                    isEqual(day, selectedDay) && isToday(day) && "bg-green-300",
                                    isEqual(day, selectedDay) &&
                                    !isToday(day) &&
                                    "bg-gray-900",
                                    !isEqual(day, selectedDay) && "hover:bg-gray-200",
                                    (isEqual(day, selectedDay) || isToday(day)) && "font-semibold",
                                    "mx-auto flex h-8 w-8 items-center justify-center rounded-full"
                                )}
                            >
                                <time dateTime={format(day, "yyyy-MM-dd")}>
                                    {format(day, "d")}
                                </time>
                            </button>

                            {/* Da se zna koji dan ima događaj */}
                            <div className="w-1 h-1 mx-auto mt-1">
                                {cleaningDates.some((cleaningDate) =>
                                    isSameDay(parseISO(cleaningDate.startDatetime), day)
                                ) && <div className="w-1 h-1 rounded-full bg-sky-500"></div>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* raspored da izabran dan */}
            <section className="mt-12 md:mt-0 md:pl-14">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <h2 className="font-semibold text-gray-900">
                            Cleaning Schedule for{" "}
                            <time dateTime={format(selectedDay, "yyyy-MM-dd")}>
                                {format(selectedDay, "MMM dd, yyyy")}
                            </time>
                        </h2>
                        <button
                            type="button"
                            className="inline-flex items-center justify-center w-8 h-8 text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 hover:text-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 active:scale-90"
                            title="Add cleaning appointment"
                        >
                            <span className="text-lg leading-none">+</span>
                        </button>
                    </div>
                </div>
                <ol className="mt-4 space-y-1 text-sm leading-6 text-gray-500">
                    {selectedDayCleaningDates.length > 0 ? (
                        selectedDayCleaningDates.map((cleaningDate) => (
                            <CleaningDate cleaningDate={cleaningDate} key={cleaningDate.id} />
                        ))
                    ) : (
                        <p>No cleaning scheduled for today.</p>
                    )}
                </ol>
            </section>
        </div>
    );
}