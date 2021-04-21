-- Alter identification_type table: adding new column of id

ALTER TABLE public.identification_type
    ADD COLUMN IF NOT EXISTS id INTEGER;

-- Updating values in identification_type table

UPDATE public.identification_type
	SET id=1
	WHERE type='ת"ז';
	
UPDATE public.identification_type
	SET id=2
	WHERE type='דרכון';

INSERT INTO public.identification_type(
	id, type)
	VALUES 
		(3, 'אחר'),
		(4, 'מזהה במוסד'),
		(5, 'ת"ז פלסטינית')
	ON CONFLICT DO NOTHING;
	
-- Remove constraint in person table
	
ALTER TABLE public.person
  DROP CONSTRAINT IF EXISTS identification_type_fk;
	
-- Remove constraint in identification_type table

ALTER TABLE public.identification_type
  DROP CONSTRAINT IF EXISTS identification_type_pkey;
  
-- Add constraint of PK in identification_type table
  
ALTER TABLE public.identification_type 
	ADD PRIMARY KEY (id);

-- Updating identification_types values in person

UPDATE public.person
	SET identification_type=1
	WHERE identification_type='ת"ז';
	
UPDATE public.person
	SET identification_type=2
	WHERE identification_type='דרכון';
	

UPDATE public.person
	SET identification_type=4
	WHERE identification_type='מזהה במוסד';
	
UPDATE public.person
	SET identification_type=5
	WHERE identification_type='פלסטינית ת"ז';
	
UPDATE public.person
	SET identification_type=3
	WHERE identification_type NOT IN ('1','2','4','5') 
		OR identification_type IS NULL;
	
-- Updating identification_type column type

ALTER TABLE public.person
	ALTER COLUMN identification_type TYPE integer 
	USING identification_type::integer;

-- Add constraint of FK in person table

ALTER TABLE public.person
    ADD CONSTRAINT identification_type_fk FOREIGN KEY (identification_type) REFERENCES public.identification_type (id);

-- Updating identification_types values in investigated_patient
	
UPDATE public.investigated_patient
	SET identity_type=1
	WHERE identity_type='ת"ז';
	
UPDATE public.investigated_patient
	SET identity_type=2
	WHERE identity_type='דרכון';
	

UPDATE public.investigated_patient
	SET identity_type=4
	WHERE identity_type='מזהה במוסד';
	
UPDATE public.investigated_patient
	SET identity_type=5
	WHERE identity_type='פלסטינית ת"ז';
	
UPDATE public.investigated_patient
	SET identity_type=3
	WHERE identity_type NOT IN ('1','2','4','5') 
		OR identity_type IS NULL;
		
-- Updating identity_type column type

ALTER TABLE public.investigated_patient
	ALTER COLUMN identity_type TYPE integer 
	USING identity_type::integer;
	
-- Add constraint of FK in investigated_patient table

ALTER TABLE public.investigated_patient
    ADD CONSTRAINT identity_type_fk FOREIGN KEY (identity_type) REFERENCES public.identification_type (id);
	
	
-- Delete duplicate function of update_contact_person

DROP FUNCTION public.update_contact_person(json, integer);