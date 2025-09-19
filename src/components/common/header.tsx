"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import LogoIcon from "@/assets/logo-black.svg";

interface HeaderProps {
  title?: string;
  leftButtonSrc?: string;
  onLeftButtonClick?: () => void;
}

export default function Header({
  title,
  leftButtonSrc = "/assets/left.svg",
  onLeftButtonClick,
}: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isHome = pathname === "/home";

  return (
    <header className="w-full h-[74px] pt-[30px] grid grid-cols-3 p-5 border-b border-gray-300 bg-white">
      <button
        onClick={onLeftButtonClick ?? (() => router.back())}
        className="flex items-center justify-start cursor-pointer"
      >
        {isHome ? (
          <LogoIcon />
        ) : (
          <Image src={leftButtonSrc} width={24} height={24} alt="홈 아이콘" />
        )}
      </button>

      <div className="flex items-center justify-center">
        {!isHome && <span className="subheadline-03-bold">{title}</span>}
      </div>

      {isHome && (
        <button
          onClick={() => router.push("/profile")}
          className="flex items-center justify-end cursor-pointer"
        >
          <Image
            src="/assets/profile.svg"
            width={32}
            height={32}
            alt="프로필 아이콘"
          />
        </button>
      )}
    </header>
  );
}

// 기본 왼쪽 아이콘 -> 뒤로가기
// 홈 -> 로고, 분석화면 -> 홈 아이콘
// 오른쪽 아이콘은 홈 헤더에만 존재 -> 프로필 아이콘
