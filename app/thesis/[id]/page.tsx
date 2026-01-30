"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { SafeUser } from "@/types";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface ThesisDetailPageProps {
  currentUser: SafeUser;
  thesisId: string;
}

// Sample thesis data - replace with actual API call
const getThesisById = (id: string) => {
  const thesisData = {
    "1": {
      id: 1,
      title: "Machine Learning Applications in Healthcare Diagnostics",
      author: "John Smith",
      year: 2024,
      category: "Computer Science",
      advisor: "Dr. Jane Doe",
      committee: ["Dr. Jane Doe", "Dr. Michael Brown", "Dr. Sarah Wilson"],
      abstract: "This thesis explores the application of machine learning algorithms in healthcare diagnostics, focusing on improving accuracy and reducing diagnostic time. The research demonstrates how artificial intelligence can revolutionize medical diagnosis by analyzing complex patterns in medical data that might be missed by traditional diagnostic methods. Through extensive testing and validation, this work presents a comprehensive framework for implementing ML solutions in clinical settings.",
      fullDescription: "The healthcare industry is experiencing a paradigm shift with the integration of artificial intelligence and machine learning technologies. This thesis presents a comprehensive study on the application of machine learning algorithms in healthcare diagnostics, with a particular focus on improving diagnostic accuracy and reducing the time required for medical diagnosis.\n\nThe research methodology employed includes extensive data collection from multiple healthcare institutions, algorithm development and testing, and validation through clinical trials. The study demonstrates significant improvements in diagnostic accuracy across various medical conditions, including cardiovascular diseases, neurological disorders, and oncological conditions.\n\nKey contributions of this work include the development of novel machine learning models specifically designed for medical data analysis, the creation of a standardized framework for implementing AI solutions in clinical settings, and the establishment of best practices for ensuring patient privacy and data security in AI-driven healthcare systems.",
      keywords: ["Machine Learning", "Healthcare", "Diagnostics", "Artificial Intelligence", "Medical Technology"],
      downloads: 245,
      views: 1520,
      rating: 4.8,
      totalRatings: 32,
      pdfUrl: "/pdfs/thesis-1.pdf",
      fileSize: "2.3 MB",
      pages: 145,
      language: "English",
      submissionDate: "2024-05-15",
      approvalDate: "2024-06-20",
      department: "Department of Computer Science",
      university: "State University",
      degree: "Master of Science in Computer Science",
      citation: "Smith, J. (2024). Machine Learning Applications in Healthcare Diagnostics. Master's thesis, State University.",
      references: [
        "Johnson, A. (2023). AI in Healthcare: Current Trends and Future Prospects. Medical AI Journal, 15(3), 45-62.",
        "Brown, M., & Davis, L. (2022). Machine Learning for Medical Diagnosis: A Comprehensive Review. Healthcare Technology Review, 8(2), 123-145.",
        "Wilson, S. (2023). Ethical Considerations in AI-Driven Healthcare. Ethics in Technology, 12(4), 78-95."
      ]
    }
  };
  
  return thesisData[id as keyof typeof thesisData] || null;
};

