"use client";

import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { useRouter, useSearchParams } from "next/navigation";
import "/style/globals.css";
import Header from "@/components/common/header";
import BottomSheets from "@/components/common/bottom-sheets";
import YearMonthDropdown from "@/components/history/custom-nav";
import { formatDateLocal } from "@/utils/format-date-local";
import RecordList from "@/components/history/record-list";
import { dummyDailyRecords } from "../../../public/dummy-data/dummy-daily-record";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialDateParam = searchParams.get("date");

  const [selectedDate, setSelectedDate] = useState<Date | null>(
    initialDateParam ? new Date(initialDateParam + "T00:00:00") : null
  );

  const joinDate = new Date(2024, 5, 1); // 가입 날짜 (예시임)
  const today = new Date();

  const [activeStartDate, setActiveStartDate] = useState<Date>(
    initialDateParam ? new Date(initialDateParam + "T00:00:00") : today
  );

  const [recordedDays, setRecordedDays] = useState<number[]>([]); // 운동 기록이 있는 날짜들

  useEffect(() => {
    const dummyResponse = {
      is_success: true,
      code: "CALENDAR_001",
      message: "월별 운동 기록 날짜 조회에 성공했습니다.",
      result: [9, 10, 23],
    };

    setRecordedDays(dummyResponse.result);

    if (dummyResponse.result.length > 0) {
      const lastDay = Math.max(...dummyResponse.result);
      const year = today.getFullYear();
      const month = today.getMonth();

      const lastDate = new Date(year, month, lastDay);

      // selectedDate도 세팅해서 바텀시트 바로 열리게
      setSelectedDate(lastDate);

      // URL도 업데이트
      router.push(`?date=${formatDateLocal(lastDate)}`);

      // 달력 activeStartDate도 맞춰줌
      setActiveStartDate(lastDate);
    }
  }, []);

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    router.push(`?date=${formatDateLocal(date)}`);
  };

  const getAvailableMonths = () => {
    const result: { year: number; month: number }[] = [];
    let current = new Date(joinDate);
    while (current <= today) {
      result.push({
        year: current.getFullYear(),
        month: current.getMonth() + 1,
      });
      current.setMonth(current.getMonth() + 1);
    }
    return result.reverse();
  };

  const availableMonths = getAvailableMonths();

  return (
    <div className="w-full h-screen relative bg-gray-50">
      <Header
        title="운동 분석 히스토리"
        onLeftButtonClick={() => router.replace("/home")}
      />

      {/* 커스텀 년,월 네비게이션 (드롭다운)*/}
      <YearMonthDropdown
        activeStartDate={activeStartDate}
        availableMonths={availableMonths} // 조회 가능한 년, 월 전달
        onChange={(date) => setActiveStartDate(date)}
      />

      {/* 캘린더 */}
      <Calendar
        locale="ko-KR"
        value={selectedDate} // 선택된 날짜 스타일링 유지
        onClickDay={handleSelectDate}
        activeStartDate={activeStartDate}
        onActiveStartDateChange={({ activeStartDate }) => {
          if (activeStartDate) setActiveStartDate(activeStartDate);
        }}
        formatDay={(_, date) => date.getDate().toString()} // 7일에서 '일' 제거
        showNeighboringMonth={false} // 이전, 다음 달의 날짜 제거
        showNavigation={false} // 기본 년, 월 네비게이션 제거
        tileDisabled={({ date }) => {
          const currentMonth = activeStartDate.getMonth();
          return (
            date.getMonth() === currentMonth &&
            !recordedDays.includes(date.getDate()) // 기록이 있는 날짜 배열에 없는 날짜는 disabled
          );
        }}
        tileClassName={({ date }) => {
          const currentMonth = activeStartDate.getMonth();
          if (
            date.getMonth() === currentMonth &&
            recordedDays.includes(date.getDate())
          ) {
            // 선택된 날짜인지 확인
            const isSelected =
              selectedDate &&
              date.getFullYear() === selectedDate.getFullYear() &&
              date.getMonth() === selectedDate.getMonth() &&
              date.getDate() === selectedDate.getDate();

            return isSelected ? "has-record selected-record" : "has-record";
          }
          return "";
        }}
      />

      {/* 바텀시트 */}
      <BottomSheets
        isOpenBottomSheets={!!selectedDate}
        onCloseBottomSheets={() => {
          setSelectedDate(null);
          router.push("");
        }}
      >
        <div className="flex flex-col h-full">
          <h2 className="subheadline-03-bold mb-5 px-[5px] shrink-0">
            {selectedDate &&
              `${
                selectedDate.getMonth() + 1
              }월 ${selectedDate.getDate()}일의 운동 기록`}
          </h2>

          <div className="flex-1 overflow-y-auto pr-1">
            {selectedDate && (
              <RecordList
                records={
                  dummyDailyRecords[formatDateLocal(selectedDate)]?.records ||
                  []
                }
              />
            )}
          </div>
        </div>
      </BottomSheets>
    </div>
  );
}
