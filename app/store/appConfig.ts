import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import zustandStorage from 'app/store/zustandStorage';

interface IAppConfigState {
  purchased: boolean;
  viewMode: 'grid' | 'list';
}

interface IAppConfigActions {
  setPurchased: (purchased: boolean) => void;
  setViewMode: (viewMode: 'grid' | 'list') => void;
}

const initialState: IAppConfigState = {
  purchased: false,
  viewMode: 'grid',
};

const useAppConfigStore = create<IAppConfigState & IAppConfigActions>()(
  devtools(
    persist(
      set => ({
        ...initialState,
        setPurchased: (s: boolean) => set(_state => ({ purchased: s })),
        setViewMode: (mode: 'grid' | 'list') => set(_state => ({ viewMode: mode })),
      }),
      {
        name: 'app-config-storage',
        storage: createJSONStorage(() => zustandStorage),
        onRehydrateStorage: state => {
          console.log('useAppConfigStore->hydration starts', state);
        },
        version: 1,
      },
    ),
  ),
);

export default useAppConfigStore;
