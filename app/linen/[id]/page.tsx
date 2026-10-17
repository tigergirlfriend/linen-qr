"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";

// 1. นำเข้า Font จาก next/font/google
import { Noto_Sans_Thai, Sarabun } from "next/font/google";

// 2. ตั้งค่า Noto Sans Thai สำหรับส่วน Header
const notoSansThai = Noto_Sans_Thai({
  weight: ["400", "700"],
  subsets: ["thai", "latin"],
  display: "swap",
});

// 3. ตั้งค่า Sarabun สำหรับส่วน Body
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
    return <div className="min-h-screen flex items-center justify-center font-bold text-gray-500">กำลังโหลดข้อมูล...</div>;
  }

  if (!linen) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-red-500 text-xl">❌ ไม่พบข้อมูลรหัสสินค้านี้</div>;
  }

  return (
    // 4. แก้ไขคลาสฟอนต์ของ Body โดยลบ font-sans ออก และใส่ className ของ Sarabun เข้าไปแทน
    <div className={`min-h-screen bg-gray-100 p-4 pb-10 ${sarabun.className}`}>
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gray-200 w-full h-64 flex items-center justify-center relative">
          {linen.mockup_img ? (
            <img 
              src={linen.mockup_img} 
              alt={linen.name} 
              className="w-full h-full object-contain bg-white"
            />
          ) : (
            <span className="text-gray-400 font-semibold">ไม่มีรูปภาพ Mockup</span>
          )}
        </div>
        <div className="p-6">
          <div className="mb-4">
            {/* 5. ใส่ truncate ให้รหัสสินค้า เผื่อรหัสยาวเกินกรอบ และใส่ title เพื่อให้อ่านข้อมูลเต็มได้เมื่อนำเมาส์ไปชี้ */}
            <span 
              className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded inline-block max-w-full truncate"
              title={`รหัส: ${linen.id}`}
            >
              รหัส: {linen.id}
            </span>
          </div>
          
          {/* 6. เปลี่ยนฟอนต์ Header เป็น Noto Sans Thai, เพิ่ม truncate ตัดคำยาวๆ ไม่ให้เลย์เอาต์พัง และใส่ title */}
          <h1 
            className={`text-2xl font-bold text-gray-800 mb-2 truncate ${notoSansThai.className}`}
            title={linen.name}
          >
            {linen.name}
          </h1>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-gray-50 p-3 rounded-lg border">
              <p className="text-sm text-gray-500 mb-1">ขนาด</p>
              {/* 7. ใส่ truncate สำหรับขนาดเผื่อชื่อขนาดยาวเกินไป */}
              <p className="font-semibold text-gray-800 truncate" title={linen.size || "-"}>
                {linen.size || "-"}
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border">
              <p className="text-sm text-gray-500 mb-1 truncate">บรรจุ (ต่อห่อ)</p>
              <p className="font-semibold text-gray-800 truncate" title={`${linen.qty_per_pack || "-"} ชิ้น`}>
                {linen.qty_per_pack || "-"} ชิ้น
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border">
              <p className="text-sm text-gray-500 mb-1">สต๊อกรับเข้า</p>
              <p className="font-semibold text-gray-800">{linen.stock_in || 0}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border">
              <p className="text-sm text-gray-500 mb-1">สต๊อกคงเหลือ</p>
              <p className="font-bold text-green-600 text-lg">{linen.stock_remain || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LinenDetailPage() {
  return (
    // 8. ใช้ Sarabun ครอบส่วน Suspense ด้วยเพื่อให้ตอนกำลังโหลดก็ใช้ฟอนต์เดียวกัน
    <Suspense fallback={<div className={`min-h-screen flex items-center justify-center font-bold text-gray-500 ${sarabun.className}`}>กำลังเตรียมหน้าเว็บ...</div>}>
      <LinenDetailContent />
    </Suspense>
  );
}