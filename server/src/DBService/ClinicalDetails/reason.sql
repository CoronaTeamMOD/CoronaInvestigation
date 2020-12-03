-- Table: public.investigation_group_reason

-- DROP TABLE public.investigation_group_reason;

CREATE TABLE public.investigation_group_reason
(
    id integer NOT NULL,
    reason character varying COLLATE pg_catalog."default",
    CONSTRAINT investigation_group_reason_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.investigation_group_reason
    OWNER to coronai;

INSERT INTO public.investigation_group_reason(
	id, reason)
	VALUES 
    (100000000, 'בני משפחה (מגורים משותפים)'),
    (100000001, 'טלפון זהה'),
    (100000002, 'שייכות למוסד משותף'),
    (100000003, 'אחר');