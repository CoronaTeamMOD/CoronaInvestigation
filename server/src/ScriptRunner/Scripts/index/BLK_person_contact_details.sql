-- Creating the new table
CREATE TABLE IF NOT EXISTS public.person_contact_details (
   	person_info integer PRIMARY KEY NOT NULL,
   	relationship varchar,
   	extra_info varchar,
	contact_type integer,
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
   	FOREIGN KEY (contact_type) 
		REFERENCES public.contact_type(id),
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
INSERT INTO public.person_contact_details (
	person_info,
	relationship,
	extra_info,
	contact_type,
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
) SELECT 	
	person_info,
	relationship,
	extra_info,
	contact_type,
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
FROM public.contacted_person;

-- TODO : add deletion of current fieilds

-- SELECT * FROM public.contacted_person