'use client';
import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import ApplicationForm from './components/ApplicationForm';
import Footer from './components/Footer';

export default function Home() {
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  return (
    <main className="min-h-screen">
      <Header />
      <Hero onApplyNow={() => setShowApplicationForm(true)} />
      <Services />
      
      {showApplicationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <ApplicationForm onClose={() => setShowApplicationForm(false)} />
          </div>
        </div>
      )}
      
      <Footer />
    </main>
  );
}