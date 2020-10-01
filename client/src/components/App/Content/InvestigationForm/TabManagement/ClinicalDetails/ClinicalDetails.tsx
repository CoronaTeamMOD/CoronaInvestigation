import React from 'react';
import { useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from "@hookform/resolvers";
import * as yup from "yup";
import { Autocomplete } from '@material-ui/lab';
import { Grid, Typography, TextField } from '@material-ui/core';

import City from 'models/City';
import Gender from 'models/enums/Gender';
import Street from 'models/enums/Street';
import Toggle from 'commons/Toggle/Toggle';
import StoreStateType from 'redux/storeStateType';
import ClinicalDetailsFields from 'models/enums/ClinicalDetailsFields';
import { clinicalDetailsDataContext, initialClinicalDetails } from 'commons/Contexts/ClinicalDetailsContext';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField';
import { setFormState } from 'redux/Form/formActionCreators';
import axios from 'Utils/axios';

import { useStyles } from './ClinicalDetailsStyles';
import useClinicalDetails from './useClinicalDetails';
import IsolationDatesFields from './IsolationDatesFields';
import IsolationProblemFields from './IsolationProblemFields'
import SymptomsFields from './SymptomsFields';
import BackgroundDiseasesFields from './BackgroundDiseasesFields';
import HospitalFields from './HospitalFields';
import Swal from 'sweetalert2';
import ClinicalDetailsData from 'models/Contexts/ClinicalDetailsContextData';

const requiredText = 'שדה זה הוא חובה';
const maxText = 'תאריך ההתחלה צריך להיות מוקדם יותר מתאריך הסיום';
const minText = 'תאריך הסיום צריך להיות מוקדם יותר מתאריך ההתחלה';

const isInIsolationStartDateSchema = yup.date().when(
    ClinicalDetailsFields.IS_IN_ISOLATION, {
    is: true,
    then: yup.date().max(yup.ref(ClinicalDetailsFields.ISOLATION_END_DATE), maxText)
    .required(requiredText).typeError(requiredText),
    otherwise: yup.date().nullable()
});

const isInIsolationEndDateSchema = yup.date().when(
    ClinicalDetailsFields.IS_IN_ISOLATION, {
    is: true,
    then: yup.date().min(yup.ref(ClinicalDetailsFields.ISOLATION_START_DATE), minText)
    .required(requiredText).typeError(requiredText),
    otherwise: yup.date().nullable()
});

const wasHospitilizedStartDateSchema = yup.date().when(
    ClinicalDetailsFields.WAS_HOPITALIZED, {
    is: true,
    then: yup.date().max(yup.ref(ClinicalDetailsFields.HOSPITALIZATION_END_DATE), maxText)
    .required(requiredText).typeError(requiredText),
    otherwise: yup.date().nullable()
});

const wasHospitilizedEndDateSchema = yup.date().when(
    ClinicalDetailsFields.WAS_HOPITALIZED, {
    is: true,
    then: yup.date().min(yup.ref(ClinicalDetailsFields.HOSPITALIZATION_START_DATE), minText)
    .required(requiredText).typeError(requiredText),
    otherwise: yup.date().nullable()
});

const schema = yup.object().shape({
    [ClinicalDetailsFields.ISOLATION_ADDRESS]: yup.object().shape({
        [ClinicalDetailsFields.ISOLATION_CITY]: yup.string().required(requiredText),
        [ClinicalDetailsFields.ISOLATION_STREET]: yup.string().required(requiredText),
        [ClinicalDetailsFields.ISOLATION_FLOOR]: yup.mixed().required(requiredText),
        [ClinicalDetailsFields.ISOLATION_HOUSE_NUMBER]: yup.mixed().required(requiredText)
    }).required(),
    [ClinicalDetailsFields.IS_IN_ISOLATION]: yup.boolean().required(),
    [ClinicalDetailsFields.ISOLATION_START_DATE]: isInIsolationStartDateSchema,
    [ClinicalDetailsFields.ISOLATION_END_DATE]: isInIsolationEndDateSchema,
    [ClinicalDetailsFields.IS_ISOLATION_PROBLEM]: yup.boolean().required(),
    [ClinicalDetailsFields.IS_ISOLATION_PROBLEM_MORE_INFO]: yup.string().when(
        ClinicalDetailsFields.IS_ISOLATION_PROBLEM, {
        is: true,
        then: yup.string().required(requiredText),
        otherwise: yup.string()
    }),
    [ClinicalDetailsFields.DOES_HAVE_SYMPTOMS]: yup.boolean().required(),
    [ClinicalDetailsFields.SYMPTOMS_START_DATE]: yup.date().when(
        ClinicalDetailsFields.DOES_HAVE_SYMPTOMS, {
        is: true,
        then: yup.date().required(requiredText).typeError(requiredText),
        otherwise: yup.date().nullable()
    }
    ),
    [ClinicalDetailsFields.SYMPTOMS]: yup.array().of(yup.string()).when(
        ClinicalDetailsFields.DOES_HAVE_SYMPTOMS, {
        is: true,
        then: yup.array().of(yup.string()).min(1).required(),
        otherwise: yup.array().of(yup.string())
    }),
    [ClinicalDetailsFields.OTHER_SYMPTOMS_MORE_INFO]: yup.string(),
    [ClinicalDetailsFields.DOES_HAVE_BACKGROUND_DISEASES]: yup.boolean().required(),
    [ClinicalDetailsFields.BACKGROUND_DESEASSES]: yup.array().of(yup.string()).when(
        ClinicalDetailsFields.DOES_HAVE_BACKGROUND_DISEASES, {
        is: true,
        then: yup.array().of(yup.string()).min(1).required(),
        otherwise: yup.array().of(yup.string())
    }),
    [ClinicalDetailsFields.WAS_HOPITALIZED]: yup.boolean().required(),
    [ClinicalDetailsFields.HOSPITAL]: yup.string(),
    [ClinicalDetailsFields.HOSPITALIZATION_START_DATE]: wasHospitilizedStartDateSchema,
    [ClinicalDetailsFields.HOSPITALIZATION_END_DATE]: wasHospitilizedEndDateSchema,
    [ClinicalDetailsFields.IS_PREGNANT]: yup.boolean().required(),
    [ClinicalDetailsFields.OTHER_BACKGROUND_DISEASES_MORE_INFO]: yup.string().nullable(),
})

const ClinicalDetails: React.FC<Props> = ({ id, onSubmit }: Props): JSX.Element => {
    const classes = useStyles();
    const [initialDBClinicalDetails, setInitialDBClinicalDetails] = React.useState<ClinicalDetailsData>(initialClinicalDetails);
    const { control, setValue, getValues, handleSubmit, reset, watch, errors, setError, clearErrors } = useForm({
        mode: 'all',
        defaultValues: initialDBClinicalDetails,
        resolver: yupResolver(schema)
    });

    const [symptoms, setSymptoms] = React.useState<string[]>([]);
    const [backgroundDiseases, setBackgroundDiseases] = React.useState<string[]>([]);
    const [isUnkonwnDateChecked, setIsUnkonwnDateChecked] = React.useState<boolean>(false);
    const [isolationCityName, setIsolationCityName] = React.useState<string>('');
    const [isolationStreetName, setIsolationStreetName] = React.useState<string>('');
    const [streetsInCity, setStreetsInCity] = React.useState<Street[]>([]);

    const patientGender = useSelector<StoreStateType, string>(state => state.gender);
    const cities = useSelector<StoreStateType, Map<string, City>>(state => state.cities);

    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    const investigatedPatientId = useSelector<StoreStateType, number>(state => state.investigation.investigatedPatientId);
    const investigationId = useSelector<StoreStateType, number>((state) => state.investigation.epidemiologyNumber);
    
    const { getStreetByCity } = useClinicalDetails({
        setSymptoms,
        setBackgroundDiseases, 
        setIsolationCityName, 
        setIsolationStreetName, 
        setStreetsInCity, 
        initialDBClinicalDetails,
        setInitialDBClinicalDetails
    });

    const handleUnkonwnDateCheck = () => {
        setIsUnkonwnDateChecked(!isUnkonwnDateChecked);
    };

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

    React.useEffect(() => {
        reset(initialDBClinicalDetails);
    }, [initialDBClinicalDetails])

    const saveClinicalDetails = (e: any) => {
        e.preventDefault();
        const values = getValues();
        axios.post('/clinicalDetails/saveClinicalDetails', ({ clinicalDetails: {...values, epidemiologyNumber, investigatedPatientId}})).catch(() => {
            Swal.fire({
                title: 'לא הצלחנו לשמור את השינויים, אנא נסה שוב בעוד מספר דקות',
                icon: 'error'
            });
        });

        schema.isValid(values).then(valid=>{
            setFormState(investigationId, id, valid);
        })
        onSubmit();
    }
    const watchIsInIsolation = watch(ClinicalDetailsFields.IS_IN_ISOLATION);
    const watchIsIsolationProblem = watch(ClinicalDetailsFields.IS_ISOLATION_PROBLEM);
    const watchDoesHaveSymptoms = watch(ClinicalDetailsFields.DOES_HAVE_SYMPTOMS);
    const watchSymptoms = watch(ClinicalDetailsFields.SYMPTOMS);
    const watchDoesHaveBackgroundDiseases = watch(ClinicalDetailsFields.DOES_HAVE_BACKGROUND_DISEASES);
    const watchBackgroundDiseases = watch(ClinicalDetailsFields.BACKGROUND_DESEASSES);
    const watchWasHospitalized = watch(ClinicalDetailsFields.WAS_HOPITALIZED);

    
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
            <form id={`form-${id}`} onSubmit={(e) => saveClinicalDetails(e)}>
            <IsolationDatesFields classes={classes} watchIsInIsolation={watchIsInIsolation} control={control} errors={errors} />
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
                                getOptionLabel={(option) => option? option.value.displayName : option}
                                inputValue={isolationCityName}
                                onChange={(event, selectedCity) => {
                                    props.onChange(selectedCity? selectedCity.id : '')
                                    if(selectedCity?.id && selectedCity.id  !== props.value) {
                                        setIsolationStreetName('');
                                        getStreetByCity(selectedCity.id);
                                    }
                                }}
                                onInputChange={(event, selectedCityName) => {
                                    setIsolationCityName(selectedCityName);
                                    if (selectedCityName === '') {
                                        setStreetsInCity([])
                                        setValue(`${ClinicalDetailsFields.ISOLATION_ADDRESS}.${ClinicalDetailsFields.ISOLATION_CITY}`, '');
                                        setValue(`${ClinicalDetailsFields.ISOLATION_ADDRESS}.${ClinicalDetailsFields.ISOLATION_STREET}`, '');
                                    }
                                }}
                                renderInput={(params) =>
                                    <TextField
                                        error={errors[ClinicalDetailsFields.ISOLATION_ADDRESS] && errors[ClinicalDetailsFields.ISOLATION_ADDRESS][ClinicalDetailsFields.ISOLATION_CITY]? true : false}
                                        label={
                                            errors[ClinicalDetailsFields.ISOLATION_ADDRESS] &&
                                            errors[ClinicalDetailsFields.ISOLATION_ADDRESS][ClinicalDetailsFields.ISOLATION_CITY]?
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
                                getOptionLabel={(option) => option? option.displayName : option}
                                inputValue={isolationStreetName}
                                onChange={(event, selectedStreet) => props.onChange(selectedStreet? selectedStreet.id : '')}
                                onInputChange={(event, selectedStreetName) => {
                                    setIsolationStreetName(selectedStreetName);
                                    if (selectedStreetName === '') {
                                        setValue(`${ClinicalDetailsFields.ISOLATION_ADDRESS}.${ClinicalDetailsFields.ISOLATION_STREET}`, '');
                                    }
                                }}
                                renderInput={(params) =>
                                    <TextField
                                        test-id='currentQuarantineStreet'
                                        error={errors[ClinicalDetailsFields.ISOLATION_ADDRESS] && errors[ClinicalDetailsFields.ISOLATION_ADDRESS][ClinicalDetailsFields.ISOLATION_STREET]? true : false}
                                        label={
                                            errors[ClinicalDetailsFields.ISOLATION_ADDRESS] && 
                                            errors[ClinicalDetailsFields.ISOLATION_ADDRESS][ClinicalDetailsFields.ISOLATION_STREET]?
                                            errors[ClinicalDetailsFields.ISOLATION_ADDRESS][ClinicalDetailsFields.ISOLATION_STREET].message
                                            :
                                            'רחוב *'
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
                                error={errors[ClinicalDetailsFields.ISOLATION_ADDRESS] && errors[ClinicalDetailsFields.ISOLATION_ADDRESS][ClinicalDetailsFields.ISOLATION_HOUSE_NUMBER]? true : false}
                                label={
                                    errors[ClinicalDetailsFields.ISOLATION_ADDRESS] && 
                                    errors[ClinicalDetailsFields.ISOLATION_ADDRESS][ClinicalDetailsFields.ISOLATION_HOUSE_NUMBER]?
                                    errors[ClinicalDetailsFields.ISOLATION_ADDRESS][ClinicalDetailsFields.ISOLATION_HOUSE_NUMBER].message
                                    :
                                    'מספר הבית *'
                                }
                                testId='currentQuarantineHomeNumber'
                                name={ClinicalDetailsFields.ISOLATION_HOUSE_NUMBER}
                                value={props.value}
                                onChange={(newValue: string) => (
                                    props.onChange(newValue)
                                )}
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
                                error={errors[ClinicalDetailsFields.ISOLATION_ADDRESS] && errors[ClinicalDetailsFields.ISOLATION_ADDRESS][ClinicalDetailsFields.ISOLATION_FLOOR]? true : false}
                                label={
                                    errors[ClinicalDetailsFields.ISOLATION_ADDRESS] && 
                                    errors[ClinicalDetailsFields.ISOLATION_ADDRESS][ClinicalDetailsFields.ISOLATION_FLOOR]?
                                    errors[ClinicalDetailsFields.ISOLATION_ADDRESS][ClinicalDetailsFields.ISOLATION_FLOOR].message
                                    :
                                    'קומה *'
                                }
                                testId='currentQuarantineFloor'
                                name={ClinicalDetailsFields.ISOLATION_FLOOR}
                                value={props.value}
                                onChange={(newValue: string) => (
                                    props.onChange(newValue)
                                )}
                                setError={setError}
                                clearErrors={clearErrors}
                                errors={errors}
                                placeholder='קומה'
                            />
                        )}
                    />
                </Grid>
            </Grid>
            <IsolationProblemFields
                classes={classes}
                watchIsIsolationProblem={watchIsIsolationProblem}
                control={control}
                setError={setError}
                clearErrors={clearErrors}
                errors={errors}
            />
            <SymptomsFields
                classes={classes}
                control={control}
                watchDoesHaveSymptoms={watchDoesHaveSymptoms}
                watchSymptoms={watchSymptoms}
                isUnkonwnDateChecked={isUnkonwnDateChecked}
                handleUnkonwnDateCheck={handleUnkonwnDateCheck}
                handleSymptomCheck={handleSymptomCheck}
                symptoms={symptoms}
                setError={setError}
                clearErrors={clearErrors}
                errors={errors}
            />
            <BackgroundDiseasesFields
                classes={classes}
                backgroundDiseases={backgroundDiseases}
                handleBackgroundIllnessCheck={handleBackgroundIllnessCheck}
                setError={setError}
                clearErrors={clearErrors}
                errors={errors}
                control={control}
                watchBackgroundDiseases={watchBackgroundDiseases}
                watchDoesHaveBackgroundDiseases={watchDoesHaveBackgroundDiseases}
            />
            <Grid spacing={3} container className={classes.containerGrid} justify='flex-start' alignItems='center'>
                <HospitalFields
                    classes={classes}
                    control={control}
                    setError={setError}
                    clearErrors={clearErrors}
                    errors={errors}
                    watchWasHospitalized={watchWasHospitalized}
                />
                {patientGender === Gender.FEMALE ?
                    <>
                        <Grid item xs={2}>
                            <Typography>
                                <b>
                                    האם בהריון:
                                </b>
                            </Typography>
                        </Grid>
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
                    </>
                    : <></>
                }
            </Grid>
            </form>
        </div>
    );
};

interface Props {
    id: number,
    onSubmit: any,
}

export default ClinicalDetails;
