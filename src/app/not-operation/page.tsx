"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

//TODO: 스타일 수정, 달리는 이미지 변경
export default function Page() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center gap-6">
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <Image
          src="/assets/running-man.svg"
          alt="달리는 사람"
          width={200}
          height={200}
        />
      </motion.div>

      <h1 className="text-xl font-semibold">
        아직 준비 중인 페이지입니다.
        <br /> 조금만 기다려주세요! 🏃🏻💨
      </h1>

      <button
        onClick={() => router.push("/home")}
        className="px-6 py-3 rounded-2xl bg-primary-300 text-white hover:bg-primary-200 shadow-md cursor-pointer"
      >
        홈으로 돌아가기 🏠
      </button>
    </div>
  );
}
