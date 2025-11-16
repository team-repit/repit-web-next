import Image from "next/image";
import React from "react";

interface SectionButtonProps {
  type: string;
  title: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

export default function SectionButton({
  type,
  title,
  icon,
  onClick,
}: SectionButtonProps) {
  // 타입별 절대 위치 매핑
  const iconPosition: Record<string, string> = {
    "AI 운동 리포트": "bottom-1 right-2",
    "스쿼트, 런지, 플랭크": "bottom-0 right-0",
    "나만의 운동 캘린더": "bottom-2 right-1",
  };

  return (
    <div
      className="relative w-[335px] h-[189px] rounded-[15px] overflow-hidden bg-primary-50 border border-gray-30 shadow-[4px_4px_10px_rgba(0,0,0,0.05)] cursor-pointer"
      onClick={onClick}
    >
      <div className="flex flex-col py-[15px] px-[14px] gap-[10px]">
        <div className="w-fit h-[31px] bg-primary-10 px-[10px] py-[7px] body-02-bold text-primary-30 rounded-[5px]">
          {type}
        </div>
        <h3 className="subheadline-03-bold">{title}</h3>
      </div>

      <div className="absolute bottom-[-10px] right-[-5px]">
        <Image
          src="/assets/background-circle.svg"
          width={262.5}
          height={118.564}
          alt="배경 원"
        />

        <div className={`absolute ${iconPosition[type]}`}>{icon}</div>
      </div>
    </div>
  );
}
