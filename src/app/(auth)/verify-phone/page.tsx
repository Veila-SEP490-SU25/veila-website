"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useVerifyPhonePopup } from "@/hooks/use-verify-phone-popup";
import { VerifyPhonePopup } from "@/components/verify-phone-popup";

function VerifyPhonePageContent() {
  const searchParams = useSearchParams();
  const { openPopup } = useVerifyPhonePopup();

  useEffect(() => {
    // Mở popup khi vào trang này
    const returnUrl = searchParams.get("returnUrl") || "";
    openPopup(returnUrl);
  }, [searchParams, openPopup]);

  return <VerifyPhonePopup />;
}

export default function VerifyPhonePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      }
    >
      <VerifyPhonePageContent />
    </Suspense>
  );
}
