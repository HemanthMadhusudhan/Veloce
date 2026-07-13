import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function main() {
  const { data, error } = await supabase.from('products').update({ stock: 99 }).eq('id', 'japan-away-kit-2026').select();
  console.log('Update result:', data, error);
}

main();
