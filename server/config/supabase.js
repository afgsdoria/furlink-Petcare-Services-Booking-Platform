// server/config/supabase.js
const { createClient } = require("@supabase/supabase-js");

// Use environment variables from .env
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("❌ Missing Supabase URL or Service Key in environment variables");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

module.exports = { supabase };
