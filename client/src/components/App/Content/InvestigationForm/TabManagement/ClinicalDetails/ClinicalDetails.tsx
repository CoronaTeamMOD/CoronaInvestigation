import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Autocomplete } from '@material-ui/lab';
import { yupResolver } from '@hookform/resolvers';
import { Grid, TextField } from '@material-ui/core';
import { useForm, Controller, FormProvider } from 'react-hook-form';

import City from 'models/City';
import Street from 'models/Street';
import Gender from 'models/enums/Gender';
import Toggle from 'commons/Toggle/Toggle';
import StoreStateType from 'redux/storeStateType';
import { get } from 'Utils/auxiliaryFunctions/auxiliaryFunctions'
import ClinicalDetailsFields from 'models/enums/ClinicalDetailsFields';
import FormRowWithInput from 'commons/FormRowWithInput/FormRowWithInput';
import ClinicalDetailsData from 'models/Contexts/ClinicalDetailsContextData';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField';

import { useStyles } from './ClinicalDetailsStyles';
import IsolationDatesFields from './IsolationDatesFields';
import ClinicalDetailsSchema from './ClinicalDetailsSchema';
import IsolationProblemFields from './IsolationProblemFields';
import SymptomsFields, { otherSymptomFieldName } from './SymptomsFields/SymptomsFields';
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
    
    const [symptoms, setSymptoms] = useState<string[]>([]);
    const [backgroundDiseases, setBackgroundDiseases] = useState<string[]>([]);
    const [streetsInCity, setStreetsInCity] = React.useState<Map<string, Street>>(new Map());
    const [didSymptomsDateChangeOccur, setDidSymptomsDateChangeOccur] = useState<boolean>(false);

    const patientGender = useSelector<StoreStateType, string>(state => state.gender);
    const cities = useSelector<StoreStateType, Map<string, City>>(state => state.cities);

    const { fetchClinicalDetails, getStreetByCity, saveClinicalDetailsAndDeleteContactEvents, isolationSources } =
        useClinicalDetails({ id, setSymptoms, setBackgroundDiseases, setStreetsInCity, didSymptomsDateChangeOccur });

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
        saveClinicalDetailsAndDeleteContactEvents(values as ClinicalDetailsData, validationDate, id);
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
        fetchClinicalDetails(methods.reset, methods.trigger);
    }, []);

    useEffect(() => {
        if (watchAddress.city) {
            getStreetByCity(watchAddress.city);
        }
    }, [watchAddress?.city]);

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
                                                value={props.value && {id: props.value as string, value: cities.get(props.value) as City}}
                                                onChange={(event, selectedCity) => props.onChange(selectedCity ? selectedCity.id : '')}
                                                renderInput={(params) =>
                                                    <TextField
                                                        error={Boolean(get(methods.errors, `${ClinicalDetailsFields.ISOLATION_ADDRESS}.${ClinicalDetailsFields.ISOLATION_CITY}`))}
                                                        label={get(methods.errors, `${ClinicalDetailsFields.ISOLATION_ADDRESS}.${ClinicalDetailsFields.ISOLATION_CITY}`)?.message || 'עיר *'}
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
                                                options={Array.from(streetsInCity, ([id, value]) => ({ id, value }))}
                                                getOptionLabel={(option) => {
                                                    if (option) {
                                                        if (option?.value) return option.value?.displayName
                                                        else return '';
                                                    } else return option
                                                }}
                                                value={props.value && {id: props.value as string, value: streetsInCity.get(props.value) as Street}}
                                                onChange={(event, selectedStreet) => {
                                                    props.onChange(selectedStreet ? selectedStreet.id : '')
                                                }}
                                                renderInput={(params) =>
                                                    <TextField
                                                        test-id='currentQuarantineStreet'
                                                        {...params}
                                                        placeholder='רחוב'
                                                        label='רחוב'
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
                                didSymptomsDateChangeOccur={didSymptomsDateChangeOccur}
                                setDidSymptomsDateChangeOccur={setDidSymptomsDateChangeOccur}
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
