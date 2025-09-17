"use client";
import React from "react";
import SectionButton from "@/components/home/section-button";
import Header from "@/components/home/header";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const sections = [
    {
      type: "AI 운동 리포트",
      title: "가장 최근 운동 분석",
      icon: (
        <Image
          src="/assets/analysis.svg"
          width={157}
          height={157}
          alt="분석 아이콘"
        />
      ),
      onClick: () => router.push("/not-operation"),
    },
    {
      type: "스쿼트, 런지, 플랭크",
      title: "운동 시작하기",
      icon: (
        <Image
          src="/assets/running-man.svg"
          width={179}
          height={150}
          alt="달리는 남자"
        />
      ),
      onClick: () => router.push("/not-operation"),
    },
    {
      type: "나만의 운동 캘린더",
      title: "운동 분석 히스토리",
      icon: (
        <Image
          src="/assets/history.svg"
          width={164}
          height={168}
          alt="히스토리"
        />
      ),
      onClick: () => router.push("/history"),
    },
  ];

  return (
    <div className="">
      <Header />
      <div className="flex flex-col mt-[55px] gap-[12px]">
        {sections.map((section) => (
          <SectionButton
            key={section.type}
            type={section.type}
            title={section.title}
            icon={section.icon}
            onClick={section.onClick}
          />
        ))}
      </div>
    </div>
  );
}
