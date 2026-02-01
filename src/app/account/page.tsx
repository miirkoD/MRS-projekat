'use client';

import NavBar from '@/components/navbar';
import { SubscriptionTable } from '@/components/subscription-table';
import { Table } from '@/components/ui/table';
import React from 'react';
import { useRouter } from 'next/navigation';

type user = {
  name: string;
  lastName: string;
  adress: string;
  email: string;
  role: string;
};
const Page = () => {
  const router = useRouter();

  const handleSignOut = () => {
    localStorage.removeItem('user');
    router.push('/');
  };
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    router.push('/login');
    return null;
  }
  const user = JSON.parse(userStr);
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      <div className="flex flex-col items-center px-10 py-12 gap-8">
        <div className="w-full max-w-6xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Moj Nalog</h1>

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-8">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Informacije o nalogu
              </h2>
              <button
                onClick={handleSignOut}
                className="bg-red-600 text-white rounded-lg font-medium text-sm px-4 py-2 hover:bg-red-700 transition-colors"
              >
                Odjavi se
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500 mb-1">
                  Ime i prezime
                </span>
                <span className="text-base text-gray-900">
                  {`${user.name} ${user.lastName}`}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500 mb-1">
                  Email adresa
                </span>
                <span className="text-base text-gray-900">{user.email}</span>
              </div>

              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500 mb-1">
                  Adresa
                </span>
                <span className="text-base text-gray-900">{user.adress}</span>
              </div>

              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500 mb-1">
                  Tip naloga
                </span>
                <span className="text-base text-gray-900 capitalize">
                  {user.role === 'user'
                    ? 'Korisnik'
                    : user.role === 'cleaner'
                      ? 'Čistač'
                      : user.role}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Moje pretplate
            </h2>
            <SubscriptionTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
