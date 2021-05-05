update public.counties
set display_name = 'מעברים'
where id = 66;

insert into public.desks (id,desk_name,county_id) values(801,'מעברים גדה',66) ON CONFLICT DO NOTHING;
insert into public.desks (id,desk_name,county_id) values(802,'מעברים ירדן',66) ON CONFLICT DO NOTHING;
insert into public.desks (id,desk_name,county_id) values(803,'מעברים ימיים',66) ON CONFLICT DO NOTHING;
insert into public.desks (id,desk_name,county_id) values(804,'מעבר נתב"ג',66) ON CONFLICT DO NOTHING;
