import React from "react";

interface VideoDisplayProps {
  title: string;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isLocal?: boolean;
  isConnected?: boolean;
  connectionState?: string;
  isStreaming?: boolean;
}

export const VideoDisplay: React.FC<VideoDisplayProps> = ({
  title,
  videoRef,
  isLocal = false,
  isConnected = false,
  connectionState = "new",
  isStreaming = false,
}) => {
  const getPlaceholderText = () => {
    if (isLocal) {
      return isStreaming ? "" : "카메라를 시작해주세요";
    } else {
      if (connectionState === "connected") {
        return "원격 스트림 로딩 중...";
      } else if (connectionState === "connecting") {
        return "WebRTC 연결 중...";
      } else if (connectionState === "failed") {
        return "연결 실패";
      } else {
        return "WebRTC 연결이 필요합니다";
      }
    }
  };

  const shouldShowPlaceholder = isLocal
    ? !isStreaming
    : !isConnected || connectionState !== "connected";

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">{title}</h3>
      <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
        <video
          ref={videoRef}
          autoPlay
          muted={isLocal}
          playsInline
          controls={!isLocal && isConnected}
          className="w-full h-full object-cover"
          onLoadedMetadata={() => console.log("비디오 메타데이터 로드됨")}
          onCanPlay={() => console.log("비디오 재생 가능")}
          onPlay={() => console.log("비디오 재생 시작")}
          onError={(e) => console.error("비디오 에러:", e)}
        />

        {shouldShowPlaceholder && (
          <div className="absolute inset-0 flex items-center justify-center text-white bg-gray-800">
            {getPlaceholderText()}
          </div>
        )}

        {/* 비디오 라벨 */}
        {(isLocal || isConnected) && (
          <div
            className={`absolute top-2 left-2 ${
              isLocal ? "bg-blue-500" : "bg-primary-400"
            } text-white px-2 py-1 rounded text-xs`}
          >
            {isLocal ? "LOCAL" : "REMOTE"}
          </div>
        )}
      </div>
    </div>
  );
};
