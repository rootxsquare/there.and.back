import { create } from 'zustand';

interface PassportStore {
  passports: string[];
  selectedCountry: string | null;
  addPassport: (countryCode: string) => void;
  removePassport: (countryCode: string) => void;
  clearPassports: () => void;
  setSelectedCountry: (countryName: string | null) => void;
}

export const usePassportStore = create<PassportStore>((set) => ({
  passports: [],
  selectedCountry: null,
  addPassport: (countryCode) => set((state) => ({
    passports: state.passports.includes(countryCode) 
      ? state.passports 
      : [...state.passports, countryCode]
  })),
  removePassport: (countryCode) => set((state) => ({
    passports: state.passports.filter((p) => p !== countryCode)
  })),
  clearPassports: () => set({ passports: [] }),
  setSelectedCountry: (countryName) => set({ selectedCountry: countryName }),
}));
