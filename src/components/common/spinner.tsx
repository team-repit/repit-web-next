import spinnerGif from "../../assets/spinner.gif";

import Image from "next/image";

export default function Spinner() {
  return (
    <div>
      <Image src={spinnerGif} width={100} height={100} alt="로딩 중..." />
    </div>
  );
}
