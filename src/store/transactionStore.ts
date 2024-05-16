import { create } from "zustand";

type IStatus = {
  status: "ERROR" | "PENDING" | "SUCCESS";
  title: string;
  message: string;
};

type State = {
  transactionStatus: IStatus | null;
};

type Action = {
  setTransactionStatus: (status: IStatus | null) => void;
};

export const useTransactionStore = create<State & Action>((set) => ({
  transactionStatus: null,
  setTransactionStatus: (status) => set((state) => ({ transactionStatus: status })),
}));
