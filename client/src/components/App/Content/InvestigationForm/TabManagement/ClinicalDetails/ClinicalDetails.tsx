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
import IsolationDatesFields from './IsolationDatesFields';
import IsolationProblemFields from './IsolationProblemFields'
import SymptomsFields from './SymptomsFields';
import BackgroundDiseasesFields from './BackgroundDiseasesFields';
import HospitalFields from './HospitalFields';

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

const ClinicalDetails: React.FC<Props> = ({ id, onSubmit }: Props): JSX.Element => {
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
    const watchSymptoms = watch(ClinicalDetailsFields.SYMPTOMS);

    return (
        <div className={classes.form}>
                                    <form id={`form-${id}`} onSubmit={(e) => saveClinicalDetails(e,{ name: "itay" })}>
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
                symptoms={symptoms}
                setError={setError}
                clearErrors={clearErrors}
                errors={errors}
            />
            <BackgroundDiseasesFields
                classes={classes}
                hasBackgroundDeseasesToggle={hasBackgroundDeseasesToggle}
                backgroundDiseases={backgroundDiseases}
                handleBackgroundIllnessCheck={handleBackgroundIllnessCheck}
                setError={setError}
                clearErrors={clearErrors}
                errors={errors}
                context={context}
                updateClinicalDetails={updateClinicalDetails}
            />
            <Grid spacing={3} container className={classes.containerGrid} justify='flex-start' alignItems='center'>
                <HospitalFields
                    classes={classes}
                    control={control}
                    setError={setError}
                    clearErrors={clearErrors}
                    errors={errors}
                    context={context}
                    updateClinicalDetails={updateClinicalDetails}
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
