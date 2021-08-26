INSERT INTO public.streets (id, display_name, city, mho_code)
VALUES ('100000', 'ירושלים', '681', '208')
ON CONFLICT DO NOTHING;

INSERT INTO public.streets (id, display_name, city, mho_code)
VALUES ('100001', 'קרן קיימת לישראל', '6500', '515')
ON CONFLICT DO NOTHING;