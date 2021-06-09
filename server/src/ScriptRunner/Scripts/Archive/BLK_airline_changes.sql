-- SEQUENCE: public.airlines_id_seq

-- DROP SEQUENCE public.airlines_id_seq;

-- The number on START need to be last ID on airlines table so sequence will be right, now number is according to coronai-App-Testing DB.
CREATE SEQUENCE public.airlines_id_seq
    INCREMENT 1
    START 77
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER TABLE public.airlines
    ALTER COLUMN id SET DEFAULT nextval('airlines_id_seq'::regclass);

ALTER TABLE public.airlines
    ALTER COLUMN display_name SET NOT NULL;

ALTER TABLE public.flight_numbers
    ALTER COLUMN display_name SET NOT NULL;