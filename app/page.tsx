"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";

// ย้ายโค้ดเดิมมาสร้างเป็น Component ย่อย
function LinenDetailContent() {
  const params = useParams();
  const id = params.id as string;
  
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
    <div className="min-h-screen bg-gray-100 p-4 font-sans pb-10">
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
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">
              รหัส: {linen.id}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{linen.name}</h1>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-gray-50 p-3 rounded-lg border">
              <p className="text-sm text-gray-500 mb-1">ขนาด</p>
              <p className="font-semibold text-gray-800">{linen.size || "-"}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border">
              <p className="text-sm text-gray-500 mb-1">บรรจุ (ต่อห่อ)</p>
              <p className="font-semibold text-gray-800">{linen.qty_per_pack || "-"} ชิ้น</p>
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

// หน้าเว็บหลักที่ครอบ Suspense ตามที่ Vercel ต้องการ
export default function LinenDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-bold text-gray-500">กำลังเตรียมหน้าเว็บ...</div>}>
      <LinenDetailContent />
    </Suspense>
  );
}