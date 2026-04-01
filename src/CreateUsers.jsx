import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  "https://wdjssmvfwzpahhnifihd.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkanNzbXZmd3pwYWhobmlmaWhkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDc5ODkxMiwiZXhwIjoyMDkwMzc0OTEyfQ.j1dbrFTNB_NSRL-knzUvSkKMdHhjiX-HH_13kGzhzF4"
)

const users = [
  { email: "user1@justice.Tunisia", password: "Temp@123" },
  { email: "user2@justice.Tunisia", password: "Temp@123" }
]

async function createUsers() {
  for (const user of users) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true
    })

    if (error) {
      console.log("Error:", error.message)
    } else {
      console.log("Created:", data.user.email)
    }
  }
}

createUsers()

