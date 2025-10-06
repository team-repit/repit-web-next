"use client";
import AnimatedPageLayout from "@/components/common/animated-page-layout";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <AnimatedPageLayout
      title={`아직 준비 중인 페이지입니다.\n조금만 기다려주세요! 🏃🏻💨`}
      imageSrc="/assets/running-man.svg"
    >
      <button
        onClick={() => router.push("/home")}
        className="px-6 py-3 rounded-2xl bg-primary-300 text-white hover:bg-primary-200 shadow-md cursor-pointer"
      >
        홈으로 돌아가기 🏠
      </button>
    </AnimatedPageLayout>
  );
}
