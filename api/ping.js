import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

export default async function handler(req, res) {
  const { error } = await supabase
    .from('keep_alive')
    .update({ updated_at: new Date().toISOString() })  // ✅ FIX
    .eq('id', 1)

  if (error) {
    return res.status(500).json({ ok: false, error })
  }

  return res.status(200).json({ ok: true })
}

