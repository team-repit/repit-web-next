"use client";

import { useState, useRef, useEffect } from "react";

// web RTC 테스트를 위한 임시 home
export default function Home() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionState, setConnectionState] = useState<string>("new");
  const [error, setError] = useState<string>("");

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  // 두 개의 PeerConnection (자기 자신과 연결)
  const pc1Ref = useRef<RTCPeerConnection | null>(null); // Caller
  const pc2Ref = useRef<RTCPeerConnection | null>(null); // Callee

  // WebRTC 설정 -> 무료 스턴 서버!!
  const rtcConfig = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
    ],
  };

  // 카메라 시작
  const handleStartCamera = async () => {
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
  };

  // 카메라 중지
  const handleStopCamera = () => {
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

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    // PeerConnection들 정리
    if (pc1Ref.current) {
      pc1Ref.current.close();
      pc1Ref.current = null;
    }
    if (pc2Ref.current) {
      pc2Ref.current.close();
      pc2Ref.current = null;
    }

    setIsStreaming(false);
    setIsConnected(false);
    setConnectionState("new");
    console.log("카메라 중지");
  };

  // 진짜 WebRTC P2P 연결 시작!!!!!!
  const startWebRTCConnection = async () => {
    try {
      if (!localStreamRef.current) {
        setError("먼저 카메라를 시작해주세요.");
        return;
      }

      console.log("진짜 WebRTC P2P 연결 시작!");
      setConnectionState("connecting");

      // 1. 두 개의 PeerConnection 생성
      pc1Ref.current = new RTCPeerConnection(rtcConfig); // Caller
      pc2Ref.current = new RTCPeerConnection(rtcConfig); // Callee

      const pc1 = pc1Ref.current;
      const pc2 = pc2Ref.current;

      // 2. ICE Candidate 교환 설정 (서로 연결)
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

      // 3. PC2에서 원격 스트림 받기 (중복 방지)
      let remoteStreamSet = false;
      pc2.ontrack = (event) => {
        console.log(
          "Track 수신:",
          event.track.kind,
          "- Stream ID:",
          event.streams[0].id
        );

        // 첫 번째 track에서만 스트림 설정
        if (!remoteStreamSet && remoteVideoRef.current) {
          remoteStreamSet = true;
          const video = remoteVideoRef.current;
          const stream = event.streams[0];

          console.log("스트림 설정 시작 - Tracks:", stream.getTracks().length);
          video.srcObject = stream;

          // loadedmetadata 이벤트를 기다린 후 재생
          video.onloadedmetadata = () => {
            console.log("메타데이터 로드됨, 재생 시도");
            video
              .play()
              .then(() => {
                console.log("비디오 재생 성공");
              })
              .catch((error) => {
                console.error("비디오 재생 실패:", error);
              });
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

      // 5. PC1에 로컬 스트림 추가 (송신자)
      console.log(
        "로컬 스트림 트랙들:",
        localStreamRef.current.getTracks().map((t) => t.kind)
      );
      localStreamRef.current.getTracks().forEach((track) => {
        if (localStreamRef.current) {
          console.log(
            "Track 추가:",
            track.kind,
            "enabled:",
            track.enabled,
            "readyState:",
            track.readyState
          );
          const sender = pc1.addTrack(track, localStreamRef.current);
          console.log("Sender 추가됨:", sender);
        }
      });

      // 6. Offer-Answer 교환 시작!
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
  };

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      handleStopCamera();
    };
  }, []);

  // 연결 상태에 따른 색상
  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-green-100 text-green-800";
      case "connecting":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen p-6 bg-gray-100">
      <div className="w-full max-w-4xl flex flex-col space-y-6">
        {/* 헤더 */}
        <header className="w-full bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">
              WebRTC P2P 테스트 (Self Connection)
            </h1>

            <div className="flex space-x-3">
              {!isStreaming ? (
                <button
                  onClick={handleStartCamera}
                  className="px-6 py-2 bg-primary-300 text-white rounded-lg hover:bg-primary-400 cursor-pointer transition-colors"
                >
                  카메라 시작
                </button>
              ) : (
                <button
                  onClick={handleStopCamera}
                  className="px-6 py-2 bg-alert-negative-primary text-white rounded-lg transition-colors cursor-pointer"
                >
                  카메라 중지
                </button>
              )}

              {isStreaming && (
                <button
                  onClick={startWebRTCConnection}
                  disabled={connectionState === "connecting"}
                  className="px-6 py-2 bg-primary-300 text-white rounded-lg hover:bg-primary-300 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {connectionState === "connecting"
                    ? "연결 중..."
                    : "WebRTC 연결"}
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

        {/* 에러 메시지 */}
        {error && (
          <div className="w-full p-4 bg-alert-negative-secondary border border-red-300 text-alert-negative-primary rounded-lg">
            {error}
          </div>
        )}

        {/* 비디오 영역 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 로컬 비디오 (송신자 - PC1) */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              송신자 (PC1 - 내 카메라)
            </h3>
            <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              {!isStreaming && (
                <div className="absolute inset-0 flex items-center justify-center text-white bg-gray-800">
                  카메라를 시작해주세요
                </div>
              )}

              {/* 송신자 표시 */}
              <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
                LOCAL
              </div>
            </div>
          </div>

          {/* 원격 비디오 (수신자 - PC2) */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              수신자 (PC2 - WebRTC로 받은 영상)
            </h3>
            <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                controls={isConnected} // 연결되면 컨트롤 표시
                className="w-full h-full object-cover"
                onLoadedMetadata={() => console.log("비디오 메타데이터 로드됨")}
                onCanPlay={() => console.log("비디오 재생 가능")}
                onPlay={() => console.log("비디오 재생 시작")}
                onError={(e) => console.error("비디오 에러:", e)}
              />
              {(!isConnected || connectionState !== "connected") && (
                <div className="absolute inset-0 flex items-center justify-center text-white bg-gray-800">
                  {connectionState === "connected"
                    ? "원격 스트림 로딩 중..."
                    : connectionState === "connecting"
                    ? "WebRTC 연결 중..."
                    : connectionState === "failed"
                    ? "연결 실패"
                    : "WebRTC 연결이 필요합니다"}
                </div>
              )}

              {/* 수신자 표시 */}
              {isConnected && (
                <div className="absolute top-2 left-2 bg-primary-400 text-white px-2 py-1 rounded text-xs">
                  REMOTE
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 디버그 정보 */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">
            테스트 정보
          </h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p>
              • <strong>PC1 (송신자)</strong>: 카메라 → WebRTC → PC2로 전송
            </p>
            <p>
              • <strong>PC2 (수신자)</strong>: PC1에서 받은 영상을 오른쪽 화면에
              표시
            </p>
            <p>• 성공하면 같은 영상이 두 화면에 나타납니다 (실시간 P2P!)</p>
            <p>• 브라우저 콘솔에서 자세한 연결 로그를 확인할 수 있습니다</p>
            <p className="text-blue-600">
              • 이 방식이 성공하면 Jetson과의 연결도 같은 원리로 작동합니다! 🎯
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
