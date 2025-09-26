export default function TextSection({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="flex flex-col gap-[10px] px-5 mb-10">
      <div className="subheadline-03-bold">{title}</div>
      <div className="text-gray-700 body-01-regular">{text}</div>
    </div>
  );
}
