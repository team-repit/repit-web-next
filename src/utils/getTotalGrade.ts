// 점수 -> 등급 변환 함수
export function getTotalGrade(score: number): string {
  if (score >= 95) return "A+";
  if (score >= 90) return "A";
  if (score >= 85) return "B+";
  if (score >= 70) return "B";
  if (score >= 65) return "C+";
  return "C";
}
