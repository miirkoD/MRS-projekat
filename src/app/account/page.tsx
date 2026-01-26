'use client';
import React, { useState } from 'react';
import NavBar from '@/components/navbar';
import Footer from '../_components/footer';

const AccountPage = () => {
  // Mock user data - in a real app, this would come from authentication/session
  const [user, setUser] = useState({
    name: 'Marko Petrović',
    email: 'marko.petrovic@email.com',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user.name);
  const [editedEmail, setEditedEmail] = useState(user.email);

  // Mock subscription history - subscriptions last 1 month
  const subscriptionHistory = [
    {
      id: 1,
      type: 'Trostruki',
      startDate: '2025-12-22',
      isExpired: false,
    },
    {
      id: 2,
      type: 'Nedeljni',
      startDate: '2025-11-22',
      isExpired: true,
    },
    {
      id: 3,
      type: 'Intenzivni',
      startDate: '2025-10-15',
      isExpired: true,
    },
  ];

  // Helper function to calculate expiry date (1 month from start)
  const getExpiryDate = (startDate: string) => {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + 1);
    return date.toLocaleDateString('sr-RS', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('sr-RS', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedName(user.name);
    setEditedEmail(user.email);
  };

  const handleSaveClick = () => {
    setUser({
      name: editedName,
      email: editedEmail,
    });
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setEditedName(user.name);
    setEditedEmail(user.email);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="sticky top-0 z-50">
        <NavBar />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-10 py-20">
        <div className="w-full max-w-2xl">
          <div className="flex flex-col gap-8">
            {/* Page Title */}
            <div className="text-center">
              <h1 className="font-semibold text-6xl text-gray-700 mb-4">
                Moj Nalog
              </h1>
              <span className="text-lg text-gray-600 font-light">
                Ovde možete videti informacije o vašem nalogu
              </span>
            </div>

            {/* Account Information Card */}
            <div className="bg-gray-50 rounded-lg p-10 shadow-sm border border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-700 mb-6">
                Informacije o Nalogu
              </h2>

              <div className="flex flex-col gap-6">
                {/* Name Field */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                    Ime i Prezime
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="bg-white px-4 py-3 rounded border border-gray-300 text-lg text-gray-700 focus:outline-none focus:border-gray-500"
                    />
                  ) : (
                    <div className="bg-white px-4 py-3 rounded border border-gray-300">
                      <span className="text-lg text-gray-700">{user.name}</span>
                    </div>
                  )}
                </div>

                {/* Email Field */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                    Email Adresa
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedEmail}
                      onChange={(e) => setEditedEmail(e.target.value)}
                      className="bg-white px-4 py-3 rounded border border-gray-300 text-lg text-gray-700 focus:outline-none focus:border-gray-500"
                    />
                  ) : (
                    <div className="bg-white px-4 py-3 rounded border border-gray-300">
                      <span className="text-lg text-gray-700">
                        {user.email}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Subscription History Table */}
            <div className="bg-gray-50 rounded-lg p-10 shadow-sm border border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-700 mb-6">
                Istorija Pretplata
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600 uppercase tracking-wide">
                        Tip Pretplate
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600 uppercase tracking-wide">
                        Datum Početka
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600 uppercase tracking-wide">
                        Datum Isteka
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600 uppercase tracking-wide">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscriptionHistory.map((subscription) => (
                      <tr
                        key={subscription.id}
                        className="border-b border-gray-200 hover:bg-gray-100 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <span className="text-lg font-medium text-gray-700">
                            {subscription.type}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-gray-600">
                            {formatDate(subscription.startDate)}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-gray-600">
                            {getExpiryDate(subscription.startDate)}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                              subscription.isExpired
                                ? 'bg-red-100 text-red-700'
                                : 'bg-green-100 text-green-700'
                            }`}
                          >
                            {subscription.isExpired ? 'Istekla' : 'Aktivna'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Additional Actions */}
            <div className="flex gap-4 justify-center">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSaveClick}
                    className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  >
                    Sačuvaj Izmene
                  </button>
                  <button
                    onClick={handleCancelClick}
                    className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                  >
                    Otkaži
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleEditClick}
                    className="px-6 py-3 bg-gray-700 text-white rounded hover:bg-gray-800 transition-colors"
                  >
                    Izmeni Nalog
                  </button>
                  <button className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                    Odjavi se
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AccountPage;
