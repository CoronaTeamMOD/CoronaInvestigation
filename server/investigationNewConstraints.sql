alter table investigation alter column investigated_patient_id set not null;
alter table investigation alter column investigation_status set not null;
alter table investigated_patient alter column covid_patient set not null;