"use client";

import React, { useState, useEffect, Suspense } from "react";
import Calendar from "react-calendar";
import { useRouter, useSearchParams } from "next/navigation";
import "/style/globals.css";
import Header from "@/components/common/header";
import BottomSheets from "@/components/common/bottom-sheets";
import YearMonthDropdown from "@/components/history/custom-nav";
import { formatDateLocal } from "@/utils/format-date-local";
import RecordList from "@/components/history/record-list";
import {
  getDailyRecords,
  getMonthlyRecords,
} from "@/apis/calendar/calendar.api";
import { RecordItem } from "@/apis/calendar/calendar.type";

function HistoryContent() {
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

  const [recordedDays, setRecordedDays] = useState<number[]>([]); // 해당 월의 운동 기록이 있는 날짜들
  const [dailyRecords, setDailyRecords] = useState<RecordItem[]>([]); // 일별 운동 기록들

  useEffect(() => {
    async function fetchMonthlyRecords() {
      try {
        const year = activeStartDate.getFullYear();
        const month = activeStartDate.getMonth() + 1;

        const response = await getMonthlyRecords({ year, month });

        console.log(response);
        if (response.is_success) {
          if (response.result && response.result.length > 0) {
            // 기록 있는 경우
            setRecordedDays(response.result);

            const lastDay = Math.max(...response.result);
            const lastDate = new Date(year, today.getMonth(), lastDay);

            setSelectedDate(lastDate);
            router.push(`?date=${formatDateLocal(lastDate)}`);
            setActiveStartDate(lastDate);
            handleSelectDate(lastDate);
          } else {
            // 기록 없는 경우
            setRecordedDays([]);
            setSelectedDate(null);
          }
        }
      } catch (error) {
        console.error("월별 기록 조회 실패:", error);
      }
    }

    fetchMonthlyRecords();
  }, [activeStartDate]);

  const handleSelectDate = async (date: Date) => {
    try {
      setSelectedDate(date);
      router.push(`?date=${formatDateLocal(date)}`);

      const year = activeStartDate.getFullYear();
      const month = activeStartDate.getMonth() + 1;
      const day = date.getDate();

      const response = await getDailyRecords({ year, month, day });

      if (response.is_success && response.result) {
        setDailyRecords(response.result.records);
      } else {
        setDailyRecords([]);
      }
    } catch (error) {
      console.error("일별 기록 조회 실패:", error);
      setDailyRecords([]);
    }
  };

  const getAvailableMonths = () => {
    const result: { year: number; month: number }[] = [];
    let current = new Date(joinDate);
    while (current <= today) {
      result.push({
        year: current.getFullYear(),
        month: current.getMonth() + 1,
      });
      current = new Date(current.getFullYear(), current.getMonth() + 1, 1); // 새로운 객체
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
        onChange={(date) => {
          setActiveStartDate(date);
          setSelectedDate(null);
          setDailyRecords([]);
          router.push("");
        }}
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
            {selectedDate && <RecordList records={dailyRecords} />}
          </div>
        </div>
      </BottomSheets>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-screen relative bg-gray-50 flex items-center justify-center">
          <div className="text-gray-500">로딩 중...</div>
        </div>
      }
    >
      <HistoryContent />
    </Suspense>
  );
}
