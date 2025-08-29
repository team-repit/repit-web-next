import { WebRTCConfig } from "@/utils/webrtcConfig";
import { useState, useRef, useCallback } from "react";

export const useWebRTCConnection = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionState, setConnectionState] = useState<string>("new");
  const [error, setError] = useState<string>("");

  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const pc1Ref = useRef<RTCPeerConnection | null>(null); // Caller
  const pc2Ref = useRef<RTCPeerConnection | null>(null); // Callee

  const startConnection = useCallback(
    async (localStream: MediaStream | null) => {
      try {
        if (!localStream) {
          setError("먼저 카메라를 시작해주세요.");
          return;
        }

        console.log("진짜 WebRTC P2P 연결 시작!");
        setConnectionState("connecting");

        // 1. 두 개의 PeerConnection 생성
        pc1Ref.current = new RTCPeerConnection(WebRTCConfig.rtcConfig);
        pc2Ref.current = new RTCPeerConnection(WebRTCConfig.rtcConfig);

        const pc1 = pc1Ref.current;
        const pc2 = pc2Ref.current;

        // 2. ICE Candidate 교환 설정
        pc1.onicecandidate = (event) => {
          if (event.candidate) {
            console.log("PC1 → PC2 ICE Candidate");
            pc2.addIceCandidate(event.candidate);
          }
        };

        pc2.onicecandidate = (event) => {
          if (event.candidate) {
            console.log("PC2 → PC1 ICE Candidate");
            pc1.addIceCandidate(event.candidate);
          }
        };

        // 3. PC2에서 원격 스트림 받기
        let remoteStreamSet = false;
        pc2.ontrack = (event) => {
          console.log(
            "Track 수신:",
            event.track.kind,
            "- Stream ID:",
            event.streams[0].id
          );

          if (!remoteStreamSet && remoteVideoRef.current) {
            remoteStreamSet = true;
            const video = remoteVideoRef.current;
            const stream = event.streams[0];

            console.log(
              "스트림 설정 시작 - Tracks:",
              stream.getTracks().length
            );
            video.srcObject = stream;

            video.onloadedmetadata = () => {
              console.log("메타데이터 로드됨, 재생 시도");
              video
                .play()
                .then(() => console.log("비디오 재생 성공"))
                .catch((error) => console.error("비디오 재생 실패:", error));
            };

            // 추가 디버깅
            setTimeout(() => {
              console.log("최종 비디오 상태:", {
                videoWidth: video.videoWidth,
                videoHeight: video.videoHeight,
                readyState: video.readyState,
                paused: video.paused,
                currentTime: video.currentTime,
                srcObject: !!video.srcObject,
              });
            }, 2000);
          }
        };

        // 4. 연결 상태 모니터링
        pc1.onconnectionstatechange = () => {
          console.log("PC1 연결 상태:", pc1.connectionState);
          setConnectionState(pc1.connectionState);
          setIsConnected(pc1.connectionState === "connected");
        };

        pc2.onconnectionstatechange = () => {
          console.log("PC2 연결 상태:", pc2.connectionState);
        };

        // 5. PC1에 로컬 스트림 추가
        console.log(
          "로컬 스트림 트랙들:",
          localStream.getTracks().map((t) => t.kind)
        );
        localStream.getTracks().forEach((track) => {
          console.log(
            "Track 추가:",
            track.kind,
            "enabled:",
            track.enabled,
            "readyState:",
            track.readyState
          );
          const sender = pc1.addTrack(track, localStream);
          console.log("Sender 추가됨:", sender);
        });

        // 6. Offer-Answer 교환
        console.log("Offer 생성 중");
        const offer = await pc1.createOffer();
        await pc1.setLocalDescription(offer);

        console.log("PC2에 Offer 전달");
        await pc2.setRemoteDescription(offer);

        console.log("Answer 생성 중");
        const answer = await pc2.createAnswer();
        await pc2.setLocalDescription(answer);

        console.log("PC1에 Answer 전달");
        await pc1.setRemoteDescription(answer);

        console.log("WebRTC 핸드셰이크 완료! 연결 대기 중");
      } catch (err) {
        console.error("WebRTC 연결 실패:", err);
        setError("WebRTC 연결에 실패했습니다: " + (err as Error).message);
        setConnectionState("failed");
      }
    },
    []
  );

  const closeConnection = useCallback(() => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    if (pc1Ref.current) {
      pc1Ref.current.close();
      pc1Ref.current = null;
    }
    if (pc2Ref.current) {
      pc2Ref.current.close();
      pc2Ref.current = null;
    }

    setIsConnected(false);
    setConnectionState("new");
  }, []);

  return {
    isConnected,
    connectionState,
    error,
    remoteVideoRef,
    startConnection,
    closeConnection,
    setError,
  };
};
