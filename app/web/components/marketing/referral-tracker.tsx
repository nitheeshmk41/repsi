"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { setReferralAttribution } from "@/lib/content-growth-store";

function ReferralTrackerInner() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const refCode = searchParams.get("ref");
    if (refCode) {
      setReferralAttribution(refCode);
    }
  }, [searchParams]);

  return null;
}

export function ReferralTracker() {
  return (
    <Suspense fallback={null}>
      <ReferralTrackerInner />
    </Suspense>
  );
}
