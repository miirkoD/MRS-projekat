"use client";

import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { format, parseISO } from "date-fns";
import DotsVerticalIcon from "@/components/icons/dots-vertical-icon";

function classNames(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export default function CleaningDate({
  cleaningDate,
  onRefresh,
}: {
  cleaningDate: {
    _key?: string;
    _id?: string;
    id?: string;
    name?: string;
    imageUrl?: string;
    startDatetime: string;
    endDatetime: string;
    cleanerId?: string;
    userId?: string;
    subscriptionId?: string;
    status?: string;
  };
  onRefresh: () => void;
}) {
  const startDateTime = parseISO(cleaningDate.startDatetime);
  const endDateTime = parseISO(cleaningDate.endDatetime);
  const appointmentId = cleaningDate._key || cleaningDate.id;

  async function handleCancel() {
    if (!appointmentId) {
      alert("Unable to cancel: appointment ID not found");
      return;
    }
    try {
      const response = await fetch(`/api/cleaning/${appointmentId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to cancel appointment");
      }
      onRefresh();
    } catch (error) {
      console.error("Error canceling appointment:", error);
      alert("Failed to cancel appointment");
    }
  }

  async function handleEdit(offsetMinutes: number) {
    if (!appointmentId) {
      alert("Unable to edit: appointment ID not found");
      return;
    }
    try {
      const startDateTime = parseISO(cleaningDate.startDatetime);
      const endDateTime = parseISO(cleaningDate.endDatetime);

      const newStart = new Date(startDateTime.getTime() + offsetMinutes * 60000);
      const newEnd = new Date(endDateTime.getTime() + offsetMinutes * 60000);

      const sameDay =
        newStart.getDate() === startDateTime.getDate() &&
        newStart.getMonth() === startDateTime.getMonth() &&
        newStart.getFullYear() === startDateTime.getFullYear() &&
        newEnd.getDate() === endDateTime.getDate() &&
        newEnd.getMonth() === endDateTime.getMonth() &&
        newEnd.getFullYear() === endDateTime.getFullYear();

      if (!sameDay) {
        alert("Izmena vremena mora ostati unutar istog dana.");
        return;
      }

      const response = await fetch(`/api/cleaning/${appointmentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startDatetime: newStart.toISOString(),
          endDatetime: newEnd.toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update appointment");
      }
      onRefresh();
    } catch (error) {
      console.error("Error editing appointment:", error);
      alert("Failed to update appointment");
    }
  }

  return (
    <li className="flex items-center px-4 py-2 space-x-4 group rounded-xl focus-within:bg-gray-100 hover:bg-gray-100">
      {cleaningDate.imageUrl && (
        <img
          src={cleaningDate.imageUrl}
          alt={cleaningDate.name || "Cleaner"}
          className="flex-none w-10 h-10 rounded-full"
        />
      )}

      <div className="flex-auto">
        <p className="text-gray-900">{cleaningDate.name || `Appointment (${cleaningDate._key || cleaningDate.id})`}</p>
        <p className="mt-0.5">
          <time dateTime={cleaningDate.startDatetime}>
            {format(startDateTime, "HH:mm")}
          </time>{" "}
          -{" "}
          <time dateTime={cleaningDate.endDatetime}>
            {format(endDateTime, "HH:mm")}
          </time>
        </p>
      </div>

      <Menu
        as="div"
        className="relative opacity-0 focus-within:opacity-100 group-hover:opacity-100"
      >
        <div>
          <Menu.Button className="-m-2 flex items-center rounded-full p-1.5 text-gray-500 hover:text-gray-600">
            <span className="sr-only">Open options</span>
            <DotsVerticalIcon className="w-6 h-6" aria-hidden="true" />
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 mt-2 origin-top-right bg-white rounded-md shadow-lg w-36 ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <Menu.Item>
                {({ active }: { active: boolean }) => (
                  <button
                    onClick={() => handleEdit(30)}
                    className={classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "w-full text-left block px-4 py-2 text-sm"
                    )}
                  >
                    Edit
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }: { active: boolean }) => (
                  <button
                    onClick={handleCancel}
                    className={classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "w-full text-left block px-4 py-2 text-sm"
                    )}
                  >
                    Cancel
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </li>
  );
}