-- SEQUENCE: public.airlines_id_seq

-- DROP SEQUENCE public.airlines_id_seq;

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