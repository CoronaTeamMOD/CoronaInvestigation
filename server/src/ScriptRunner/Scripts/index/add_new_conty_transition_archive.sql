INSERT INTO public.counties(
display_name, id, user_admin_id, district_id, self_investigator_id, is_displayed)
VALUES ('ארכיון מעברים', '9992', 'admin.group9999', '9999', 'self_investigator.group9999',true);

INSERT INTO public."user"(
user_name, id, investigation_group, user_type, is_developer)
VALUES ('ארכיון מעברים', 'admin.group9992', '9992', 1, false);

UPDATE public.counties
SET user_admin_id='admin.group9992'
WHERE id=9992;