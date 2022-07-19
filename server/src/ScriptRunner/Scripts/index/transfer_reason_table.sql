CREATE TABLE IF NOT EXISTS public.transfer_reason
(

    id integer NOT NULL,
    display_name character varying COLLATE pg_catalog."default",
    CONSTRAINT transfer_reason_pk PRIMARY KEY (id)
);
INSERT INTO public.transfer_reason(id, display_name)

	VALUES (0,'אחר'),
        (1,'ברירת מחדל'),
        (20,'עומס חקירות'),
        (30,'חקירה ישנה'),
        (40,'חקירה מיוחדת'),
        (50,'מקום מגורים'),
        (60,'אירוע הדבקה')
	ON CONFLICT DO NOTHING;

ALTER TABLE investigation ADD COLUMN IF NOT EXISTS transfer_reason_id integer;

ALTER TABLE investigation ADD CONSTRAINT transfer_reason_id_fk 
FOREIGN KEY (transfer_reason_id)
REFERENCES public.transfer_reason (id) MATCH SIMPLE;