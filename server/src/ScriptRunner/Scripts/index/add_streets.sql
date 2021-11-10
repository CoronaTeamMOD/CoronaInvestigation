
INSERT INTO public.streets (id, display_name, city, mho_code)
VALUES ('100002', 'רימון', '1247', '106')
ON CONFLICT DO NOTHING;

INSERT INTO public.streets (id, display_name, city, mho_code)
VALUES ('100003', 'הגל', '2100', '131')
ON CONFLICT DO NOTHING;

INSERT INTO public.streets (id, display_name, city, mho_code)
VALUES ('100004', 'עמוס עוז', '6400', '1388')
ON CONFLICT DO NOTHING;

INSERT INTO public.streets (id, display_name, city, mho_code)
VALUES ('100005', 'איסר הראל', '1020', '138')
ON CONFLICT DO NOTHING;

INSERT INTO public.streets (id, display_name, city, mho_code)
VALUES ('100006', 'הר שלמה', '1020', '227')
ON CONFLICT DO NOTHING;

INSERT INTO public.sub_occupation(id, display_name, parent_occupation, city)
VALUES ('7701105692', 'שכ הפרחים', 'מערכת החינוך', 'חריש')
ON CONFLICT DO NOTHING;;

INSERT INTO public.sub_occupation(
id, display_name, parent_occupation, city, street)
VALUES ('651166', 'גן ניצוצות ב''', 'מערכת החינוך', 'חריש', 'רקפת 17');