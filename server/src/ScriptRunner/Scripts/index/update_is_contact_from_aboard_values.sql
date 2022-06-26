
UPDATE public.contact_from_aboard_type
SET display_name = 'מגע אופציונלי מחו"ל'
where id = 1;

INSERT INTO public.contact_from_aboard_type( id, display_name)
	VALUES (2, 'אותר מגע מחו"ל')
    ON CONFLICT DO NOTHING;