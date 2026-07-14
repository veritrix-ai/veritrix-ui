import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { PatchNotesModal } from "@/components/dashboard/PatchNotesModal";

interface PatchNotesModalContextValue {
  openPatchNotesModal: () => void;
  closePatchNotesModal: () => void;
}

const PatchNotesModalContext = createContext<PatchNotesModalContextValue | null>(null);

export function PatchNotesModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openPatchNotesModal = useCallback(() => setIsOpen(true), []);
  const closePatchNotesModal = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ openPatchNotesModal, closePatchNotesModal }),
    [openPatchNotesModal, closePatchNotesModal],
  );

  return (
    <PatchNotesModalContext.Provider value={value}>
      {children}
      <PatchNotesModal open={isOpen} onClose={closePatchNotesModal} />
    </PatchNotesModalContext.Provider>
  );
}

export function usePatchNotesModal() {
  const context = useContext(PatchNotesModalContext);
  if (!context) {
    throw new Error("usePatchNotesModal must be used within PatchNotesModalProvider");
  }
  return context;
}
