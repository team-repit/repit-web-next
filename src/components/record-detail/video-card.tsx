import Image from "next/image";
import CardLayout from "./card-layout";

interface VideoCardProps {
  videoUrlForStream: string;
  videoUrlForDownload: string;
  onDeleteClick: () => void;
}

export default function VideoCard({
  videoUrlForStream,
  videoUrlForDownload,
  onDeleteClick,
}: VideoCardProps) {
  console.log("다운로드용 url", videoUrlForDownload);

  const handleDownloadVideo = async () => {
    if (!videoUrlForDownload) {
      alert("다운로드 받을 수 없습니다.");
      return;
    }

    try {
      // CORS 회피: fetch/Blob 대신 presigned URL로 직접 이동
      const link = document.createElement("a");
      link.href = videoUrlForDownload;
      link.rel = "noopener";
      // 서버가 Content-Disposition=attachment 를 포함하므로 바로 저장됨
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
        {videoUrlForStream && (
          <video
            className="w-full h-120 rounded-[15px]"
            src={videoUrlForStream}
            controls
          />
        )}
      </div>
    </CardLayout>
  );
}
