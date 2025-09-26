type Side = {
  part: string;
  score: string;
};

export default function DetailScoreGrid({
  left,
  right,
}: {
  left: Side[];
  right: Side[];
}) {
  // part들을 헤더로 추출 (왼쪽 기준)
  const parts = left.map((item) => item.part);

  return (
    <div className="rounded-[15px] bg-[linear-gradient(180deg,#F9FAFB_0%,#EDEEF0_100%)] p-5 m-5">
      {/* 헤더 */}
      <div
        className={`grid grid-cols-${
          parts.length + 1
        } text-center gap-4 body-01-bold mb-4`}
      >
        <div /> {/* 빈칸 (왼쪽/오른쪽 자리) */}
        {parts.map((part) => (
          <div key={part}>{part}</div>
        ))}
      </div>

      {/* 왼쪽 행 */}
      <div
        className={`grid grid-cols-${
          parts.length + 1
        } text-center gap-4 items-center mb-2`}
      >
        <div className="body-02-bold text-gray-600">왼쪽</div>
        {left.map(({ part, score }) => (
          <div key={`left-${part}`} className="body-01-bold text-gray-900">
            {score}
          </div>
        ))}
      </div>

      {/* 오른쪽 행 */}
      <div
        className={`grid grid-cols-${
          parts.length + 1
        } text-center gap-4 items-center`}
      >
        <div className="body-02-bold text-gray-600">오른쪽</div>
        {right.map(({ part, score }) => (
          <div key={`right-${part}`} className="body-01-bold text-gray-900">
            {score}
          </div>
        ))}
      </div>
    </div>
  );
}
