CREATE TABLE IF NOT EXISTS contact_from_aboard_type (
    id INTEGER PRIMARY KEY NOT NULL,
    display_name varchar
);

INSERT INTO public.contact_from_aboard_type(
	id, display_name)
	VALUES (0, 'לא אותר מגע מחו"ל'),(1,'אותר מגע מחו"ל')
    ON CONFLICT DO NOTHING;

ALTER TABLE involved_contact 
    ADD COLUMN IF NOT EXISTS is_stay_another_country INTEGER DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS transit_date timestamp with time zone,
	ADD COLUMN IF NOT EXISTS from_country_id character varying REFERENCES countries (id),
	ADD COLUMN IF NOT EXISTS overseas_comments VARCHAR(400);

INSERT INTO public.investigation_complexity_reasons(
	id, description, reason_id, status_validity)
	VALUES (14, 'מגע עם חוזר חו"ל', 14, false)
	ON CONFLICT DO NOTHING;

ALTER TABLE public.investigation
ADD COLUMN IF NOT EXISTS contact_from_aboard_id INTEGER REFERENCES contact_from_aboard_type (id);

ALTER TABLE person_contact_details
    ADD COLUMN IF NOT EXISTS is_stay_another_country INTEGER DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS transit_date timestamp with time zone,
	ADD COLUMN IF NOT EXISTS from_country_id character varying REFERENCES countries (id),
	ADD COLUMN IF NOT EXISTS overseas_comments VARCHAR(400);