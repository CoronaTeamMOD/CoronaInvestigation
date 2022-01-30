INSERT INTO public.chat_status(id, display_name)
	VALUES (21,'לא נשלח - טלפון לא תקין')
	ON CONFLICT DO NOTHING;

INSERT INTO public.chat_status(id, display_name)
	VALUES (22,'לא נשלח - טלפון קווי/כשר')
	ON CONFLICT DO NOTHING;