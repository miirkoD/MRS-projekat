'use client';

import Navbar from '@/components/navbar';
import Footer from '../_components/footer';
import Calendar from '@/components/calendar';

export default function DateSelectionPage() {
  return (
    <>
      <Navbar />

      <main className="pt-16 flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-4xl w-full px-6 rounded-lg shadow-lg p-8 bg-white">
          <header className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Izbor datuma čišćenja
            </h1>
            <p className="text-gray-600">
              Pregled termina čišćenja i raspored po danima
            </p>
          </header>

          <Calendar />
        </div>
      </main>

      <Footer />
    </>
  );
}
