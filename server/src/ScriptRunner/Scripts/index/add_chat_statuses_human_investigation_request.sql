INSERT INTO public.chat_status(id, display_name)
	VALUES (14,'חקירה אנושית -קושי רפואי')
	ON CONFLICT DO NOTHING;

INSERT INTO public.chat_status(id, display_name)
	VALUES (15,'חקירה אנושית')
	ON CONFLICT DO NOTHING;

UPDATE  public.chat_status
SET display_name='חקירה אנושית -קושי בבידוד'
WHERE id = 10;