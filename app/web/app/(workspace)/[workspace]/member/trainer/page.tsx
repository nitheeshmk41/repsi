"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { User, MessageSquare, Calendar, Star, Loader2, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { repsiApi } from "@/lib/api";
import { getAuthUser } from "@/lib/auth";

export default function MemberTrainerPage(props: { params: Promise<{ workspace: string }> }) {
  const params = use(props.params);
  const workspace = params.workspace || "apex-fitness";
  const [trainers, setTrainers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const user = getAuthUser();
        if (user && user.id) {
          const tList = await repsiApi.getClientTrainers(user.id);
          setTrainers(tList);
        }
      } catch (err) {
        console.error("Error loading member trainers", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            MY PERSONAL TRAINERS
          </span>
          <span className="text-xs text-[var(--text-muted)]">• {workspace}</span>
        </div>
        <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight mt-1">My Trainer</h1>
        <p className="text-xs text-[var(--text-muted)]">
          View your assigned certified personal trainers, schedule 1-on-1 sessions, and view qualifications.
        </p>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center text-[var(--text-muted)]">
          <Loader2 className="h-6 w-6 animate-spin text-[var(--primary)]" />
        </div>
      ) : trainers.length === 0 ? (
        <div className="p-8 border border-dashed border-[var(--border)] rounded-xl text-center text-xs text-[var(--text-muted)] space-y-3 bg-[var(--surface)]">
          <User className="h-10 w-10 mx-auto text-[var(--text-muted)]" />
          <h3 className="font-semibold text-sm text-[var(--text)]">No Trainer Assigned Yet</h3>
          <p className="max-w-sm mx-auto">
            You currently do not have a personal trainer assigned to your account. Contact gym management to pair up with a certified trainer.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trainers.map((t) => (
            <div key={t.trainer_id} className="p-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-14 w-14 border-2 border-[var(--primary)]">
                    <AvatarFallback className="font-bold text-lg bg-emerald-500/10 text-emerald-600">
                      {t.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-base text-[var(--text)]">{t.name}</h3>
                    <p className="text-xs text-[var(--primary-dark)] dark:text-[var(--primary-hover)] font-semibold">
                      {t.specialization || "Personal Coach"}
                    </p>
                    <p className="text-[11px] text-[var(--text-muted)]">{t.email} • {t.phone}</p>
                  </div>
                </div>
              </div>

              {t.bio && <p className="text-xs text-[var(--text-muted)] leading-relaxed">{t.bio}</p>}

              <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between gap-2">
                <Link href={`/${workspace}/chat`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full text-xs gap-1.5 border-[var(--border)]">
                    <MessageSquare className="h-3.5 w-3.5 text-blue-500" /> Message
                  </Button>
                </Link>
                <Link href={`/${workspace}/member/workout`} className="flex-1">
                  <Button size="sm" className="w-full text-xs gap-1.5 bg-[var(--primary)] text-white">
                    <Dumbbell className="h-3.5 w-3.5" /> View Workouts
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
