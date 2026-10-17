"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";

// นำเข้า Font
import { Noto_Sans_Thai, Sarabun } from "next/font/google";

const notoSansThai = Noto_Sans_Thai({
  weight: ["400", "700"],
  subsets: ["thai", "latin"],
  display: "swap",
});

const sarabun = Sarabun({
  weight: ["400", "600", "700"],
  subsets: ["thai", "latin"],
  display: "swap",
});

function LinenDetailContent() {
  const params = useParams();
  const id = params?.id as string;
  
  const [linen, setLinen] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLinen() {
      const { data, error } = await supabase
        .from("linens")
        .select("*")
        .eq("id", id)
        .single();
      
      if (data) {
        setLinen(data);
      }
      setLoading(false);
    }
    
    if (id) {
      fetchLinen();
    }
  }, [id]);

  if (loading) {
    return <div className={`min-h-screen bg-[#F2F5F9] flex items-center justify-center font-bold text-[#5B6B84] ${sarabun.className}`}>กำลังโหลดข้อมูล...</div>;
  }

  if (!linen) {
    return <div className={`min-h-screen bg-[#F2F5F9] flex items-center justify-center font-bold text-red-500 text-xl ${sarabun.className}`}>❌ ไม่พบข้อมูลรหัสสินค้านี้</div>;
  }

  return (
    // 1. [แก้ไข] เปลี่ยน pb-24 เป็น pb-10 เนื่องจากเรานำ Sticky Footer ออกแล้ว จึงไม่จำเป็นต้องเว้นพื้นที่ด้านล่างไว้เยอะ
    <div className={`min-h-screen bg-[#F2F5F9] pb-10 ${sarabun.className}`}>
      
      {/* 2. [ส่วนหัว] พื้นสีน้ำเงิน #12294D ตาม Ref */}
      <div className="bg-[#12294D] w-full pt-8 pb-8 px-4">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center text-[#FFFFFF] mb-4 text-sm">
            <span>Linen-QR</span>
            <span className="text-gray-300">อัปเดตล่าสุด</span>
          </div>
          
          {/* 3. [ป้ายรหัสสินค้า] สีพื้นส้ม #F26B1D, ตัวอักษรบนพื้นส้ม #12294D */}
          <span className="bg-[#F26B1D] text-[#12294D] text-sm font-bold px-3 py-1 rounded-md inline-block mb-3">
            {linen.id}
          </span>
          
          {/* 4. [ชื่อสินค้า] ตัวอักษรบนพื้นน้ำเงิน #FFFFFF และฟอนต์ Header Noto Sans Thai */}
          <h1 className={`text-2xl font-bold text-[#FFFFFF] mb-2 line-clamp-2 ${notoSansThai.className}`}>
            {linen.name}
          </h1>
          <p className="text-gray-300 text-sm">
            {linen.size ? `ขนาด ${linen.size}` : "ไม่ระบุขนาด"} • {linen.qty_per_pack || "-"} ชิ้น/ห่อ
          </p>
        </div>
      </div>

      {/* Container สำหรับเนื้อหาการ์ดต่างๆ */}
      <div className="max-w-md mx-auto p-4 space-y-4 -mt-2">
        
        {/* 5. [Card: ภาพ Mockup] */}
        <div className="bg-[#FFFFFF] p-5 rounded-xl border border-[#D9E0EA] shadow-sm">
          <h2 className={`text-lg font-bold text-[#12294D] border-l-4 border-[#F26B1D] pl-3 mb-4 ${notoSansThai.className}`}>
            ภาพ Mockup
          </h2>
          <div className="bg-[#F2F5F9] w-full h-48 flex items-center justify-center rounded-lg border border-[#D9E0EA] overflow-hidden p-2">
            {linen.mockup_img ? (
              <img 
                src={linen.mockup_img} 
                alt={linen.name} 
                className="w-full h-full object-contain"
              />
            ) : (
              <span className="text-[#5B6B84] font-semibold text-sm">ไม่มีรูปภาพ Mockup</span>
            )}
          </div>
        </div>

        {/* 6. [Card: ยอดที่ซื้อเข้า] */}
        <div className="bg-[#FFFFFF] p-5 rounded-xl border border-[#D9E0EA] shadow-sm">
          <h2 className={`text-lg font-bold text-[#12294D] border-l-4 border-[#F26B1D] pl-3 mb-4 ${notoSansThai.className}`}>
            ยอดที่ซื้อเข้า
          </h2>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-5xl font-bold text-[#12294D]">{linen.stock_in || 0}</span>
            <span className="text-[#5B6B84] text-sm">ชิ้น</span>
          </div>
          <div className="border-t border-[#D9E0EA] pt-4 flex justify-between items-center text-sm">
            <span className="text-[#5B6B84]">สต๊อกคงเหลือตามระบบ</span>
            <span className="text-[#16233B] font-bold text-lg">{linen.stock_remain || 0} ชิ้น</span>
          </div>
        </div>

        {/* 7. [Card: โซนที่วาง] */}
        <div className="bg-[#FFFFFF] p-5 rounded-xl border border-[#D9E0EA] shadow-sm">
          <h2 className={`text-lg font-bold text-[#12294D] border-l-4 border-[#F26B1D] pl-3 mb-4 ${notoSansThai.className}`}>
            โซนที่วาง
          </h2>
          <div className="bg-[#FFE9DA] rounded-xl p-4 flex items-center gap-5">
            <span className="text-4xl font-bold text-[#B84A06]">{linen.zone || "A3"}</span>
            <div className="flex flex-col">
              <span className="text-[#16233B] font-bold text-sm">คลัง A • ชั้น 3 • ช่อง 12</span>
              <span className="text-[#5B6B84] text-xs mt-1">{linen.name}</span>
            </div>
          </div>
        </div>

        {/* 8. [แก้ไข] ยกเลิกรูปแบบ Fixed Sticky นำปุ่มมาใส่ใน Flow หลักของการ์ด เพื่อให้เลื่อนจอไปจนสุดแล้วค่อยเจอปุ่ม */}
        <div className="pt-4">
          <button className="w-full bg-[#12294D] text-[#FFFFFF] font-bold py-3.5 rounded-xl hover:bg-opacity-90 transition shadow-md text-sm sm:text-base">
            ไปที่ระบบเบิกจ่ายผ้า
          </button>
        </div>

      </div>
    </div>
  );
}

export default function LinenDetailPage() {
  return (
    <Suspense fallback={<div className={`min-h-screen bg-[#F2F5F9] flex items-center justify-center font-bold text-[#5B6B84] ${sarabun.className}`}>กำลังเตรียมหน้าเว็บ...</div>}>
      <LinenDetailContent />
    </Suspense>
  );
}