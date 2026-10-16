import { createClient } from '@supabase/supabase-js';

// ใส่ URL และ Key เข้าไปตรงๆ เพื่อแก้ปัญหาระบบไม่อ่านไฟล์ .env
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://avqqsykvtothfbldzune.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2cXFzeWt2dG90aGZibGR6dW5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIxMTU4MTYsImV4cCI6MjEwNzY5MTgxNn0.HNBAARMaHyhrtV8UykvajLNcYzBAEeWpZvNqtP1R6ac";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);