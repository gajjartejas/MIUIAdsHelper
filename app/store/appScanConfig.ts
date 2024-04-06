import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import zustandStorage from 'app/store/zustandStorage';

interface IAppScanConfigState {
  ports: number[];
  scanTimeoutInMs: number;
  scanThreads: number;
}

interface IAppScanConfigActions {
  setPorts: (port: number[]) => void;
  setScanTimeoutInMs: (scanTimeoutInMs: number) => void;
  setScanThreads: (scanThreads: number) => void;
  reset: () => void;
}

const initialState: IAppScanConfigState = {
  ports: [80, 8080, 32400],
  scanTimeoutInMs: 1000,
  scanThreads: 150,
};

const useAppScanConfigStore = create<IAppScanConfigState & IAppScanConfigActions>()(
  devtools(
    persist(
      set => ({
        ...initialState,
        setPorts: (p: number[]) => set(_state => ({ ports: p })),
        setScanTimeoutInMs: (st: number) => set(_state => ({ scanTimeoutInMs: st })),
        setScanThreads: (st: number) => set(_state => ({ scanThreads: st })),
        reset: () => set(_state => ({ ...initialState })),
      }),
      {
        name: 'app-scan-config-storage',
        storage: createJSONStorage(() => zustandStorage),
        onRehydrateStorage: state => {
          console.log('useAppScanConfigStore->hydration starts', state);
        },
        version: 1,
      },
    ),
  ),
);

export default useAppScanConfigStore;
