import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect } from "react";

export const useAuthRefresh = () => {
  const setAccessToken = useAuthStore((s) => s.setAccessToken);

  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;
  useEffect(() => {
    const refresh = async () => {
      try {
        // 쿠키에 담긴 refreshToken은 자동으로 요청에 포함됨
        const res = await fetch(`${SERVER_URL}/api/auth/refresh`, {
          method: "POST",
          credentials: "include", // 쿠키를 같이 보내기 위해 필요
        });

        const data = await res.json();

        if (data.accessToken) {
          setAccessToken(data.accessToken);
          console.log("Access token refreshed");
        } else {
          console.warn("리프레시 실패:", data);
        }
      } catch (err) {
        console.error("토큰 갱신 에러:", err);
      }
    };

    refresh();
  }, [setAccessToken]);
};
