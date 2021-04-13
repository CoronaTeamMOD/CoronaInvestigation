-- there is no need to run this script in prod
-- Each command should be run separately in this order 

INSERT INTO public.place_types (display_name)
VALUES ('אחר');

update public.place_sub_types 
   	set parent_place_type = 'אחר'
	where parent_place_type = 'אף אחד מהנ"ל';

delete from public.place_types
   	where display_name = 'אף אחד מהנ"ל';
