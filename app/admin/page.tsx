"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { QRCodeCanvas } from "qrcode.react";

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
    const canvas = document.getElementById(`qr-${id}`) as HTMLCanvasElement;
    if (!canvas) return;
    const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `${id}_QRCode.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  if (loading) return <div className="p-10 text-center font-bold text-gray-500">กำลังโหลดข้อมูลคลังผ้า...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans pb-20">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">ระบบสร้าง QR Code (Admin)</h1>
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
            <p className="text-xs text-gray-500 mb-4 truncate w-full text-center">{linen.name}</p>
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