const ThesisDetailPage: React.FC<ThesisDetailPageProps> = ({ currentUser, thesisId }) => {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [userRating, setUserRating] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const thesis = getThesisById(thesisId);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    signOut({ redirect: false }).then(() => {
      router.push("/");
      router.refresh();
    });
  };

  const handleDownload = () => {
    if (thesis) {
      // In a real app, you'd track the download
      window.open(thesis.pdfUrl, '_blank');
    }
  };

  const handleRating = (rating: number) => {
    setUserRating(rating);
    // In a real app, you'd save this to the database
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // In a real app, you'd save this to the database
  };

  if (!thesis) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Thesis Not Found</h1>
          <p className="text-gray-600 mb-4">The thesis you're looking for doesn't exist.</p>
          <Link href="/browse" className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors">
            Back to Browse
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Sidebar Navigation - Same as Browse */}
      <aside className="w-64 bg-white shadow-lg fixed left-0 top-0 bottom-0 overflow-y-auto z-20">
        <div className="p-6 border-b border-gray-200">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
              <img 
                src="/images/department-logo.png" 
                alt="Department Logo"
                className="w-8 h-8 object-contain"
              />
            </div>
          </Link>
        </div>

        <nav className="p-4 space-y-2">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home
          </Link>

          <Link href="/browse" className="flex items-center gap-3 px-4 py-3 bg-red-50 text-red-600 rounded-lg font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Browse
          </Link>

          <Link href="/categories" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Categories
          </Link>

          <Link href="/favorites" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            Favorites
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64">
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/browse" className="text-red-600 hover:text-red-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">Thesis Details</h1>
            </div>

            {/* User Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center gap-3 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
              >
                <div className="w-9 h-9 bg-red-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {currentUser.name?.charAt(0).toUpperCase()}
                </div>
              </button>

              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-200">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-900">{currentUser.name}</p>
                    <p className="text-xs text-gray-600 truncate">{currentUser.email}</p>
                  </div>
                  <div className="py-1">
                    <Link href="/profile" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Thesis Content */}
        <div className="p-8">
          <div className="max-w-5xl mx-auto">
            {/* Thesis Header */}
            <div className="bg-white rounded-lg shadow-md p-8 mb-6">
              <div className="flex gap-8">
                {/* Thesis Cover */}
                <div className="w-48 h-64 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex-shrink-0 flex items-center justify-center relative">
                  <div className="text-white text-center">
                    <div className="text-lg font-bold mb-2">{thesis.category}</div>
                    <div className="text-sm opacity-90">{thesis.year}</div>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>

                {/* Thesis Info */}
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">{thesis.title}</h1>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-600">Author</p>
                      <p className="font-medium text-gray-900">{thesis.author}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Advisor</p>
                      <p className="font-medium text-gray-900">{thesis.advisor}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Year</p>
                      <p className="font-medium text-gray-900">{thesis.year}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Department</p>
                      <p className="font-medium text-gray-900">{thesis.department}</p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleRating(star)}
                          className={`w-6 h-6 ${
                            star <= (userRating || thesis.rating) 
                              ? "text-yellow-500" 
                              : "text-gray-300"
                          }`}
                        >
                          <svg fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        </button>
                      ))}
                      <span className="text-sm text-gray-600 ml-2">
                        {thesis.rating} ({thesis.totalRatings} ratings)
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <button
                      onClick={handleDownload}
                      className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download PDF
                    </button>
                    <button
                      onClick={toggleFavorite}
                      className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                        isFavorite 
                          ? "bg-red-100 text-red-600 border border-red-200" 
                          : "bg-gray-100 text-gray-600 border border-gray-200"
                      }`}
                    >
                      <svg className="w-5 h-5" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {isFavorite ? "Favorited" : "Add to Favorites"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="border-b border-gray-200">
                <nav className="flex">
                  {[
                    { id: "overview", label: "Overview" },
                    { id: "abstract", label: "Abstract" },
                    { id: "details", label: "Details" },
                    { id: "references", label: "References" }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? "border-red-600 text-red-600"
                          : "border-transparent text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-8">
                {activeTab === "overview" && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Overview</h3>
                    <p className="text-gray-700 mb-6 leading-relaxed">{thesis.abstract}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">{thesis.downloads}</div>
                        <div className="text-sm text-gray-600">Downloads</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{thesis.views}</div>
                        <div className="text-sm text-gray-600">Views</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{thesis.pages}</div>
                        <div className="text-sm text-gray-600">Pages</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{thesis.fileSize}</div>
                        <div className="text-sm text-gray-600">File Size</div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "abstract" && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Abstract</h3>
                    <div className="prose max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">{thesis.fullDescription}</p>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="font-semibold text-gray-900 mb-2">Keywords</h4>
                      <div className="flex flex-wrap gap-2">
                        {thesis.keywords.map((keyword, index) => (
                          <span
                            key={index}
                            className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "details" && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Thesis Details</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-600">Degree</p>
                          <p className="font-medium text-gray-900">{thesis.degree}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">University</p>
                          <p className="font-medium text-gray-900">{thesis.university}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Language</p>
                          <p className="font-medium text-gray-900">{thesis.language}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Submission Date</p>
                          <p className="font-medium text-gray-900">{new Date(thesis.submissionDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-600">Committee Members</p>
                          <ul className="list-disc list-inside text-gray-900">
                            {thesis.committee.map((member, index) => (
                              <li key={index}>{member}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Approval Date</p>
                          <p className="font-medium text-gray-900">{new Date(thesis.approvalDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8">
                      <h4 className="font-semibold text-gray-900 mb-2">Citation</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-700 font-mono">{thesis.citation}</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "references" && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">References</h3>
                    <div className="space-y-4">
                      {thesis.references.map((reference, index) => (
                        <div key={index} className="border-l-4 border-red-200 pl-4">
                          <p className="text-gray-700 text-sm">{reference}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ThesisDetailPage;