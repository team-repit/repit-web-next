export default function TextSection({ text }: { text: string }) {
  return (
    <div className="flex flex-col gap-2.5 px-5 mb-10">
      <div className="text-gray-700 body-01-regular whitespace-pre-line break-words">
        {text}
      </div>
    </div>
  );
}
