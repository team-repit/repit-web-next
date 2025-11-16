// 공통 응답 형식
export interface BaseSuccessResponse {
  is_success: boolean;
  code: string;
  message: string;
}

export interface SuccessResponse<T> extends BaseSuccessResponse {
  result: T;
}

export interface EmptySuccessResponse extends BaseSuccessResponse {
  result: null;
}

// 유니온 타입
export type ApiResponse<T> = SuccessResponse<T> | EmptySuccessResponse;
