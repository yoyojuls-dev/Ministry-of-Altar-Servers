// "use client";

// import Link from "next/link";
// import { SafeUser } from "@/types";
// import { useState, useRef, useEffect } from "react";
// import { signOut } from "next-auth/react";
// import { useRouter } from "next/navigation";

// interface BrowsePageProps {
//   currentUser: SafeUser;
// }

// // Sample thesis data - replace with your actual API call
// const sampleThesis = [
//   {
//     id: 1,
//     title: "Machine Learning Applications in Healthcare Diagnostics",
//     author: "John Smith",
//     year: 2024,
//     category: "Computer Science",
//     advisor: "Dr. Jane Doe",
//     abstract: "This thesis explores the application of machine learning algorithms in healthcare diagnostics, focusing on improving accuracy and reducing diagnostic time.",
//     downloads: 245,
//     views: 1520,
//     rating: 4.8,
//     pdfUrl: "/pdfs/thesis-1.pdf",
//   },
//   {
//     id: 2,
//     title: "Blockchain Technology for Supply Chain Management",
//     author: "Maria Garcia",
//     year: 2024,
//     category: "Information Technology", 
//     advisor: "Dr. Robert Johnson",
//     abstract: "An innovative approach to implementing blockchain technology in supply chain management systems to enhance transparency and security.",
//     downloads: 189,
//     views: 892,
//     rating: 4.5,
//     pdfUrl: "/pdfs/thesis-2.pdf",
//   },
//   {
//     id: 3,
//     title: "IoT Security Framework for Smart Cities",
//     author: "David Chen",
//     year: 2023,
//     category: "Information Systems",
//     advisor: "Dr. Sarah Williams",
//     abstract: "Development of a comprehensive security framework for Internet of Things devices in smart city infrastructures.",
//     downloads: 312,
//     views: 1205,
//     rating: 4.7,
//     pdfUrl: "/pdfs/thesis-3.pdf",
//   },
//   {
//     id: 4,
//     title: "Data Analytics in E-commerce Personalization",
//     author: "Lisa Thompson",
//     year: 2023,
//     category: "Data Analytics",
//     advisor: "Dr. Michael Brown",
//     abstract: "Utilizing big data analytics to create personalized shopping experiences in e-commerce platforms.",
//     downloads: 276,
//     views: 983,
//     rating: 4.6,
//     pdfUrl: "/pdfs/thesis-4.pdf",
//   },
//   {
//     id: 5,
//     title: "Artificial Intelligence in Educational Technology",
//     author: "Robert Anderson",
//     year: 2023,
//     category: "Computer Science",
//     advisor: "Dr. Emily Davis",
//     abstract: "Integration of AI technologies in educational platforms to enhance learning outcomes and student engagement.",
//     downloads: 198,
//     views: 756,
//     rating: 4.4,
//     pdfUrl: "/pdfs/thesis-5.pdf",
//   },
//   {
//     id: 6,
//     title: "Cybersecurity in Financial Technology",
//     author: "Jennifer Wilson",
//     year: 2022,
//     category: "Information Technology",
//     advisor: "Dr. Christopher Lee",
//     abstract: "Comprehensive analysis of cybersecurity threats and solutions in the rapidly evolving fintech industry.",
//     downloads: 423,
//     views: 1678,
//     rating: 4.9,
//     pdfUrl: "/pdfs/thesis-6.pdf",
//   }
// ];

