import { Link } from 'react-router-dom';
import { Globe } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-slate-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content (Desktop & Tablet) */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-12 mb-16">
          
          {/* Column 1 */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Get to Know Us</h3>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">About EXOUSIA</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Press Releases</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Corporate Information</a></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Connect with Us</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <a href="#" className="hover:text-primary transition-colors">Facebook</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">Twitter</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">Instagram</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">YouTube</a>
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Make Money with Us</h3>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">Sell on EXOUSIA</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Protect and Build Your Brand</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Global Selling</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Become an Affiliate</a></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Let Us Help You</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/profile" className="hover:text-primary transition-colors">Your Account</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">Returns Centre</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">100% Purchase Protection</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Help & Support</a></li>
            </ul>
          </div>
          
        </div>

        {/* Mobile Footer Content (Specific Links) */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-4 md:hidden mb-2">
          <ul className="space-y-4 text-sm font-medium text-slate-300">
            <li><Link to="/profile" className="hover:text-white transition-colors">Your EXOUSIA.in</Link></li>
            <li><a href="#" className="hover:text-white transition-colors">EXOUSIA Pay</a></li>
            <li><Link to="/profile" className="hover:text-white transition-colors">Your Account</Link></li>
            <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Sell</a></li>
          </ul>
          <ul className="space-y-4 text-sm font-medium text-slate-300">
            <li><Link to="/profile" className="hover:text-white transition-colors">Your Orders</Link></li>
            <li><a href="#" className="hover:text-white transition-colors">App Download</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Your Lists</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Customer Service</a></li>
          </ul>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 my-8"></div>

        {/* Sub-footer (Logo & Language) */}
        <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0 mb-8">
          <Link to="/" className="text-2xl font-black bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent tracking-tighter">
            EXOUSIA.
          </Link>
          
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 border border-slate-700 rounded-md px-4 py-2 text-sm hover:border-slate-500 transition-colors">
              <Globe size={16} />
              <span>English</span>
            </button>
            <button className="flex items-center space-x-2 border border-slate-700 rounded-md px-4 py-2 text-sm hover:border-slate-500 transition-colors">
              <span className="font-bold text-slate-400">₹</span>
              <span>INR - Indian Rupee</span>
            </button>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-xs text-slate-500 space-y-2">
          <div className="space-x-4">
            <a href="#" className="hover:text-slate-300 transition-colors">Conditions of Use & Sale</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Notice</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Interest-Based Ads</a>
          </div>
          <p>&copy; {new Date().getFullYear()}, EXOUSIA.com, Inc. or its affiliates</p>
        </div>
      </div>
    </footer>
  );
};
