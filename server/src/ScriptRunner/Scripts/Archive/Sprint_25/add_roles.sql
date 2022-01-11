INSERT INTO public.occupation(id, display_name)
	VALUES (100000008, 'גריאטריה' )
	ON CONFLICT DO NOTHING;

ALTER TABLE public.investigated_patient_role
ADD COLUMN IF NOT EXISTS xrm_id integer;


INSERT INTO public.investigated_patient_role(id, display_name,occupation,xrm_id)
	VALUES (7,'צוות אדמיניסטרטיבי', 'גריאטריה',2 )
	ON CONFLICT DO NOTHING;
	
INSERT INTO public.investigated_patient_role(id, display_name,occupation,xrm_id)
	VALUES (8,'צוות מטפל', 'גריאטריה',5 )
	ON CONFLICT DO NOTHING;
	
UPDATE  public.investigated_patient_role
set xrm_id = 2
where id in (2,6);

UPDATE  public.investigated_patient_role
set xrm_id = id
where xrm_id is null;