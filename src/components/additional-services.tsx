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

  const selectedServices = SERVICES.filter((service) => selected.includes(service.id));
  const totalPrice = selectedServices.reduce((sum, service) => sum + service.price, 0);

  return (
    <div className="max-w-3xl mx-auto mt-16 text-center">
      <h2 className="text-2xl font-serif text-purple-600 mb-2 tracking-wide">
        TIDYME
      </h2>
      <h1 className="text-3xl font-bold mb-10 text-gray-800">
        Izaberite dodatne usluge
      </h1>

      <div className="overflow-hidden rounded-2xl shadow-lg bg-white">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 text-sm font-semibold text-gray-600">
            <tr>
              <th className="text-center px-6 py-3">Vrsta usluge</th>
              <th className="text-center px-6 py-3">Cena</th>
              <th className="text-center px-6 py-3">Akcija</th>
            </tr>
          </thead>
          <tbody>
            {SERVICES.map((service) => (
              <tr
                key={service.id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4 text-gray-800 font-medium">
                  {service.name}
                </td>
                <td className="px-6 py-4 text-gray-700 font-semibold">
                  {service.price} €
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleService(service.id)}
                    className={`px-4 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                      selected.includes(service.id)
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-purple-500 text-white hover:bg-purple-600"
                    }`}
                  >
                    {selected.includes(service.id) ? "Dodato" : "Dodaj"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedServices.length > 0 && (
        <div className="mt-8 text-left bg-white shadow-md rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Izabrane usluge:
          </h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-gray-600 font-semibold">
                <th className="text-left px-4 py-2">Usluga</th>
                <th className="text-left px-4 py-2">Cena</th>
              </tr>
            </thead>
            <tbody>
              {selectedServices.map((service) => (
                <tr key={service.id} className="border-t">
                  <td className="px-4 py-2 text-gray-700">{service.name}</td>
                  <td className="px-4 py-2 text-gray-700">{service.price} €</td>
                </tr>
              ))}
              <tr className="border-t font-bold text-gray-900">
                <td className="px-4 py-2">Ukupno:</td>
                <td className="px-4 py-2">{totalPrice} €</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <button className="mt-10 bg-gray-200 hover:bg-gray-300 transition text-gray-700 px-8 py-3 rounded-xl font-medium shadow-sm">
        Nastavi
      </button>

    </div>
  );
}