import { getStatusColor } from "@/utils/statusUtils";
import React from "react";

interface WebRTCHeaderProps {
  isStreaming: boolean;
  connectionState: string;
  onStartCamera: () => void;
  onStopCamera: () => void;
  onStartConnection: () => void;
}

export const WebRTCHeader: React.FC<WebRTCHeaderProps> = ({
  isStreaming,
  connectionState,
  onStartCamera,
  onStopCamera,
  onStartConnection,
}) => {
  return (
    <header className="w-full bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">
          WebRTC P2P 테스트 (Self Connection)
        </h1>

        <div className="flex space-x-3">
          {!isStreaming ? (
            <button
              onClick={onStartCamera}
              className="px-6 py-2 bg-primary-300 text-white rounded-lg hover:bg-primary-400 cursor-pointer transition-colors"
            >
              카메라 시작
            </button>
          ) : (
            <button
              onClick={onStopCamera}
              className="px-6 py-2 bg-alert-negative-primary text-white rounded-lg transition-colors cursor-pointer"
            >
              카메라 중지
            </button>
          )}

          {isStreaming && (
            <button
              onClick={onStartConnection}
              disabled={connectionState === "connecting"}
              className="px-6 py-2 bg-primary-300 text-white rounded-lg hover:bg-primary-300 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {connectionState === "connecting" ? "연결 중..." : "WebRTC 연결"}
            </button>
          )}
        </div>
      </div>

      {/* 상태 표시 */}
      <div className="mt-4 flex space-x-4">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            isStreaming
              ? "bg-primary-100 text-primary-500"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {isStreaming ? "스트리밍 중" : "스트리밍 중지"}
        </span>

        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
            connectionState
          )}`}
        >
          {connectionState === "new"
            ? "미연결"
            : connectionState === "connecting"
            ? "연결 중"
            : connectionState === "connected"
            ? "P2P 연결됨!"
            : connectionState === "failed"
            ? "연결 실패"
            : connectionState}
        </span>
      </div>
    </header>
  );
};
