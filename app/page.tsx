import { redirect } from "next/navigation";

export default function Home() {
  // สั่งให้หน้าแรกเด้งไปที่หน้า admin ทันที
  redirect("/admin");
}