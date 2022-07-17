-- FUNCTION: public.update_desk_by_group_id(integer, uuid[], integer, character varying)

-- DROP FUNCTION IF EXISTS public.update_desk_by_group_id(integer, uuid[], integer, character varying);

CREATE OR REPLACE FUNCTION public.update_desk_by_group_id(
	desk integer,
	selected_groups uuid[],
	user_county integer,
	reason character varying DEFAULT ''::character varying,
	reason_id integer DEFAULT null)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
BEGIN
	UPDATE public.investigation inv 
	SET desk_id = desk , transfer_reason = reason, transfer_reason_id=reason_id
	FROM public.user us
	WHERE inv.group_id IN (SELECT unnest(selected_groups))
	AND inv.creator = us.id
	AND us.investigation_group = user_county;
END;
$BODY$;