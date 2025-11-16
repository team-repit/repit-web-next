import type { Metadata } from "next";
import "/style/globals.css";
import { AuthRefreshWrapper } from "@/components/common/auth-refresh-wrapper";
export const metadata: Metadata = {
  title: "Re:PiT",
  icons: {
    icon: "/assets/logo-favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased max-w-[500px] min-h-screen mx-auto flex flex-col items-center shadow-[-5px_0_10px_-5px_rgba(0,0,0,0.1),5px_0_10px_-5px_rgba(0,0,0,0.1)]">
        <AuthRefreshWrapper>{children}</AuthRefreshWrapper>
      </body>
    </html>
  );
}
