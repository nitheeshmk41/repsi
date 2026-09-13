"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Search, 
  UserCheck, 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  ShieldCheck,
  Zap
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { repsiApi } from "@/lib/api";
import { members } from "@/lib/mock-data";
import { getInitials } from "@/lib/utils";

export default function ReceptionCheckInPage() {
  const params = useParams();
  const workspace = (params.workspace as string) || "apex-fitness";

  const [query, setQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState<(typeof members)[0] | null>(null);
  const [recentCheckIns, setRecentCheckIns] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    repsiApi.getAttendance().then((res) => {
      if (res && res.length > 0) {
        setRecentCheckIns(res.slice(0, 5));
      }
    });
  }, []);

  const searchResults = query.trim() === "" ? [] : members.filter(
    (m) =>
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.phone.includes(query) ||
      m.email.toLowerCase().includes(query.toLowerCase())
  );

  const handleCheckIn = async (m: (typeof members)[0]) => {
    try {
      await repsiApi.checkInMember(m.id, m.name);
      setFeedback(`Successfully checked in ${m.name}`);
      const updated = await repsiApi.getAttendance();
      setRecentCheckIns(updated.slice(0, 5));
      setSelectedMember(null);
      setQuery("");
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href={`/${workspace}/attendance`}
            className="p-2 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-hover)] transition-colors"
          >
            <ArrowLeft className="h-4 w-4 text-[var(--text-muted)]" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-bold">
                RECEPTION DESK
              </span>
            </div>
            <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight mt-1">
              Member Fast Check-In
            </h1>
          </div>
        </div>

        <Link href={`/${workspace}/attendance/history`}>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <Clock className="h-3.5 w-3.5" />
            History Log
          </Button>
        </Link>
      </div>

      {feedback && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Reception Scanner / Search Box */}
      <Card className="border-[var(--border)] bg-[var(--surface)] shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Quick Member Lookup</CardTitle>
          <CardDescription>
            Search by member name, phone number, or scan member barcode / RFID.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--text-muted)]" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search member name or phone (e.g. Arun, Priya, 98450)..."
              className="pl-11 h-12 text-base rounded-xl"
              autoFocus
            />
          </div>

          {/* Quick results dropdown / list */}
          {searchResults.length > 0 && (
            <div className="border border-[var(--border)] rounded-xl overflow-hidden divide-y divide-[var(--border)] bg-[var(--background)]">
              {searchResults.slice(0, 4).map((m) => (
                <div
                  key={m.id}
                  onClick={() => setSelectedMember(m)}
                  className="p-3.5 flex items-center justify-between hover:bg-[var(--surface-hover)] cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback>{getInitials(m.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm text-[var(--text)]">{m.name}</p>
                      <p className="text-xs text-[var(--text-muted)]">{m.phone} · {m.plan}</p>
                    </div>
                  </div>
                  <Button size="sm" onClick={(e) => { e.stopPropagation(); handleCheckIn(m); }} className="gap-1.5">
                    <Zap className="h-3.5 w-3.5" />
                    CHECK IN
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Selected Member Preview Card */}
      {selectedMember && (
        <Card className="border-2 border-[var(--primary)] bg-[var(--surface)]">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-center sm:text-left">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-lg font-bold">{getInitials(selectedMember.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold text-[var(--text)]">{selectedMember.name}</h2>
                  <div className="flex items-center gap-2 mt-1 justify-center sm:justify-start">
                    <Badge variant="active">Active</Badge>
                    <span className="text-xs text-[var(--text-muted)] font-medium">{selectedMember.plan} Plan</span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] mt-1.5">
                    Phone: {selectedMember.phone} · Email: {selectedMember.email}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setSelectedMember(null)}>
                  Cancel
                </Button>
                <Button size="lg" className="gap-2 px-8 font-bold" onClick={() => handleCheckIn(selectedMember)}>
                  <UserCheck className="h-5 w-5" />
                  CONFIRM CHECK IN
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Check-Ins Stream */}
      <Card className="border-[var(--border)] bg-[var(--surface)]">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Today's Live Check-Ins</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentCheckIns.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-lg bg-[var(--background)] border border-[var(--border)] text-sm"
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span className="font-medium text-[var(--text)]">{item.memberName || item.member_name}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                  <span>In: {new Date(item.checkInTime || item.check_in_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold uppercase text-[10px]">
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
