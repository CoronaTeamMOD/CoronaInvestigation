insert into public.investigation_sub_status
(display_name, id, parent_status)
values ('בטיפול',null,'100000002')
on conflict do nothing;