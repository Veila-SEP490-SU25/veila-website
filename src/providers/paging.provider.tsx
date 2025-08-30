"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type PagingContextType = {
  pageIndex: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  goNext: () => void;
  goPrevious: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
  gotoPage: (page: number) => void;
  setPaging: (
    pageIndex: number,
    pageSize: number,
    totalItems: number,
    totalPages: number,
    hasNext: boolean,
    hasPrevious: boolean
  ) => void;
  resetPaging: () => void;
};

const PagingContext = createContext<PagingContextType | undefined>(undefined);

export const usePaging = () => {
  const context = useContext(PagingContext);
  if (!context) {
    throw new Error("usePaging must be used within a PagingProvider");
  }
  return context;
};

export const PagingProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);

  const setPaging = useCallback(
    (
      pageIndex: number,
      pageSize: number,
      totalItems: number,
      totalPages: number,
      hasNext: boolean,
      hasPrevious: boolean
    ) => {
      setPageIndex(pageIndex);
      setPageSize(pageSize);
      setTotalItems(totalItems);
      setTotalPages(totalPages);
      setHasNext(hasNext);
      setHasPrevious(hasPrevious);
    },
    [
      setHasNext,
      setHasPrevious,
      setPageIndex,
      setPageSize,
      setTotalItems,
      setTotalPages,
    ]
  );

  const resetPaging = useCallback(() => {
    setPageIndex(0);
    setPageSize(10);
    setTotalItems(0);
    setTotalPages(0);
    setHasNext(false);
    setHasPrevious(false);
  }, [
    setHasNext,
    setHasPrevious,
    setPageIndex,
    setPageSize,
    setTotalItems,
    setTotalPages,
  ]);

  const goNext = useCallback(() => {
    if (hasNext) {
      setPageIndex((prev) => prev + 1);
    }
  }, [hasNext, setPageIndex]);

  const goPrevious = useCallback(() => {
    if (hasPrevious) {
      setPageIndex((prev) => prev - 1);
    }
  }, [hasPrevious, setPageIndex]);

  const gotoPage = useCallback(
    (page: number) => {
      if (page >= 0 && page < totalPages) {
        setPageIndex(page);
      }
    },
    [totalPages, setPageIndex]
  );

  useEffect(() => {
    setPageIndex(0);
    setPageSize(10);
    setTotalItems(0);
    setTotalPages(0);
    setHasNext(false);
    setHasPrevious(false);
  }, [pathname]);

  return (
    <PagingContext.Provider
      value={{
        pageIndex,
        pageSize,
        totalPages,
        totalItems,
        goNext,
        goPrevious,
        hasNext,
        hasPrevious,
        setPaging,
        gotoPage,
        resetPaging,
      }}
    >
      {children}
    </PagingContext.Provider>
  );
};
