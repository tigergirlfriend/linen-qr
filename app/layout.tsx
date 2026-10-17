import type { Metadata } from "next";
// 1. [ลบออก] ลบการ import { Geist, Geist_Mono } ออกไป เพื่อไม่ให้ไปทับกับฟอนต์ที่เราตั้งไว้ใน globals.css
import "./globals.css";

// 2. [อัปเดต] เปลี่ยน Title ให้ตรงกับโปรเจกต์
export const metadata: Metadata = {
  title: "Linen-QR Management",
  description: "ระบบจัดการคลังผ้าด้วย QR Code",
};

// 3. [แก้เฉพาะส่วนที่จำเป็น] ใช้ Any หรือกำหนด Type ปกติสำหรับ children เพื่อความเข้ากันได้
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 4. [อัปเดต] เปลี่ยนภาษาเป็น th (ภาษาไทย)
    // 5. [ลบออก] ลบ ${geistSans.variable} ${geistMono.variable} ออกจาก className เพื่อเปิดทางให้ globals.css ทำงานเต็มที่
    <html
      lang="th"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}