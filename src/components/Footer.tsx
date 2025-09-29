import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-400">DriverTrack</h3>
            <p className="text-gray-400 text-sm">
              Professional driver management and performance tracking system.
            </p>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-blue-400 transition-colors">Home</Link></li>
              <li><Link to="/login" className="hover:text-blue-400 transition-colors">Login</Link></li>
              <li><Link to="/register" className="hover:text-blue-400 transition-colors">Register</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-3">Contact</h4>
            <p className="text-gray-400 text-sm">
              Email: <a href="mailto:Lesotho.support@drivertrack.com" className="hover:text-blue-400 transition-colors">Lesotho.support@drivertrack.com</a><br />
              Phone: <a href="tel:57202831" className="hover:text-blue-400 transition-colors">(+266) 123-4567</a>
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