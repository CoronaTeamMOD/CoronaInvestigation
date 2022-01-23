INSERT INTO public.chat_status(id, display_name)
	VALUES (14,'בקשה דחופה לחקירה אנושית')
	ON CONFLICT DO NOTHING;

INSERT INTO public.chat_status(id, display_name)
	VALUES (15,'עדיפות לחקירה אנושית')
	ON CONFLICT DO NOTHING;