import { createContext, useContext, useState, ReactNode } from "react";

interface VerifyPhonePopupState {
  isOpen: boolean;
  returnUrl?: string;
  openPopup: (returnUrl?: string) => void;
  closePopup: () => void;
}

const VerifyPhonePopupContext = createContext<
  VerifyPhonePopupState | undefined
>(undefined);

export function VerifyPhonePopupProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [returnUrl, setReturnUrl] = useState<string | undefined>(undefined);

  const openPopup = (newReturnUrl?: string) => {
    setReturnUrl(newReturnUrl);
    setIsOpen(true);
  };

  const closePopup = () => {
    setIsOpen(false);
    setReturnUrl(undefined);
  };

  const value: VerifyPhonePopupState = {
    isOpen,
    returnUrl,
    openPopup,
    closePopup,
  };

  return (
    <VerifyPhonePopupContext.Provider value={value}>
      {children}
    </VerifyPhonePopupContext.Provider>
  );
}

export function useVerifyPhonePopup() {
  const context = useContext(VerifyPhonePopupContext);
  if (context === undefined) {
    throw new Error(
      "useVerifyPhonePopup must be used within a VerifyPhonePopupProvider"
    );
  }
  return context;
}
