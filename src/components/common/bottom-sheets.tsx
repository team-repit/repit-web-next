"use client";
import clsx from "clsx";
import React, { useState } from "react";

interface BottomSheetsProps {
  isOpenBottomSheets: boolean; // 바텀시트 열림 여부
  onCloseBottomSheets: () => void; // 바텀시트가 닫힐 때 실행되는 함수
  children: React.ReactNode; // 바텀시트 안에 보여줄 콘텐츠
}

export default function BottomSheets({
  isOpenBottomSheets,
  onCloseBottomSheets,
  children,
}: BottomSheetsProps) {
  const [closing, setClosing] = useState(false); // 닫히는 중 애니메이션 상태 (true면 닫히는 애니메이션 실행)
  const [dragStartY, setDragStartY] = useState<number | null>(null); // 드래그 시작한 y좌표 (터치/마우스 이벤트 시작 위치)
  const [dragOffsetY, setDragOffsetY] = useState(0); // 드래그 이동 거리 (y축 이동 값)

  const handleCloseBottomSheets = () => {
    // 닫기 버튼을 누르거나 드래그로 닫힐 때 실행
    setClosing(true); // closing = true -> translate-y-full이 적용되어 아래로 내려가는 애니메이션 실행
    onCloseBottomSheets();
    setClosing(false);
  };

  // 드래그 시작 -> 손가락/마우스 y좌표를 기억
  const handleDragStart = (y: number) => setDragStartY(y);

  // 드래그 중
  const handleDragMove = (y: number) => {
    if (dragStartY !== null) {
      // 아래로 끌었을 때만(diff > 0) translateY 업데이트
      const diff = y - dragStartY; // 현재 y좌표와 시작 y좌표 차이(diff) 계산.
      if (diff > 0) setDragOffsetY(diff); // 이 값이 style={{ transform: translateY(...) }}에 적용돼서 바텀시트가 손가락 따라 아래로 내려 옴
    }
  };

  // 드래그 종료
  const handleDragEnd = () => {
    if (dragOffsetY > 100) {
      //손을 뗐을 때, translateY > 100px이면 닫기 동작 실행 -> 끌어내린 정도가 크면 닫아버림
      handleCloseBottomSheets();
    }
    setDragOffsetY(0); // 그 외, 살짝 내린 경우나 100px에 못 미치면 초기화 시켜 원 상태 복귀
    setDragStartY(null);
  };

  if (!isOpenBottomSheets) return null;

  return (
    <div
      className={clsx(
        "absolute bottom-0 left-0 w-full flex items-end z-50 transition-transform duration-300",
        closing ? "translate-y-full" : "translate-y-0"
      )}
    >
      <div
        className="w-full h-[43vh] bg-white rounded-t-[25px] pt-[37px] px-5 pb-2 shadow-[4px_-4px_10px_0_rgba(0,0,0,0.05)] animate-slideUp"
        style={{ transform: `translateY(${dragOffsetY}px)` }}
        // 터치 이벤트 -> 모바일로 웹 접근하는 경우
        onTouchStart={(e) => handleDragStart(e.touches[0].clientY)}
        onTouchMove={(e) => handleDragMove(e.touches[0].clientY)}
        onTouchEnd={handleDragEnd}
        // 마우스 이벤트
        onMouseDown={(e) => handleDragStart(e.clientY)}
        onMouseMove={(e) => {
          if (dragStartY !== null) handleDragMove(e.clientY);
        }}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
      >
        {children}
      </div>
    </div>
  );
}
