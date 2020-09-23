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
import ClinicalDetailsData from 'models/Contexts/ClinicalDetailsContextData';

import { useStyles } from './ClinicalDetailsStyles';
import useClinicalDetails from './useClinicalDetails';

export const otherBackgroundDiseaseFieldName = 'אחר';
export const otherSymptomFieldName = 'אחר';

const schema = yup.object().shape({
    [ClinicalDetailsFields.IS_IN_ISOLATION]: yup.boolean().required(),
    [ClinicalDetailsFields.ISOLATION_START_DATE]: yup.date().when(
        ClinicalDetailsFields.IS_IN_ISOLATION, {
        is: true,
        then: yup.date().required(),
        otherwise: yup.date().nullable()
    }),
    [ClinicalDetailsFields.ISOLATION_END_DATE]: yup.date().when(
        ClinicalDetailsFields.IS_IN_ISOLATION, {
        is: true,
        then: yup.date().required(),
        otherwise: yup.date().nullable()
    }),
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
    [ClinicalDetailsFields.SYMPTOMS_START_DATE]: yup.string(),
    [ClinicalDetailsFields.SYMPTOMS]: yup.string(),
    [ClinicalDetailsFields.DOES_HAVE_BACKGROUND_DISEASES]: yup.boolean(),
    [ClinicalDetailsFields.BACKGROUND_DESEASSES]: yup.string(),
    [ClinicalDetailsFields.HOSPITAL]: yup.string(),
    [ClinicalDetailsFields.HOSPITALIZATION_START_DATE]: yup.string(),
    [ClinicalDetailsFields.HOSPITALIZATION_END_DATE]: yup.string(),
    [ClinicalDetailsFields.IS_PREGNANT]: yup.string(),
    [ClinicalDetailsFields.INVESTIGATED_PATIENT_ID]: yup.string(),
    [ClinicalDetailsFields.OTHER_BACKGROUND_DISEASES_MORE_INFO]: yup.string(),
})

