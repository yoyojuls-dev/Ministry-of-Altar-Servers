import Link from "next/link";
import Container from "../Container";
import FooterList from "./FooterList";

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-b from-gray-800 to-gray-900 text-white text-sm mt-4 overflow-hidden">
      {/* Animated Background */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "url('/images/thesis-bg.gif')",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
        }}
      />
      
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/90 to-gray-800/80" />

      <Container>
        <div className="relative z-10">
          {/* Top Section with Logo */}
          <div className="flex flex-col items-center pt-3 pb-2 border-b border-gray-700">
            <div className="flex items-center gap-2 mb-1">
              <img 
                src="/images/department-logo.png" 
                alt="Department Logo"
                className="w-8 h-8 object-contain"
              />
              <div className="text-center">
                <h2 className="text-base font-bold text-red-500">
                  THESIS ARCHIVE MANAGEMENT SYSTEM
                </h2>
                <p className="text-[10px] text-gray-400">
                  Computer Studies Department
                </p>
              </div>
            </div>
          </div>

          {/* Main Footer Content */}
          <div className="flex flex-col md:flex-row justify-between py-3 gap-4">
            <FooterList>
              <h3 className="text-sm font-bold mb-1 text-red-500">Quick Links</h3>
              <Link href="/" className="hover:text-red-400 transition-colors text-xs">Home</Link>
              <Link href="/thesis" className="hover:text-red-400 transition-colors text-xs">Browse Thesis</Link>
              <Link href="/about" className="hover:text-red-400 transition-colors text-xs">About</Link>
              <Link href="/contact" className="hover:text-red-400 transition-colors text-xs">Contact</Link>
              <Link href="/help" className="hover:text-red-400 transition-colors text-xs">Help Center</Link>
            </FooterList>

            <FooterList>
              <h3 className="text-sm font-bold mb-1 text-red-500">For Students</h3>
              <Link href="/submit" className="hover:text-red-400 transition-colors text-xs">Submit Thesis</Link>
              <Link href="/guidelines" className="hover:text-red-400 transition-colors text-xs">Submission Guidelines</Link>
              <Link href="/resources" className="hover:text-red-400 transition-colors text-xs">Resources</Link>
              <Link href="/faq" className="hover:text-red-400 transition-colors text-xs">FAQs</Link>
            </FooterList>

            <FooterList>
              <h3 className="text-sm font-bold mb-1 text-red-500">Categories</h3>
              <Link href="/category/cs" className="hover:text-red-400 transition-colors text-xs">Computer Science</Link>
              <Link href="/category/it" className="hover:text-red-400 transition-colors text-xs">Information Technology</Link>
              <Link href="/category/is" className="hover:text-red-400 transition-colors text-xs">Information Systems</Link>
              <Link href="/category/da" className="hover:text-red-400 transition-colors text-xs">Data Analytics</Link>
            </FooterList>

            <div className="w-full md:w-1/3 mb-4 md:mb-0">
              <h3 className="text-sm font-bold mb-1 text-red-500">About</h3>
              <p className="text-gray-300 text-xs leading-relaxed">
                Digital repository for thesis documents from the Computer Studies Department.
              </p>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700 py-2">
            <div className="flex flex-col md:flex-row justify-between items-center gap-2">
              <p className="text-gray-400 text-[10px]">
                &copy; {new Date().getFullYear()} Thesis Archive Management System. All rights reserved
              </p>
              <div className="flex gap-4 text-[10px] text-gray-400">
                <Link href="/privacy" className="hover:text-red-400 transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="hover:text-red-400 transition-colors">
                  Terms of Service
                </Link>
                <Link href="/accessibility" className="hover:text-red-400 transition-colors">
                  Accessibility
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;