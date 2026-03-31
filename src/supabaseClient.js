import { createClient } from "@supabase/supabase-js";

// 🔥 ضع بيانات مشروعك هنا
const supabaseUrl = "https://wdjssmvfwzpahhnifihd.supabase.co";

// ⚠️ مهم جداً: استخدم Publishable Key فقط (مو secret)
const supabaseKey = "sb_publishable_aEshRguohYW3XKWQktNnRg__NIDQVef";

export const supabase = createClient(supabaseUrl, supabaseKey);


