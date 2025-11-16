"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  deleteRecordVideo,
  getRecordDetail,
  getVideoS3Url,
} from "@/apis/record/record.api";
import ConfirmModal from "@/components/common/confirm-modal";
import Header from "@/components/common/header";
import AnalysisCard from "@/components/record-detail/analysis-card";
import TotalScoreCard from "@/components/record-detail/total-scord-card";
import VideoCard from "@/components/record-detail/video-card";
import { RecordDetail } from "@/apis/record/record.type";

export default function Page() {
  const { record_id } = useParams();
  const router = useRouter();

  const [recordDetail, setRecordDetail] = useState<RecordDetail | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string>("");

  const handleConfirmDelete = async () => {
    try {
      const response = await deleteRecordVideo(Number(record_id));
      console.log(response);
      setIsModalOpen(false);
    } catch (error) {
      console.error("영상 삭제 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    const fetchRecordDetail = async () => {
      try {
        const response = await getRecordDetail(Number(record_id));
        console.log(response);
        setRecordDetail(response.result);
      } catch (error) {
        console.error("운동 기록 불러오기 실패:", error);
      }
    };

    const fetchVideoUrl = async () => {
      try {
        const response = await getVideoS3Url(Number(record_id));
        console.log("Video URL:", response);
        setVideoUrl(response.result?.url || "");
      } catch (error) {
        console.error("영상 URL 불러오기 실패:", error);
      }
    };

    if (record_id) {
      fetchRecordDetail();
      fetchVideoUrl();
    }
  }, [record_id]);

  if (!recordDetail) return <div>Loading...</div>;

  const date = new Date(recordDetail.recorded_at);
  const formattedDate = `${date.getMonth() + 1}월 ${date.getDate()}일`;

  return (
    <div className="w-full flex flex-col h-screen">
      <Header
        title="운동 분석 결과"
        leftButtonSrc="/assets/home.svg"
        onLeftButtonClick={() => router.replace("/home")}
      />

      <div className="flex-1 px-5 bg-[linear-gradient(180deg,#FFF_0%,#F3F6F5_47.5%,#F1FAF5_100%)] overflow-auto pb-5">
        <TotalScoreCard
          formattedDate={formattedDate}
          recordDetail={recordDetail}
        />
        <VideoCard
          videoUrl={videoUrl}
          onDeleteClick={() => setIsModalOpen(true)}
        />
        <AnalysisCard recordDetail={recordDetail} />

        <ConfirmModal
          isOpen={isModalOpen}
          type="삭제"
          extraInfo="삭제 시 복구할 수 없습니다."
          onConfirm={handleConfirmDelete}
          onCancel={() => setIsModalOpen(false)}
        />
      </div>
    </div>
  );
}
