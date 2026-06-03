import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";

export default function UserLayout() {

  return (
    <div className="relative min-h-screen flex flex-col bg-[#fffcf8]">
      {/* Stick with one consistent Header height */}
      <header className="fixed top-0 z-50 w-full border-b border-amber-900/5 bg-white/80 backdrop-blur-xl">
        <Navbar />
      </header>

      {/* Exact height matching Navbar (h-14 = 56px + py-4 = 32px => 88px) */}
      <main className="flex-grow pt-[87px]">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}