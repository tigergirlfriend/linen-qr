"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { QRCodeCanvas } from "qrcode.react";

// 1. [แก้ไข] นำเข้า Font จาก next/font/google
import { Noto_Sans_Thai, Sarabun } from "next/font/google";

// 2. [แก้ไข] ตั้งค่า Noto Sans Thai สำหรับส่วน Header
const notoSansThai = Noto_Sans_Thai({
  weight: ["400", "700"],
  subsets: ["thai", "latin"],
  display: "swap",
});

// 3. [แก้ไข] ตั้งค่า Sarabun สำหรับส่วน Body
const sarabun = Sarabun({
  weight: ["400", "600", "700"],
  subsets: ["thai", "latin"],
  display: "swap",
});

export default function AdminPage() {
  const [linens, setLinens] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ดึง URL อัตโนมัติ ไม่ว่าจะรันในคอมหรือบน Vercel
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  useEffect(() => {
    async function fetchLinens() {
      const { data, error } = await supabase.from("linens").select("*").order("id", { ascending: true });
      if (data) setLinens(data);
      setLoading(false);
    }
    fetchLinens();
  }, []);

  const downloadQR = (id: string) => {
    const originalCanvas = document.getElementById(`qr-${id}`) as HTMLCanvasElement;
    if (!originalCanvas) return;

    // 4. [แก้ไข] สร้าง Canvas ใหม่จำลองขึ้นมาเพื่อกำหนดขนาดการดาวน์โหลดเป็น 2000x2000px
    const highResCanvas = document.createElement("canvas");
    highResCanvas.width = 2000;
    highResCanvas.height = 2000;
    const ctx = highResCanvas.getContext("2d");

    if (ctx) {
      // 5. [แก้ไข] ปิดการเบลอภาพ (Anti-aliasing) เพื่อให้ขอบของ QR Code ยังคงคมชัดเป็นพิกเซลแม้ขยายใหญ่
      ctx.imageSmoothingEnabled = false;
      
      // 6. [แก้ไข] วาดภาพจาก QR Code เดิม (ซึ่งอาจมีขนาดเล็ก) ขยายให้เต็มขนาด 2000x2000px บน Canvas ใหม่
      ctx.drawImage(originalCanvas, 0, 0, 2000, 2000);
    }

    // 7. [แก้ไข] แปลงไฟล์เป็น PNG (ขนาด 2000x2000px นี้ละเอียดเพียงพอสำหรับงานพิมพ์ระดับ 300dpi)
    const pngUrl = highResCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `${id}_QRCode.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  // 8. [แก้ไข] เพิ่มฟอนต์ Sarabun ตอนกำลังโหลดเช่นกัน
  if (loading) return <div className={`p-10 text-center font-bold text-gray-500 ${sarabun.className}`}>กำลังโหลดข้อมูลคลังผ้า...</div>;

  return (
    // 9. [แก้ไข] เพิ่มคลาส sarabun.className ลงไปที่ div ครอบสุด เพื่อให้เนื้อหาหลัก (Body) ใช้ฟอนต์ Sarabun
    <div className={`p-8 bg-gray-50 min-h-screen pb-20 ${sarabun.className}`}>
      
      {/* 10. [แก้ไข] ลบคลาส font-heading เดิม (ถ้ามี) และใช้ notoSansThai.className เพื่อบังคับให้ Header ใช้ Noto Sans Thai */}
      <h1 className={`text-2xl font-bold mb-6 text-gray-800 ${notoSansThai.className}`}>
        ระบบสร้าง QR Code (Admin)
      </h1>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {linens.map((linen) => (
          <div key={linen.id} className="bg-white p-4 rounded-xl shadow border flex flex-col items-center">
            <QRCodeCanvas 
              id={`qr-${linen.id}`}
              value={`${baseUrl}/linen/${linen.id}`} 
              size={120} 
              level="H"
            />
            <p className="mt-4 font-bold text-gray-800 text-sm">{linen.id}</p>
            
            {/* 11. [แก้ไข] เปลี่ยนจาก truncate (1 บรรทัด) เป็น mb-2 line-clamp-3 (สูงสุด 3 บรรทัด) และใส่ title */}
            <p 
              className="text-xs text-gray-500 mb-2 line-clamp-3 w-full text-center"
              title={linen.name}
            >
              {linen.name}
            </p>
            
            <button 
              onClick={() => downloadQR(linen.id)}
              className="bg-blue-600 text-white text-xs px-3 py-2 rounded-lg hover:bg-blue-700 w-full transition"
            >
              ดาวน์โหลด QR
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}