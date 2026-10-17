"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { QRCodeCanvas } from "qrcode.react";

// นำเข้า Font จาก next/font/google
import { Noto_Sans_Thai, Sarabun } from "next/font/google";

// ตั้งค่า Noto Sans Thai สำหรับส่วน Header
const notoSansThai = Noto_Sans_Thai({
  weight: ["400", "700"],
  subsets: ["thai", "latin"],
  display: "swap",
});

// ตั้งค่า Sarabun สำหรับส่วน Body
const sarabun = Sarabun({
  weight: ["400", "600", "700"],
  subsets: ["thai", "latin"],
  display: "swap",
});

export default function AdminPage() {
  const [linens, setLinens] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 1. [แก้ไข] เพิ่ม State สำหรับเก็บข้อความค้นหา (Search Term)
  const [searchTerm, setSearchTerm] = useState("");

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

    // สร้าง Canvas ใหม่จำลองขึ้นมาเพื่อกำหนดขนาดการดาวน์โหลดเป็น 2000x2000px
    const highResCanvas = document.createElement("canvas");
    highResCanvas.width = 2000;
    highResCanvas.height = 2000;
    const ctx = highResCanvas.getContext("2d");

    if (ctx) {
      // ปิดการเบลอภาพ (Anti-aliasing) เพื่อให้ขอบของ QR Code ยังคงคมชัดเป็นพิกเซลแม้ขยายใหญ่
      ctx.imageSmoothingEnabled = false;
      
      // วาดภาพจาก QR Code เดิม ขยายให้เต็มขนาด 2000x2000px บน Canvas ใหม่
      ctx.drawImage(originalCanvas, 0, 0, 2000, 2000);
    }

    // แปลงไฟล์เป็น PNG (ขนาด 2000x2000px)
    const pngUrl = highResCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `${id}_QRCode.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  // 2. [แก้ไข] ฟังก์ชันกรองข้อมูลอัจฉริยะ (Smart Search)
  const filteredLinens = linens.filter((linen) => {
    // ถ้าไม่ได้พิมพ์อะไรเลย ให้แสดงทั้งหมด
    if (!searchTerm.trim()) return true;

    // แยกคำค้นหาด้วยช่องว่าง (Space) เพื่อให้หาได้หลายตัวแปร เช่น "LN 001", "โต๊ะ ขาว"
    const searchKeywords = searchTerm.toLowerCase().trim().split(/\s+/);
    
    // รวมข้อมูลรหัสและชื่อเข้าด้วยกันเพื่อใช้ค้นหา
    const textToSearch = `${linen.id} ${linen.name}`.toLowerCase();

    // เช็คว่า "ทุกคำ (every)" ที่พิมพ์มา จะต้องมีอยู่ใน textToSearch
    return searchKeywords.every((keyword) => textToSearch.includes(keyword));
  });

  // เพิ่มฟอนต์ Sarabun ตอนกำลังโหลดเช่นกัน
  if (loading) return <div className={`p-10 text-center font-bold text-gray-500 ${sarabun.className}`}>กำลังโหลดข้อมูลคลังผ้า...</div>;

  return (
    // เพิ่มคลาส sarabun.className ลงไปที่ div ครอบสุด เพื่อให้เนื้อหาหลัก (Body) ใช้ฟอนต์ Sarabun
    <div className={`p-8 bg-gray-50 min-h-screen pb-20 ${sarabun.className}`}>
      
      {/* ใช้ notoSansThai.className เพื่อบังคับให้ Header ใช้ Noto Sans Thai */}
      <h1 className={`text-2xl font-bold mb-6 text-gray-800 ${notoSansThai.className}`}>
        ระบบสร้าง QR Code (Admin)
      </h1>

      {/* 3. [แก้ไข] เพิ่มช่อง Search Input ด้านบนสุด */}
      <div className="mb-6">
        <input 
          type="text"
          placeholder="ค้นหารหัส หรือ ชื่อสินค้า (เว้นวรรคเพื่อค้นหาหลายคำพร้อมกันได้ เช่น 'LN ขาว')"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
        />
      </div>
      
      {/* 4. [แก้ไข] เปลี่ยนจาก Grid เป็น List (flex-col) */}
      <div className="flex flex-col gap-4">
        {/* เปลี่ยนการ map จาก linens ต้นฉบับ มาเป็น filteredLinens ที่ผ่านการกรองแล้ว */}
        {filteredLinens.map((linen) => (
          // ปรับโครงสร้างแต่ละ Card เป็นแถวแนวนอน (flex-row) แทนการจัดกลางแนวตั้ง
          <div key={linen.id} className="bg-white p-4 rounded-xl shadow border flex flex-row items-center gap-4">
            
            {/* ส่วนรูปภาพ QR Code (ย่อขนาดลงเล็กน้อยให้เหมาะกับ List) */}
            <div className="flex-shrink-0">
              <QRCodeCanvas 
                id={`qr-${linen.id}`}
                value={`${baseUrl}/linen/${linen.id}`} 
                size={100} // ปรับขนาดจาก 120 เป็น 100 เพื่อไม่ให้ List สูงเกินไป
                level="H"
              />
            </div>
            
            {/* ส่วนข้อความ รหัส และ ชื่อ (flex-grow ให้ขยายเต็มพื้นที่ที่เหลือ) */}
            <div className="flex-grow min-w-0"> {/* min-w-0 ช่วยให้ truncate / line-clamp ไม่ล้นหน้าจอ */}
              <p className="font-bold text-gray-800 text-base mb-1">{linen.id}</p>
              <p 
                className="text-sm text-gray-500 mb-2 line-clamp-3"
                title={linen.name}
              >
                {linen.name}
              </p>
            </div>
            
            {/* ส่วนปุ่มกด ดาวน์โหลด QR */}
            <div className="flex-shrink-0">
              <button 
                onClick={() => downloadQR(linen.id)}
                className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition whitespace-nowrap"
              >
                ดาวน์โหลด QR
              </button>
            </div>
          </div>
        ))}

        {/* 5. [แก้ไข] เพิ่ม UI กรณีค้นหาแล้วไม่เจอข้อมูล */}
        {filteredLinens.length === 0 && (
          <div className="text-center p-8 bg-white rounded-xl shadow border text-gray-500">
            ไม่พบข้อมูลสินค้าที่ค้นหา
          </div>
        )}
      </div>
    </div>
  );
}