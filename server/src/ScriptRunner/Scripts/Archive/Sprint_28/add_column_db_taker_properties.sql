alter table public.db_taker_properties 
add column if not exists last_contact_date timestamp with time zone;