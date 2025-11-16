export default function CardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mt-6 rounded-[15px] bg-white shadow-[4px_4px_20px_5px_rgba(0,0,0,0.05)] overflow-hidden">
      {children}
    </div>
  );
}
