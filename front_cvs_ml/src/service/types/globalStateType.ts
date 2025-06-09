
export interface GlobalState {
    
  selectedVacanteId: string | null;
  setSelectedVacanteId: (id: string) => void;

  reset: () => void;
}