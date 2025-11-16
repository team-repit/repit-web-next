"use client";

import Spinner from "@/components/common/spinner";
import { useAuthStore } from "@/stores/useAuthStore";
import { useUserStore } from "@/stores/useUserStore";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function KakaoCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setUser = useUserStore((state) => state.setUser);

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

        if (data.member.accessToken) {
          setAccessToken(data.member.accessToken);
          setUser({
            member_id: data.member.memberId,
            nickname: data.member.name,
            email: data.member.email,
            profile_image_url: "",
          });

          router.replace("/copy-key");
        } else {
          console.error("로그인 실패:", data);
        }
      } catch (err) {
        console.error("로그인 에러:", err);
      }
    };

    handleLogin();
  }, [code, setAccessToken, setUser, router]);

  return (
    <div className="h-screen flex justify-center items-center">
      <Spinner />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex justify-center items-center">
          <Spinner />
        </div>
      }
    >
      <KakaoCallbackContent />
    </Suspense>
  );
}
