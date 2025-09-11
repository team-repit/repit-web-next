"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import Logo from "@/assets/logo-white.svg";
import LogoText from "@/assets/logo-text-white.svg";

const SPLASH_DURATION = 3000;

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    // 앱 게이트웨이 로직 — zustand + persist 로직으로 교체 예정
    const checkAuthAndRedirect = () => {
      try {
        const accessToken = localStorage.getItem("auth");
        if (!accessToken) return router.replace("/home"); // 뒤로가기 시 스플래시로 돌아오지 않게 처리 -> 로그인 페이지로 수정

        const parsedAuthData = JSON.parse(accessToken);
        // 예상 데이터 형태: { token: string, expiresAt: number } -> 이게 아니면 그냥 알아서 만료 기간 정하기
        if (
          parsedAuthData?.token &&
          parsedAuthData?.expiresAt &&
          parsedAuthData.expiresAt > Date.now()
        ) {
          return router.replace("/home");
        }
        return router.replace("/home"); // 로그인 페이지로 수정
      } catch (e) {
        // 파싱 에러 -> 로그인 페이지로 이동 -> 뭔가 모달이라도 만들어야 하나?
        return router.replace("/home"); // 로그인 페이지로 수정
      }
    };

    // 스플래시 애니메이션이 끝난 뒤 앱 게이트웨이 로직 실행
    const timer = setTimeout(checkAuthAndRedirect, SPLASH_DURATION);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <AnimatePresence>
      <main
        className="h-screen w-screen flex items-center justify-center"
        // LinearGradient 대체
        style={{
          background: `linear-gradient(180deg, rgba(75,254,69,0.9) 0%, rgba(108,187,105,0.94) 25%, rgb(62,148,92) 50%, rgba(4,107,81,0.99) 75%, rgb(4,97,74) 100%)`,
        }}
      >
        <motion.div
          className="flex flex-col items-center justify-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
        >
          {/* 로고 애니메이션: 페이드 인 + 스케일 업 */}
          <motion.div
            className="flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 1.2,
              type: "spring",
              stiffness: 120,
              damping: 12,
            }}
          >
            <Logo className="w-48 h-48 drop-shadow-lg" />
          </motion.div>

          {/* 텍스트 애니메이션: 페이드 인 + Y축 이동 */}
          <motion.div
            className="mt-4 flex items-center justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <LogoText className="w-full h-full drop-shadow-md" />
          </motion.div>

          {/* 배경 반짝 효과 (미묘한 Opacity 애니메이션) */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background: `linear-gradient(
      180deg,
      rgba(75,254,69,0.2) 0%,
      rgba(108,187,105,0.15) 25%,
      rgba(62,148,92,0.15) 50%,
      rgba(4,107,81,0.2) 75%,
      rgba(4,97,74,0.2) 100%
    )`,
            }}
            animate={{
              opacity: [0.15, 0.3, 0.15], // 은은하게 깜빡임
              scale: [1, 1.02, 1], // 살짝만 울렁임
            }}
            transition={{
              repeat: Infinity,
              duration: 3.5,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </main>
    </AnimatePresence>
  );
}
