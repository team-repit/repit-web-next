import type { Metadata } from "next";
import "/style/globals.css";

export const metadata: Metadata = {
  title: "Re:PiT",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased mx-auto w-[500px] flex-col items-center justify-center min-h-screen">
        <div className="flex">{children}</div>
      </body>
    </html>
  );
}
