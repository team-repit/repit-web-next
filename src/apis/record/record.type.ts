import { ApiResponse } from "../common-type";

// 운동 기록 상세 조회 result
export interface RecordDetail {
  record_id: number;
  member_id: number;
  pose_type: string;
  recorded_at: string;
  duration: number;
  reps: number;
  total_score: string;
  video_path: string;
  analysis_text: string;
  score_details: ScoreDetail[];
  deleted_at: string;
}

export interface ScoreDetail {
  score_id: number;
  body_part: string;
  detail_score: string;
}

// 운동 상세 조회 응답
export type GetRecordDetailResponse = ApiResponse<RecordDetail>;

// 운동 영상 삭제 응답
export type DeleteRecordVideoResponse = ApiResponse<null>;

export interface VideoS3UrlResult {
  url: string;
  object_key: string;
  expires_in_seconds: number;
}

// 운동 영상 s3 Url 발급 응답
export type GetVideoS3UrlResponse = ApiResponse<VideoS3UrlResult>;
