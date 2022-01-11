alter table public.bot_investigation
add column IF NOT EXISTS was_updated_after_investigation_start boolean default false;