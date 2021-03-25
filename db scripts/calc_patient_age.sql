UPDATE public.covid_patients
SET age = EXTRACT(YEAR FROM (AGE(birth_date)))
WHERE age is null;