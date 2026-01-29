'use client';

import Navbar from '@/components/navbar';
import Footer from '../_components/footer';
import AdditionalServices from '@/components/additional-services';

export default function AdditionalServicesPage() {
  return (
    <>
      <Navbar />

      <main className="pt-16 flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-4xl w-full px-6 rounded-lg shadow-lg p-8 bg-white">
          <header className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Dodatne usluge
            </h1>
            <p className="text-gray-600">
              Izaberite neke od naših dodatnih usluga koje mogu da upotpune vaše čišćenje
            </p>
          </header>

          <AdditionalServices />
        </div>
      </main>

      <Footer />
    </>
  );
}