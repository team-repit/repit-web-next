"use client";

import React, { useState } from "react";
import Image from "next/image";

interface YearMonth {
  year: number;
  month: number;
}

interface YearMonthDropdownProps {
  activeStartDate: Date;
  availableMonths: YearMonth[];
  onChange: (date: Date) => void;
}

export default function YearMonthDropdown({
  activeStartDate,
  availableMonths,
  onChange,
}: YearMonthDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative ml-7 mt-8">
      <button
        className="flex items-center gap-2 headline-01"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {activeStartDate.getFullYear()}년 {activeStartDate.getMonth() + 1}월
        <span className="text-gray-500">
          <Image src="/assets/down.svg" alt="펼치기" width={20} height={20} />
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 w-34 max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          {availableMonths.map(({ year, month }) => (
            <div
              key={`${year}-${month}`}
              onClick={() => {
                onChange(new Date(year, month - 1, 1));
                setIsOpen(false);
              }}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {year}년 {month}월
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
