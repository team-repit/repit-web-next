"use client";
import { motion } from "framer-motion";
import Image from "next/image";

interface AnimatedPageLayoutProps {
  title: React.ReactNode;
  imageSrc: string;
  children?: React.ReactNode;
}

export default function AnimatedPageLayout({
  title,
  imageSrc,
  children,
}: AnimatedPageLayoutProps) {
  return (
    <div className="flex flex-col items-center pt-50 min-h-screen text-center gap-6 px-6">
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 1.8 }}
      >
        <Image src={imageSrc} alt="illustration" width={200} height={200} />
      </motion.div>

      <h1 className="text-xl font-semibold whitespace-pre-line">{title}</h1>

      {children}
    </div>
  );
}
