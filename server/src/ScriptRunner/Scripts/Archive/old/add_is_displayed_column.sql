alter table counties add column is_displayed boolean;

-- 9999 is unknown district code
update counties 
set is_displayed = false
where (district_id = 9999 or display_name = 'בית שמש');

update counties 
set is_displayed = true
where is_displayed is null;

alter table counties alter column is_displayed set not null;

commit;