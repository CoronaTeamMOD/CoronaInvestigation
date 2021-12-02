ALTER TABLE investigation
ADD COLUMN IF NOT EXISTS last_updator_user character varying COLLATE pg_catalog."default";