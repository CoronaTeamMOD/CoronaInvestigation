ALTER TABLE exposure
ADD COLUMN IF NOT EXISTS border_checkpoint_type integer;

ALTER TABLE exposure ADD CONSTRAINT exposure_border_checkpoint_type_fk 
FOREIGN KEY (border_checkpoint_type)
REFERENCES public.border_checkpoint_type (id) MATCH SIMPLE;

ALTER TABLE exposure
ADD COLUMN IF NOT EXISTS border_checkpoint character varying(10);

ALTER TABLE exposure ADD CONSTRAINT exposure_border_checkpoint_fk 
FOREIGN KEY (border_checkpoint)
REFERENCES public.border_checkpoint (id) MATCH SIMPLE;

ALTER TABLE exposure
ADD COLUMN IF NOT EXISTS last_destination_country character varying COLLATE pg_catalog."default";

ALTER TABLE exposure ADD CONSTRAINT exposure_last_country_fk 
FOREIGN KEY (last_destination_country)
REFERENCES public.countries (id) MATCH SIMPLE;

ALTER TABLE exposure
ADD COLUMN IF NOT EXISTS arrival_time_to_israel time with time zone;

ALTER TABLE exposure
ADD COLUMN IF NOT EXISTS arrival_date_to_israel timestamp with time zone;

ALTER TABLE exposure
ADD COLUMN IF NOT EXISTS other_flight_num character varying(10) COLLATE pg_catalog."default";

ALTER TABLE exposure
ADD COLUMN IF NOT EXISTS flight_seat_num character varying(10) COLLATE pg_catalog."default";






