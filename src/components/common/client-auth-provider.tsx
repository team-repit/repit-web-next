"use client";

import { useAuthRefresh } from "@/hooks/useAuthRefresh";

export default function ClientAuthProvider() {
  useAuthRefresh(); // 페이지 진입 시 자동 갱신
  return null; // 화면에 아무것도 렌더링하지 않음
}
