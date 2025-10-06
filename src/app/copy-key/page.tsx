"use client";
import AnimatedPageLayout from "@/components/common/animated-page-layout";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();
  const accessToken = "aaa"; // 나중엔 useAuthStore()로 교체!!
  const [showCopySuccess, setShowCopySuccess] = useState(false);

  useEffect(() => {
    if (!accessToken) {
      router.replace("/login");
    }
  }, [accessToken, router]); // TODO: 보안 강화...?

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
            {accessToken ? "•".repeat(12) : "재로그인 해주세요."}
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

      <AnimatePresence>
        {showCopySuccess && (
          <motion.div
            key="copy-hint"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="body-01-bold bg-white px-6 py-4 rounded-lg shadow-md"
          >
            키를 복사했습니다! 🔑
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatedPageLayout>
  );
}
