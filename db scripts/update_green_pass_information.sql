-- FUNCTION: public.update_green_pass_information(json[], integer, integer)

-- DROP FUNCTION public.update_green_pass_information(json[], integer, integer);

CREATE OR REPLACE FUNCTION public.update_green_pass_information(
	green_pass_arr json[],
	event_id_input integer,
	investigation_id_input integer)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
declare

--Update or insert green pass information about specified contacted_event
--GreenPass variables:
greenPassObject json;
greenPassQuestion integer;
greenPassAnswer integer;
isRecordExists bool;

begin 

	if event_id_input is null then
		RAISE EXCEPTION 'event_id got null';
	end if;
	
	SELECT EXISTS(
		select * 
		from public.green_pass_information
		where investigation_id = investigation_id_input and contact_event_id = event_id_input
	)INTO isRecordExists;
	
	foreach greenPassObject in array green_pass_arr 
		loop
			greenPassQuestion:=(select value::text::integer from json_each(greenPassObject) where key='questionId');
			greenPassAnswer:=(select value::text::integer from json_each(greenPassObject) where key='answerId');
			if isRecordExists then
				UPDATE public.green_pass_information
					set answer_id = greenPassAnswer
					where investigation_id = investigation_id_input and contact_event_id = event_id_input and question_id = greenPassQuestion;
			else 
				INSERT INTO public.green_pass_information(
					investigation_id, contact_event_id, question_id, answer_id)
					VALUES (investigation_id_input, event_id_input, greenPassQuestion, greenPassAnswer);	
			end if;
		end loop;
				
end;
$BODY$;

ALTER FUNCTION public.update_green_pass_information(json[], integer, integer)
    OWNER TO postgres;

COMMENT ON FUNCTION public.update_green_pass_information(json[], integer, integer)
    IS 'Update or insert green pass information about specifiedcontacted_event';
