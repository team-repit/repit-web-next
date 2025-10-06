import Image from "next/image";
import CardLayout from "./card-layout";

interface VideoCardProps {
  videoUrl: string;
  onDeleteClick: () => void;
}

export default function VideoCard({ videoUrl, onDeleteClick }: VideoCardProps) {
  return (
    <CardLayout>
      <div className="flex items-center justify-between px-5 py-4">
        <span className="pt-2 subheadline-03-bold">운동 영상보기</span>
        <div className="flex gap-3">
          <button className="cursor-pointer">
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
        <video
          className="w-full h-120 rounded-[15px]"
          src={videoUrl}
          controls
        />
      </div>
    </CardLayout>
  );
}
