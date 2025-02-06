import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qzamtpxqulfshhqqcrsa.supabase.co";
const supabaseKey =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6YW10cHhxdWxmc2hocXFjcnNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3OTYwMzUsImV4cCI6MjA1NDM3MjAzNX0.pO1Ik3ehBS8z9aVLPyKyyX96ZK21Y5ejiC_At8MYecM";

export const supabase = createClient(supabaseUrl, supabaseKey);
