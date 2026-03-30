const { createClient } = require("@supabase/supabase-js");
const bcrypt = require("bcryptjs");

const supabase = createClient(
  "YOUR_SUPABASE_URL",
  "YOUR_SUPABASE_ANON_KEY"
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

    const hash = await bcrypt.hash(user.password, 10);

    await supabase
      .from("users")
      .update({ password_hash: hash })
      .eq("id", user.id);

    console.log("تم تأمين:", user.username);
  }

  console.log("🔥 انتهى التشفير");
}

run();


