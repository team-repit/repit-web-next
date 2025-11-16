interface ButtonProps {
  text: string;
  variant?: "primary" | "secondary";
  onClick?: () => void;
}

export default function Button({
  text,
  variant = "primary",
  onClick,
}: ButtonProps) {
  const baseStyle =
    "w-full rounded-[5px] py-[14px] body-01-bold cursor-pointer";
  const style =
    variant === "primary"
      ? `${baseStyle} bg-black text-white`
      : `${baseStyle} border border-gray-400 text-gray-600 body-01-regular`;

  return (
    <button className={style} onClick={onClick}>
      {text}
    </button>
  );
}
