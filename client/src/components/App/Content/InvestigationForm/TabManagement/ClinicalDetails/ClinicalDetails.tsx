import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { Autocomplete } from '@material-ui/lab';
import { Grid, Typography, TextField, Collapse } from '@material-ui/core';
import { yupResolver } from '@hookform/resolvers';

import City from 'models/City';
import Street from 'models/Street';
import ClinicalDetailsFields from 'models/enums/ClinicalDetailsFields';
import ClinicalDetailsData from 'models/Contexts/ClinicalDetailsContextData';
import Toggle from 'commons/Toggle/Toggle';
import { initialClinicalDetails } from 'commons/Contexts/ClinicalDetailsContext';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField';
import StoreStateType from 'redux/storeStateType';
import { setFormState } from 'redux/Form/formActionCreators';
import Gender from 'models/enums/Gender';

import SymptomsFields from './SymptomsFields';
import HospitalFields from './HospitalFields';
import { useStyles } from './ClinicalDetailsStyles';
import useClinicalDetails from './useClinicalDetails';
import IsolationDatesFields from './IsolationDatesFields';
import ClinicalDetailsSchema from './ClinicalDetailsSchema';
import IsolationProblemFields from './IsolationProblemFields';
import BackgroundDiseasesFields from './BackgroundDiseasesFields';

