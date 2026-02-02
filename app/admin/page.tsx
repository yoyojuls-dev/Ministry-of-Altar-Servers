// app/admin/page.tsx - Updated Admin Dashboard with notification bell and MAS logo
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";

interface Notification {
  id: string;
  message: string;
  type: 'update' | 'change' | 'reminder';
  timestamp: Date;
  isRead: boolean;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.userType !== "ADMIN") {
      router.push("/member/dashboard");
      return;
    }

    if (status === "unauthenticated") {
      router.push("/admin/login");
      return;
    }

    // Load sample data
    loadSampleData();
  }, [session, status, router]);

  const loadSampleData = () => {
    // Sample notifications
    const sampleNotifications: Notification[] = [
      {
        id: "1",
        message: "Monthly Meeting on February 1st, 2026 (Sunday - 1pm & 2pm Purpose Hall)",
        type: "reminder",
        timestamp: new Date("2026-01-31"),
        isRead: false
      },
      {
        id: "2",
        message: "Birthday of Juan Cruz",
        type: "update",
        timestamp: new Date("2026-01-30"),
        isRead: false
      },
      {
        id: "3",
        message: "New member John Santos has been added",
        type: "change",
        timestamp: new Date("2026-01-29"),
        isRead: true
      },
      {
        id: "4",
        message: "Sunday Mass attendance updated",
        type: "update",
        timestamp: new Date("2026-01-28"),
        isRead: false
      },
      {
        id: "5",
        message: "Maria Cruz completed altar server training",
        type: "change",
        timestamp: new Date("2026-01-27"),
        isRead: true
      }
    ];
    
    setNotifications(sampleNotifications);
    setUnreadCount(sampleNotifications.filter(n => !n.isRead).length);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, isRead: true } : n
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, isRead: true }))
    );
    setUnreadCount(0);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'reminder':
        return '📅';
      case 'update':
        return '🔄';
      case 'change':
        return '✨';
      default:
        return '🔔';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return timestamp.toLocaleDateString();
  };

  if (status === "loading") {
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
        <div className="flex items-center justify-between">
          {/* Left - Notification Bell and Welcome */}
          <div className="flex items-center space-x-4">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors relative"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute top-12 left-0 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                      <button
                        onClick={markAllAsRead}
                        className="text-blue-600 text-sm font-medium hover:text-blue-700"
                      >
                        Mark all read
                      </button>
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                          !notification.isRead ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{formatTimestamp(notification.timestamp)}</p>
                          </div>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Welcome Text */}
            <div>
              <p className="text-sm text-gray-500">Welcome back!</p>
              <h1 className="text-xl font-semibold text-gray-900">
                {session?.user?.name || 'Admin Admin'}
              </h1>
            </div>
          </div>

          {/* Right - MAS Logo */}
          <div className="flex items-center space-x-4">
            <div className="relative w-16 h-12">
              <Image
                src="/images/MAS LOGO.png"
                alt="Ministry of Altar Servers Logo"
                fill
                sizes="64px"
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Close notifications when clicking outside */}
      {showNotifications && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowNotifications(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="p-6">
        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* User Management Icons */}
        <div className="flex justify-end space-x-3 mb-6">
          <Link
            href="/admin/profile"
            className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </Link>
          <Link
            href="/admin/members"
            className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m9 5.197v0M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </Link>
        </div>

        {/* Main Dashboard Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Monthly Meeting */}
          <Link
            href="/admin/monthly-meeting"
            className="bg-gradient-to-br from-orange-400 to-orange-500 p-6 rounded-2xl text-white hover:from-orange-500 hover:to-orange-600 transition-all transform hover:scale-105 shadow-lg"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">1st Sunday of the Month</span>
            </div>
            <h3 className="text-lg font-bold mb-1">Monthly</h3>
            <h3 className="text-lg font-bold">Meeting</h3>
          </Link>

          {/* Sunday Groups */}
          <Link
            href="/admin/sunday-groups"
            className="bg-white p-6 rounded-2xl hover:shadow-xl transition-all transform hover:scale-105 shadow-lg border border-gray-100"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Sunday Service</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Sunday</h3>
            <h3 className="text-lg font-bold text-gray-900">Groups</h3>
          </Link>

          {/* Daily Masses */}
          <Link
            href="/admin/daily-masses"
            className="bg-white p-6 rounded-2xl hover:shadow-xl transition-all transform hover:scale-105 shadow-lg border border-gray-100"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Daily Attendance</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Daily</h3>
            <h3 className="text-lg font-bold text-gray-900">Masses</h3>
          </Link>

          {/* Event Tracker */}
          <Link
            href="/admin/events"
            className="bg-white p-6 rounded-2xl hover:shadow-xl transition-all transform hover:scale-105 shadow-lg border border-gray-100"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z" />
                </svg>
              </div>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Event List</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Event</h3>
            <h3 className="text-lg font-bold text-gray-900">Tracker</h3>
          </Link>
        </div>

        {/* Upcoming Notifications */}
        <div className="bg-gradient-to-r from-red-400 to-red-500 rounded-2xl p-4 mb-6 shadow-lg">
          <div className="flex items-center mb-3">
            <span className="bg-white text-red-500 px-2 py-1 rounded-full text-xs font-semibold mr-2">!</span>
            <h3 className="text-white font-semibold">UPCOMING</h3>
          </div>
          <div className="space-y-2">
            <div className="text-white text-sm flex items-start">
              <div className="w-1.5 h-1.5 bg-white rounded-full mr-2 mt-2 flex-shrink-0"></div>
              <span>Monthly Meeting on February 1st, 2026 (Sunday - 1pm & 2pm Purpose Hall)</span>
            </div>
            <div className="text-white text-sm flex items-start">
              <div className="w-1.5 h-1.5 bg-white rounded-full mr-2 mt-2 flex-shrink-0"></div>
              <span>Birthday of Juan Cruz</span>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="bg-blue-800 rounded-2xl p-4">
          <div className="flex justify-center space-x-8">
            <Link
              href="/admin"
              className="flex flex-col items-center text-white hover:text-blue-200 transition-colors"
            >
              <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
              <span className="text-xs">Home</span>
            </Link>
            <Link
              href="/admin/messages"
              className="flex flex-col items-center text-white/70 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="text-xs">Messages</span>
            </Link>
            <Link
              href="/admin/birthdays"
              className="flex flex-col items-center text-white/70 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m9 5.197v0M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className="text-xs">Birthdays</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}