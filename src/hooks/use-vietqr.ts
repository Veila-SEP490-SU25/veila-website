"use client";

import { getVietQRConfig } from "@/lib/utils";
import { IBank } from "@/services/types/bank.type";
import { use, useCallback, useEffect, useState } from "react";
import { VietQR } from "vietqr";

interface IGetBanksResponse {
  code: string;
  data: IBank[];
  desc: string;
}

export const useVietQR = () => {
  const { clientId, apiKey } = getVietQRConfig();
  const [vietQR, setVietQR] = useState<VietQR>();
  const [banks, setBanks] = useState<IBank[]>();

  useEffect(() => {
    if (clientId && apiKey) {
      setVietQR(new VietQR({ clientID: clientId, apiKey }));
    }
  }, [clientId, apiKey]);

  const fetchBanks = async () => {
    if (vietQR) {
      const supportedBanks = (await vietQR.getBanks()) as IGetBanksResponse;
      setBanks(supportedBanks.data);
    }
  };

  const generateQRImage = async (
    bin: string,
    bankNumber: string,
    amount: number,
    note?: string
  ) => {
    return `https://img.vietqr.io/image/${bin}-${bankNumber}-print.png?amount=${amount}${
      note ? `&addInfo=${note}` : ""
    }`;
  };

  const getBank = useCallback(
    (bin: string | null) => {
      if (!bin || !banks) return null;
      return banks.find((bank) => bank.bin === bin) || null;
    },
    [banks]
  );

  useEffect(() => {
    fetchBanks();
  }, [vietQR]);

  return { banks, getBank, generateQRImage };
};
