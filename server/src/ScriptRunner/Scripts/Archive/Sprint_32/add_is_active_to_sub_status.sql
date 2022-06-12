ALTER TABLE public.investigation_sub_status
ADD COLUMN IF NOT EXISTS is_active boolean default true;

UPDATE public.investigation_sub_status
SET is_active = false
WHERE display_name='המטופל נפטר' or display_name='חסר טלפון'
or display_name='טלפון לא זמין' or display_name='מדיניות לשכה' 
or display_name='מטופל מבקש לצלצל אליו בזמן אחר';

INSERT INTO public.investigation_sub_status(
	display_name, id, parent_status, is_active)
	VALUES ('פלסטיני', 100000011, 100000008, true),('עובד משרד בטחון', 100000012, 100000008, true),('דיפלומט', 100000013, 100000008, true),('נפטר', 100000014, 100000008, true),('פער בשפה', 100000015, 100000000, true)
	ON CONFLICT DO NOTHING;