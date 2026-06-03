import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles, RefreshCw } from "lucide-react";

import { useState, useRef, useEffect } from "react";
import { useChatStore } from "../features/chat/model/useChatStore";

const ChatSidebar = () => {
  const { isOpen, toggleChat, messages, sendMessage, loading, startNewChat } = useChatStore();
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={toggleChat}
            className="fixed inset-0 bg-black/40 z-[150] backdrop-blur-sm"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-[800px] bg-[#fffcf8] z-[200] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="bg-[#4a2c2a] p-6 text-[#fffcf8] flex justify-between items-center">
              <div className="flex items-center gap-3">
                <button onClick={startNewChat} className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="New Chat">
                  <RefreshCw size={18} />
                </button>
                <div>
                  <h3 className="font-bold leading-none">Boutique Support</h3>
                  <span className="text-[10px] uppercase tracking-widest opacity-60">Handcrafted Help</span>
                </div>
              </div>
              <button onClick={toggleChat} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Chat Body */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-pattern-subtle">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm shadow-sm ${
                    msg.role === "user" 
                    ? "bg-[#4a2c2a] text-[#fffcf8] rounded-br-none" 
                    : "bg-white text-[#4a2c2a] border border-amber-100 rounded-bl-none"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && <div className="text-[14px] text-amber-800 animate-pulse">Chocolatier is typing...</div>}
            </div>

            {/* Input Footer */}
            <div className="p-4 bg-white border-t border-amber-100">
              <div className="relative flex items-center">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (sendMessage(input), setInput(""))}
                  placeholder="Inquire about our treats..."
                  className="w-full pl-4 pr-12 py-3 bg-[#fffcf8] border border-amber-200 rounded-xl focus:ring-2 focus:ring-[#4a2c2a] outline-none text-sm"
                />
                <button 
                  onClick={() => { sendMessage(input); setInput(""); }}
                  className="absolute right-2 p-2 text-[#4a2c2a] hover:scale-110 transition-transform"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ChatSidebar;