alter table contact_event
add column if not exists is_there_more_verified boolean;

alter table contact_event
add column if not exists details_additional_verified varchar;