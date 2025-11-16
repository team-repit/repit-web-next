import { ApiResponse } from "../common-type";

// 월별 운동 기록 result
export type MonthlyRecords = number[];

// 월별 운동 기록 조회 요청
export interface GetMonthlyRecordsRequest {
  year: number;
  month: number;
}

// 월별 운동 기록 조회 응답
export type GetMonthlyRecordsResponse = ApiResponse<MonthlyRecords>;

// 하나의 운동 기록
export interface RecordItem {
  recordId: number;
  exercise_type: string;
  start_time: string;
  video_path: string;
  analysis_path: string;
}

// 일별 운동 기록
export interface DailyRecords {
  date: string;
  records: RecordItem[];
}

// 일별 운동 기록 조회 요청
export interface GetDailyRecordsRequest {
  year: number;
  month: number;
  day: number;
}

// 일별 운동 기록 조회 응답
export type GetDailyRecordsResponse = ApiResponse<DailyRecords>;