// const BrowsePage: React.FC<BrowsePageProps> = ({ currentUser }) => {
//   const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [selectedYear, setSelectedYear] = useState("All");
//   const [sortBy, setSortBy] = useState("recent");
//   const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
//   const dropdownRef = useRef<HTMLDivElement>(null);
//   const router = useRouter();

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setIsUserDropdownOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleLogout = () => {
//     signOut({ redirect: false }).then(() => {
//       router.push("/");
//       router.refresh();
//     });
//   };

//   // Filter and sort thesis
//   const filteredThesis = sampleThesis.filter(thesis => {
//     const matchesSearch = thesis.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                          thesis.author.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesCategory = selectedCategory === "All" || thesis.category === selectedCategory;
//     const matchesYear = selectedYear === "All" || thesis.year.toString() === selectedYear;
    
//     return matchesSearch && matchesCategory && matchesYear;
//   });

//   const sortedThesis = [...filteredThesis].sort((a, b) => {
//     switch (sortBy) {
//       case "recent":
//         return b.year - a.year;
//       case "popular":
//         return b.downloads - a.downloads;
//       case "rating":
//         return b.rating - a.rating;
//       case "title":
//         return a.title.localeCompare(b.title);
//       default:
//         return 0;
//     }
//   });

//   const categories = ["All", "Computer Science", "Information Technology", "Information Systems", "Data Analytics"];
//   const years = ["All", "2024", "2023", "2022", "2021"];

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       {/* Left Sidebar Navigation - Same as Dashboard */}
//       <aside className="w-64 bg-white shadow-lg fixed left-0 top-0 bottom-0 overflow-y-auto z-20">
//         {/* Logo at top of sidebar */}
//         <div className="p-6 border-b border-gray-200">
//           <Link href="/" className="flex items-center gap-3">
//             <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
//               <img 
//                 src="/images/department-logo.png" 
//                 alt="Department Logo"
//                 className="w-8 h-8 object-contain"
//               />
//             </div>
//           </Link>
//         </div>

//         {/* Navigation Menu */}
//         <nav className="p-4 space-y-2">
//           {/* Home */}
//           <Link
//             href="/"
//             className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
//           >
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
//             </svg>
//             Home
//           </Link>

//           {/* Browse - Active */}
//           <Link
//             href="/browse"
//             className="flex items-center gap-3 px-4 py-3 bg-red-50 text-red-600 rounded-lg font-medium"
//           >
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//             </svg>
//             Browse
//           </Link>

//           {/* Categories */}
//           <Link
//             href="/categories"
//             className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
//           >
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
//             </svg>
//             Categories
//           </Link>

//           {/* Favorites */}
//           <Link
//             href="/favorites"
//             className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
//           >
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
//             </svg>
//             Favorites
//           </Link>

//           {/* Divider */}
//           <div className="border-t border-gray-200 my-4"></div>

//           {/* Admin Panel - Only for admins */}
//           {currentUser.role === 'ADMIN' && (
//             <Link
//               href="/admin"
//               className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
//             >
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//               </svg>
//               Admin Panel
//             </Link>
//           )}

//           {/* Settings */}
//           <Link
//             href="/settings"
//             className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
//           >
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//             </svg>
//             Settings
//           </Link>

//           {/* Bottom Links */}
//           <div className="pt-4 space-y-1">
//             <Link href="/about" className="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
//               About
//             </Link>
//             <Link href="/support" className="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
//               Support
//             </Link>
//             <Link href="/terms" className="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
//               Terms & Condition
//             </Link>
//           </div>
//         </nav>
//       </aside>

//       {/* Main Content Area */}
//       <main className="flex-1 ml-64">
//         {/* Top Bar */}
//         <div className="bg-white shadow-sm border-b border-gray-200 px-8 py-4">
//           <div className="flex items-center justify-between">
//             {/* Search Bar */}
//             <div className="flex-1 max-w-2xl">
//               <div className="relative">
//                 <button className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm flex items-center gap-1">
//                   Advanced
//                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                   </svg>
//                 </button>
//                 <input
//                   type="text"
//                   placeholder="Search thesis..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="w-full pl-28 pr-12 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
//                 />
//                 <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-600">
//                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                   </svg>
//                 </button>
//               </div>
//             </div>

//             {/* Right Section: User Dropdown */}
//             <div className="flex items-center gap-6 ml-8">
//               {/* Time */}
//               <div className="flex items-center gap-2 text-gray-600">
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//                 <span className="text-sm font-medium">09:00 AM</span>
//               </div>

//               {/* Date */}
//               <div className="flex items-center gap-2 text-gray-600">
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                 </svg>
//                 <span className="text-sm font-medium">12-JULY-2025</span>
//               </div>

//               {/* Notifications */}
//               <button className="relative p-2 text-gray-600 hover:text-red-600 transition-colors">
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
//                 </svg>
//                 <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
//               </button>

//               {/* User Dropdown */}
//               <div className="relative" ref={dropdownRef}>
//                 <button
//                   onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
//                   className="flex items-center gap-3 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
//                 >
//                   <div className="w-9 h-9 bg-red-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
//                     {currentUser.name?.charAt(0).toUpperCase()}
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <span className="text-sm font-medium text-gray-700">{currentUser.role || 'USER'}</span>
//                     <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                     </svg>
//                   </div>
//                 </button>

//                 {/* Dropdown Menu */}
//                 {isUserDropdownOpen && (
//                   <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-200">
//                     <div className="px-4 py-3 border-b border-gray-200">
//                       <p className="text-sm font-semibold text-gray-900">{currentUser.name}</p>
//                       <p className="text-xs text-gray-600 truncate">{currentUser.email}</p>
//                     </div>
//                     <div className="py-1">
//                       <Link href="/profile" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
//                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                         </svg>
//                         My Profile
//                       </Link>
//                       <Link href="/favorites" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
//                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
//                         </svg>
//                         Favorites
//                       </Link>
//                     </div>
//                     <div className="border-t border-gray-200 py-1">
//                       <button
//                         onClick={handleLogout}
//                         className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
//                       >
//                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//                         </svg>
//                         Logout
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Browse Content */}
//         <div className="p-8">
//           {/* Page Header */}
//           <div className="mb-8">
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Thesis</h1>
//             <p className="text-gray-600">Explore our collection of academic research and thesis documents</p>
//           </div>

