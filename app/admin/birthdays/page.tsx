// app/admin/birthdays/page.tsx - Birthdays page for both admins and members
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface BirthdayPerson {
  id: string;
  name: string;
  birthday: Date;
  age: number;
  userType: 'Admin' | 'Member';
  position?: string; // For admins
  serviceLevel?: 'Neophyte' | 'Junior' | 'Senior Server'; // For members
  isToday: boolean;
  daysUntil: number;
}

export default function BirthdaysPage() {
  const [birthdays, setBirthdays] = useState<BirthdayPerson[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [loading, setLoading] = useState(true);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  useEffect(() => {
    loadBirthdays();
  }, []);

  const loadBirthdays = async () => {
    try {
      // Sample birthday data (in real app, fetch from API)
      const sampleBirthdays: BirthdayPerson[] = [
        // Admins
        {
          id: "admin-1",
          name: "Admin Admin",
          birthday: new Date("1990-02-05"),
          age: calculateAge(new Date("1990-02-05")),
          userType: "Admin",
          position: "Ministry Coordinator",
          isToday: isToday(new Date("1990-02-05")),
          daysUntil: calculateDaysUntilBirthday(new Date("1990-02-05"))
        },
        {
          id: "admin-2",
          name: "Father Rodriguez",
          birthday: new Date("1975-06-15"),
          age: calculateAge(new Date("1975-06-15")),
          userType: "Admin",
          position: "Parish Priest",
          isToday: isToday(new Date("1975-06-15")),
          daysUntil: calculateDaysUntilBirthday(new Date("1975-06-15"))
        },
        // Members
        {
          id: "member-1",
          name: "John Michael Santos",
          birthday: new Date("2005-03-15"),
          age: calculateAge(new Date("2005-03-15")),
          userType: "Member",
          serviceLevel: "Senior Server",
          isToday: isToday(new Date("2005-03-15")),
          daysUntil: calculateDaysUntilBirthday(new Date("2005-03-15"))
        },
        {
          id: "member-2",
          name: "Maria Grace Cruz",
          birthday: new Date("2006-07-22"),
          age: calculateAge(new Date("2006-07-22")),
          userType: "Member",
          serviceLevel: "Junior",
          isToday: isToday(new Date("2006-07-22")),
          daysUntil: calculateDaysUntilBirthday(new Date("2006-07-22"))
        },
        {
          id: "member-3",
          name: "David Paul Rodriguez",
          birthday: new Date("2004-11-08"),
          age: calculateAge(new Date("2004-11-08")),
          userType: "Member",
          serviceLevel: "Senior Server",
          isToday: isToday(new Date("2004-11-08")),
          daysUntil: calculateDaysUntilBirthday(new Date("2004-11-08"))
        },
        {
          id: "member-4",
          name: "Sarah Joy Kim",
          birthday: new Date("2005-02-03"),
          age: calculateAge(new Date("2005-02-03")),
          userType: "Member",
          serviceLevel: "Senior Server",
          isToday: isToday(new Date("2005-02-03")),
          daysUntil: calculateDaysUntilBirthday(new Date("2005-02-03"))
        },
        {
          id: "member-5",
          name: "Mark Anthony Dela Cruz",
          birthday: new Date("2006-02-14"),
          age: calculateAge(new Date("2006-02-14")),
          userType: "Member",
          serviceLevel: "Neophyte",
          isToday: isToday(new Date("2006-02-14")),
          daysUntil: calculateDaysUntilBirthday(new Date("2006-02-14"))
        }
      ];

      setBirthdays(sampleBirthdays);
    } catch (error) {
      console.error("Error loading birthdays:", error);
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

  const isToday = (birthday: Date): boolean => {
    const today = new Date();
    return today.getMonth() === birthday.getMonth() && today.getDate() === birthday.getDate();
  };

  const calculateDaysUntilBirthday = (birthday: Date): number => {
    const today = new Date();
    const thisYear = today.getFullYear();
    let nextBirthday = new Date(thisYear, birthday.getMonth(), birthday.getDate());
    
    if (nextBirthday < today) {
      nextBirthday = new Date(thisYear + 1, birthday.getMonth(), birthday.getDate());
    }
    
    const diffTime = nextBirthday.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getServiceLevelColor = (level: string): string => {
    switch (level) {
      case 'Neophyte': return 'bg-blue-100 text-blue-800';
      case 'Junior': return 'bg-green-100 text-green-800';
      case 'Senior Server': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUserTypeColor = (userType: string): string => {
    return userType === 'Admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800';
  };

  const filteredBirthdays = birthdays.filter(person => 
    person.birthday.getMonth() === selectedMonth
  );

  const todaysBirthdays = birthdays.filter(person => person.isToday);
  const upcomingBirthdays = birthdays
    .filter(person => !person.isToday && person.daysUntil <= 30)
    .sort((a, b) => a.daysUntil - b.daysUntil);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-4">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin"
            className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Birthdays</h1>
            <p className="text-sm text-gray-500">Admin and member birthday calendar</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Today's Birthdays */}
        {todaysBirthdays.length > 0 && (
          <div className="bg-gradient-to-r from-pink-400 to-pink-500 rounded-2xl p-6 mb-6 shadow-lg">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white">🎉 Today's Birthdays!</h2>
            </div>
            <div className="space-y-3">
              {todaysBirthdays.map((person) => (
                <div key={person.id} className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-semibold text-lg">{person.name}</h3>
                      <p className="text-white/80">
                        Turning {person.age + 1} today! • {person.userType}
                        {person.position && ` - ${person.position}`}
                        {person.serviceLevel && ` - ${person.serviceLevel}`}
                      </p>
                    </div>
                    <div className="text-2xl">🎂</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Birthdays */}
        {upcomingBirthdays.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm mb-6">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <svg className="w-5 h-5 text-yellow-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Upcoming Birthdays (Next 30 Days)
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {upcomingBirthdays.map((person) => (
                <div key={person.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 font-semibold">
                          {person.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{person.name}</h3>
                        <p className="text-sm text-gray-500">
                          {person.birthday.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} • 
                          Turning {person.age + 1}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUserTypeColor(person.userType)}`}>
                        {person.userType}
                      </span>
                      {person.serviceLevel && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getServiceLevelColor(person.serviceLevel)}`}>
                          {person.serviceLevel}
                        </span>
                      )}
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {person.daysUntil === 1 ? 'Tomorrow' : `In ${person.daysUntil} days`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Month Filter */}
        <div className="bg-white rounded-2xl shadow-sm mb-6">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Browse by Month</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
              {months.map((month, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedMonth(index)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedMonth === index
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {month}
                </button>
              ))}
            </div>

            {/* Monthly Birthday List */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">
                {months[selectedMonth]} Birthdays ({filteredBirthdays.length})
              </h3>
              {filteredBirthdays.length > 0 ? (
                <div className="grid gap-3">
                  {filteredBirthdays.map((person) => (
                    <div key={person.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                          <span className="text-gray-600 font-semibold">
                            {person.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{person.name}</h4>
                          <p className="text-sm text-gray-500">
                            {person.birthday.toLocaleDateString('en-US', { 
                              month: 'long', 
                              day: 'numeric',
                              year: 'numeric' 
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUserTypeColor(person.userType)}`}>
                          {person.userType}
                        </span>
                        {person.serviceLevel && (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getServiceLevelColor(person.serviceLevel)}`}>
                            {person.serviceLevel}
                          </span>
                        )}
                        <span className="text-sm text-gray-500">
                          Age {person.age}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                  </svg>
                  <p className="text-gray-500">No birthdays in {months[selectedMonth]}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}