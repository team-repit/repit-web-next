import { apiFetch } from "../client";
import {
  GetDailyRecordsRequest,
  GetDailyRecordsResponse,
  GetMonthlyRecordsRequest,
  GetMonthlyRecordsResponse,
} from "./calendar.type";

// 월별 기록 조회 api
export async function getMonthlyRecords({
  year,
  month,
}: GetMonthlyRecordsRequest) {
  return apiFetch<GetMonthlyRecordsResponse>(`/api/calendar/${year}/${month}`, {
    method: "GET",
  });
}

// 일별 기록 조회 api
export async function getDailyRecords({
  year,
  month,
  day,
}: GetDailyRecordsRequest) {
  return apiFetch<GetDailyRecordsResponse>(
    `/api/calendar/${year}/${month}/${day}`,
    {
      method: "GET",
    }
  );
}