//           {/* Filters and Controls */}
//           <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
//               {/* Category Filter */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
//                 <select
//                   value={selectedCategory}
//                   onChange={(e) => setSelectedCategory(e.target.value)}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
//                 >
//                   {categories.map(category => (
//                     <option key={category} value={category}>{category}</option>
//                   ))}
//                 </select>
//               </div>

//               {/* Year Filter */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
//                 <select
//                   value={selectedYear}
//                   onChange={(e) => setSelectedYear(e.target.value)}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
//                 >
//                   {years.map(year => (
//                     <option key={year} value={year}>{year}</option>
//                   ))}
//                 </select>
//               </div>

//               {/* Sort By */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
//                 <select
//                   value={sortBy}
//                   onChange={(e) => setSortBy(e.target.value)}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
//                 >
//                   <option value="recent">Most Recent</option>
//                   <option value="popular">Most Downloaded</option>
//                   <option value="rating">Highest Rated</option>
//                   <option value="title">Title A-Z</option>
//                 </select>
//               </div>

//               {/* View Mode */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">View</label>
//                 <div className="flex bg-gray-100 rounded-lg p-1">
//                   <button
//                     onClick={() => setViewMode("grid")}
//                     className={`flex-1 py-1 px-3 rounded text-sm font-medium transition-colors ${
//                       viewMode === "grid" 
//                         ? "bg-white text-red-600 shadow-sm" 
//                         : "text-gray-600 hover:text-gray-900"
//                     }`}
//                   >
//                     Grid
//                   </button>
//                   <button
//                     onClick={() => setViewMode("list")}
//                     className={`flex-1 py-1 px-3 rounded text-sm font-medium transition-colors ${
//                       viewMode === "list" 
//                         ? "bg-white text-red-600 shadow-sm" 
//                         : "text-gray-600 hover:text-gray-900"
//                     }`}
//                   >
//                     List
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Results Count */}
//             <div className="text-sm text-gray-600">
//               Showing {sortedThesis.length} of {sampleThesis.length} thesis
//             </div>
//           </div>

