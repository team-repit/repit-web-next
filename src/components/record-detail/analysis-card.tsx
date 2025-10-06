import CardLayout from "./card-layout";
import DetailScoreGrid from "./detail-score-grid";
import TextSection from "./text-section";

// TODO: props 타입 수정
interface AnalysisCardProps {
  scoreDetails: {
    left: { part: string; score: string }[];
    right: { part: string; score: string }[];
    good: string;
    bad: string;
  };
}
export default function AnalysisCard({ scoreDetails }: AnalysisCardProps) {
  return (
    <CardLayout>
      <div className="flex items-center justify-between p-5 subheadline-03-bold">
        분석결과 보기
      </div>
      <div className="border-t border-gray-300" />
      <DetailScoreGrid left={scoreDetails.left} right={scoreDetails.right} />
      <TextSection title="Good" text={scoreDetails.good} />
      <TextSection title="Bad" text={scoreDetails.bad} />
    </CardLayout>
  );
}
