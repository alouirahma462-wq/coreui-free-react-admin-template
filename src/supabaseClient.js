import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://wdjssmvfwzpahhnifihd.supabase.co"

const supabaseKey = "sb_publishable_CsYZU2031CakNqTp3X121A_fBYKamBE"

export const supabase = createClient(supabaseUrl, supabaseKey)
