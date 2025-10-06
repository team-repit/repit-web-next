"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { deleteRecordVideo } from "@/apis/record/record.api";
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
    // 더미 데이터 -> 추후 실제 데이터 fetch
    const dummyResponse = {
      result: {
        record_id: Number(record_id),
        pose_type: "SQUAT",
        recorded_at: "2025-09-10T14:20:10",
        duration: "00:10:30",
        score: "A",
        video_name: "https://s3.aws.com/repit/videos/1234.mp4",
        scoreDetails: {
          left: [
            { part: "무릎", score: "B" },
            { part: "팔꿈치", score: "C" },
            { part: "손목", score: "A" },
            { part: "골반", score: "B" },
            { part: "발", score: "C" },
          ],
          right: [
            { part: "무릎", score: "A" },
            { part: "팔꿈치", score: "C" },
            { part: "손목", score: "A" },
            { part: "골반", score: "B" },
            { part: "발", score: "C" },
          ],
          good: "무릎 각도와 상체 밸런스가 안정적입니다. 특히 하체 근력이 고르게 사용되었습니다. 무릎 각도와 상체 밸런스가 안정적입니다. 특히 하체 근력이 고르게 사용되었습니다.",
          bad: "팔꿈치가 반복적으로 흔들려 상체 균형이 다소 불안정했습니다. 코어 근육 사용을 보완하면 좋습니다. 팔꿈치가 반복적으로 흔들려 상체 균형이 다소 불안정했습니다. 코어 근육 사용을 보완하면 좋습니다.",
        },
      },
    };

    setRecordDetail(dummyResponse.result);
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
          videoUrl={recordDetail.video_name}
          onDeleteClick={() => setIsModalOpen(true)}
        />
        <AnalysisCard scoreDetails={recordDetail.scoreDetails} />

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
