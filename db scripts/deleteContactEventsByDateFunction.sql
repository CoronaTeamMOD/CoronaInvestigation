CREATE OR REPLACE FUNCTION public.delete_contact_events_before_date(earliest_date character varying, curr_investigation_id integer)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
	begin
		delete from public.person p
		where p.id in (
			select p.id
			from public.person p
			join contacted_person cp on cp.person_info = p.id join contact_event ce on ce.id = cp.contact_event
			where ce.investigation_id=curr_investigation_id
		);
		delete from public.contact_event ce
		where ce.start_time < to_timestamp(earliest_date, 'YYYY-MM-DD') and ce.investigation_id=curr_investigation_id;
	END;
$function$
;