ALTER TABLE public.investigation
    ADD COLUMN is_return_sick boolean NOT NULL DEFAULT false,
    ADD COLUMN previous_disease_start_date timestamp with time zone,
    ADD COLUMN is_vaccinated boolean NOT NULL DEFAULT false,
    ADD COLUMN vaccination_effective_from timestamp with time zone,
    ADD COLUMN is_suspicion_of_mutation boolean NOT NULL DEFAULT false,
    ADD COLUMN mutation_name character varying;