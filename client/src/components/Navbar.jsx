import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-3xl font-bold text-[#0033FF]">Mathongo</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-10">
            <Link to="/courses" className="text-lg text-gray-700 hover:text-[#0033FF]">Courses</Link>
            <Link to="/test-series" className="text-lg text-gray-700 hover:text-[#0033FF]">Test Series</Link>
            <Link to="/contact" className="text-lg text-gray-700 hover:text-[#0033FF]">Contact Us</Link>
            <Link to="/login" className="text-lg font-medium text-[#0033FF] hover:text-[#0022CC]">Login</Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isOpen ? (
                <XMarkIcon className="block h-6 w-6" />
              ) : (
                <Bars3Icon className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/courses" className="block px-3 py-2 text-lg text-gray-700 hover:text-[#0033FF]">Courses</Link>
            <Link to="/test-series" className="block px-3 py-2 text-lg text-gray-700 hover:text-[#0033FF]">Test Series</Link>
            <Link to="/contact" className="block px-3 py-2 text-lg text-gray-700 hover:text-[#0033FF]">Contact Us</Link>
            <Link to="/login" className="block px-3 py-2 text-lg font-medium text-[#0033FF]">Login</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 