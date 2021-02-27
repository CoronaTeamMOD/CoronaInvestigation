ALTER TABLE investigation
ADD COLUMN complexity_reasons_id integer[];

ALTER TABLE investigation_complexity_reasons
ADD COLUMN reason_id SERIAL NOT NULL