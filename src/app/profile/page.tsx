"use client";
import { useState } from "react";
import Button from "@/components/common/button";
import Header from "@/components/common/header";
import { useUserStore } from "@/stores/useUserStore";
import Image from "next/image";
import ConfirmModal from "@/components/common/confirm-modal";
import { postUserLogout } from "@/apis/auth/auth.api";
import { deleteUserInfo } from "@/apis/user/user.api";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);

  const [isModalOpen, setIsModalOpen] = useState(false); // 모달이 열렸는지
  const [modalType, setModalType] = useState(""); // 모달 메세지 setting
  const [modalExtraInfo, setModalExtraInfo] = useState<string | undefined>(); // 모달 추가 정보 기입
  const [modalAction, setModalAction] = useState<() => void>(() => () => {}); // 모달 confirm action setting

  const handleUserAction = async (
    actionName: "로그아웃" | "회원탈퇴",
    apiCall: () => Promise<unknown>
  ) => {
    try {
      const response = await apiCall();
      console.log(`${actionName} 성공:`, response);

      useUserStore.getState().clearUser?.();
      router.replace("/login");
    } catch (err) {
      console.error(`${actionName} 실패:`, err);
      alert(`${actionName}에 실패했습니다. 다시 시도해주세요.`);
    }
  };

  const handleModalOpen = (
    type: string,
    action: () => void,
    extraInfo?: string
  ) => {
    setModalType(type);
    setModalExtraInfo(extraInfo);
    setModalAction(() => action);
    setIsModalOpen(true);
  };

  const handleConfirmModal = () => {
    modalAction();
    setIsModalOpen(false);
  };

  const handleCancleModal = () => setIsModalOpen(false);

  return (
    <div className="w-full flex flex-col items-center relative min-h-screen">
      <Header title="마이페이지" />
      <div className="flex flex-col items-center gap-[11px] mt-25">
        <Image
          src="/assets/profile.svg"
          width={81}
          height={81}
          alt="기본 프로필 이미지"
        />
        <span className="headline-01">{user?.nickname}</span>
      </div>
      <div className="w-full flex items-center gap-[15px] px-10 mt-[31px]">
        <span className="w-12 body-01-bold">이메일</span>
        <input
          value={user?.email}
          className="w-full p-[10px] body-01-regular text-gray-400 border border-gray-300 rounded-[5px]"
          disabled
        />
      </div>
      <div className="absolute bottom-10 left-0 w-full flex flex-col gap-[10px] px-10">
        <Button
          text="로그아웃"
          variant="primary"
          onClick={() =>
            handleModalOpen("로그아웃", () =>
              handleUserAction("로그아웃", postUserLogout)
            )
          }
        />
        <Button
          text="회원탈퇴"
          variant="secondary"
          onClick={() =>
            handleModalOpen("회원탈퇴", () =>
              handleUserAction("회원탈퇴", deleteUserInfo)
            )
          }
        />
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        type={modalType}
        extraInfo={modalExtraInfo}
        onConfirm={handleConfirmModal}
        onCancel={handleCancleModal}
      />
    </div>
  );
}
