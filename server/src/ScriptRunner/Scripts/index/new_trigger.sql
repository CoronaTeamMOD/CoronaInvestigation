-- Trigger: update_last_update_time

DROP TRIGGER if exists update_last_update_time ON public.person_contact_details;

CREATE TRIGGER update_last_update_time
    BEFORE INSERT OR UPDATE 
    ON public.person_contact_details
    FOR EACH ROW
    EXECUTE PROCEDURE public.trigger_set_timestamp();