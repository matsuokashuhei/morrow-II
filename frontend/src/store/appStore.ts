import { create } from 'zustand';

interface AppState {
  // App状態
  isFirstLaunch: boolean;
  isOnboardingComplete: boolean;

  // アクション
  setFirstLaunch: (isFirst: boolean) => void;
  setOnboardingComplete: (isComplete: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // 初期状態
  isFirstLaunch: true,
  isOnboardingComplete: false,

  // アクション
  setFirstLaunch: (isFirst) => set({ isFirstLaunch: isFirst }),
  setOnboardingComplete: (isComplete) => set({ isOnboardingComplete: isComplete }),
}));
