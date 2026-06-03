import { Facebook, Twitter, Instagram, Heart, Mail, Phone, MapPin } from "lucide-react";
import { memo } from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#4a2c2a] text-[#fffcf8] pt-16 pb-8 border-t border-amber-900/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Story */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-amber-200 rounded-lg flex items-center justify-center">
                <span className="text-[#4a2c2a] font-bold text-xs">CN</span>
              </div>
              <span className="text-2xl font-black tracking-tighter uppercase">
                Choco<span className="text-amber-200">Nut</span>
              </span>
            </div>
            <p className="text-amber-50/60 text-sm leading-relaxed">
              Crafting premium indulgence since 2026. We source only the finest single-origin cocoa beans and sun-dried nuts to bring you a taste of pure luxury.
            </p>
            <div className="flex space-x-4">
              <SocialIcon icon={<Facebook size={18} />} label="Facebook" />
              <SocialIcon icon={<Twitter size={18} />} label="Twitter" />
              <SocialIcon icon={<Instagram size={18} />} label="Instagram" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-amber-200 font-bold uppercase tracking-widest text-xs mb-6">Explore</h4>
            <ul className="space-y-4 text-sm font-medium text-amber-50/70">
              <li><Link to="/shops" className="hover:text-amber-200 transition-colors">Our Shop</Link></li>
              <li><Link to="/orders" className="hover:text-amber-200 transition-colors">Track Orders</Link></li>
              <li><Link to="/wishlist" className="hover:text-amber-200 transition-colors">Your Wishlist</Link></li>
              <li><Link to="/profile" className="hover:text-amber-200 transition-colors">Account Profile</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-amber-200 font-bold uppercase tracking-widest text-xs mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm text-amber-50/70">
              <li className="flex items-center space-x-3">
                <MapPin size={16} className="text-amber-200" />
                <span>Neerolpalam ,Thenhippalam ,Malappurm</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={16} className="text-amber-200" />
                <span>+91 0000000000</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={16} className="text-amber-200" />
                <span>hello@choconut.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-amber-200 font-bold uppercase tracking-widest text-xs mb-6">Newsletter</h4>
            <p className="text-xs text-amber-50/50 mb-4">Join our list for exclusive seasonal releases.</p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="Email address" 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-amber-200 transition-colors"
              />
              <button className="absolute right-2 top-2 bg-amber-200 text-[#4a2c2a] p-1.5 rounded-lg hover:bg-white transition-colors">
                <Mail size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2 text-amber-50/40 text-[10px] font-bold uppercase tracking-widest">
            <span>&copy; {currentYear} ChocoNut</span>
            <span>•</span>
            <div className="flex items-center space-x-1">
              <span>Made with</span>
              <Heart size={10} className="text-rose-400 fill-rose-400" />
              <span>for users</span>
            </div>
          </div>
          
          {/* Payment Icons Placeholder */}
          <div className="flex space-x-4 grayscale opacity-30 hover:opacity-100 transition-opacity">
            <div className="h-6 w-10 bg-white rounded-md" />
            <div className="h-6 w-10 bg-white rounded-md" />
            <div className="h-6 w-10 bg-white rounded-md" />
          </div>
        </div>
      </div>
    </footer>
  );
};

/* --- Helper Component --- */
const SocialIcon = ({ icon, label }) => (
  <a
    href="#"
    aria-label={label}
    className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-amber-200 hover:text-[#4a2c2a] transition-all duration-300"
  >
    {icon}
  </a>
);

export default memo(Footer);