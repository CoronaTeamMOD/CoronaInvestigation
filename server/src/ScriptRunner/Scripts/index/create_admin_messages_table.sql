-- Creating public.admin_messages
CREATE TABLE IF NOT EXISTS public.admin_messages (
    id integer PRIMARY KEY NOT NULL,
    message varchar NOT NULL,
	desks_id integer[] NOT NULL,
	admin_id varchar NOT NULL
);