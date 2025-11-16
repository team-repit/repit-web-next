import { apiFetch } from "../client";
import { PostUserLogoutResponse } from "./auth.type";

// 회원 로그아웃 api
export async function postUserLogout() {
  return apiFetch<PostUserLogoutResponse>("/api/auth/logout", {
    method: "POST",
  });
}
