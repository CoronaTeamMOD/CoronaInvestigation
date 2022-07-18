CREATE TABLE IF NOT EXISTS public.trasfer_reason
(

    id integer NOT NULL,
    display_name character varying COLLATE pg_catalog."default",
    CONSTRAINT trasfer_reason_pk PRIMARY KEY (id)
);
INSERT INTO public.trasfer_reason(id, display_name)
	VALUES (0,'אחר')
    ON CONFLICT DO NOTHING;
    INSERT INTO public.trasfer_reason(id, display_name)
    VALUES (1,'ברירת מחדל')
    ON CONFLICT DO NOTHING;
    INSERT INTO public.trasfer_reason(id, display_name)
    VALUES (20,'עומס חקירות')
    ON CONFLICT DO NOTHING;
    INSERT INTO public.trasfer_reason(id, display_name)
    VALUES (30,'חקירה ישנה')
    ON CONFLICT DO NOTHING;
    INSERT INTO public.trasfer_reason(id, display_name)
    VALUES (40,'חקירה מיוחדת')
    ON CONFLICT DO NOTHING;
    INSERT INTO public.trasfer_reason(id, display_name)
    VALUES (50,'מקום מגורים')
    ON CONFLICT DO NOTHING;
    INSERT INTO public.trasfer_reason(id, display_name)
    VALUES (60,'אירוע הדבקה')
	ON CONFLICT DO NOTHING;

ALTER TABLE investigation
ADD COLUMN IF NOT EXISTS transfer_reason_id integer;

ALTER TABLE investigation ADD CONSTRAINT transfer_reason_id_fk 
FOREIGN KEY (transfer_reason_id)
REFERENCES public.trasfer_reason (id) MATCH SIMPLE;