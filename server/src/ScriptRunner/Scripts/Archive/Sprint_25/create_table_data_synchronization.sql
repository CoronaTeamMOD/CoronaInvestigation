CREATE TABLE IF NOT EXISTS public.data_synchronization (
   table_name varchar,
   last_update timestamp,
   id integer
);

INSERT INTO public.data_synchronization(
	table_name, last_update, id)
	VALUES ('cities_temp', NULL, NUll);

INSERT INTO public.data_synchronization(
	table_name, last_update, id)
	VALUES ('streets_temp', NULL, 100007);