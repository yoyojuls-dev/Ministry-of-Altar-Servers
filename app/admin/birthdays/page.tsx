// app/admin/birthdays/page.tsx - Birthdays page for both admins and members
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface BirthdayPerson {
  id: string;
  name: string;
  birthday: string;
  age: number;
  userType: 'Admin' | 'Member';
  position?: string;
  serviceLevel?: string;
}

const MONTHS = [
  'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
];

export default function BirthdaysPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [birthdays, setBirthdays] = useState<BirthdayPerson[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'authenticated') {
      if (session?.user?.role !== 'ADMIN' && session?.user?.userType !== 'ADMIN') {
        router.push('/member/dashboard');
        return;
      }
      loadBirthdays();
    } else if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, session, router]);

  const loadBirthdays = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/birthdays');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to fetch birthdays');
      }
      
      const data = await response.json();
      setBirthdays(data);
    } catch (err: any) {
      console.error('Error loading birthdays:', err);
      setError(err.message || 'Failed to load birthdays');
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (birthday: Date): number => {
    const today = new Date();
    let age = today.getFullYear() - birthday.getFullYear();
    const monthDiff = today.getMonth() - birthday.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthday.getDate())) {
      age--;
    }
    return age;
  };

  // Filter birthdays for selected month
  const filteredBirthdays = birthdays.filter(person => {
    const birthDate = new Date(person.birthday);
    return birthDate.getMonth() === selectedMonth;
  });

  // Sort filtered birthdays by date
  const sortedFilteredBirthdays = [...filteredBirthdays].sort((a, b) => {
    const aDate = new Date(a.birthday);
    const bDate = new Date(b.birthday);
    return aDate.getDate() - bDate.getDate();
  });

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 pb-24">
      {/* Blue Header with Back Button and Logo */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/admin" className="text-white">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="relative w-16 h-16">
            <Image
              src="/images/MAS LOGO.png"
              alt="MAS Logo"
              fill
              sizes="64px"
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* White Content Card */}
      <div className="bg-white rounded-t-[2rem] mt-4 min-h-screen px-6 py-6">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">BIRTHDAYS</h2>

        {/* Month Selector - Horizontal Scroll */}
        <div className="mb-6">
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300">
            {MONTHS.map((month, index) => (
              <button
                key={month}
                onClick={() => setSelectedMonth(index)}
                className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                  selectedMonth === index
                    ? 'bg-blue-700 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {month}
              </button>
            ))}
          </div>
        </div>

        {/* Celebrants List */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {/* {MONTHS[selectedMonth]} Celebrants */}CELEBRANTS
          </h3>
          {sortedFilteredBirthdays.length > 0 ? (
            <div className="space-y-3">
              {sortedFilteredBirthdays.map((person) => (
                <div key={person.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{person.name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(person.birthday).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-500">No birthdays in {MONTHS[selectedMonth]}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}