"use client";

import { WebRTCHeader } from "@/components/video/webRTC-header";
import { VideoDisplay } from "@/components/video/video-display";
import { useCamera } from "@/hooks/useCamera";
import { useWebRTCConnection } from "@/hooks/useWebRTCConnection";
import { useEffect } from "react";

export default function Page() {
  const {
    isStreaming,
    error: cameraError,
    localVideoRef,
    localStreamRef,
    startCamera,
    stopCamera,
  } = useCamera();

  const {
    isConnected,
    connectionState,
    error: connectionError,
    remoteVideoRef,
    startConnection,
    closeConnection,
  } = useWebRTCConnection();

  // 카메라와 연결 동시 정리
  const handleStopCamera = () => {
    closeConnection();
    stopCamera();
  };

  const handleStartConnection = () => {
    startConnection(localStreamRef.current);
  };

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      handleStopCamera();
    };
  }, []);

  const error = cameraError || connectionError;

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen p-6 bg-gray-100">
      <div className="w-full max-w-4xl flex flex-col space-y-6">
        <WebRTCHeader
          isStreaming={isStreaming}
          connectionState={connectionState}
          onStartCamera={startCamera}
          onStopCamera={handleStopCamera}
          onStartConnection={handleStartConnection}
        />

        {/* 에러 메시지 */}
        {error && (
          <div className="w-full p-4 bg-alert-negative-secondary border border-red-300 text-alert-negative-primary rounded-lg">
            {error}
          </div>
        )}

        {/* 비디오 영역 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <VideoDisplay
            title="송신자 (PC1 - 내 카메라)"
            videoRef={localVideoRef}
            isLocal={true}
            isStreaming={isStreaming}
          />

          <VideoDisplay
            title="수신자 (PC2 - WebRTC로 받은 영상)"
            videoRef={remoteVideoRef}
            isLocal={false}
            isConnected={isConnected}
            connectionState={connectionState}
          />
        </div>
      </div>
    </div>
  );
}
