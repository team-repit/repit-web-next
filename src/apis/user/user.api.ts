import { apiFetch } from "../client";
import { DeleteUserInfoResponse, GetUserInfoResponse } from "./user.type";

// 내 정보 조회 api -> 로그인 성공하면 호출해서 zustand에 내 정보 저장
export async function getUserInfo() {
  return apiFetch<GetUserInfoResponse>("/api/user/me", {
    method: "GET",
  });
}

// 회원 탈퇴 api
export async function deleteUserInfo() {
  return apiFetch<DeleteUserInfoResponse>("/api/user", {
    method: "DELETE",
  });
}
