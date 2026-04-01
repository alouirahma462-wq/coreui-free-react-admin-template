import React from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://wdjssmvfwzpahhnifihd.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkanNzbXZmd3pwYWhobmlmaWhkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDc5ODkxMiwiZXhwIjoyMDkwMzc0OTEyfQ.j1dbrFTNB_NSRL-knzUvSkKMdHhjiX-HH_13kGzhzF4"
);

export default function CreateUsers() {

  const createUsers = async () => {
    const { data: users, error } = await supabase
      .from("profiles")
      .select("*");

    if (error) {
      alert("خطأ في جلب المستخدمين");
      console.log(error);
      return;
    }

    for (const u of users) {
      const email = `${u.username}@justice.tn`;

      const { error } = await supabase.auth.admin.createUser({
        email,
        password: "Temp@123",
        email_confirm: true
      });

      if (error) {
        console.log("Error:", email, error.message);
      } else {
        console.log("Created:", email);
      }
    }

    alert("✅ تم إنشاء المستخدمين في Authentication");
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>إنشاء المستخدمين</h2>
      <button onClick={createUsers}>
        إنشاء كل المستخدمين
      </button>
    </div>
  );
}
