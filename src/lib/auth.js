import { supabase } from "../supabaseClient";

export const getUserBase = async (userId) => {
  const { data, error } = await supabase
    .from("users")
    .select(`
      id,
      username,
      role_id,
      court_id,
      roles (
        id,
        role_key,
        role_name,
        access_level
      ),
      courts (
        id,
        name
      )
    `)
    .eq("id", userId)
    .single();

  return { data, error };
};
