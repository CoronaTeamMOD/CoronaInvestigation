-- Creating the new table
CREATE TABLE IF NOT EXISTS public.person_contact_details (
   	person_info integer PRIMARY KEY NOT NULL,
   	relationship varchar,
   	extra_info varchar,
	does_have_background_diseases boolean,
	occupation varchar,
	does_feel_good boolean,
	does_need_help_in_isolation boolean,
	repeating_occurance_with_confirmed boolean,
	does_live_with_confirmed boolean,
	family_relationship integer,
	does_work_with_crowd boolean,
	does_need_isolation boolean,
	last_update_time timestamp,
	creation_time timestamp,
	completion_time timestamp,
	contact_status integer,
	involved_contact_id integer,
	isolation_address integer,
	FOREIGN KEY (contact_status) 
		REFERENCES public.contact_statuses(id),
	FOREIGN KEY (isolation_address)
		REFERENCES public.address(id),
	FOREIGN KEY (family_relationship) 
		REFERENCES public.family_relationship(id),
	FOREIGN KEY (involved_contact_id)
		REFERENCES public.involved_contact(id),
	FOREIGN KEY (occupation)
		REFERENCES public.occupation(display_name),
	FOREIGN KEY (person_info)
		REFERENCES public.person(id)
);

-- inserting all of the existing data into the new table
INSERT INTO public.person_contact_details AS pcd (
	person_info,
	relationship,
	extra_info,
	does_have_background_diseases,
	occupation,
	does_feel_good,
	does_need_help_in_isolation,
	repeating_occurance_with_confirmed,
	does_live_with_confirmed,
	family_relationship,
	does_work_with_crowd,
	does_need_isolation,
	last_update_time,
	contact_status,
	creation_time,
	involved_contact_id,
	completion_time,
	isolation_address
) SELECT DISTINCT ON (person_info) * FROM (
	SELECT
	person_info,
	relationship,
	extra_info,
	does_have_background_diseases,
	occupation,
	does_feel_good,
	does_need_help_in_isolation,
	repeating_occurance_with_confirmed,
	does_live_with_confirmed,
	family_relationship,
	does_work_with_crowd,
	does_need_isolation,
	last_update_time,
	contact_status,
	creation_time,
	involved_contact_id,
	completion_time,
	isolation_address 
	FROM public.contacted_person ORDER BY last_update_time DESC
) p
ON CONFLICT (person_info)
DO UPDATE SET
	relationship = COALESCE(EXCLUDED.relationship , pcd.relationship),
	extra_info = COALESCE(EXCLUDED.extra_info ,pcd.extra_info),
	does_have_background_diseases = COALESCE(EXCLUDED.does_have_background_diseases ,pcd.does_have_background_diseases),
	occupation = COALESCE(EXCLUDED.occupation ,pcd.occupation),
	does_feel_good = COALESCE(EXCLUDED.does_feel_good ,pcd.does_feel_good),
	does_need_help_in_isolation = COALESCE(EXCLUDED.does_need_help_in_isolation ,pcd.does_need_help_in_isolation),
	repeating_occurance_with_confirmed = COALESCE(EXCLUDED.repeating_occurance_with_confirmed ,pcd.repeating_occurance_with_confirmed),
	does_live_with_confirmed = COALESCE(EXCLUDED.does_live_with_confirmed ,pcd.does_live_with_confirmed),
	family_relationship = COALESCE(EXCLUDED.family_relationship ,pcd.family_relationship),
	does_work_with_crowd = COALESCE(EXCLUDED.does_work_with_crowd ,pcd.does_work_with_crowd),
	does_need_isolation = COALESCE(EXCLUDED.does_need_isolation ,pcd.does_need_isolation),
	last_update_time = COALESCE(EXCLUDED.last_update_time ,pcd.last_update_time),
	contact_status = COALESCE(EXCLUDED.contact_status ,pcd.contact_status),
	creation_time = COALESCE(EXCLUDED.creation_time ,pcd.creation_time),
	involved_contact_id = COALESCE(EXCLUDED.involved_contact_id ,pcd.involved_contact_id),
	completion_time = COALESCE(EXCLUDED.completion_time ,pcd.completion_time),
	isolation_address = COALESCE(EXCLUDED.isolation_address ,pcd.isolation_address);

ALTER TABLE public.contacted_person 
	DROP COLUMN relationship,
	DROP COLUMN does_have_background_diseases,
	DROP COLUMN occupation,
	DROP COLUMN does_feel_good,
	DROP COLUMN does_need_help_in_isolation,
	DROP COLUMN repeating_occurance_with_confirmed,
	DROP COLUMN does_live_with_confirmed,
	DROP COLUMN family_relationship,
	DROP COLUMN does_work_with_crowd,
	DROP COLUMN does_need_isolation,
	DROP COLUMN contact_status,
	DROP COLUMN completion_time,
	DROP COLUMN isolation_address;