import { apiFetch } from "../client";
import {
  DeleteRecordVideoResponse,
  GetRecordDetailResponse,
  GetVideoS3UrlResponse,
} from "./record.type";

// 운동 기록 상세 조회 api
export async function getRecordDetail(recordId: number) {
  return apiFetch<GetRecordDetailResponse>(`/api/record/${recordId}`, {
    method: "GET",
  });
}

// 운동 영상 삭제 api
export async function deleteRecordVideo(recordId: number) {
  return apiFetch<DeleteRecordVideoResponse>(`/api/record/${recordId}`, {
    method: "DELETE",
  });
}

// 운동 영상 s3 url 다운로드 api
export async function getVideoS3Url(recordId: number) {
  return apiFetch<GetVideoS3UrlResponse>(
    `/api/record/${recordId}/video/download-url`,
    {
      method: "GET",
    }
  );
}
