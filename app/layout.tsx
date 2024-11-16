import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "APS NAV - https://aps.icu",
  description: "APS NAV",
  keywords: ['APS NAV', '导航', 'APS', 'mei', 'linuxcat', 'linuxcat周刊', '开源', '软件', '分享', '推荐'],
  authors: [{ name: 'mei' }],
  creator: 'mei',
  publisher: 'mei',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hans">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}