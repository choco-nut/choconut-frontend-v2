import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, FileText, Scale, Lock, Globe, Mail, Phone, Bookmark } from "lucide-react";
import { motion } from "framer-motion";

export default function TermsAndConditions() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("introduction");

  const sections = [
    { id: "introduction", title: "Introduction" },
    { id: "definitions", title: "Definitions" },
    { id: "account", title: "Account Registration" },
    { id: "orders", title: "Orders & Payments" },
    { id: "products", title: "Products Information" },
    { id: "shipping", title: "Shipping & Delivery" },
    { id: "returns", title: "Returns & Refunds" },
    { id: "intellectual", title: "Intellectual Property" },
    { id: "user-content", title: "User Content" },
    { id: "privacy", title: "Privacy & Data" },
    { id: "limitation", title: "Limitation of Liability" },
    { id: "termination", title: "Termination" },
    { id: "governing", title: "Governing Law" },
    { id: "changes", title: "Changes to Terms" },
    { id: "contact", title: "Contact Information" }
  ];

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100; // Account for fixed navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#fffcf8] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-[#4a2c2a]/10 pb-8"
        >
          <div className="flex items-start space-x-6">
            <div className="hidden sm:flex w-16 h-16 bg-[#4a2c2a] rounded-2xl items-center justify-center shadow-xl shadow-[#4a2c2a]/20">
              <Scale className="w-8 h-8 text-[#fffcf8]" />
            </div>
            <div>
              <button
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2 text-[#4a2c2a]/60 hover:text-[#4a2c2a] font-bold uppercase tracking-widest text-[10px] mb-2 transition-colors"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Return to previous</span>
              </button>
              <h1 className="text-4xl md:text-5xl font-black text-[#4a2c2a] tracking-tighter uppercase">Legal Protocol</h1>
              <p className="text-amber-900/60 font-medium italic mt-1">Version 2.0 • Updated {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-[32px] shadow-sm border border-amber-900/5 p-8 sticky top-32">
              <h3 className="font-black text-[#4a2c2a] uppercase tracking-[0.2em] text-xs mb-6 flex items-center">
                <Bookmark className="w-4 h-4 mr-2" />
                Articles
              </h3>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl transition-all text-sm font-bold ${
                      activeSection === section.id
                        ? "bg-[#4a2c2a] text-[#fffcf8] shadow-lg shadow-[#4a2c2a]/20"
                        : "text-[#4a2c2a]/40 hover:text-[#4a2c2a] hover:bg-amber-900/5"
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <div className="bg-white rounded-[40px] shadow-sm border border-amber-900/5 p-8 md:p-12">
              
              {/* Introduction */}
              <section id="introduction" className="mb-16 scroll-mt-32">
                <div className="flex items-center space-x-3 mb-6">
                  <span className="text-[#4a2c2a]/20 font-black text-4xl">01</span>
                  <h2 className="text-2xl font-black text-[#4a2c2a] uppercase tracking-tight">Executive Summary</h2>
                </div>
                <div className="space-y-4 text-amber-900/80 leading-relaxed font-medium">
                  <p>
                    Welcome to the digital home of <span className="text-[#4a2c2a] font-bold">ChocoNut Artisan Boutique</span>. 
                    These Terms and Conditions constitute a legally binding agreement between you and our gourmet collective.
                  </p>
                  <div className="bg-[#fffcf8] border-l-4 border-[#4a2c2a] p-6 rounded-r-2xl italic">
                    By engaging with our boutique, you acknowledge that you have refined your understanding of these terms 
                    and agree to be bound by our operational protocols.
                  </div>
                </div>
              </section>

              {/* Account Registration */}
              <section id="account" className="mb-16 scroll-mt-32">
                <div className="flex items-center space-x-3 mb-6">
                  <span className="text-[#4a2c2a]/20 font-black text-4xl">03</span>
                  <h2 className="text-2xl font-black text-[#4a2c2a] uppercase tracking-tight">Member Credentials</h2>
                </div>
                <div className="space-y-4 text-amber-900/80 leading-relaxed font-medium">
                  <p>Membership within the ChocoNut circle requires the maintenance of accurate and high-security credentials:</p>
                  <ul className="space-y-3">
                    {[
                      "Provision of verified and current contact data.",
                      "Absolute confidentiality of your vintage access keys (passwords).",
                      "Full liability for transactions initiated under your signature."
                    ].map((item, i) => (
                      <li key={i} className="flex items-start space-x-3">
                        <div className="mt-2 w-1.5 h-1.5 rounded-full bg-[#4a2c2a]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* Shipping & Delivery */}
              <section id="shipping" className="mb-16 scroll-mt-32">
                <div className="flex items-center space-x-3 mb-6">
                  <span className="text-[#4a2c2a]/20 font-black text-4xl">06</span>
                  <h2 className="text-2xl font-black text-[#4a2c2a] uppercase tracking-tight">Logistics & Transit</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="p-6 rounded-3xl bg-[#fffcf8] border border-amber-900/5">
                    <h4 className="font-black text-[#4a2c2a] text-xs uppercase tracking-widest mb-2">Preservation</h4>
                    <p className="text-sm text-amber-900/70">Our products are temperature-controlled. Delivery timelines are optimized for freshness.</p>
                  </div>
                  <div className="p-6 rounded-3xl bg-[#fffcf8] border border-amber-900/5">
                    <h4 className="font-black text-[#4a2c2a] text-xs uppercase tracking-widest mb-2">Coverage</h4>
                    <p className="text-sm text-amber-900/70">We currently serve all major Indian territories via our premium logistics partners.</p>
                  </div>
                </div>
              </section>

              {/* Privacy & Data */}
              <section id="privacy" className="mb-16 scroll-mt-32">
                <div className="flex items-center space-x-3 mb-6">
                  <span className="text-[#4a2c2a]/20 font-black text-4xl">10</span>
                  <h2 className="text-2xl font-black text-[#4a2c2a] uppercase tracking-tight">Data Sovereignty</h2>
                </div>
                <div className="bg-[#4a2c2a] rounded-[32px] p-8 text-[#fffcf8]">
                  <Shield className="w-8 h-8 mb-4 opacity-50" />
                  <p className="font-medium leading-relaxed opacity-90">
                    We employ military-grade encryption to ensure your personal taste profile and financial data 
                    remain strictly between us. We never trade your details with third-party vendors.
                  </p>
                </div>
              </section>

              {/* Contact Information */}
              <section id="contact" className="mb-8 scroll-mt-32">
                <h2 className="text-2xl font-black text-[#4a2c2a] uppercase tracking-tight mb-8">Direct Correspondence</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-900/5 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-[#4a2c2a]" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-amber-900/40 mb-1">Electronic Mail</p>
                      <p className="text-[#4a2c2a] font-bold">concierge@choconut.com</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-900/5 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-[#4a2c2a]" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-amber-900/40 mb-1">Tele-Support</p>
                      <p className="text-[#4a2c2a] font-bold">+91 1800 123 4567</p>
                    </div>
                  </div>
                </div>
              </section>

              <div className="mt-16 pt-8 border-t border-amber-900/5 flex flex-col items-center">
                <div className="w-12 h-1 bg-[#4a2c2a] rounded-full mb-6 opacity-20" />
                <p className="text-center text-amber-900/40 text-[10px] font-black uppercase tracking-[0.4em]">
                  End of Protocol • ChocoNut Artisan Collective
                </p>
              </div>

            </div>
          </main>
        </div>
      </div>
    </div>
  );
}