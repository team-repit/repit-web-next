"use client";
import AnimatedPageLayout from "@/components/common/animated-page-layout";
import { useAuthStore } from "@/stores/useAuthStore";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const [showCopySuccess, setShowCopySuccess] = useState(false);

  useEffect(() => {
    if (!accessToken) {
      router.replace("/login");
    }
  }, [accessToken, router]);

  const handleCopyKey = () => {
    if (!accessToken) return;
    navigator.clipboard.writeText(accessToken);
    setShowCopySuccess(true);
    setTimeout(() => setShowCopySuccess(false), 2000);
  };

  // accessToken이 없으면 렌더링 막기 (리다이렉트 중 화면 깜박임 방지)
  if (!accessToken) return null;

  return (
    <AnimatedPageLayout
      title={`아래 키를 복사하고\n지금 바로 운동 자세를 분석해 보세요! 🏃🏻💨`}
      imageSrc="/assets/running-man.svg"
    >
      <div className="relative w-full">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/30 to-white-500/30 rounded-xl blur-md" />

        <div className="relative flex p-4 items-center gap-2 bg-gradient-to-br backdrop-blur-md rounded-xl border border-white shadow-sm">
          <div className="flex-1 body-01-bold tracking-widest select-none">
            {accessToken ? "•".repeat(12) : "재로그인 해주세요."}{" "}
            {/* 토큰 만료되면 스토어 비워야 하나...? */}
          </div>

          <button
            onClick={handleCopyKey}
            disabled={!accessToken}
            className="p-2 rounded-lg bg-white/20 hover:bg-gray-100 transition-all cursor-pointer"
          >
            <Image
              src="/assets/copy-icon.png"
              alt="키 복사 버튼"
              width={16}
              height={16}
            />
          </button>
        </div>
      </div>
      <button
        onClick={() => router.replace("/home")}
        className="mt-4 px-6 py-3 rounded-2xl bg-primary-300 text-white hover:bg-primary-200 shadow-md cursor-pointer"
      >
        홈으로 바로가기 🏠
      </button>
      <AnimatePresence>
        {showCopySuccess && (
          <motion.div
            key="copy-hint"
            initial={{ opacity: 0, y: -50 }} // 화면 상단 위에서 시작
            animate={{ opacity: 1, y: 50 }} // 살짝 내려오기
            exit={{ opacity: 0, y: -50 }} // 다시 위로 올라가면서 사라짐
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-1/2 -translate-x-1/2 z-50 body-01-bold bg-white pt-5 p-4 rounded-lg border border-gray-100 shadow-md"
          >
            키를 복사했습니다! 🔑
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatedPageLayout>
  );
}
