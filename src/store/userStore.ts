import { create } from "zustand";

type State = {
  balance: number;
  isFetched: boolean;
};

type Action = {
  setBalance: (value: number) => void;
  setIsFetched: (value: boolean) => void;
};

export const useUserStore = create<State & Action>((set) => ({
  balance: 0,
  isFetched: false,
  setBalance: (balance) => set((state) => ({ balance })),
  setIsFetched: (isFetched) => set((state) => ({ isFetched })),
}));
