ALTER TABLE public.investigated_patient_role
ADD column occupation character varying null;

ALTER TABLE public.investigated_patient_role
ADD CONSTRAINT fk_investigated_patient_role_occupation FOREIGN KEY (occupation) REFERENCES occupation (display_name);

INSERT INTO public.investigated_patient_role (id, display_name, occupation)
VALUES(6, 'צוות אדמיניסטרטיבי','מערכת הבריאות');

UPDATE public.investigated_patient_role SET occupation='מערכת הבריאות' WHERE id=5;
UPDATE public.investigated_patient_role SET occupation='מערכת החינוך' WHERE id in(1,2,3);