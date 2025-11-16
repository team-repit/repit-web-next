import { RecordDetail } from "@/apis/record/record.type";
import CardLayout from "./card-layout";
import DetailScoreGrid from "./detail-score-grid";
import TextSection from "./text-section";

interface AnalysisCardProps {
  recordDetail: RecordDetail;
}
export default function AnalysisCard({ recordDetail }: AnalysisCardProps) {
  return (
    <CardLayout>
      <div className="flex items-center justify-between p-5 subheadline-03-bold">
        분석결과 보기
      </div>
      <div className="border-t border-gray-300" />
      <DetailScoreGrid scoreDetails={recordDetail.score_details} />
      <TextSection text={recordDetail.analysis_text} />
    </CardLayout>
  );
}
