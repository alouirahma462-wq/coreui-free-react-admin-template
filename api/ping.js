import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

export default async function handler(req, res) {
  try {
    const { error } = await supabase
      .from('keep_alive')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', 1)

    if (error) {
      return res.status(500).json({ ok: false, error: error.message })
    }

    return res.status(200).json({ ok: true, time: new Date().toISOString() })
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message })
  }
}


