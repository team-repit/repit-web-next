import { create } from "zustand";

// TODO: 로그인 성공 이후 내 정보 조회 api 호출 시 성공적으로 응답 받아와지면 useUserStore.getState().setUser(data); 저장!
interface UserProfile {
  member_id: number;
  nickname: string;
  email: string;
  profile_image_url: string;
}

interface UserState {
  user: UserProfile | null;
  setUser: (user: UserProfile) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
