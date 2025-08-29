"use client";

import { useState, useRef, useEffect } from "react";
import { io, Socket } from "socket.io-client";

// 서버 개발자에게 제공받을 Socket.io 서버 주소
const SIGNALING_SERVER_URL = "https://api.repit.life";

export default function Page() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [connectionState, setConnectionState] = useState<string>("new");
  const [error, setError] = useState<string>("");
  const [myId, setMyId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [roomName, setRoomName] = useState<string>("web-rtc-123"); // 입장할 방 이름 -> 써야지요~~~

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  // 1:1 통신이므로 단일 PeerConnection 객체만 관리
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const targetPeerIdRef = useRef<string | null>(null);

  // WebRTC 설정 -> 무료 스턴 서버!!
  const rtcConfig = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
    ],
  };

  // 2. Socket.io 서버에 연결하고 이벤트 리스너를 설정하는 함수
  const connectToServer = () => {
    console.log("Socket.io 서버에 연결 시도...");
    const socket = io(SIGNALING_SERVER_URL);
    socketRef.current = socket;

    // 서버 연결 성공 시
    socket.on("connect", () => {
      if (socket.id) {
        setMyId(socket.id);
        console.log("Socket.io 서버에 연결됨. 내 ID:", socket.id);
        socket.emit("joinRoom", roomName);
      }
    });

    // 서버 연결 실패 시
    socket.on("connect_error", (err) => {
      console.error("Socket.io 연결 오류:", err);
      setError("서버 연결에 실패했습니다: " + err.message);
    });

    // 방에 있는 다른 유저들의 ID를 받음 (1:1 통신이므로 한 명만 필요)
    socket.on("roomUsers", async (usersInRoom: string[]) => {
      console.log("현재 방 유저:", usersInRoom);
      // 자신을 제외하고 방에 다른 유저가 있다면 연결 시작
      const otherUser = usersInRoom.find((id) => id !== socket.id);
      if (otherUser) {
        console.log(`상대방 발견: ${otherUser}`);
        targetPeerIdRef.current = otherUser;
        createPeerConnection(true); // Offer를 먼저 생성하는 Initiator 역할
      } else {
        console.log("상대방을 기다리는 중...");
      }
    });

    // 새로운 유저가 방에 들어왔을 때
    socket.on("newUser", (newUserId: string) => {
      console.log(`새로운 유저 입장: ${newUserId}`);
      // 새로운 유저가 들어왔으므로 상대방 ID 설정 후 연결 시작
      targetPeerIdRef.current = newUserId;
      createPeerConnection(true);
    });

    // Offer 수신 (상대방이 보낸 SDP)
    socket.on(
      "offer",
      async (data: {
        senderId: string;
        payload: RTCSessionDescriptionInit;
      }) => {
        console.log(`Offer 수신: ${data.senderId}`);
        targetPeerIdRef.current = data.senderId;
        await handleIncomingOffer(data.payload);
      }
    );

    // Answer 수신 (상대방이 보낸 SDP)
    socket.on(
      "answer",
      async (data: {
        senderId: string;
        payload: RTCSessionDescriptionInit;
      }) => {
        console.log(`Answer 수신: ${data.senderId}`);
        await handleIncomingAnswer(data.payload);
      }
    );

    // ICE Candidate 수신 (상대방이 보낸 네트워크 정보)
    socket.on(
      "candidate",
      async (data: { senderId: string; payload: RTCIceCandidate }) => {
        console.log(`ICE Candidate 수신: ${data.senderId}`);
        await handleIncomingCandidate(data.payload);
      }
    );

    // 피어 연결 해제
    socket.on("peerDisconnected", (peerId: string) => {
      if (targetPeerIdRef.current === peerId) {
        console.log("상대방 연결 해제. 연결 종료.");
        handleStopCamera();
      }
    });
  };

  // 1. 카메라 시작 & 서버 연결
  const handleStartCamera = async () => {
    try {
      setError("");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      setIsStreaming(true);
      console.log("카메라 시작");

      // 카메라 시작 후 서버 연결 로직 실행
      connectToServer();
    } catch (err) {
      console.error("카메라 접근 실패:", err);
      setError("카메라에 접근할 수 없습니다. 권한을 확인해주세요.");
    }
  };

  // 카메라 중지 및 모든 연결 종료
  const handleStopCamera = () => {
    console.log("카메라 및 모든 연결 중지");
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;

    // PeerConnection 정리
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }

    // Socket.io 연결 해제
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    setIsStreaming(false);
    setIsConnected(false);
    setConnectionState("new");
    setMyId(null);
    targetPeerIdRef.current = null;
    console.log("모든 연결 종료");
  };

  // 3. PeerConnection 생성 및 로컬 스트림 추가
  const createPeerConnection = (isInitiator: boolean) => {
    if (pcRef.current) return;
    if (!localStreamRef.current) {
      console.error(
        "로컬 스트림이 없습니다. PeerConnection을 만들 수 없습니다."
      );
      return;
    }

    const pc = new RTCPeerConnection(rtcConfig);
    pcRef.current = pc;
    console.log("PeerConnection 생성");

    // 로컬 스트림을 PeerConnection에 추가
    localStreamRef.current.getTracks().forEach((track) => {
      pc.addTrack(track, localStreamRef.current!);
    });

    // ICE Candidate 이벤트 핸들러: 서버로 전송
    pc.onicecandidate = (event) => {
      if (event.candidate && socketRef.current && targetPeerIdRef.current) {
        socketRef.current.emit("candidate", {
          targetId: targetPeerIdRef.current,
          payload: event.candidate,
        });
      } else {
        // event.candidate가 null일 때 (수집 완료)
        console.log("ICE Candidate 수집이 완료되었습니다.");
      }
    };

    // 원격 스트림 이벤트 핸들러: 원격 비디오에 연결
    pc.ontrack = (event) => {
      console.log("Track 수신");
      if (remoteVideoRef.current && event.streams[0]) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    // 연결 상태 모니터링
    pc.onconnectionstatechange = () => {
      console.log(`PeerConnection 연결 상태: ${pc.connectionState}`);
      setConnectionState(pc.connectionState);
      setIsConnected(pc.connectionState === "connected");
    };

    if (isInitiator) {
      // Offer 생성 및 전송
      pc.createOffer()
        .then((offer) => pc.setLocalDescription(offer))
        .then(() => {
          if (socketRef.current && targetPeerIdRef.current) {
            socketRef.current.emit("offer", {
              targetId: targetPeerIdRef.current,
              payload: pc.localDescription,
            });
            console.log(`Offer 전송 to ${targetPeerIdRef.current}`);
          }
        })
        .catch((err) => console.error("Offer 생성 실패:", err));
    }
  };

  // Offer 수신 처리
  const handleIncomingOffer = async (offer: RTCSessionDescriptionInit) => {
    if (!pcRef.current) {
      createPeerConnection(false); // Answerer 역할
    }
    const pc = pcRef.current;
    if (!pc) return;

    await pc.setRemoteDescription(offer);
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    if (socketRef.current && targetPeerIdRef.current) {
      socketRef.current.emit("answer", {
        targetId: targetPeerIdRef.current,
        payload: answer,
      });
      console.log(`Answer 전송 to ${targetPeerIdRef.current}`);
    }
  };

  // Answer 수신 처리
  const handleIncomingAnswer = async (answer: RTCSessionDescriptionInit) => {
    const pc = pcRef.current;
    if (pc && pc.signalingState !== "stable") {
      await pc.setRemoteDescription(answer);
      console.log("Answer 적용");
    }
  };

  // ICE Candidate 수신 처리
  const handleIncomingCandidate = async (candidate: RTCIceCandidate) => {
    const pc = pcRef.current;
    if (pc) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
        console.log("ICE Candidate 추가");
      } catch (e) {
        console.error("Error adding ICE candidate:", e);
      }
    }
  };

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      handleStopCamera();
    };
  }, []);

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
        <header className="w-full bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">
              WebRTC 1:1 P2P (Socket.io)
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
                  연결 및 중지
                </button>
              )}
            </div>
          </div>
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
                ? "서버 미연결"
                : connectionState === "connecting"
                ? "연결 중"
                : connectionState === "connected"
                ? "P2P 연결됨!"
                : connectionState === "failed"
                ? "연결 실패"
                : connectionState}
            </span>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            내 ID: <span className="font-mono">{myId || "연결 필요"}</span>
          </div>
          <div className="text-sm text-gray-600">
            상대방 ID:{" "}
            <span className="font-mono">
              {targetPeerIdRef.current || "없음"}
            </span>
          </div>
        </header>
        {error && (
          <div className="w-full p-4 bg-alert-negative-secondary border border-red-300 text-alert-negative-primary rounded-lg">
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              내 카메라
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
              <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
                LOCAL
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              상대방 영상
            </h3>
            <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              {!isConnected && (
                <div className="absolute inset-0 flex items-center justify-center text-white bg-gray-800">
                  {connectionState === "connected"
                    ? "원격 스트림 로딩 중..."
                    : "P2P 연결을 기다리는 중..."}
                </div>
              )}
              {isConnected && (
                <div className="absolute top-2 left-2 bg-primary-400 text-white px-2 py-1 rounded text-xs">
                  REMOTE
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">설명</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p>• 이 코드는 1:1 WebRTC P2P 통신을 위한 클라이언트 예제입니다.</p>
            <p>
              • 카메라 시작 버튼을 누르면 Socket.io 서버에 연결하고 `test-room`
              방에 자동으로 입장합니다.
            </p>
            <p>
              • 방에 다른 사용자가 있으면 자동으로 Offer를 보내고 연결을
              시작합니다. 상대방이 먼저 연결을 시도하면 Offer를 받아서 Answer를
              보냅니다.
            </p>
            <p>
              • **Offer, Answer, ICE Candidate**는 서버를 통해 서로 주고받으며
              P2P 연결을 위한 핸드셰이크를 완료합니다.
            </p>
            <p>
              • 연결에 성공하면 P2P로 직접 미디어 스트림을 주고받게 됩니다. 🎯
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
