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
    <div className={`min-h-screen bg-[#F2F5F9] pb-10 ${sarabun.className}`}>
      
      {/* 1. [แก้ไข] ย้ายสีน้ำเงินเข้ามาอยู่ใน Container หลัก และเพิ่ม rounded-b-3xl เพื่อให้มุมด้านล่างโค้งมนดูนุ่มนวล */}
      <div className="max-w-md mx-auto bg-[#12294D] pt-8 pb-10 px-6 rounded-b-3xl shadow-md">
        <div className="flex justify-between items-center text-[#FFFFFF] mb-5 text-sm opacity-90">
          <span>Linen-QR</span>
          <span>อัปเดตล่าสุด</span>
        </div>
        
        {/* ป้ายรหัสสินค้า */}
        <span className="bg-[#F26B1D] text-[#12294D] text-sm font-bold px-3 py-1 rounded-md inline-block mb-3 shadow-sm">
          {linen.id}
        </span>
        
        {/* ชื่อสินค้า */}
        <h1 className={`text-2xl font-bold text-[#FFFFFF] mb-2 leading-snug line-clamp-2 ${notoSansThai.className}`}>
          {linen.name}
        </h1>
        
        {/* รายละเอียด */}
        <p className="text-gray-300 text-sm">
          {linen.size ? `ขนาด ${linen.size}` : "ไม่ระบุขนาด"} • {linen.qty_per_pack || "-"} ชิ้น/ห่อ
        </p>
      </div>

      {/* 2. [แก้ไข] ลบ -mt-2 ออก เพื่อให้มีพื้นที่หายใจ (Gap) ระหว่างการ์ดสีน้ำเงินกับเนื้อหาด้านล่าง */}
      <div className="max-w-md mx-auto p-4 space-y-4 mt-2">
        
        {/* Card: ภาพ Mockup */}
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

        {/* Card: ยอดที่ซื้อเข้า */}
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

        {/* Card: โซนที่วาง */}
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

        {/* ปุ่มด้านล่าง */}
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