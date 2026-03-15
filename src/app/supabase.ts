import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://evlbmnlihebnygolmusu.supabase.co';
const supabaseKey = 'sb_publishable__T7bBBm5XtH3w_XxU2dITA_bzQEaJDw';

export const supabase = createClient(supabaseUrl, supabaseKey);