//           {/* Thesis Grid/List */}
//           {viewMode === "grid" ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//               {sortedThesis.map((thesis) => (
//                 <Link
//                   key={thesis.id}
//                   href={`/thesis/${thesis.id}`}
//                   className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
//                 >
//                   {/* Thesis Thumbnail */}
//                   <div className="h-48 bg-gradient-to-br from-red-600 to-red-700 p-4 flex items-center justify-center relative">
//                     <div className="text-white text-center">
//                       <div className="text-lg font-bold mb-2">{thesis.category}</div>
//                       <div className="text-sm opacity-90">{thesis.year}</div>
//                     </div>
//                     <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm rounded-full p-1">
//                       <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
//                       </svg>
//                     </div>
//                   </div>

//                   {/* Thesis Info */}
//                   <div className="p-4">
//                     <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
//                       {thesis.title}
//                     </h3>
//                     <p className="text-sm text-gray-600 mb-2">by {thesis.author}</p>
//                     <p className="text-xs text-gray-500 mb-3 line-clamp-2">{thesis.abstract}</p>
                    
//                     {/* Stats */}
//                     <div className="flex items-center justify-between text-xs text-gray-500">
//                       <div className="flex items-center gap-3">
//                         <span className="flex items-center gap-1">
//                           <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
//                           </svg>
//                           {thesis.downloads}
//                         </span>
//                         <span className="flex items-center gap-1">
//                           <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                           </svg>
//                           {thesis.views}
//                         </span>
//                       </div>
//                       <div className="flex items-center gap-1">
//                         <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
//                           <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
//                         </svg>
//                         <span>{thesis.rating}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           ) : (
//             /* List View */
//             <div className="space-y-4">
//               {sortedThesis.map((thesis) => (
//                 <Link
//                   key={thesis.id}
//                   href={`/thesis/${thesis.id}`}
//                   className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 flex gap-6"
//                 >
//                   {/* Thesis Thumbnail */}
//                   <div className="w-32 h-44 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex-shrink-0 flex items-center justify-center">
//                     <div className="text-white text-center">
//                       <div className="text-sm font-bold mb-1">{thesis.category}</div>
//                       <div className="text-xs opacity-90">{thesis.year}</div>
//                     </div>
//                   </div>

//                   {/* Thesis Details */}
//                   <div className="flex-1">
//                     <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
//                       {thesis.title}
//                     </h3>
//                     <p className="text-gray-600 mb-2">by {thesis.author}</p>
//                     <p className="text-sm text-gray-500 mb-2">Advisor: {thesis.advisor}</p>
//                     <p className="text-gray-600 mb-4 line-clamp-3">{thesis.abstract}</p>
                    
//                     {/* Stats */}
//                     <div className="flex items-center gap-6 text-sm text-gray-500">
//                       <span className="flex items-center gap-1">
//                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
//                         </svg>
//                         {thesis.downloads} downloads
//                       </span>
//                       <span className="flex items-center gap-1">
//                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                         </svg>
//                         {thesis.views} views
//                       </span>
//                       <span className="flex items-center gap-1">
//                         <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
//                           <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
//                         </svg>
//                         {thesis.rating}
//                       </span>
//                       <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
//                         {thesis.category}
//                       </span>
//                     </div>
//                   </div>

//                   {/* Action Buttons */}
//                   <div className="flex flex-col gap-2">
//                     <button
//                       onClick={(e) => {
//                         e.preventDefault();
//                         window.open(thesis.pdfUrl, '_blank');
//                       }}
//                       className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
//                     >
//                       Download
//                     </button>
//                     <button
//                       onClick={(e) => {
//                         e.preventDefault();
//                         // Add to favorites logic
//                       }}
//                       className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
//                     >
//                       ♡ Favorite
//                     </button>
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           )}

//           {/* No Results */}
//           {sortedThesis.length === 0 && (
//             <div className="text-center py-12">
//               <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//               </svg>
//               <h3 className="text-lg font-medium text-gray-900 mb-2">No thesis found</h3>
//               <p className="text-gray-600">Try adjusting your search criteria or filters</p>
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default BrowsePage;