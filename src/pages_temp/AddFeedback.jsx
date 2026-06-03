// src/pages/AddReview.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useUserStore } from "../entities/user/model/useUserStore";

import { toast } from "react-toastify";
import api from "../shared/api/apiClient";
import {
  Star,
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  Send,
  PenLine,
  Award
} from "lucide-react";
import { motion } from "framer-motion";

export default function AddFeedback() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useUserStore();

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Review form state
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [recommend, setRecommend] = useState(null);

  const getRatingLabel = (rating) => {
    const labels = {
      1: "Disappointing",
      2: "Acceptable",
      3: "Pleasant",
      4: "Exquisite",
      5: "Exceptional",
    };
    return labels[rating] || "Rate your experience";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error("Please sign in to share your thoughts");
      navigate("/login", { state: { from: location } });
      return;
    }
    if (rating === 0) return toast.error("Please provide a star rating");

    setSubmitting(true);
    try {
      await api.post(`/products/${id}/reviews/`, {
        rating,
        title: title.trim(),
        comment: comment.trim(),
        recommend,
      });
      toast.success("Your critique has been recorded");
      navigate(`/product/${id}`);
    } catch (error) {
      toast.error("Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#fffcf8] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#4a2c2a]/10 border-t-[#4a2c2a] rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fffcf8] py-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Navigation */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center space-x-3 text-[#4a2c2a]/40 hover:text-[#4a2c2a] transition-colors mb-10 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Return to Product</span>
        </motion.button>

        <div className="mb-12">
          <h1 className="text-4xl font-black text-[#4a2c2a] tracking-tighter uppercase">Product Critique</h1>
          <p className="text-[11px] font-bold uppercase tracking-widest text-amber-900/40 mt-2">Share your sensory experience with our atelier</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Star Selection Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[40px] shadow-2xl shadow-[#4a2c2a]/5 border border-amber-900/5 p-8 md:p-12 text-center"
          >
            <Award className="w-6 h-6 text-[#4a2c2a]/20 mx-auto mb-6" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#4a2c2a] mb-8">Overall Impression</h3>

            <div className="flex justify-center space-x-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform active:scale-90"
                >
                  <Star
                    className={`w-10 h-10 transition-all ${star <= (hoverRating || rating)
                        ? "text-[#4a2c2a] fill-[#4a2c2a]"
                        : "text-amber-900/10 fill-transparent"
                      }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-xl font-black text-[#4a2c2a] tracking-tight h-8">
              {getRatingLabel(hoverRating || rating)}
            </p>
          </motion.div>

          {/* Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-[40px] shadow-2xl shadow-[#4a2c2a]/5 border border-amber-900/5 p-8 md:p-12 space-y-10"
          >
            {/* Title */}
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-900/40 flex items-center gap-2">
                <PenLine className="w-3.5 h-3.5" /> Critique Headline
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="E.g., A Symphony of Dark Cocoa"
                className="w-full bg-[#fffcf8] border border-amber-900/10 rounded-2xl px-6 py-4 outline-none focus:border-[#4a2c2a] transition-all text-[#4a2c2a] font-bold text-sm"
                maxLength={100}
              />
            </div>

            {/* Recommendation Toggle */}
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-900/40">The Verdict</label>
              <div className="flex gap-4">
                {[
                  { val: true, label: "Highly Recommend", icon: ThumbsUp },
                  { val: false, label: "Not for Me", icon: ThumbsDown }
                ].map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setRecommend(opt.val)}
                    className={`flex-1 py-4 px-2 rounded-2xl border transition-all flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest ${recommend === opt.val
                        ? "bg-[#4a2c2a] text-[#fffcf8] border-[#4a2c2a] shadow-lg shadow-[#4a2c2a]/20"
                        : "bg-transparent border-amber-900/10 text-[#4a2c2a]/40 hover:border-[#4a2c2a]/40"
                      }`}
                  >
                    <opt.icon size={14} />
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-900/40">Observations</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Describe the texture, aroma, and lingering notes..."
                rows={5}
                className="w-full bg-[#fffcf8] border border-amber-900/10 rounded-3xl px-6 py-5 outline-none focus:border-[#4a2c2a] transition-all text-[#4a2c2a] font-bold text-sm leading-relaxed resize-none"
                maxLength={1000}
              />
            </div>
          </motion.div>

          {/* Submission Action */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="submit"
              disabled={submitting || rating === 0 || !title.trim() || !comment.trim()}
              className="flex-1 bg-[#4a2c2a] text-[#fffcf8] py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-[#4a2c2a]/30 hover:bg-[#3d2422] transition-all disabled:opacity-30 flex items-center justify-center gap-3"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Publish Review
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="sm:w-1/3 py-5 rounded-2xl border border-amber-900/10 text-[#4a2c2a]/40 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-amber-900/5 transition-all"
            >
              Discard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}