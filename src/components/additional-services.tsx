"use client";

import { useState } from "react";

const SERVICES = [
  { id: 1, name: "Pranje veša", price: 5 },
  { id: 2, name: "Peglanje veša", price: 7 },
  { id: 3, name: "Dubinsko pranje nameštaja", price: 35 },
  { id: 4, name: "Pranje sudova", price: 5 },
];

export default function AdditionalServices() {
  const [selected, setSelected] = useState<number[]>([]);

  const toggleService = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  return (
    <div className="max-w-3xl mx-auto mt-16 text-center">
      {/* Header */}
      <h2 className="text-2xl font-serif text-purple-600 mb-2 tracking-wide">
        TIDYME
      </h2>
      <h1 className="text-3xl font-bold mb-10 text-gray-800">
        Izaberite dodatne usluge
      </h1>

      {/* Services Table */}
      <div className="border rounded-2xl shadow-lg overflow-hidden bg-white">
        <div className="grid grid-cols-3 bg-gray-100 px-6 py-3 text-left text-sm font-semibold text-gray-600">
          <span className="col-span-2">Vrsta usluge</span>
          <span>Cena</span>
        </div>

        {SERVICES.map((service) => (
          <div
            key={service.id}
            className="grid grid-cols-3 items-center px-6 py-4 border-t hover:bg-gray-50 transition"
          >
            <span className="col-span-2 text-left text-gray-800 font-medium">
              {service.name}
            </span>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-semibold">
                {service.price} €
              </span>
              <button
                onClick={() => toggleService(service.id)}
                className={`ml-4 px-4 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selected.includes(service.id)
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-purple-500 text-white hover:bg-purple-600"
                }`}
              >
                {selected.includes(service.id) ? "Dodato" : "Dodaj"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Skip button */}
      <button className="mt-10 bg-gray-200 hover:bg-gray-300 transition text-gray-700 px-8 py-3 rounded-xl font-medium shadow-sm">
        Ne želim dodatne usluge
      </button>
    </div>
  );
}