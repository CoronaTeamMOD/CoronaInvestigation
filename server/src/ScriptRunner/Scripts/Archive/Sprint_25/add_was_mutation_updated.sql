alter table public.investigation
add column IF NOT EXISTS was_mutation_updated boolean default false;