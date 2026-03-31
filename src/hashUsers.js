const { createClient } = require("@supabase/supabase-js");
const bcrypt = require("bcryptjs");

// ⚠️ حطي مفاتيح Supabase هنا (Secret key فقط في هذا السكربت)
const supabase = createClient(
  "https://wdjssmvfwzpahhnifihd.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkanNzbXZmd3pwYWhobmlmaWhkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDc5ODkxMiwiZXhwIjoyMDkwMzc0OTEyfQ.j1dbrFTNB_NSRL-knzUvSkKMdHhjiX-HH_13kGzhzF4"
);

async function run() {
  const { data: users, error } = await supabase
    .from("users")
    .select("*");

  if (error) {
    console.log("Error:", error);
    return;
  }

  for (let user of users) {
    if (!user.password) continue;

    // 🔐 تشفير الباسورد
    const hash = await bcrypt.hash(user.password, 10);

    // تحديث في قاعدة البيانات
    const { error: updateError } = await supabase
      .from("users")
      .update({ password_hash: hash })
      .eq("id", user.id);

    if (updateError) {
      console.log("خطأ في:", user.username, updateError);
    } else {
      console.log("✔ تم تأمين:", user.username);
    }
  }

  console.log("🔥 انتهى التشفير");
}

run();


