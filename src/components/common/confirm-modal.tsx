interface ConfirmModalProps {
  isOpen: boolean;
  type: string;
  extraInfo?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  type,
  extraInfo,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center z-50">
      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative bg-white rounded-lg w-[300px] flex flex-col border border-gray-300 overflow-hidden">
        {/* 메시지 영역 */}
        <div className="pt-[60px] pb-10 p-6">
          <p className="subheadline-03-bold text-center">
            정말 {type} 하시겠습니까?
          </p>

          <p className="flex mt-[10px] justify-center body-02-regular text-gray-600">
            {extraInfo}
          </p>
        </div>

        {/* 버튼 영역 */}
        <div className="flex border-t border-gray-300">
          <button
            className="flex-1 py-5 text-gray-700 body-01-regular border-r border-gray-300 cursor-pointer hover:bg-gray-100"
            onClick={onCancel}
          >
            취소
          </button>
          <button
            className="flex-1 py-5 body-01-bold cursor-pointer text-alert-negative-primary hover:bg-gray-100"
            onClick={onConfirm}
          >
            {type}
          </button>
        </div>
      </div>
    </div>
  );
}
