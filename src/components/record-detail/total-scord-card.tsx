import Image from "next/image";
import CardLayout from "./card-layout";
import { RecordDetail } from "@/apis/record/record.type";

interface TotalScoreCardProps {
  formattedDate: string;
  recordDetail: RecordDetail;
}
export default function TotalScoreCard({
  formattedDate,
  recordDetail,
}: TotalScoreCardProps) {
  return (
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
  );
}
