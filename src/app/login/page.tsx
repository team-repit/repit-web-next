"use client";

import { motion } from "framer-motion";
import LogoGreen from "@/assets/logo-green.svg";
import LogoTextGreen from "@/assets/logo-text-green.svg";
import Image from "next/image";

export default function Page() {
  return (
    <main className="w-full h-screen flex flex-col items-center justify-center bg-white px-5">
      {/* 로고 등장 애니메이션 */}
      <motion.div
        className="flex flex-col items-center gap-[14px]"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 1,
          type: "spring",
          stiffness: 120,
          damping: 12,
        }}
      >
        <LogoGreen className="w-50 h-50" />
        <LogoTextGreen />
      </motion.div>

      <motion.div
        className="w-full mt-[91px]"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <button className="w-full flex items-center justify-center gap-[10px] py-[14px] bg-[#FAE407] rounded-[8px] cursor-pointer">
          <Image
            src="/assets/kakao.svg"
            alt="카카오 아이콘"
            width={30}
            height={30}
            className="align-middle"
          />
          <p className="pt-[2px] subheadline-03-bold">
            카카오 계정으로 로그인하기
          </p>
        </button>
      </motion.div>
    </main>
  );
}
