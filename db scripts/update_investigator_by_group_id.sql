DROP FUNCTION public.update_investigator_by_group_id(character varying, uuid[], integer, boolean);

CREATE OR REPLACE FUNCTION public.update_investigator_by_group_id(
	new_investigator character varying,
	selected_groups uuid[],
	user_county integer,
	reason character varying,
	investigation_transferred boolean DEFAULT false)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
BEGIN
	UPDATE public.investigation inv
	SET creator = new_investigator, was_investigation_transferred = investigation_transferred,  transfer_reason = reason
   	FROM public.user us
	WHERE inv.group_id IN (SELECT unnest(selected_groups))
	AND inv.creator = us.id
	AND us.investigation_group = user_county;
END;
$BODY$;

ALTER FUNCTION public.update_investigator_by_group_id(character varying, uuid[], integer, character varying, boolean)
    OWNER TO coronai;
