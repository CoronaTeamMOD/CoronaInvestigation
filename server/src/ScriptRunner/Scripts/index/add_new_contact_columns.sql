ALTER TABLE person_contact_details 
ADD COLUMN if not exists xrm_status_id integer,
ADD COLUMN if not exists xrm_response_time timestamp with time zone,
ADD COLUMN if not exists is_contact_send BOOLEAN DEFAULT false;
