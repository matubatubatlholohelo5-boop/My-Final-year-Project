import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">DriverTrack</h3>
            <p className="text-gray-300 text-sm">
              Professional driver management and performance tracking system.
            </p>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="/" className="hover:text-teal-400 transition-colors">Home</a></li>
              <li><a href="/login" className="hover:text-teal-400 transition-colors">Login</a></li>
              <li><a href="/register" className="hover:text-teal-400 transition-colors">Register</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-3">Contact</h4>
            <p className="text-gray-300 text-sm">
              Email: support@drivertrack.com<br />
              Phone: (555) 123-4567
            </p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
          <p>© 2025 DriverTrack. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;