const ClinicalDetails: React.FC<Props> = ({ id, onSubmit }: Props): JSX.Element => {
    const classes = useStyles();
    const { control, getValues, handleSubmit, watch, errors, setError, clearErrors } = useForm({
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

    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    const investigatedPatientId = useSelector<StoreStateType, number>(state => state.investigation.investigatedPatientId);
    
    const { hasBackgroundDeseasesToggle, getStreetByCity, updateClinicalDetails, updateIsolationAddress, updateIsolationAddressOnCityChange } = useClinicalDetails({
        setSymptoms, setBackgroundDiseases, context, setIsolationCityName, setIsolationStreetName, setStreetsInCity
    });

    React.useEffect(() => {
        if (context.clinicalDetailsData.doesHaveSymptoms) {
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

    const handleSymptomCheck = (checkedSymptom: string) => {
        let selectedSymptoms = context.clinicalDetailsData.symptoms;

        if (selectedSymptoms.includes(checkedSymptom)) {
            selectedSymptoms = selectedSymptoms.filter((symptom) => symptom !== checkedSymptom);
        } else {
            selectedSymptoms.push(checkedSymptom);
        }

        updateClinicalDetails(ClinicalDetailsFields.SYMPTOMS, selectedSymptoms);
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

    const saveClinicalDetails = (e: any, clinicalDetailsData : any | ClinicalDetailsData) => {
        e.preventDefault();
        console.log("ClinicalTab");
        onSubmit();
        return true;
        // const clinicalDetails = ({
        //     ...clinicalDetailsData,
        //     isolationAddress: clinicalDetailsData.isolationAddress.city === '' ? 
        //                       null : clinicalDetailsData.isolationAddress,
        //     investigatedPatientId,
        //     epidemiologyNumber
        // });

        // if (clinicalDetails.symptoms.includes(otherSymptomFieldName)) {
        //     clinicalDetails.symptoms = clinicalDetails.symptoms.filter(symptom => symptom !== otherSymptomFieldName)
        // } else {
        //     clinicalDetails.otherSymptomsMoreInfo = '';
        // }

        // if (clinicalDetails.backgroundDeseases.includes(otherBackgroundDiseaseFieldName)) {
        //     clinicalDetails.backgroundDeseases = clinicalDetails.backgroundDeseases.filter(symptom => symptom !== otherBackgroundDiseaseFieldName)
        // } else {
        //     clinicalDetails.otherBackgroundDiseasesMoreInfo = '';
        // }

        // if (!clinicalDetails.wasHospitalized) {
        //     clinicalDetails.hospital = '';
        //     clinicalDetails.hospitalizationStartDate = null;
        //     clinicalDetails.hospitalizationEndDate = null;
        // }

        // if (!clinicalDetails.isInIsolation) {
        //     clinicalDetails.isolationStartDate = null;
        //     clinicalDetails.isolationEndDate = null;
        // }

        // if (!clinicalDetails.doesHaveSymptoms) {
        //     clinicalDetails.symptoms = [];
        //     clinicalDetails.symptomsStartDate = null;
        // }

        // if (!clinicalDetails.doesHaveBackgroundDiseases) {
        //     clinicalDetails.backgroundDeseases = [];
        // }

        // axios.post('/clinicalDetails/saveClinicalDetails', ({ clinicalDetails })).catch(() => {
        //     Swal.fire({
        //         title: 'לא הצלחנו לשמור את השינויים, אנא נסה שוב בעוד מספר דקות',
        //         icon: 'error'
        //     });
        // })
    }
    const watchIsInIsolation = watch(ClinicalDetailsFields.IS_IN_ISOLATION);
    const watchIsIsolationProblem = watch(ClinicalDetailsFields.IS_ISOLATION_PROBLEM);
    const watchDoesHaveSymptoms = watch(ClinicalDetailsFields.DOES_HAVE_SYMPTOMS);

    return (
        <div className={classes.form}>
                        <form id={`form-${id}`} onSubmit={(e) => saveClinicalDetails(e,{ name: "itay" })}>

            <Grid spacing={3} container className={classes.containerGrid} justify='flex-start' alignItems='center'>
                <Grid item xs={2} className={classes.fieldLabel}>
                    <Typography>
                        <b>
                            האם שהית בבידוד:
                        </b>
                    </Typography>
                </Grid>
                <Grid item xs={2}>
                    <Controller
                        name={ClinicalDetailsFields.IS_IN_ISOLATION}
                        control={control}
                        render={(props) => (
                            <Toggle
                                test-id='isInQuarantine'
                                value={props.value}
                                onChange={(e, value) => {
                                    if(value !== null) {
                                        props.onChange(value)
                                    }
                                }}
                            />      
                        )}
                    />
                </Grid>
            </Grid>
            <Collapse in={watchIsInIsolation}>
                <Grid item xs={2} className={classes.dates}>
                    <Controller
                        name={ClinicalDetailsFields.ISOLATION_START_DATE}
                        control={control}
                        render={(props) => (
                            <div className={classes.spacedDates}>
                                <DatePick
                                    test-id='quarantinedFromDate'
                                    labelText='מתאריך'
                                    value={props.value}
                                    onChange={(newDate: Date) => {
                                        props.onChange(newDate);
                                    }}
                                />     
                            </div>
                        )}
                    />
                    <Controller
                        name={ClinicalDetailsFields.ISOLATION_END_DATE}
                        control={control}
                        render={(props) => (
                            <DatePick
                                test-id='quarantinedUntilDate'
                                labelText='עד'
                                value={props.value}
                                onChange={(newDate: Date) => {
                                    props.onChange(newDate);
                                }}
                            />   
                        )}
                    />
                </Grid>
            </Collapse>
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
                        options={Array.from(cities, ([id, value]) => ({id, value}))}
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
                        placeholder='קומה'/>
                </Grid>
            </Grid>
            <Grid spacing={3} container className={classes.containerGrid} justify='flex-start' alignItems='center'>
                <Grid item xs={2} className={classes.fieldLabel}>
                    <Typography>
                        <b>
                            האם בעייתי לקיים בידוד:
                        </b>
                    </Typography>
                </Grid>
                <Grid item xs={2}>
                    <Controller
                        name={ClinicalDetailsFields.IS_ISOLATION_PROBLEM}
                        control={control}
                        render={(props) => (
                            <Toggle
                                test-id='isQuarantineProblematic'
                                value={props.value}
                                onChange={(e, value) => {
                                    if(value !== null) {
                                        props.onChange(value)
                                    }
                                }}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={2}>
                    <Collapse in={watchIsIsolationProblem}>
                        <Controller
                            name={ClinicalDetailsFields.IS_ISOLATION_PROBLEM_MORE_INFO}
                            control={control}
                            render={(props) => (
                                <AlphanumericTextField
                                    test-id='problematicQuarantineReason'
                                    name={ClinicalDetailsFields.IS_ISOLATION_PROBLEM_MORE_INFO}
                                    value={props.value}
                                    onChange={(newValue: string) => (
                                        props.onChange(newValue)
                                    )}
                                    setError={setError}
                                    clearErrors={clearErrors}
                                    errors={errors}
                                    placeholder='הכנס סיבה:'
                                    className={classes.isolationProblemTextField}
                                />
                            )}
                        />
                    </Collapse>
                </Grid>
            </Grid>
            <Grid spacing={3} container className={classes.containerGrid} justify='flex-start' alignItems='center'>
                <Grid item xs={2} className={classes.fieldLabel}>
                    <Typography>
                        <b>
                            האם יש סימפטומים:
                        </b>
                    </Typography>
                </Grid>
                <Grid item xs={2}>
                    <Controller
                        name={ClinicalDetailsFields.DOES_HAVE_SYMPTOMS}
                        control={control}
                        render={(props) => (
                            <Toggle
                                test-id='areThereSymptoms'
                                value={props.value}
                                onChange={(e, value) => {
                                    if(value !== null) {
                                        props.onChange(value)
                                    }
                                }}
                            />
                        )}
                    />
                </Grid>
            </Grid>
            <Collapse in={watchDoesHaveSymptoms}>
                <Grid item xs={7}>
                    <div className={classes.dates}>
                        {
                            !isUnkonwnDateChecked &&
                            <DatePick
                                label={'תאריך התחלת סימפטומים'}
                                testId='symptomsStartDate'
                                value={context.clinicalDetailsData.symptomsStartDate}
                                labelText='תאריך התחלת סימפטומים'
                                onChange={(newDate: Date) =>
                                    updateClinicalDetails(
                                        ClinicalDetailsFields.SYMPTOMS_START_DATE,
                                        newDate
                                    )
                                }
                            />
                        }
                        <div className={classes.symptomsDateCheckBox}>
                            <CustomCheckbox
                                testId='unkownSymptomsDate'
                                checkboxElements={[{
                                    value: isUnkonwnDateChecked,
                                    labelText: 'תאריך התחלת סימפטומים לא ידוע',
                                    checked: isUnkonwnDateChecked,
                                    onChange: () => (handleUnkonwnDateCheck())
                                }]}
                            />
                        </div>
                    </div>
                    {
                        context.clinicalDetailsData.doesHaveSymptoms &&
                        <Typography>סימפטומים: (יש לבחור לפחות סימפטום אחד)</Typography>
                    }
                    <Grid item container className={classes.smallGrid}>
                        {
                            symptoms.map((symptom: string) => (
                                <Grid item xs={5} key={symptom} className={classes.symptomsAndDiseasesCheckbox}>
                                    <CustomCheckbox
                                        key={symptom}
                                        checkboxElements={[{
                                            key: symptom,
                                            value: symptom,
                                            labelText: symptom,
                                            checked: context.clinicalDetailsData.symptoms.includes(symptom),
                                            onChange: () => handleSymptomCheck(symptom)
                                        }]}
                                    />
                                </Grid>
                            ))
                        }
                        <Collapse in={context.clinicalDetailsData.symptoms.includes(otherSymptomFieldName)}>
                            <Grid item xs={2}>
                                <AlphanumericTextField
                                    testId='symptomInput'
                                    name={ClinicalDetailsFields.OTHER_SYMPTOMS_MORE_INFO}
                                    value={context.clinicalDetailsData.otherSymptomsMoreInfo}
                                    onChange={(newValue : string) =>
                                        updateClinicalDetails(ClinicalDetailsFields.OTHER_SYMPTOMS_MORE_INFO, newValue as string)
                                    }
                                    label='סימפטום'
                                    setError={setError}
                                    clearErrors={clearErrors}
                                    errors={errors}
                                    className={classes.otherTextField}
                                    placeholder='הזן סימפטום...'

                                />
                            </Grid>
                        </Collapse>
                    </Grid>
                </Grid>
            </Collapse>
            <Grid spacing={5} container className={classes.containerGrid + ' ' + classes.verticalSpacing} justify='flex-start' alignItems='center'>
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
                            <AlphanumericTextField
                                className={classes.hospitalInput}
                                name={ClinicalDetailsFields.HOSPITAL}
                                label='בית חולים'
                                testId='hospitalInput'
                                setError={setError}
                                clearErrors={clearErrors}
                                errors={errors}
                                value={context.clinicalDetailsData.hospital}
                                onChange={(newValue: string) => (
                                    updateClinicalDetails(ClinicalDetailsFields.HOSPITAL, newValue as string)
                                )}
                            />
                        </div>
                        <div className={classes.hospitalizationDates}>
                            <div className={classes.spacedDates}>
                                <DatePick
                                    label='מתאריך'
                                    testId='wasHospitalizedFromDate'
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
            </form>
        </div>
    );
};

interface Props {
    id: number,
    onSubmit: any,
}

export default ClinicalDetails;
