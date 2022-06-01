-- Inserting ifInvestigatedPatientNeedsIsolation data into table rules_config

INSERT INTO public.rules_config(key, value, description)
	VALUES ('ifInvestigatedPatientNeedsIsolation','{"ifInvestigatedPatientNeedsIsolation":false}'::json,'האם מאומת מחוייב בבידוד')
	ON CONFLICT DO NOTHING;