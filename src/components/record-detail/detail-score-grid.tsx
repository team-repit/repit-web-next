import { ScoreDetail } from "@/apis/record/record.type";
import React from "react";

export default function DetailScoreGrid({
  scoreDetails,
}: {
  scoreDetails: ScoreDetail[];
}) {
  const thClass =
    "body-02-bold text-gray-700 border-b border-gray-200 pb-2 w-1/2";
  const tdClass = "body-02 text-gray-600 pt-3 w-1/2";

  return (
    <div className="rounded-[15px] bg-[linear-gradient(180deg,#F9FAFB_0%,#EDEEF0_100%)] p-5 m-7 overflow-x-auto">
      <table className="w-full table-fixed text-center border-collapse">
        <thead>
          <tr>
            <th className={thClass}>부위</th>
            <th className={thClass}>점수</th>
          </tr>
        </thead>
        <tbody>
          {scoreDetails.map(({ score_id, body_part, detail_score }) => (
            <tr key={score_id}>
              <td className={tdClass}>{body_part}</td>
              <td className={`${tdClass} text-primary-300 font-semibold`}>
                {detail_score}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
