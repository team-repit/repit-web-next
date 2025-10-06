import { ApiResponse } from "../common-type";

// 운동 기록 상세 조회 result
export interface RecordDetail {
  record_id: number;
  pose_type: string;
  recorded_at: string;
  duration: string;
  score: string;
  video_name: string;
  scoreDetails: {
    left: { part: string; score: string }[];
    right: { part: string; score: string }[];
    good: string;
    bad: string;
  };
}
// 운동 상세 조회 응답
export type GetRecordDetailResponse = ApiResponse<RecordDetail>;

// 운동 영상 삭제 응답
export type DeleteRecordVideoResponse = ApiResponse<null>;
