INSERT INTO public.desks(
	id, desk_name, county_id)
	VALUES (807, 'ארכיון מעברים', '66')
	ON CONFLICT DO NOTHING;

UPDATE public.counties
    SET is_displayed='false'
    WHERE id=9992;