import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../shared/api/apiClient";
import { MapPin, Plus, CheckCircle2, ArrowRight, Home, Truck, User, Phone, Map } from "lucide-react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

import { useUserStore } from "../entities/user/model/useUserStore";

export default function Address() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { cart } = useUserStore();

  const orderId = state?.orderId;
  const [addresses, setAddresses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    address_line: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    // If cart is empty and we are not debugging, redirect to home.
    // This handles the "Back" button case from Order Confirmation.
    if (!cart?.total_items && !orderId) {
      // navigate("/"); // Commented out to prevent aggressive redirects during dev, but logic is sound.
      // Actually, let's enable it as user requested navigation fix.
      if (cart?.total_items === 0) {
        navigate("/", { replace: true });
      }
    }
  }, [cart, navigate, orderId]);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await api.get("/orders/address/");
      setAddresses(res.data);
    } catch (err) {
      console.error("Error fetching addresses", err);
    }
  };

  // Redirect if cart is empty logic is handled in useEffect above

  const handleSave = async () => {
    // PRIORITY 1: If the "Add New" form is visible
    if (isAddingNew || addresses.length === 0) {
      const { full_name, phone, address_line, city, state, pincode } = form;

      // Validate that all fields are filled
      if (!full_name || !phone || !address_line || !city || !state || !pincode) {
        return toast.error("Please fill in all the details for your new address");
      }

      // Success: Navigate with new address
      return navigate("/payment", { state: { new_address: form } });
    }

    // PRIORITY 2: If the user has picked an existing card
    if (selected) {
      // FIX: Send address_id so backend can CLONE the existing address.
      // This prevents creation of unlinked duplicates and leverages backend logic.
      return navigate("/payment", {
        state: {
          address_id: selected.id,
          // Optional: send preview data if needed by payment page UI, but logic relies on ID
        }
      });
    }

    // FALLBACK: Nothing picked and form not open
    toast.error("Please select a delivery destination");
  };

  return (
    <div className="min-h-screen bg-[#fffcf8] py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <header className="mb-12">
          <div className="flex items-center space-x-4 mb-2">
            <div className="w-10 h-10 bg-[#4a2c2a] rounded-xl flex items-center justify-center shadow-lg">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-black text-[#4a2c2a] uppercase tracking-tighter">Shipping Destination</h1>
          </div>
          <p className="text-amber-900/50 font-medium ml-14">Where should we deliver your artisan collection?</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            {/* Saved Addresses Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xs font-black text-[#4a2c2a]/40 uppercase tracking-[0.3em] flex items-center">
                  <Home className="w-4 h-4 mr-2" /> Saved Locations
                </h2>
                {!isAddingNew && (
                  <button
                    onClick={() => setIsAddingNew(true)}
                    className="text-[10px] font-black uppercase text-amber-700 hover:text-[#4a2c2a] transition-colors"
                  >
                    + Add New
                  </button>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <motion.div
                    whileHover={{ y: -4 }}
                    key={addr.id}
                    onClick={() => {
                      setSelected(addr);
                      setIsAddingNew(false);
                    }}
                    className={`relative p-6 rounded-[24px] cursor-pointer border-2 transition-all duration-300 ${selected?.id === addr.id && !isAddingNew
                      ? "border-[#4a2c2a] bg-white shadow-xl shadow-[#4a2c2a]/5"
                      : "border-amber-900/5 bg-white/50 hover:bg-white"
                      }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className={`font-black uppercase text-xs tracking-widest ${selected?.id === addr.id ? 'text-[#4a2c2a]' : 'text-amber-900/40'}`}>
                        {addr.full_name}
                      </h3>
                      {selected?.id === addr.id && !isAddingNew && (
                        <CheckCircle2 className="text-[#4a2c2a] w-5 h-5" />
                      )}
                    </div>
                    <p className="text-sm font-bold text-[#4a2c2a] mb-1">{addr.phone}</p>
                    <p className="text-sm text-amber-900/60 leading-relaxed font-medium">
                      {addr.address_line}<br />
                      {addr.city}, {addr.state} — {addr.pincode}
                    </p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Form Section */}
            <AnimatePresence>
              {(isAddingNew || addresses.length === 0) && (
                <motion.section
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white rounded-[32px] p-8 border border-amber-900/5 shadow-sm overflow-hidden"
                >
                  <h2 className="text-xs font-black text-[#4a2c2a]/40 uppercase tracking-[0.3em] mb-8 flex items-center">
                    <Plus className="w-4 h-4 mr-2" /> Register New Address
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-amber-900/40 ml-1">Full Name</label>
                      <input
                        className="w-full bg-[#fffcf8] border-none rounded-xl py-3 px-4 text-[#4a2c2a] font-bold placeholder:text-amber-900/20 focus:ring-2 focus:ring-[#4a2c2a]/10"
                        placeholder="e.g. Julian Artisan"
                        onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-amber-900/40 ml-1">Contact Number</label>
                      <input
                        className="w-full bg-[#fffcf8] border-none rounded-xl py-3 px-4 text-[#4a2c2a] font-bold placeholder:text-amber-900/20 focus:ring-2 focus:ring-[#4a2c2a]/10"
                        placeholder="+91"
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-2">
                      <label className="text-[10px] font-black uppercase text-amber-900/40 ml-1">Street Address</label>
                      <input
                        className="w-full bg-[#fffcf8] border-none rounded-xl py-3 px-4 text-[#4a2c2a] font-bold placeholder:text-amber-900/20 focus:ring-2 focus:ring-[#4a2c2a]/10"
                        placeholder="House No, Building, Street"
                        onChange={(e) => setForm({ ...form, address_line: e.target.value })}
                      />
                    </div>
                    <input
                      className="bg-[#fffcf8] border-none rounded-xl py-3 px-4 text-[#4a2c2a] font-bold placeholder:text-amber-900/20"
                      placeholder="City"
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        className="bg-[#fffcf8] border-none rounded-xl py-3 px-4 text-[#4a2c2a] font-bold placeholder:text-amber-900/20"
                        placeholder="State"
                        onChange={(e) => setForm({ ...form, state: e.target.value })}
                      />
                      <input
                        className="bg-[#fffcf8] border-none rounded-xl py-3 px-4 text-[#4a2c2a] font-bold placeholder:text-amber-900/20"
                        placeholder="Pincode"
                        onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                      />
                    </div>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>
          </div>

          {/* Checkout Panel */}
          <aside className="lg:col-span-1">
            <div className="bg-[#4a2c2a] rounded-[32px] p-8 text-[#fffcf8] sticky top-32 shadow-2xl shadow-[#4a2c2a]/30">
              <div className="flex items-center space-x-3 mb-8">
                <MapPin className="w-5 h-5 opacity-50" />
                <h2 className="text-sm font-black uppercase tracking-[0.2em]">Summary</h2>
              </div>

              <div className="space-y-6 mb-10">
                <div className="pb-6 border-b border-white/10">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">Selected Dispatch</p>
                  {selected && !isAddingNew ? (
                    <p className="text-sm font-medium leading-relaxed italic">
                      "{selected.address_line}, {selected.city}"
                    </p>
                  ) : (
                    <p className="text-sm font-medium opacity-20 italic">No address selected</p>
                  )}
                </div>
              </div>

              <button
                onClick={handleSave}
                disabled={(!selected && !form.full_name) || (isAddingNew && !form.full_name)}
                className="w-full bg-[#fffcf8] text-[#4a2c2a] py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-white transition-all disabled:opacity-20"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-center text-[9px] font-black uppercase tracking-widest opacity-30 mt-6">
                Secure SSL Encrypted Transaction
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}