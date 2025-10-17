"use client";

import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  useEffect(() => {
    if (!code) return;

    const handleLogin = async () => {
      try {
        const res = await fetch("/api/auth/kakao", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });

        const data = await res.json();

        if (data.accessToken) {
          setAccessToken(data.accessToken);

          router.replace("/copy-key"); // 토큰 복사 페이지로 이동
        } else {
          console.error("로그인 실패:", data);
        }
      } catch (err) {
        console.error("로그인 에러:", err);
      }
    };

    handleLogin();
  }, [code, setAccessToken, router]);

  return <p>카카오 로그인 처리중...</p>;
}
