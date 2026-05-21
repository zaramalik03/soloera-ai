import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nsckyslywcvqwmnotpor.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zY2t5c2x5d2N2cXdtbm90cG9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxOTY0NjYsImV4cCI6MjA5NDc3MjQ2Nn0.u4VkbRXMacUuSHIVVpk8QLt617W4vMVKP4EvA872-9U'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)