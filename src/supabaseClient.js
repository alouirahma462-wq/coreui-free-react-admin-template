import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://wdjssmvfwzpahhnifihd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkanNzbXZmd3pwYWhobmlmaWhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3OTg5MTIsImV4cCI6MjA5MDM3NDkxMn0.2zwHzfppzufjL1T9GHbJSUhve2dwh92Lk-uEdb5mKMk";

export const supabase = createClient(supabaseUrl, supabaseKey);

