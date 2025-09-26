"use client";

import Header from "@/components/common/header";
import CardLayout from "@/components/record-detail/card-layout";
import DetailScoreGrid from "@/components/record-detail/detail-score-grid";
import TextSection from "@/components/record-detail/text-section";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface RecordDetail {
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

export default function Page() {
  const { record_id } = useParams();
  const router = useRouter();
  const [recordDetail, setRecordDetail] = useState<RecordDetail | null>(null);

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
            { part: "무릎", score: "B" },
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
        {/* 상단 총 점수 카드 */}
        <CardLayout>
          <div className="flex items-center justify-between w-full px-6 py-5">
            <div className="flex flex-col gap-[6px]">
              <span className="text-gray-600 body-01-regular">
                {`${formattedDate}의 ${recordDetail.pose_type}`}
              </span>
              <span className="headline-01">서유연님의 자세 점수</span>
            </div>
            <Image
              src={`/assets/score-${recordDetail.score}.svg`}
              alt="분석 총 점수"
              width={80}
              height={80}
            />
          </div>
        </CardLayout>

        {/* 운동 영상 카드 */}
        <CardLayout>
          <div className="flex items-center justify-between px-5 py-4">
            <span className="pt-2 subheadline-03-bold">운동 영상보기</span>
            <button className="cursor-pointer" onClick={() => {}}>
              <Image
                src="/assets/download.svg"
                alt="다운로드"
                width={20}
                height={20}
              />
            </button>
          </div>
          <div className="border-t border-gray-300" />
          <div className="p-4">
            <video
              className="w-full h-120 rounded-[15px]"
              src={recordDetail.video_name}
              controls
            />
          </div>
        </CardLayout>

        {/* 분석 결과 카드 */}
        <CardLayout>
          <div className="flex items-center justify-between p-5 subheadline-03-bold">
            분석결과 보기
          </div>
          <div className="border-t border-gray-300" />
          <DetailScoreGrid
            left={recordDetail.scoreDetails.left}
            right={recordDetail.scoreDetails.right}
          />
          <TextSection title="Good" text={recordDetail.scoreDetails.good} />
          <TextSection title="Bad" text={recordDetail.scoreDetails.bad} />
        </CardLayout>
      </div>
    </div>
  );
}