const ClinicalDetails: React.FC<Props> = ({ id, onSubmit }: Props): JSX.Element => {
    const classes = useStyles();
    const [initialDBClinicalDetails, setInitialDBClinicalDetails] = React.useState<ClinicalDetailsData>(initialClinicalDetails);
    const { control, setValue, getValues, reset, watch, errors, setError, clearErrors, trigger } = useForm({
        mode: 'all',
        defaultValues: initialClinicalDetails,
        resolver: yupResolver(ClinicalDetailsSchema)
    });

    const [symptoms, setSymptoms] = React.useState<string[]>([]);
    const [backgroundDiseases, setBackgroundDiseases] = React.useState<string[]>([]);
    const [isolationCityName, setIsolationCityName] = React.useState<string>('');
    const [isolationStreetName, setIsolationStreetName] = React.useState<string>('');
    const [streetsInCity, setStreetsInCity] = React.useState<Street[]>([]);

    const patientGender = useSelector<StoreStateType, string>(state => state.gender);
    const cities = useSelector<StoreStateType, Map<string, City>>(state => state.cities);

    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    const investigatedPatientId = useSelector<StoreStateType, number>(state => state.investigation.investigatedPatientId);
    const investigationId = useSelector<StoreStateType, number>((state) => state.investigation.epidemiologyNumber);

    const { fetchClinicalDetails, getStreetByCity, saveClinicalDetails } = useClinicalDetails({
        setSymptoms,
        setBackgroundDiseases,
        setIsolationCityName,
        setIsolationStreetName,
        setStreetsInCity,
        initialDBClinicalDetails,
        setInitialDBClinicalDetails
    });

    const handleSymptomCheck = (
        checkedSymptom: string,
        onChange: (newSymptoms: string[]) => void,
        selectedSymptoms: string[]
    ) => {
        if (selectedSymptoms.includes(checkedSymptom)) {
            onChange(selectedSymptoms.filter((symptom) => symptom !== checkedSymptom));
        } else {
            onChange([...selectedSymptoms, checkedSymptom]);
        }
    };

    const handleBackgroundIllnessCheck = (
        checkedBackgroundIllness: string,
        onChange: (newBackgroundDiseases: string[]) => void,
        selectedBackgroundDiseases: string[]
    ) => {
        if (selectedBackgroundDiseases.includes(checkedBackgroundIllness)) {
            onChange(selectedBackgroundDiseases.filter((symptom) => symptom !== checkedBackgroundIllness));
        } else {
            onChange([...selectedBackgroundDiseases, checkedBackgroundIllness]);
        };
    };


    const saveForm = (e: any) => {
        e.preventDefault();
        const values = getValues();
        saveClinicalDetails(values as ClinicalDetailsData, epidemiologyNumber, investigatedPatientId);
        setFormState(investigationId, id, true);
        onSubmit();
    }
    const watchIsInIsolation = watch(ClinicalDetailsFields.IS_IN_ISOLATION);
    const watchIsolationStartDate = watch(ClinicalDetailsFields.ISOLATION_START_DATE);
    const watchIsolationEndDate = watch(ClinicalDetailsFields.ISOLATION_END_DATE);
    const watchIsIsolationProblem = watch(ClinicalDetailsFields.IS_ISOLATION_PROBLEM);
    const watchIsSymptomsDateUnknown = watch(ClinicalDetailsFields.IS_SYMPTOMS_DATE_UNKNOWN);
    const watchDoesHaveSymptoms = watch(ClinicalDetailsFields.DOES_HAVE_SYMPTOMS);
    const watchSymptoms = watch(ClinicalDetailsFields.SYMPTOMS);
    const watchDoesHaveBackgroundDiseases = watch(ClinicalDetailsFields.DOES_HAVE_BACKGROUND_DISEASES);
    const watchBackgroundDiseases = watch(ClinicalDetailsFields.BACKGROUND_DESEASSES);
    const watchWasHospitalized = watch(ClinicalDetailsFields.WAS_HOPITALIZED);
    const watchHospitalizedStartDate = watch(ClinicalDetailsFields.HOSPITALIZATION_START_DATE);
    const watcHospitalizedEndDate = watch(ClinicalDetailsFields.HOSPITALIZATION_END_DATE);

    React.useEffect(() => {
        fetchClinicalDetails(reset, trigger)
    }, []);

    React.useEffect(() => {
        if (watchIsInIsolation === false) {
            setValue(ClinicalDetailsFields.ISOLATION_START_DATE, null);
            setValue(ClinicalDetailsFields.ISOLATION_END_DATE, null);
        }
    }, [watchIsInIsolation]);

    React.useEffect(() => {
        if (watchIsIsolationProblem === false) {
            setValue(ClinicalDetailsFields.IS_ISOLATION_PROBLEM_MORE_INFO, '');
        }
    }, [watchIsIsolationProblem]);

    React.useEffect(() => {
        if (watchDoesHaveSymptoms === false) {
            setValue(ClinicalDetailsFields.SYMPTOMS, []);
            setValue(ClinicalDetailsFields.SYMPTOMS_START_DATE, null);
            setValue(ClinicalDetailsFields.OTHER_SYMPTOMS_MORE_INFO, '');
        }
    }, [watchDoesHaveSymptoms]);

    React.useEffect(() => {
        if (watchIsSymptomsDateUnknown) {
            setValue(ClinicalDetailsFields.SYMPTOMS_START_DATE, null);
        }
    }, [watchIsSymptomsDateUnknown])

    React.useEffect(() => {
        if (watchDoesHaveBackgroundDiseases === false) {
            setValue(ClinicalDetailsFields.BACKGROUND_DESEASSES, []);
            setValue(ClinicalDetailsFields.OTHER_BACKGROUND_DISEASES_MORE_INFO, '');
        }
    }, [watchDoesHaveBackgroundDiseases]);

    React.useEffect(() => {
        if (watchWasHospitalized === false) {
            setValue(ClinicalDetailsFields.HOSPITAL, '');
            setValue(ClinicalDetailsFields.HOSPITALIZATION_START_DATE, null);
            setValue(ClinicalDetailsFields.HOSPITALIZATION_END_DATE, null);
        }
    }, [watchWasHospitalized]);

    return (
        <div className={classes.form}>
            <form id={`form-${id}`} onSubmit={(e) => saveForm(e)}>
                <Grid spacing={2} container>
                    <Grid item xs={12}>
                        <IsolationDatesFields classes={classes} watchIsInIsolation={watchIsInIsolation} control={control} errors={errors} trigger={trigger}
                            watchIsolationStartDate={watchIsolationStartDate} watchIsolationEndDate={watchIsolationEndDate} />
                    </Grid>
                    <Grid item xs={12}>
                        <Grid spacing={3} container className={classes.containerGrid} justify='flex-start' alignItems='center'>
                            <Grid item xs={2} className={classes.fieldLabel}>
                                <Typography>
                                    <b>
                                        כתובת לאשפוז ביתי:
                            </b>
                                </Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Controller
                                    name={`${ClinicalDetailsFields.ISOLATION_ADDRESS}.${ClinicalDetailsFields.ISOLATION_CITY}`}
                                    control={control}
                                    render={(props) => (
                                        <Autocomplete
                                            test-id='currentQuarantineCity'
                                            options={Array.from(cities, ([id, value]) => ({ id, value }))}
                                            getOptionLabel={(option) => option ? option.value.displayName : option}
                                            inputValue={isolationCityName}
                                            onChange={(event, selectedCity) => {
                                                props.onChange(selectedCity ? selectedCity.id : '')
                                                if (selectedCity?.id && selectedCity.id !== props.value) {
                                                    setIsolationStreetName('');
                                                    getStreetByCity(selectedCity.id);
                                                }
                                            }}
                                            onInputChange={(event, selectedCityName) => {
                                                setIsolationCityName(selectedCityName);
                                                if (selectedCityName === '') {
                                                    setStreetsInCity([])
                                                    props.onChange('');
                                                    setValue(`${ClinicalDetailsFields.ISOLATION_ADDRESS}.${ClinicalDetailsFields.ISOLATION_STREET}`, '');
                                                }
                                            }}
                                            renderInput={(params) =>
                                                <TextField
                                                    error={errors[ClinicalDetailsFields.ISOLATION_ADDRESS] && errors[ClinicalDetailsFields.ISOLATION_ADDRESS][ClinicalDetailsFields.ISOLATION_CITY] ? true : false}
                                                    label={
                                                        errors[ClinicalDetailsFields.ISOLATION_ADDRESS] &&
                                                            errors[ClinicalDetailsFields.ISOLATION_ADDRESS][ClinicalDetailsFields.ISOLATION_CITY] ?
                                                            errors[ClinicalDetailsFields.ISOLATION_ADDRESS][ClinicalDetailsFields.ISOLATION_CITY].message
                                                            :
                                                            'עיר *'
                                                    }
                                                    {...params}
                                                    placeholder='עיר'
                                                />
                                            }
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <Controller
                                    name={`${ClinicalDetailsFields.ISOLATION_ADDRESS}.${ClinicalDetailsFields.ISOLATION_STREET}`}
                                    control={control}
                                    render={(props) => (
                                        <Autocomplete
                                            options={streetsInCity}
                                            getOptionLabel={(option) => option ? option.displayName : option}
                                            inputValue={isolationStreetName}
                                            onChange={(event, selectedStreet) => props.onChange(selectedStreet ? selectedStreet.id : '')}
                                            onInputChange={(event, selectedStreetName) => {
                                                setIsolationStreetName(selectedStreetName);
                                                if (selectedStreetName === '') {
                                                    props.onChange('');
                                                    setValue(`${ClinicalDetailsFields.ISOLATION_ADDRESS}.${ClinicalDetailsFields.ISOLATION_STREET}`, '');
                                                }
                                            }}
                                            renderInput={(params) =>
                                                <TextField
                                                    test-id='currentQuarantineStreet'
                                                    error={errors[ClinicalDetailsFields.ISOLATION_ADDRESS] && errors[ClinicalDetailsFields.ISOLATION_ADDRESS][ClinicalDetailsFields.ISOLATION_STREET] ? true : false}
                                                    label={
                                                        errors[ClinicalDetailsFields.ISOLATION_ADDRESS] &&
                                                            errors[ClinicalDetailsFields.ISOLATION_ADDRESS][ClinicalDetailsFields.ISOLATION_STREET] ?
                                                            errors[ClinicalDetailsFields.ISOLATION_ADDRESS][ClinicalDetailsFields.ISOLATION_STREET].message
                                                            :
                                                            'רחוב'
                                                    }
                                                    {...params}
                                                    placeholder='רחוב'
                                                />
                                            }
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <Controller
                                    name={`${ClinicalDetailsFields.ISOLATION_ADDRESS}.${ClinicalDetailsFields.ISOLATION_HOUSE_NUMBER}`}
                                    control={control}
                                    render={(props) => (
                                        <AlphanumericTextField
                                            error={errors[ClinicalDetailsFields.ISOLATION_ADDRESS] && errors[ClinicalDetailsFields.ISOLATION_ADDRESS][ClinicalDetailsFields.ISOLATION_HOUSE_NUMBER] ? true : false}
                                            label={
                                                errors[ClinicalDetailsFields.ISOLATION_ADDRESS] &&
                                                    errors[ClinicalDetailsFields.ISOLATION_ADDRESS][ClinicalDetailsFields.ISOLATION_HOUSE_NUMBER] ?
                                                    errors[ClinicalDetailsFields.ISOLATION_ADDRESS][ClinicalDetailsFields.ISOLATION_HOUSE_NUMBER].message
                                                    :
                                                    'מספר הבית'
                                            }
                                            testId='currentQuarantineHomeNumber'
                                            name={`${ClinicalDetailsFields.ISOLATION_ADDRESS}.${ClinicalDetailsFields.ISOLATION_HOUSE_NUMBER}`}
                                            value={props.value}
                                            onChange={(newValue: string) => (
                                                props.onChange(newValue)
                                            )}
                                            onBlur={props.onBlur}
                                            setError={setError}
                                            clearErrors={clearErrors}
                                            errors={errors}
                                            placeholder='מספר הבית'
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={2} className={classes.cancelWhiteSpace}>
                                <Controller
                                    name={`${ClinicalDetailsFields.ISOLATION_ADDRESS}.${ClinicalDetailsFields.ISOLATION_FLOOR}`}
                                    control={control}
                                    render={(props) => (
                                        <AlphanumericTextField
                                            error={errors[ClinicalDetailsFields.ISOLATION_ADDRESS] && errors[ClinicalDetailsFields.ISOLATION_ADDRESS][ClinicalDetailsFields.ISOLATION_FLOOR] ? true : false}
                                            label={
                                                errors[ClinicalDetailsFields.ISOLATION_ADDRESS] &&
                                                    errors[ClinicalDetailsFields.ISOLATION_ADDRESS][ClinicalDetailsFields.ISOLATION_FLOOR] ?
                                                    errors[ClinicalDetailsFields.ISOLATION_ADDRESS][ClinicalDetailsFields.ISOLATION_FLOOR].message
                                                    :
                                                    'קומה'
                                            }
                                            testId='currentQuarantineFloor'
                                            name={`${ClinicalDetailsFields.ISOLATION_ADDRESS}.${ClinicalDetailsFields.ISOLATION_FLOOR}`}
                                            value={props.value}
                                            onChange={(newValue: string) => (
                                                props.onChange(newValue)
                                            )}
                                            onBlur={props.onBlur}
                                            setError={setError}
                                            clearErrors={clearErrors}
                                            errors={errors}
                                            placeholder='קומה'
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <IsolationProblemFields
                            classes={classes}
                            watchIsIsolationProblem={watchIsIsolationProblem}
                            control={control}
                            setError={setError}
                            clearErrors={clearErrors}
                            errors={errors}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <SymptomsFields
                            classes={classes}
                            control={control}
                            watchDoesHaveSymptoms={watchDoesHaveSymptoms}
                            watchSymptoms={watchSymptoms}
                            watchIsSymptomsDateUnknown={watchIsSymptomsDateUnknown}
                            handleSymptomCheck={handleSymptomCheck}
                            symptoms={symptoms}
                            setError={setError}
                            clearErrors={clearErrors}
                            errors={errors}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <BackgroundDiseasesFields
                            classes={classes}
                            backgroundDiseases={backgroundDiseases}
                            handleBackgroundIllnessCheck={handleBackgroundIllnessCheck}
                            setError={setError}
                            setValue={setValue}
                            clearErrors={clearErrors}
                            errors={errors}
                            control={control}
                            watchBackgroundDiseases={watchBackgroundDiseases}
                            watchDoesHaveBackgroundDiseases={watchDoesHaveBackgroundDiseases}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <HospitalFields
                            classes={classes}
                            control={control}
                            setError={setError}
                            clearErrors={clearErrors}
                            errors={errors}
                            trigger={trigger}
                            watchWasHospitalized={watchWasHospitalized}
                            watchHospitalizedStartDate={watchHospitalizedStartDate}
                            watchHospitalizedEndDate={watcHospitalizedEndDate}
                        />
                    </Grid>
                    <Collapse in={patientGender === Gender.FEMALE}>
                        <Grid item xs={12}>
                            <Grid spacing={3} container className={classes.containerGrid} justify='flex-start' alignItems='center'>
                                <Grid item xs={2} className={classes.fieldLabel}>
                                    <Typography>
                                        <b>
                                            האם בהריון:
                                        </b>
                                    </Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <Controller
                                        name={ClinicalDetailsFields.IS_PREGNANT}
                                        control={control}
                                        render={(props) => (
                                            <Toggle
                                                test-id='isPregnant'
                                                value={props.value}
                                                onChange={(e, value) => {
                                                    if (value !== null) {
                                                        props.onChange(value)
                                                    }
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Collapse>
                </Grid>
            </form>
        </div>
    );
};

interface Props {
    id: number;
    onSubmit: () => void;
}

export default ClinicalDetails;
