import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET(req) {
  try {
    // 🔐 حماية CRON_SECRET
    const auth = req.headers.get("authorization");

    if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 🟢 تحديث keep_alive
    const { error } = await supabase
      .from("keep_alive")
      .update({ updated_at: new Date().toISOString() }) // ✅ مهم
      .eq("id", 1);

    return NextResponse.json({
      ok: true,
      db: error ? "error" : "updated",
      time: new Date().toISOString()
    });

  } catch (e) {
    return NextResponse.json({
      ok: false,
      error: e.message
    });
  }
}





