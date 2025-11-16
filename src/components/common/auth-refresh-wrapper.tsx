"use client";
import { useAuthRefresh } from "@/hooks/useAuthRefresh";

export const AuthRefreshWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  useAuthRefresh(); // 앱 진입 시 accessToken 자동 갱신
  return <>{children}</>;
};
