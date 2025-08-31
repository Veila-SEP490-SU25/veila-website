"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useVerifyPhonePopup } from "@/hooks/use-verify-phone-popup";
import { VerifyPhonePopup } from "@/components/verify-phone-popup";

export default function VerifyPhonePage() {
  const searchParams = useSearchParams();
  const { openPopup } = useVerifyPhonePopup();

  useEffect(() => {
    // Mở popup khi vào trang này
    const returnUrl = searchParams.get("returnUrl") || "";
    openPopup(returnUrl);
  }, [searchParams, openPopup]);

  return <VerifyPhonePopup />;
}
