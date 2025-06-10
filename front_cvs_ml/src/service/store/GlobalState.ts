import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Interface
import { GlobalState } from '../types/globalStateType';


export const useGlobalStore = create<GlobalState>()(
  persist(
    (set) => ({
      selectedVacanteId: null,
      setSelectedVacanteId: (id: string) => set({ selectedVacanteId: id }),

      reset: () =>
        set({
          selectedVacanteId: null,
        }),
    }),
    {
      name: "global-storage", // Clave en localStorage
    }
  )
);
