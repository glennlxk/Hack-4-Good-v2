import type { Metadata } from "next";
import { Inter, Onest } from "next/font/google";
import "./globals.css";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import { TaskProvider } from "@/context/TaskContext";
import NavBar, { Navbar } from "@/components/global/navbar";

const onest = Onest({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Marketplace",
  description: "Hack 4 Good Minimart",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body className={onest.className}>
          <TaskProvider>
            <Navbar />
            {children}
          </TaskProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
