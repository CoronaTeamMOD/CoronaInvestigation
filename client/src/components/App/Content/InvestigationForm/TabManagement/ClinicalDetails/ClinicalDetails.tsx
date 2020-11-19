import Swal from 'sweetalert2';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Autocomplete } from '@material-ui/lab';
import { yupResolver } from '@hookform/resolvers';
import { Grid, TextField } from '@material-ui/core';
import { useForm, Controller, FormProvider } from 'react-hook-form';

import City from 'models/City';
import Street from 'models/Street';
import logger from 'logger/logger';
import Gender from 'models/enums/Gender';
import Toggle from 'commons/Toggle/Toggle';
import { Severity } from 'models/Logger';
import StoreStateType from 'redux/storeStateType';
import { setFormState } from 'redux/Form/formActionCreators';
import ClinicalDetailsFields from 'models/enums/ClinicalDetailsFields';
import FormRowWithInput from 'commons/FormRowWithInput/FormRowWithInput';
import ClinicalDetailsData from 'models/Contexts/ClinicalDetailsContextData';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField';
import { cityFilterOptions, streetFilterOptions } from 'Utils/Address/AddressOptionsFilters';

import { useStyles } from './ClinicalDetailsStyles';
import IsolationDatesFields from './IsolationDatesFields';
import ClinicalDetailsSchema from './ClinicalDetailsSchema';
import IsolationProblemFields from './IsolationProblemFields';
import SymptomsFields, { otherSymptomFieldName } from './SymptomsFields';
import useClinicalDetails, { initialClinicalDetails } from './useClinicalDetails';
import BackgroundDiseasesFields, { otherBackgroundDiseaseFieldName } from './BackgroundDiseasesFields';

