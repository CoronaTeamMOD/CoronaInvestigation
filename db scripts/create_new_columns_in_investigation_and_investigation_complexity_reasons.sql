ALTER TABLE investigation
ADD COLUMN complexity_reasons_id integer[];
ALTER TABLE investigation_complexity_reasons
ADD COLUMN reason_id SERIAL NOT NULL;
 
insert into public.investigation_complexity_reasons
values(10, 'חולה חוזר');

insert into public.investigation_complexity_reasons
values(11, 'מחוסן');

insert into public.investigation_complexity_reasons
values(12, 'מוטציה');

insert into public.investigation_complexity_reasons
values(13, 'חזר מחו"ל');