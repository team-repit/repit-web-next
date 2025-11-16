import { ApiResponse } from "../common-type";

export interface UserInfo {
  member_id: number;
  nickname: string;
  email: string;
  profile_image_url: string;
}

// 내 정보 조회 응답
export type GetUserInfoResponse = ApiResponse<UserInfo>;

// 회원 탈퇴 응답
export type DeleteUserInfoResponse = ApiResponse<null>;