const ClinicalDetails: React.FC<Props> = ({ id }: Props): JSX.Element => {
    const classes = useStyles();

    const validationDate : Date = useSelector<StoreStateType, Date>(state => state.investigation.validationDate);

    const methods = useForm({
        mode: 'all',
        defaultValues: initialClinicalDetails,
        resolver: yupResolver(ClinicalDetailsSchema(validationDate))
    });
    
    const [symptoms, setSymptoms] = React.useState<string[]>([]);
    const [backgroundDiseases, setBackgroundDiseases] = React.useState<string[]>([]);
    const [isolationCityName, setIsolationCityName] = React.useState<string>('');
    const [isolationStreetName, setIsolationStreetName] = React.useState<string>('');
    const [streetsInCity, setStreetsInCity] = React.useState<Street[]>([]);

    const patientGender = useSelector<StoreStateType, string>(state => state.gender);
    const cities = useSelector<StoreStateType, Map<string, City>>(state => state.cities);
    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    const investigatedPatientId = useSelector<StoreStateType, number>(state => state.investigation.investigatedPatient.investigatedPatientId);
    const userId = useSelector<StoreStateType, string>(state => state.user.data.id);

    const { fetchClinicalDetails, getStreetByCity, saveClinicalDetails, isolationSources } = useClinicalDetails({
            setSymptoms, setBackgroundDiseases, setIsolationCityName, setIsolationStreetName, setStreetsInCity });

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
        const values = methods.getValues();
        const saveClinicalDetailsLogger = logger.setup({
            workflow: 'Saving clinical details tab',
            investigation: epidemiologyNumber,
            user: userId
        });
        saveClinicalDetailsLogger.info('launching the server request', Severity.LOW)
        saveClinicalDetails(values as ClinicalDetailsData, epidemiologyNumber, investigatedPatientId)
            .then(() => {
                saveClinicalDetailsLogger.info('saved clinical details successfully', Severity.LOW)
            })
            .catch((error) => {
                saveClinicalDetailsLogger.error(`got error from server: ${error}`, Severity.HIGH)
                Swal.fire({
                    title: 'לא הצלחנו לשמור את השינויים, אנא נסה שוב בעוד מספר דקות',
                    icon: 'error'
                })
            })
            .finally(() => {
                ClinicalDetailsSchema(validationDate).isValid(values).then(valid => {
                    setFormState(epidemiologyNumber, id, valid);
                })
            })
    }

    const watchIsInIsolation = methods.watch(ClinicalDetailsFields.IS_IN_ISOLATION);
    const watchIsolationStartDate = methods.watch(ClinicalDetailsFields.ISOLATION_START_DATE);
    const watchIsolationEndDate = methods.watch(ClinicalDetailsFields.ISOLATION_END_DATE);
    const watchIsIsolationProblem = methods.watch(ClinicalDetailsFields.IS_ISOLATION_PROBLEM);
    const watchIsSymptomsDateUnknown = methods.watch(ClinicalDetailsFields.IS_SYMPTOMS_DATE_UNKNOWN);
    const watchDoesHaveSymptoms = methods.watch(ClinicalDetailsFields.DOES_HAVE_SYMPTOMS);
    const watchSymptoms = methods.watch(ClinicalDetailsFields.SYMPTOMS);
    const watchDoesHaveBackgroundDiseases = methods.watch(ClinicalDetailsFields.DOES_HAVE_BACKGROUND_DISEASES);
    const watchBackgroundDiseases = methods.watch(ClinicalDetailsFields.BACKGROUND_DESEASSES);
    const watchWasHospitalized = methods.watch(ClinicalDetailsFields.WAS_HOPITALIZED);
    const watchAddress = methods.watch(ClinicalDetailsFields.ISOLATION_ADDRESS);

    useEffect(() => {
        watchAddress.city && getStreetByCity(watchAddress.city);
    }, [watchAddress?.city]);

    useEffect(() => {
        fetchClinicalDetails(methods.reset, methods.trigger);
    }, []);

    useEffect(() => {
        if (watchIsInIsolation === false) {
            methods.setValue(ClinicalDetailsFields.ISOLATION_START_DATE, null);
            methods.setValue(ClinicalDetailsFields.ISOLATION_END_DATE, null);
        }
    }, [watchIsInIsolation]);

    useEffect(() => {
        if (watchIsIsolationProblem === false) {
            methods.setValue(ClinicalDetailsFields.IS_ISOLATION_PROBLEM_MORE_INFO, '');
        }
    }, [watchIsIsolationProblem]);

    useEffect(() => {
        if (watchDoesHaveSymptoms === false) {
            methods.setValue(ClinicalDetailsFields.SYMPTOMS, []);
            methods.setValue(ClinicalDetailsFields.SYMPTOMS_START_DATE, null);
            methods.setValue(ClinicalDetailsFields.OTHER_SYMPTOMS_MORE_INFO, '');
        }
    }, [watchDoesHaveSymptoms]);

    useEffect(() => {
        if (!watchSymptoms.includes(otherSymptomFieldName)) {
            methods.setValue(ClinicalDetailsFields.OTHER_SYMPTOMS_MORE_INFO, '');
        }
    }, [watchSymptoms]);

    useEffect(() => {
        if (watchIsSymptomsDateUnknown) {
            methods.setValue(ClinicalDetailsFields.SYMPTOMS_START_DATE, null);
        }
    }, [watchIsSymptomsDateUnknown])

    useEffect(() => {
        if (watchDoesHaveBackgroundDiseases === false) {
            methods.setValue(ClinicalDetailsFields.BACKGROUND_DESEASSES, []);
            methods.setValue(ClinicalDetailsFields.OTHER_BACKGROUND_DISEASES_MORE_INFO, '');
        }
    }, [watchDoesHaveBackgroundDiseases]);

    useEffect(() => {
        if (!watchBackgroundDiseases.includes(otherBackgroundDiseaseFieldName)) {
            methods.setValue(ClinicalDetailsFields.OTHER_BACKGROUND_DISEASES_MORE_INFO, '');
        }
    }, [watchBackgroundDiseases]);

    useEffect(() => {
        if (watchWasHospitalized === false) {
            methods.setValue(ClinicalDetailsFields.HOSPITAL, '');
            methods.setValue(ClinicalDetailsFields.HOSPITALIZATION_START_DATE, null);
            methods.setValue(ClinicalDetailsFields.HOSPITALIZATION_END_DATE, null);
        }
    }, [watchWasHospitalized]);

    return (
        <div className={classes.form}>
            <FormProvider {...methods}>
                <form id={`form-${id}`} onSubmit={(e) => saveForm(e)}>
                    <Grid spacing={2} container>
                        <Grid item xs={12}>
                            <IsolationDatesFields 
                                classes={classes} 
                                watchIsInIsolation={watchIsInIsolation} 
                                watchIsolationStartDate={watchIsolationStartDate} 
                                watchIsolationEndDate={watchIsolationEndDate}
                                isolationSources={isolationSources}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormRowWithInput fieldName='כתובת לבידוד:'>
                                <>
                                <Grid item xs={2}>
                                    <Controller
                                        name={`${ClinicalDetailsFields.ISOLATION_ADDRESS}.${ClinicalDetailsFields.ISOLATION_CITY}`}
                                        control={methods.control}
                                        render={(props) => (
                                            <Autocomplete
                                                test-id='currentQuarantineCity'
                                                options={Array.from(cities, ([id, value]) => ({ id, value }))}
                                                getOptionLabel={(option) => option ? option.value.displayName : option}
                                                inputValue={isolationCityName}
                                                filterOptions={cityFilterOptions}
                                                onChange={(event, selectedCity) => {
                                                    props.onChange(selectedCity ? selectedCity.id : '')
                                                    if (selectedCity?.id && selectedCity.id !== props.value) {
                                                        setIsolationStreetName('');
                                                        methods.setValue(`${ClinicalDetailsFields.ISOLATION_ADDRESS}.${ClinicalDetailsFields.ISOLATION_STREET}`, '');
                                                        getStreetByCity(selectedCity.id);
                                                    }
                                                }}
                                                onInputChange={(event, selectedCityName) => {
                                                    if (event?.type !== 'blur') {
                                                        setIsolationCityName(selectedCityName);
                                                        if (selectedCityName === '') {
                                                            setStreetsInCity([]);
                                                            props.onChange('');
                                                            methods.setValue(`${ClinicalDetailsFields.ISOLATION_ADDRESS}.${ClinicalDetailsFields.ISOLATION_STREET}`, '');
                                                        }
                                                    }
                                                }}
                                                renderInput={(params) =>
                                                    <TextField
                                                        error={methods.errors[ClinicalDetailsFields.ISOLATION_ADDRESS] && 
                                                               methods.errors[ClinicalDetailsFields.ISOLATION_ADDRESS][ClinicalDetailsFields.ISOLATION_CITY] ? true : false}
                                                        label={
                                                            methods.errors[ClinicalDetailsFields.ISOLATION_ADDRESS] &&
                                                            methods.errors[ClinicalDetailsFields.ISOLATION_ADDRESS][ClinicalDetailsFields.ISOLATION_CITY]?.message
                                                             || 'עיר *'
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
                                        control={methods.control}
                                        render={(props) => (
                                            <Autocomplete
                                                options={streetsInCity}
                                                getOptionLabel={(option) => option ? option.displayName : option}
                                                inputValue={isolationStreetName}
                                                filterOptions={streetFilterOptions}
                                                onChange={(event, selectedStreet) => props.onChange(selectedStreet ? selectedStreet.id : '')}
                                                onInputChange={(event, selectedStreetName) => {
                                                    if (event?.type !== 'blur') {
                                                        setIsolationStreetName(selectedStreetName);
                                                        if (selectedStreetName === '') {
                                                            props.onChange('');
                                                            methods.setValue(`${ClinicalDetailsFields.ISOLATION_ADDRESS}.${ClinicalDetailsFields.ISOLATION_STREET}`, '');
                                                        }
                                                    }
                                                }}
                                                renderInput={(params) =>
                                                    <TextField
                                                        test-id='currentQuarantineStreet'
                                                        error={methods.errors[ClinicalDetailsFields.ISOLATION_ADDRESS] && methods.errors[ClinicalDetailsFields.ISOLATION_ADDRESS][ClinicalDetailsFields.ISOLATION_STREET] ? true : false}
                                                        label={
                                                            methods.errors[ClinicalDetailsFields.ISOLATION_ADDRESS] &&
                                                            methods.errors[ClinicalDetailsFields.ISOLATION_ADDRESS][ClinicalDetailsFields.ISOLATION_STREET] ?
                                                            methods.errors[ClinicalDetailsFields.ISOLATION_ADDRESS][ClinicalDetailsFields.ISOLATION_STREET].message
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
                                        control={methods.control}
                                        render={(props) => (
                                            <AlphanumericTextField
                                                testId='currentQuarantineHomeNumber'
                                                name={`${ClinicalDetailsFields.ISOLATION_ADDRESS}.${ClinicalDetailsFields.ISOLATION_HOUSE_NUMBER}`}
                                                value={props.value}
                                                onChange={(newValue: string) => props.onChange(newValue)}
                                                onBlur={props.onBlur}
                                                placeholder='מספר הבית'
                                                label='מספר הבית'
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={2} className={classes.cancelWhiteSpace}>
                                    <Controller
                                        name={`${ClinicalDetailsFields.ISOLATION_ADDRESS}.${ClinicalDetailsFields.ISOLATION_FLOOR}`}
                                        control={methods.control}
                                        render={(props) => (
                                            <AlphanumericTextField
                                                testId='currentQuarantineFloor'
                                                name={`${ClinicalDetailsFields.ISOLATION_ADDRESS}.${ClinicalDetailsFields.ISOLATION_FLOOR}`}
                                                value={props.value}
                                                onChange={(newValue: string) => props.onChange(newValue)}
                                                onBlur={props.onBlur}
                                                placeholder='קומה'
                                                label='קומה'
                                            />
                                        )}
                                    />
                                </Grid>
                                </>
                            </FormRowWithInput>
                        </Grid>
                        <Grid item xs={12}>
                            <IsolationProblemFields
                                classes={classes}
                                watchIsIsolationProblem={watchIsIsolationProblem}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <SymptomsFields
                                classes={classes}
                                watchDoesHaveSymptoms={watchDoesHaveSymptoms}
                                watchSymptoms={watchSymptoms}
                                watchIsSymptomsDateUnknown={watchIsSymptomsDateUnknown}
                                handleSymptomCheck={handleSymptomCheck}
                                symptoms={symptoms}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <BackgroundDiseasesFields
                                classes={classes}
                                backgroundDiseases={backgroundDiseases}
                                handleBackgroundIllnessCheck={handleBackgroundIllnessCheck}
                                watchBackgroundDiseases={watchBackgroundDiseases}
                                watchDoesHaveBackgroundDiseases={watchDoesHaveBackgroundDiseases}
                            />
                        </Grid>
                        <Grid item xs={12} className={patientGender === Gender.MALE ? classes.hiddenIsPregnant : ''}>
                            <FormRowWithInput fieldName='האם בהריון:'>
                            <Grid item xs={2}>
                                    <Controller
                                        name={ClinicalDetailsFields.IS_PREGNANT}
                                        control={methods.control}
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
                            </FormRowWithInput>
                        </Grid>
                    </Grid>
                </form>
            </FormProvider>
        </div>
    );
};

interface Props {
    id: number;
}

export default ClinicalDetails;
