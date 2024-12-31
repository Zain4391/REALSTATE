import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabaseURL = process.env.SUPABASE_URL;
const APIKEY = process.env.API_KEY;

export const supabase = createClient(supabaseURL, APIKEY);
