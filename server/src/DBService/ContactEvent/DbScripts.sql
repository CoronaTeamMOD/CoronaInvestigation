CREATE OR REPLACE FUNCTION public.insert_contact_event(curr_investigation integer, user_allows_hamagen_data boolean, event_start_time timestamp without time zone, event_end_time timestamp without time zone, event_place_name character varying, event_bus_line character varying DEFAULT NULL::character varying, event_train_line character varying DEFAULT NULL::character varying, event_bus_company character varying DEFAULT NULL::character varying, event_boarding_station character varying DEFAULT NULL::character varying, event_end_station character varying DEFAULT NULL::character varying, event_isolation_start_date timestamp without time zone DEFAULT NULL::timestamp without time zone, event_externalization_approval boolean DEFAULT NULL::boolean, event_place_type character varying DEFAULT NULL::character varying, event_contact_phone_number character varying DEFAULT NULL::character varying, event_grade character varying DEFAULT NULL::character varying, event_airline character varying DEFAULT NULL::character varying, event_flight_num character varying DEFAULT NULL::character varying, event_contact_person_first_name character varying DEFAULT NULL::character varying, event_contact_person_last_name character varying DEFAULT NULL::character varying, event_contact_person_phone_number character varying DEFAULT NULL::character varying, event_number_of_contacted integer DEFAULT NULL::integer, event_city_origin character varying DEFAULT NULL::character varying, event_city_destination character varying DEFAULT NULL::character varying, event_location_address character varying DEFAULT NULL::character varying, event_flight_origin_country character varying DEFAULT NULL::character varying, event_flight_origin_city character varying DEFAULT NULL::character varying, event_flight_origin_airport character varying DEFAULT NULL::character varying, event_flight_destination_country character varying DEFAULT NULL::character varying, event_flight_destination_city character varying DEFAULT NULL::character varying, event_flight_destination_airport character varying DEFAULT NULL::character varying, event_place_sub_type integer DEFAULT NULL::integer)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
	contact_event_id int4;
BEGIN
	SELECT INTO contact_event_id
	id
	FROM contact_event
	WHERE investigation_id=curr_investigation AND
	start_time=event_start_time AND
	end_time=event_end_time;
	IF contact_event_id IS NULL THEN
		INSERT INTO public.contact_event
					(investigation_id, allows_hamagen_data, start_time, end_time, place_name, bus_line, train_line, bus_company,
					boarding_station, end_station, isolation_start_date, externalization_approval, place_type, contact_phone_number, grade, airline, flight_num, contact_person_first_name, contact_person_last_name, contact_person_phone_number, number_of_contacted, city_origin, city_destination, location_address, flight_origin_country, flight_origin_city, flight_origin_airport, flight_destination_country, flight_destination_city, flight_destination_airport, place_sub_type)
		VALUES( curr_investigation,
		    user_allows_hamagen_data,
		    event_start_time,
		    event_end_time,
		 	event_place_name,
			event_bus_line,
		    event_train_line,
			event_bus_company,
			event_boarding_station,
	 		event_end_station,
	 		event_isolation_start_date,
	 		event_externalization_approval,
	 		event_place_type,
	 		event_contact_phone_number,
	 		event_grade,
	 		event_airline,
	 		event_flight_num,
	 		event_contact_person_first_name,
	 		event_contact_person_last_name,
	 		event_contact_person_phone_number,
	 		event_number_of_contacted,
	 		event_city_origin,
	 		event_city_destination,
	 		event_location_address,
	 		event_flight_origin_country,
	 		event_flight_origin_city,
	 		event_flight_origin_airport,
	 		event_flight_destination_country,
	 		event_flight_destination_city,
	 		event_flight_destination_airport,
	 		event_place_sub_type)

		RETURNING id INTO contact_event_id;
	END IF;
	RETURN contact_event_id;
END;$function$
;