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

-- Table: public.investigation_group

-- DROP TABLE public.investigation_group;

CREATE TABLE public.investigation_group
(
    id uuid NOT NULL,
    reason integer NOT NULL,
    other_reason character varying(200) COLLATE pg_catalog."default",
    CONSTRAINT id PRIMARY KEY (id),
    CONSTRAINT reason FOREIGN KEY (reason)
        REFERENCES public.investigation_group_reason (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.investigation_group
    OWNER to coronai;


ALTER TABLE public.investigation
    ADD COLUMN group_id uuid,
    add constraint fk_group 
    foreign key (group_id) 
    references public.investigation_group (id);