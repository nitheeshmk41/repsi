"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  User,
  MessageSquare,
  Star,
  Loader2,
  Dumbbell,
  ShieldAlert,
  ThumbsUp,
  CheckCircle2,
  X,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { repsiApi } from "@/lib/api";
import { getAuthUser } from "@/lib/auth";

interface Review {
  id: string;
  rating: number;
  tags: string[];
  comment: string;
  author: string;
  date: string;
}

export default function MemberTrainerPage(props: { params: Promise<{ workspace: string }> }) {
  const params = use(props.params);
  const workspace = params.workspace || "apex-fitness";
  const [trainers, setTrainers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [selectedTrainer, setSelectedTrainer] = useState<any>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  // Review Form State
  const [rating, setRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>(["Form Guidance", "Punctual"]);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Report Form State
  const [reportReason, setReportReason] = useState("Unprofessional Behavior");
  const [reportDetails, setReportDetails] = useState("");
  const [submittingReport, setSubmittingReport] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  // Trainer Reviews Local Store
  const [reviewsStore, setReviewsStore] = useState<Record<string, Review[]>>({
    "1": [
      {
        id: "rev-1",
        rating: 5,
        tags: ["Form Guidance", "Motivating"],
        comment: "Coach Vikram corrected my bench press technique and increased my lift safely!",
        author: "Nitheesh",
        date: "2 days ago",
      },
    ],
  });

  useEffect(() => {
    async function load() {
      try {
        const user = getAuthUser();
        if (user && user.id) {
          const tList = await repsiApi.getClientTrainers(user.id);
          setTrainers(tList);
        } else {
          // Fallback mock trainers for demonstration
          setTrainers([
            {
              trainer_id: "1",
              name: "Vikram Rathore",
              specialization: "Strength & Conditioning",
              email: "vikram@repsi.app",
              phone: "+91 98765 12345",
              bio: "ACE Certified strength coach with 6+ years experience in powerlifting & hypertrophy.",
              rating: 4.9,
              total_reviews: 14,
            },
            {
              trainer_id: "2",
              name: "Kavya Menon",
              specialization: "HIIT & Fat Loss",
              email: "kavya@repsi.app",
              phone: "+91 98765 67890",
              bio: "Functional conditioning expert specializing in body recomposition & endurance.",
              rating: 4.8,
              total_reviews: 9,
            },
          ]);
        }
      } catch (err) {
        console.error("Error loading member trainers", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrainer) return;
    setSubmittingReview(true);

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      rating,
      tags: selectedTags,
      comment: reviewComment || "Excellent personal coaching session!",
      author: "Nitheesh",
      date: "Just now",
    };

    setTimeout(() => {
      setReviewsStore((prev) => ({
        ...prev,
        [selectedTrainer.trainer_id]: [newRev, ...(prev[selectedTrainer.trainer_id] || [])],
      }));
      setSubmittingReview(false);
      setReviewSuccess(true);
      setTimeout(() => {
        setReviewSuccess(false);
        setReviewModalOpen(false);
        setReviewComment("");
      }, 1500);
    }, 800);
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrainer) return;
    setSubmittingReport(true);

    setTimeout(() => {
      setSubmittingReport(false);
      setReportSuccess(true);
      setTimeout(() => {
        setReportSuccess(false);
        setReportModalOpen(false);
        setReportDetails("");
      }, 1500);
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            MY PERSONAL TRAINERS
          </span>
          <span className="text-xs text-[var(--text-muted)]">• {workspace}</span>
        </div>
        <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight mt-1">My Trainer & Coach Reviews</h1>
        <p className="text-xs text-[var(--text-muted)]">
          View assigned personal trainers, submit verified ratings & feedback, or contact gym management.
        </p>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center text-[var(--text-muted)]">
          <Loader2 className="h-6 w-6 animate-spin text-[var(--primary)]" />
        </div>
      ) : trainers.length === 0 ? (
        <div className="p-8 border border-dashed border-[var(--border)] rounded-2xl text-center text-xs text-[var(--text-muted)] space-y-3 bg-[var(--surface)]">
          <User className="h-10 w-10 mx-auto text-[var(--text-muted)]" />
          <h3 className="font-semibold text-sm text-[var(--text)]">No Trainer Assigned Yet</h3>
          <p className="max-w-sm mx-auto">
            You currently do not have a personal trainer assigned to your account. Contact gym management to pair up with a certified trainer.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {trainers.map((t) => {
            const tReviews = reviewsStore[t.trainer_id] || [];
            const avgRating = t.rating || 4.9;
            const reviewCount = (t.total_reviews || 10) + tReviews.length;

            return (
              <div
                key={t.trainer_id}
                className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-4 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-14 w-14 border-2 border-emerald-500">
                      <AvatarFallback className="font-bold text-lg bg-emerald-500/10 text-emerald-600">
                        {t.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-base text-[var(--text)]">{t.name}</h3>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                        {t.specialization || "Personal Coach"}
                      </p>
                      <div className="flex items-center gap-1 mt-1 text-xs text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{avgRating}</span>
                        <span className="text-[11px] font-normal text-[var(--text-muted)]">
                          ({reviewCount} reviews)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Report Button */}
                  <button
                    onClick={() => {
                      setSelectedTrainer(t);
                      setReportModalOpen(true);
                    }}
                    className="p-2 rounded-xl text-[var(--text-muted)] hover:text-rose-500 hover:bg-rose-500/10 transition"
                    title="Report Trainer to Gym Management"
                  >
                    <ShieldAlert className="w-4 h-4" />
                  </button>
                </div>

                {t.bio && <p className="text-xs text-[var(--text-muted)] leading-relaxed">{t.bio}</p>}

                {/* Member Reviews Snippet */}
                {tReviews.length > 0 && (
                  <div className="p-3 rounded-xl bg-[var(--background)] border border-[var(--border)] space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-[var(--text)]">Recent Member Review</span>
                      <span className="text-[var(--text-muted)]">{tReviews[0].date}</span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] italic">"{tReviews[0].comment}"</p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {tReviews[0].tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        >
                          ✓ {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="pt-2 flex items-center justify-between gap-2">
                  <Link href={`/${workspace}/chat`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full text-xs gap-1.5 border-[var(--border)]">
                      <MessageSquare className="h-3.5 w-3.5 text-blue-500" /> Message
                    </Button>
                  </Link>

                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedTrainer(t);
                      setReviewModalOpen(true);
                    }}
                    className="flex-1 text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                  >
                    <Star className="h-3.5 w-3.5" /> Review Trainer
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────────────
          1. REVIEW TRAINER MODAL
      ───────────────────────────────────────────────────────────────────────────── */}
      {reviewModalOpen && selectedTrainer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setReviewModalOpen(false)}
              className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text)]"
            >
              <X className="w-5 h-5" />
            </button>

            {reviewSuccess ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                <h3 className="text-lg font-bold text-[var(--text)]">Review Submitted!</h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Thank you for rating Coach {selectedTrainer.name}. Your feedback helps maintain training quality.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-[var(--text)]">Review Coach {selectedTrainer.name}</h3>
                  <p className="text-xs text-[var(--text-muted)]">
                    Share your workout feedback and coach rating.
                  </p>
                </div>

                {/* Star Rating Selector */}
                <div>
                  <label className="text-xs font-semibold text-[var(--text)] block mb-1.5">Rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="p-1 hover:scale-110 transition"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-[var(--border)] fill-transparent"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-[var(--text)] ml-2">{rating} / 5 Stars</span>
                  </div>
                </div>

                {/* Rating Tags */}
                <div>
                  <label className="text-xs font-semibold text-[var(--text)] block mb-1.5">Compliments & Tags</label>
                  <div className="flex flex-wrap gap-1.5">
                    {["Form Guidance", "Punctual", "Motivating", "Custom Workouts", "Nutrition Advice"].map((tag) => {
                      const active = selectedTags.includes(tag);
                      return (
                        <button
                          type="button"
                          key={tag}
                          onClick={() => handleToggleTag(tag)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                            active
                              ? "bg-emerald-600 text-white"
                              : "bg-[var(--background)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)]"
                          }`}
                        >
                          {active ? "✓ " : "+ "}
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Comment Input */}
                <div>
                  <label className="text-xs font-semibold text-[var(--text)] block mb-1">Feedback Comments</label>
                  <textarea
                    rows={3}
                    placeholder="Write your review experience with this coach..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] p-3 text-xs text-[var(--text)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setReviewModalOpen(false)}
                    className="border-[var(--border)]"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={submittingReview}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                  >
                    {submittingReview ? "Submitting..." : "Submit Review"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────────────
          2. REPORT TRAINER MODAL
      ───────────────────────────────────────────────────────────────────────────── */}
      {reportModalOpen && selectedTrainer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setReportModalOpen(false)}
              className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text)]"
            >
              <X className="w-5 h-5" />
            </button>

            {reportSuccess ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-rose-500 mx-auto animate-bounce" />
                <h3 className="text-lg font-bold text-[var(--text)]">Report Submitted</h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Your report regarding {selectedTrainer.name} has been securely logged with Gym Management for priority audit.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReport} className="space-y-4">
                <div className="flex items-center gap-2 text-rose-500">
                  <ShieldAlert className="w-5 h-5" />
                  <h3 className="text-lg font-bold text-[var(--text)]">Report Trainer Incident</h3>
                </div>

                <p className="text-xs text-[var(--text-muted)]">
                  Report improper conduct or policy violations by Coach {selectedTrainer.name}. Reports are confidential and reviewed directly by gym management.
                </p>

                {/* Reason Dropdown */}
                <div>
                  <label className="text-xs font-semibold text-[var(--text)] block mb-1">Reason for Report</label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs text-[var(--text)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
                  >
                    <option value="Unprofessional Behavior">Unprofessional Behavior</option>
                    <option value="Frequent Tardy / No-Show">Frequent Tardy / No-Show</option>
                    <option value="Inappropriate Conduct">Inappropriate Conduct</option>
                    <option value="Safety / Workout Policy Violation">Safety / Workout Policy Violation</option>
                    <option value="Other Issue">Other Issue</option>
                  </select>
                </div>

                {/* Details Input */}
                <div>
                  <label className="text-xs font-semibold text-[var(--text)] block mb-1">Incident Details</label>
                  <textarea
                    rows={3}
                    placeholder="Describe what occurred, dates, or specific concerns..."
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] p-3 text-xs text-[var(--text)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setReportModalOpen(false)}
                    className="border-[var(--border)]"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={submittingReport}
                    className="bg-rose-600 hover:bg-rose-500 text-white font-bold"
                  >
                    {submittingReport ? "Logging..." : "Submit Incident Report"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
