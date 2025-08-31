"use client";

import { Button } from "@/components/ui/button";
import { MoveLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export const GoBackButton = () => {
  const router = useRouter();

  return (
    <Button
      variant="outline"
      className="flex items-center justify-center gap-2"
      onClick={() => {
        router.back();
      }}
    >
      <MoveLeft className="size-4" />
      Quay lại
    </Button>
  );
};
