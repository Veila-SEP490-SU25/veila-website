"use client";
import { usePaging } from "@/providers/paging.provider";
import { useLazyGetSubscriptionsQuery } from "@/services/apis";
import { ISubscription } from "@/services/types";
import { useState } from "react";

export default function StaffSubscriptionPage() {
  const [subscriptions, setSubscriptions] = useState<ISubscription[]>([]);
  const [trigger, { isLoading }] = useLazyGetSubscriptionsQuery();
  const { pageIndex, pageSize, totalItems, resetPaging, setPaging } =
    usePaging();
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string>("");
  const [filter, setFilter] = useState<string>("");

  return <div>Staff Subscription Page</div>;
}
