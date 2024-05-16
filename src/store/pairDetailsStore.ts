import { create } from "zustand";
import { IPair } from "../constants/types";

type State = {
  pairInfo: IPair | null;
};

type Action = {
  setPairInfo: (info: IPair) => void;
};

export const usePairDetailsStore = create<State & Action>((set) => ({
  pairInfo: null,
  setPairInfo: (info) => set(() => ({ pairInfo: info })),
}));
