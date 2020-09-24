import React from 'react';
import { useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from "@hookform/resolvers";
import * as yup from "yup";
import { Autocomplete } from '@material-ui/lab';
import { Grid, Typography, Collapse, TextField } from '@material-ui/core';

import City from 'models/City';
import Gender from 'models/enums/Gender';
import Street from 'models/enums/Street';
import Toggle from 'commons/Toggle/Toggle';
import DatePick from 'commons/DatePick/DatePick';
import StoreStateType from 'redux/storeStateType';
import CustomCheckbox from 'commons/CheckBox/CustomCheckbox';
import ClinicalDetailsFields from 'models/enums/ClinicalDetailsFields';
import { clinicalDetailsDataContext, initialClinicalDetails } from 'commons/Contexts/ClinicalDetailsContext';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField';

import { useStyles } from './ClinicalDetailsStyles';
import useClinicalDetails from './useClinicalDetails';
import IsolationDatesFields from './IsolationDatesFields';
import IsolationProblemFields from './IsolationProblemFields'
import SymptomsFields from './SymptomsFields';

export const otherBackgroundDiseaseFieldName = 'אחר';

const isInIsolationDateSchema = yup.date().when(
    ClinicalDetailsFields.IS_IN_ISOLATION, {
    is: true,
    then: yup.date().required(),
    otherwise: yup.date().nullable()
});

const wasHospitilizedDateSchema = yup.date().when(
    ClinicalDetailsFields.IS_IN_ISOLATION, {
    is: true,
    then: yup.date().required(),
    otherwise: yup.date().nullable()
});

const schema = yup.object().shape({
    [ClinicalDetailsFields.IS_IN_ISOLATION]: yup.boolean().required(),
    [ClinicalDetailsFields.ISOLATION_START_DATE]: isInIsolationDateSchema,
    [ClinicalDetailsFields.ISOLATION_END_DATE]: isInIsolationDateSchema,
    [ClinicalDetailsFields.ISOLATION_CITY]: yup.string().required(),
    [ClinicalDetailsFields.ISOLATION_STREET]: yup.string().required(),
    [ClinicalDetailsFields.ISOLATION_FLOOR]: yup.number().required(),
    [ClinicalDetailsFields.ISOLATION_HOUSE_NUMBER]: yup.number().required(),
    [ClinicalDetailsFields.IS_ISOLATION_PROBLEM]: yup.boolean().required(),
    [ClinicalDetailsFields.IS_ISOLATION_PROBLEM_MORE_INFO]: yup.string().when(
        ClinicalDetailsFields.IS_ISOLATION_PROBLEM, {
        is: true,
        then: yup.string().required(),
        otherwise: yup.string()
    }),
    [ClinicalDetailsFields.DOES_HAVE_SYMPTOMS]: yup.boolean().required(),
    [ClinicalDetailsFields.SYMPTOMS_START_DATE]: yup.date().when(
        ClinicalDetailsFields.DOES_HAVE_SYMPTOMS, {
        is: true,
        then: yup.date().required(),
        otherwise: yup.date().nullable()
    }
    ),
    [ClinicalDetailsFields.SYMPTOMS]: yup.array().of(yup.string()).when(
        ClinicalDetailsFields.DOES_HAVE_SYMPTOMS, {
        is: true,
        then: yup.array().of(yup.string()).required(),
        otherwise: yup.array().of(yup.string())
    }
    ),
    [ClinicalDetailsFields.DOES_HAVE_BACKGROUND_DISEASES]: yup.boolean(),
    [ClinicalDetailsFields.BACKGROUND_DESEASSES]: yup.string(),
    [ClinicalDetailsFields.WAS_HOPITALIZED]: yup.boolean().required(),
    [ClinicalDetailsFields.HOSPITAL]: yup.string().when(
        ClinicalDetailsFields.WAS_HOPITALIZED, {
        is: true,
        then: yup.string().required(),
        else: yup.string()
    }
    ),
    [ClinicalDetailsFields.HOSPITALIZATION_START_DATE]: wasHospitilizedDateSchema,
    [ClinicalDetailsFields.HOSPITALIZATION_END_DATE]: wasHospitilizedDateSchema,
    [ClinicalDetailsFields.IS_PREGNANT]: yup.boolean().required(),
    [ClinicalDetailsFields.OTHER_BACKGROUND_DISEASES_MORE_INFO]: yup.string(),
})

const ClinicalDetails: React.FC = (): JSX.Element => {
    const classes = useStyles();
    const { control, getValues, handleSubmit, watch, errors, setError, clearErrors } = useForm({
        mode: 'onBlur',
        defaultValues: initialClinicalDetails,
        resolver: yupResolver(schema)
    });
    const context = React.useContext(clinicalDetailsDataContext);
    const { city, street } = context.clinicalDetailsData.isolationAddress;

    const [symptoms, setSymptoms] = React.useState<string[]>([]);
    const [backgroundDiseases, setBackgroundDiseases] = React.useState<string[]>([]);
    const [isUnkonwnDateChecked, setIsUnkonwnDateChecked] = React.useState<boolean>(false);
    const [isolationCityName, setIsolationCityName] = React.useState<string>('');
    const [isolationStreetName, setIsolationStreetName] = React.useState<string>('');
    const [streetsInCity, setStreetsInCity] = React.useState<Street[]>([]);

    const patientGender = useSelector<StoreStateType, string>(state => state.gender);
    const cities = useSelector<StoreStateType, Map<string, City>>(state => state.cities);

    const { hasBackgroundDeseasesToggle, getStreetByCity, updateClinicalDetails, updateIsolationAddress, updateIsolationAddressOnCityChange } = useClinicalDetails({
        setSymptoms, setBackgroundDiseases, context, setIsolationCityName, setIsolationStreetName, setStreetsInCity
    });

    React.useEffect(() => {
        if (context.clinicalDetailsData.symptoms.length > 0) {
            setIsUnkonwnDateChecked(context.clinicalDetailsData.symptomsStartDate === null)
        }
    }, [context.clinicalDetailsData.symptomsStartDate, context.clinicalDetailsData.symptoms])

    React.useEffect(() => {
        city !== '' ? getStreetByCity(city) : setStreetsInCity([]);
    }, [city])

    React.useEffect(() => {
        if (streetsInCity.length > 0 && street === '') {
            updateIsolationAddress(ClinicalDetailsFields.ISOLATION_STREET, streetsInCity[0].id);
            setIsolationStreetName(streetsInCity[0].displayName);
        }
    }, [streetsInCity])

    const handleUnkonwnDateCheck = () => {
        setIsUnkonwnDateChecked(!isUnkonwnDateChecked);
        updateClinicalDetails(ClinicalDetailsFields.SYMPTOMS_START_DATE, null);
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

    const handleBackgroundIllnessCheck = (backgroundIllness: string) => {
        let selectedBackgroundDiseases = context.clinicalDetailsData.backgroundDeseases;

        if (selectedBackgroundDiseases.includes(backgroundIllness)) {
            selectedBackgroundDiseases = selectedBackgroundDiseases.filter((checkedBackgroundIllness) => checkedBackgroundIllness !== backgroundIllness);
        } else {
            selectedBackgroundDiseases.push(backgroundIllness);
        };

        updateClinicalDetails(ClinicalDetailsFields.BACKGROUND_DESEASSES, selectedBackgroundDiseases);
    };

    const watchIsInIsolation = watch(ClinicalDetailsFields.IS_IN_ISOLATION);
    const watchIsIsolationProblem = watch(ClinicalDetailsFields.IS_ISOLATION_PROBLEM);
    const watchDoesHaveSymptoms = watch(ClinicalDetailsFields.DOES_HAVE_SYMPTOMS);
    const watchSymptoms = watch(ClinicalDetailsFields.SYMPTOMS);

    return (
        <div className={classes.form}>
            <IsolationDatesFields classes={classes} watchIsInIsolation={watchIsInIsolation} control={control} />
            <Grid spacing={3} container className={classes.containerGrid} justify='flex-start' alignItems='center'>
                <Grid item xs={2} className={classes.fieldLabel}>
                    <Typography>
                        <b>
                            כתובת לאשפוז ביתי:
                        </b>
                    </Typography>
                </Grid>
                <Grid item xs={2}>
                    <Autocomplete
                        test-id='currentQuarantineCity'
                        options={Array.from(cities, ([id, value]) => ({ id, value }))}
                        getOptionLabel={(option) => option.value.displayName}
                        inputValue={isolationCityName}
                        onChange={(event, selectedCity) => updateIsolationAddressOnCityChange(selectedCity ? selectedCity.id : '')}
                        onInputChange={(event, selectedCityName) => {
                            setIsolationCityName(selectedCityName);
                            if (selectedCityName === '') {
                                updateIsolationAddressOnCityChange('');
                                setIsolationStreetName('');
                            }
                        }}
                        renderInput={(params) =>
                            <TextField
                                {...params}
                                placeholder='עיר'
                            />
                        }
                    />
                </Grid>
                <Grid item xs={2}>
                    <Autocomplete
                        options={streetsInCity}
                        getOptionLabel={(option) => option.displayName}
                        inputValue={isolationStreetName}
                        onChange={(event, selectedStreet) => updateIsolationAddress(ClinicalDetailsFields.ISOLATION_STREET, selectedStreet === null ? '' : selectedStreet.id)}
                        onInputChange={(event, selectedStreetName) => {
                            setIsolationStreetName(selectedStreetName);
                            if (selectedStreetName === '') {
                                updateIsolationAddress(ClinicalDetailsFields.ISOLATION_STREET, '');
                            }
                        }}
                        renderInput={(params) =>
                            <TextField
                                test-id='currentQuarantineStreet'
                                {...params}
                                placeholder='רחוב'
                            />
                        }
                    />
                </Grid>
                <Grid item xs={2}>
                    <AlphanumericTextField
                        testId='currentQuarantineHomeNumber'
                        name={ClinicalDetailsFields.ISOLATION_HOUSE_NUMBER}
                        value={context.clinicalDetailsData.isolationAddress.houseNum}
                        onChange={(newValue: string) => (
                            updateIsolationAddress(ClinicalDetailsFields.ISOLATION_HOUSE_NUMBER, newValue)
                        )}
                        setError={setError}
                        clearErrors={clearErrors}
                        errors={errors}
                        placeholder='מספר הבית'
                    />
                </Grid>
                <Grid item xs={2} className={classes.cancelWhiteSpace}>
                    <AlphanumericTextField
                        testId='currentQuarantineFloor'
                        name={ClinicalDetailsFields.ISOLATION_FLOOR}
                        value={context.clinicalDetailsData.isolationAddress.floor}
                        onChange={(newValue: string) => (
                            updateIsolationAddress(ClinicalDetailsFields.ISOLATION_FLOOR, newValue)
                        )}
                        setError={setError}
                        clearErrors={clearErrors}
                        errors={errors}
                        placeholder='קומה' />
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
                updateClinicalDetails={updateClinicalDetails}
                symptoms={symptoms}
                setError={setError}
                clearErrors={clearErrors}
                errors={errors}
                context={context}
            />
            <Grid spacing={5} container className={classes.containerGrid} justify='flex-start' alignItems='center'>
                <Grid item xs={2} className={classes.fieldLabel}>
                    <Typography>
                        <b>
                            האם יש לך מחלות רקע:
                        </b>
                    </Typography>
                </Grid>
                <Grid item xs={2}>
                    <Toggle
                        test-id='areThereBackgroundDiseases'
                        value={context.clinicalDetailsData.doesHaveBackgroundDiseases}
                        onChange={hasBackgroundDeseasesToggle}
                    />
                </Grid>
            </Grid>
            <Collapse in={context.clinicalDetailsData.doesHaveBackgroundDiseases}>
                <Typography className={classes.backgroundDiseasesLabel}>מחלות רקע: (יש לבחור לפחות מחלת רקע
                    אחת)</Typography>
                <Grid container className={classes.smallGrid}>
                    {
                        backgroundDiseases.map((backgroundIllness: string) => (
                            <Grid item xs={5} key={backgroundIllness} className={classes.symptomsAndDiseasesCheckbox}>
                                <CustomCheckbox
                                    key={backgroundIllness}
                                    checkboxElements={[{
                                        key: backgroundIllness,
                                        value: backgroundIllness,
                                        labelText: backgroundIllness,
                                        checked: context.clinicalDetailsData.backgroundDeseases.includes(backgroundIllness),
                                        onChange: () => handleBackgroundIllnessCheck(backgroundIllness)
                                    }]}
                                />
                            </Grid>
                        ))
                    }
                    <Collapse
                        in={context.clinicalDetailsData.backgroundDeseases.includes(otherBackgroundDiseaseFieldName)}>
                        <Grid item xs={2}>
                            <AlphanumericTextField
                                testId='otherBackgroundDisease'
                                name={ClinicalDetailsFields.OTHER_BACKGROUND_DISEASES_MORE_INFO}
                                value={context.clinicalDetailsData.otherBackgroundDiseasesMoreInfo}
                                onChange={(newValue: string) =>
                                    updateClinicalDetails(ClinicalDetailsFields.OTHER_BACKGROUND_DISEASES_MORE_INFO, newValue as string)
                                }
                                required
                                setError={setError}
                                clearErrors={clearErrors}
                                errors={errors}
                                label='מחלת רקע'
                                placeholder='הזן מחלת רקע...'
                                className={classes.otherTextField}
                            />
                        </Grid>
                    </Collapse>
                </Grid>
            </Collapse>
            <Grid spacing={3} container className={classes.containerGrid} justify='flex-start' alignItems='center'>
                <Grid item xs={2} className={classes.fieldLabel}>
                    <Typography>
                        <b>
                            האם אושפז:
                        </b>
                    </Typography>
                </Grid>
                <Grid item xs={10}>
                    <Toggle
                        test-id='wasHospitalized'
                        value={context.clinicalDetailsData.wasHospitalized}
                        onChange={() => updateClinicalDetails(ClinicalDetailsFields.WAS_HOPITALIZED, !context.clinicalDetailsData.wasHospitalized)}
                    />
                </Grid>
                <Grid item xs={4}>
                    <Collapse in={context.clinicalDetailsData.wasHospitalized}>
                        <div className={classes.dates}>
                            <Typography>
                                <b>
                                    בית חולים:
                                </b>
                            </Typography>
                            <TextField
                                className={classes.hospitalInput}
                                required
                                label='בית חולים'
                                test-id='hospitalInput'
                                value={context.clinicalDetailsData.hospital}
                                onChange={(event: React.ChangeEvent<{ value: unknown }>) => (
                                    updateClinicalDetails(ClinicalDetailsFields.HOSPITAL, event.target.value)
                                )}
                            />
                        </div>
                        <div className={classes.hospitalizationDates}>
                            <div className={classes.spacedDates}>
                                <DatePick
                                    required
                                    label='מתאריך'
                                    test-id='wasHospitalizedFromDate'
                                    labelText='מתאריך'
                                    value={context.clinicalDetailsData.hospitalizationStartDate}
                                    onChange={(newDate: Date) =>
                                        updateClinicalDetails(
                                            ClinicalDetailsFields.HOSPITALIZATION_START_DATE,
                                            newDate
                                        )
                                    }
                                />
                            </div>
                            <DatePick
                                required
                                label='עד'
                                testId='wasHospitalizedUntilDate'
                                labelText='עד'
                                value={context.clinicalDetailsData.hospitalizationEndDate}
                                onChange={(newDate: Date) =>
                                    updateClinicalDetails(
                                        ClinicalDetailsFields.HOSPITALIZATION_END_DATE,
                                        newDate
                                    )
                                }
                            />
                        </div>
                    </Collapse>
                </Grid>
                {patientGender === Gender.FEMALE ?
                    <>
                        <Grid item xs={2}>
                            <Typography>
                                <b>
                                    האם בהריון:
                                </b>
                            </Typography>
                        </Grid>
                        <Toggle
                            test-id='isPregnant'
                            value={context.clinicalDetailsData.isPregnant}
                            onChange={() => updateClinicalDetails(ClinicalDetailsFields.IS_PREGNANT, !context.clinicalDetailsData.isPregnant)}
                        />
                    </>
                    : <></>
                }
            </Grid>
        </div>
    );
};

export default ClinicalDetails;
