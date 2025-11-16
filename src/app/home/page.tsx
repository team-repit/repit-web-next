"use client";
import React from "react";
import SectionButton from "@/components/home/section-button";
import Header from "@/components/common/header";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { sectionsData } from "@/constants/section-buttons";

export default function Page() {
  const router = useRouter();

  return (
    <div className="w-full flex flex-col items-center">
      <Header onLeftButtonClick={() => {}} />
      <div className="flex flex-col mt-[55px] gap-5">
        {sectionsData.map(({ type, title, iconSrc, iconSize, path }) => (
          <SectionButton
            key={type}
            type={type}
            title={title}
            icon={
              <Image
                src={iconSrc}
                width={iconSize.width}
                height={iconSize.height}
                alt={`${type} 아이콘`}
              />
            }
            onClick={() => router.push(path)}
          />
        ))}
      </div>
    </div>
  );
}
