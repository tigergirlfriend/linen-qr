"use client";

import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { supabase } from "../../lib/supabase";

export default function AdminPage() {
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [savedSku, setSavedSku] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // ส่งข้อมูลไปบันทึกในตาราง linens ของ Supabase
    const { error } = await supabase
      .from("linens")
      .insert([{ id: sku, name: name }]);

    if (error) {
      alert("เกิดข้อผิดพลาด: " + error.message);
    } else {
      alert("บันทึกข้อมูลสำเร็จ!");
      setSavedSku(sku); // ให้ระบบจำรหัสที่เพิ่งบันทึกเพื่อเอาไปสร้าง QR Code
      setSku(""); // ล้างช่องกรอกรหัส
      setName(""); // ล้างช่องกรอกชื่อ
    }
    setIsSaving(false);
  };

  // URL ปลายทางที่ซ่อนอยู่ใน QR Code (เมื่อสแกนแล้วจะวิ่งไปหน้านี้)
  const qrUrl = `http://localhost:3000/linen/${savedSku}`;

  return (
    <div className="p-8 font-sans max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">ระบบเพิ่มรายการผ้า (Admin)</h1>
      
      <div className="flex gap-8">
        {/* กล่องซ้าย: ฟอร์มกรอกข้อมูล */}
        <div className="w-1/2 bg-white p-6 rounded-lg shadow-md border">
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <div>
              <label className="block mb-1 font-semibold text-gray-700">รหัสสินค้า</label>
              <input
                type="text"
                placeholder="เช่น FB-9595-CR"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                required
                className="border p-2 rounded w-full outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold text-gray-700">ชื่อ/รายละเอียดผ้า</label>
              <input
                type="text"
                placeholder="เช่น ผ้า 95x95 สีครีม"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border p-2 rounded w-full outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <button 
              type="submit" 
              disabled={isSaving}
              className="bg-blue-600 text-white p-2 rounded mt-2 hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isSaving ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
            </button>
          </form>
        </div>

        {/* กล่องขวา: แสดง QR Code เมื่อบันทึกสำเร็จ */}
        {savedSku && (
          <div className="w-1/2 flex flex-col items-center justify-center bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300">
            <h2 className="text-lg font-bold mb-4 text-green-600">✅ สร้าง QR Code สำเร็จ!</h2>
            
            <div id="print-area" className="bg-white p-4 flex flex-col items-center border rounded shadow-sm">
              <QRCodeCanvas value={qrUrl} size={150} level={"H"} />
              <p className="mt-2 font-bold text-lg text-gray-800">{savedSku}</p>
            </div>
            
            <button
              onClick={() => window.print()}
              className="mt-6 bg-green-500 text-white px-6 py-2 rounded-full font-bold shadow hover:bg-green-600"
            >
              🖨️ ปริ้นท์สติ๊กเกอร์
            </button>
          </div>
        )}
      </div>
    </div>
  );
}