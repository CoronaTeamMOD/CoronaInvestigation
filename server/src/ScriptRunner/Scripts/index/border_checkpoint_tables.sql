-- Creating table border_checkpoint_type

CREATE TABLE IF NOT EXISTS public.border_checkpoint_type
(
    id integer NOT NULL,
    display_name character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT border_checkpoint_type_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

-- Inserting data into table border_checkpoint_type

INSERT INTO public.border_checkpoint_type(id, display_name)
	VALUES (1,'ברכב/ברגל')
	ON CONFLICT DO NOTHING;

INSERT INTO public.border_checkpoint_type(id, display_name)
	VALUES (2,'שיט')
	ON CONFLICT DO NOTHING;

INSERT INTO public.border_checkpoint_type(id, display_name)
	VALUES (3,'טיסה')
	ON CONFLICT DO NOTHING;

    -- Creating table border_checkpoint

CREATE TABLE IF NOT EXISTS public.border_checkpoint
(
    id character varying(10) COLLATE pg_catalog."default" NOT NULL,
    display_name character varying COLLATE pg_catalog."default" NOT NULL,
    border_checkpoint_type_id integer,
    CONSTRAINT border_checkpoint_pkey PRIMARY KEY (id),
    CONSTRAINT border_checkpoint_type_fkey FOREIGN KEY (border_checkpoint_type_id)
        REFERENCES public.border_checkpoint_type (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

-- Inserting data into table border_checkpoint

INSERT INTO public.border_checkpoint(id, display_name,border_checkpoint_type_id)
	VALUES ('s1024','מעבר תרקומיא',1)
	ON CONFLICT DO NOTHING;

INSERT INTO public.border_checkpoint(id, display_name,border_checkpoint_type_id)
	VALUES ('s1025','מעבר מיתר',1)
	ON CONFLICT DO NOTHING;

INSERT INTO public.border_checkpoint(id, display_name,border_checkpoint_type_id)
	VALUES ('s1026','מעבר ל"ה',1)
	ON CONFLICT DO NOTHING;

INSERT INTO public.border_checkpoint(id, display_name,border_checkpoint_type_id)
	VALUES ('s1027','מעבר אייל',1)
	ON CONFLICT DO NOTHING;

INSERT INTO public.border_checkpoint(id, display_name,border_checkpoint_type_id)
	VALUES ('s1028','מעבר רחל',1)
	ON CONFLICT DO NOTHING;

INSERT INTO public.border_checkpoint(id, display_name,border_checkpoint_type_id)
	VALUES ('s1029','מעבר קלנדיה',1)
	ON CONFLICT DO NOTHING;

INSERT INTO public.border_checkpoint(id, display_name,border_checkpoint_type_id)
	VALUES ('s1030','מעבר שער-אפריים',1)
	ON CONFLICT DO NOTHING;

INSERT INTO public.border_checkpoint(id, display_name,border_checkpoint_type_id)
	VALUES ('s1031','מעבר ריחן',1)
	ON CONFLICT DO NOTHING;

INSERT INTO public.border_checkpoint(id, display_name,border_checkpoint_type_id)
	VALUES ('s1032','מעבר גלבוע',1)
	ON CONFLICT DO NOTHING;

INSERT INTO public.border_checkpoint(id, display_name,border_checkpoint_type_id)
	VALUES ('s1033','נהר הירדן',1)
	ON CONFLICT DO NOTHING;

INSERT INTO public.border_checkpoint(id, display_name,border_checkpoint_type_id)
	VALUES ('s1034','טאבה',1)
	ON CONFLICT DO NOTHING;

INSERT INTO public.border_checkpoint(id, display_name,border_checkpoint_type_id)
	VALUES ('s1035','ערבה',1)
	ON CONFLICT DO NOTHING;

INSERT INTO public.border_checkpoint(id, display_name,border_checkpoint_type_id)
	VALUES ('s1036','מרינה אשקלון',2)
	ON CONFLICT DO NOTHING;

INSERT INTO public.border_checkpoint(id, display_name,border_checkpoint_type_id)
	VALUES ('s1037','אשדוד',2)
	ON CONFLICT DO NOTHING;

INSERT INTO public.border_checkpoint(id, display_name,border_checkpoint_type_id)
	VALUES ('s1038','אילת נמל ים',2)
	ON CONFLICT DO NOTHING;

INSERT INTO public.border_checkpoint(id, display_name,border_checkpoint_type_id)
	VALUES ('s1039','שדה תעופה רמון',3)
	ON CONFLICT DO NOTHING;

INSERT INTO public.border_checkpoint(id, display_name,border_checkpoint_type_id)
	VALUES ('s1040','נתב"ג',3)
	ON CONFLICT DO NOTHING;

INSERT INTO public.border_checkpoint(id, display_name,border_checkpoint_type_id)
	VALUES ('s1041','גשר אלנבי',1)
	ON CONFLICT DO NOTHING;

INSERT INTO public.border_checkpoint(id, display_name,border_checkpoint_type_id)
	VALUES ('s1043','חיפה נמל ים',2)
	ON CONFLICT DO NOTHING;

INSERT INTO public.border_checkpoint(id, display_name,border_checkpoint_type_id)
	VALUES ('s2001','חיפה שדה תעופה',3)
	ON CONFLICT DO NOTHING;

INSERT INTO public.border_checkpoint(id, display_name,border_checkpoint_type_id)
	VALUES ('s2002','עובדה',3)
	ON CONFLICT DO NOTHING;

INSERT INTO public.border_checkpoint(id, display_name,border_checkpoint_type_id)
	VALUES ('s2003','ראש הנקרה ',1)
	ON CONFLICT DO NOTHING;

INSERT INTO public.border_checkpoint(id, display_name,border_checkpoint_type_id)
	VALUES ('s2004','מרינה ת"א',2)
	ON CONFLICT DO NOTHING;

INSERT INTO public.border_checkpoint(id, display_name,border_checkpoint_type_id)
	VALUES ('s2005','מרינה הרצליה',2)
	ON CONFLICT DO NOTHING;

INSERT INTO public.border_checkpoint(id, display_name,border_checkpoint_type_id)
	VALUES ('s2006','קצא"א',2)
	ON CONFLICT DO NOTHING;

INSERT INTO public.border_checkpoint(id, display_name,border_checkpoint_type_id)
	VALUES ('s2007','ניצנה',1)
	ON CONFLICT DO NOTHING;

INSERT INTO public.border_checkpoint(id, display_name,border_checkpoint_type_id)
	VALUES ('s2008','יקל"ז',2)
	ON CONFLICT DO NOTHING;

INSERT INTO public.border_checkpoint(id, display_name,border_checkpoint_type_id)
	VALUES ('s2009','ארז בינלאומי',1)
	ON CONFLICT DO NOTHING;

INSERT INTO public.border_checkpoint(id, display_name,border_checkpoint_type_id)
	VALUES ('s2010','חדרה נמל "פחם"',2)
	ON CONFLICT DO NOTHING;
    
INSERT INTO public.border_checkpoint(id, display_name,border_checkpoint_type_id)
	VALUES ('s2011','חיל האוויר חצור',3)
	ON CONFLICT DO NOTHING;

INSERT INTO public.border_checkpoint(id, display_name,border_checkpoint_type_id)
	VALUES ('s2012','חיל האוויר חצרים',3)
	ON CONFLICT DO NOTHING;

INSERT INTO public.border_checkpoint(id, display_name,border_checkpoint_type_id)
	VALUES ('s2013','חיל האוויר רמת דוד',3)
	ON CONFLICT DO NOTHING;

INSERT INTO public.border_checkpoint(id, display_name,border_checkpoint_type_id)
	VALUES ('s2014','חיל האוויר תל נוף',3)
	ON CONFLICT DO NOTHING;

INSERT INTO public.border_checkpoint(id, display_name,border_checkpoint_type_id)
	VALUES ('s2015','חיל האוויר פלמחים',3)
	ON CONFLICT DO NOTHING;

/* Exposure */

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

ALTER TABLE exposure
ADD COLUMN IF NOT EXISTS other_airline character varying(50) COLLATE pg_catalog."default";

