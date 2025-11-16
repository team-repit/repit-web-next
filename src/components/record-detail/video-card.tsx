import Image from "next/image";
import CardLayout from "./card-layout";

interface VideoCardProps {
  videoUrl: string;
  onDeleteClick: () => void;
}

export default function VideoCard({ videoUrl, onDeleteClick }: VideoCardProps) {
  console.log(videoUrl);
  const handleDownloadVideo = async () => {
    try {
      // S3 URL에서 영상 다운로드, 브라우저가 이 주소로 가서 파일을 다운로드 받는 것!
      const response = await fetch(videoUrl);
      const blob = await response.blob();

      // Blob URL 생성
      const blobUrl = window.URL.createObjectURL(blob);

      // 임시 다운로드 링크 생성
      const link = document.createElement("a");
      link.href = blobUrl;

      // 파일명 추출 (URL에서) 또는 기본 파일명 사용
      const fileName = videoUrl.split("/").pop()?.split("?")[0] || "video.mp4";
      link.download = fileName;

      // 다운로드 트리거
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("다운로드 실패:", error);
      alert("영상 다운로드에 실패했습니다.");
    }
  };

  return (
    <CardLayout>
      <div className="flex items-center justify-between px-5 py-4">
        <span className="pt-2 subheadline-03-bold">운동 영상보기</span>
        <div className="flex gap-3">
          <button className="cursor-pointer" onClick={handleDownloadVideo}>
            <Image
              src="/assets/download.svg"
              alt="다운로드"
              width={16}
              height={16}
            />
          </button>
          <button className="cursor-pointer" onClick={onDeleteClick}>
            <Image
              src="/assets/trash-icon.png"
              alt="휴지통"
              width={20}
              height={20}
            />
          </button>
        </div>
      </div>
      <div className="border-t border-gray-300" />
      <div className="p-4">
        {videoUrl && (
          <video
            className="w-full h-120 rounded-[15px]"
            src={videoUrl}
            controls
          />
        )}
      </div>
    </CardLayout>
  );
}
