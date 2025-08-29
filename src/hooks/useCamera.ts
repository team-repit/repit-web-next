import { useState, useRef, useCallback } from "react";

export const useCamera = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string>("");
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      setError("");
      console.log("카메라 준비");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 },
        },
        audio: true,
      });

      localStreamRef.current = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      setIsStreaming(true);
      console.log("카메라 시작");
    } catch (err) {
      console.error("카메라 접근 실패:", err);
      setError("카메라에 접근할 수 없습니다. 권한을 확인해주세요.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    console.log("카메라 중지 준비");

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      localStreamRef.current = null;
    }

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }

    setIsStreaming(false);
    console.log("카메라 중지");
  }, []);

  return {
    isStreaming,
    error,
    localVideoRef,
    localStreamRef,
    startCamera,
    stopCamera,
    setError,
  };
};
