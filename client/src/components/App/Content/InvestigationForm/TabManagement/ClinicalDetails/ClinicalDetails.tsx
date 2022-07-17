import { Checkbox, FormControlLabel, Grid } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { yupResolver } from '@hookform/resolvers';
import React, { useEffect, useState } from 'react';
import { useForm, Controller, FormProvider } from 'react-hook-form';

import Gender from 'models/enums/Gender';
import Toggle from 'commons/Toggle/Toggle';
import StoreStateType from 'redux/storeStateType';
import InlineErrorText from 'commons/InlineErrorText/InlineErrorText';
import ClinicalDetailsFields from 'models/enums/ClinicalDetailsFields';
import FormRowWithInput from 'commons/FormRowWithInput/FormRowWithInput';
import ClinicalDetailsData from 'models/Contexts/ClinicalDetailsContextData';
import AddressForm, { AddressFormFields } from 'commons/Forms/AddressForm/AddressForm';

import { useStyles } from './ClinicalDetailsStyles';
import IsolationDatesFields from './IsolationDatesFields';
import ClinicalDetailsSchema from './ClinicalDetailsSchema';
import IsolationProblemFields from './IsolationProblemFields';
import useClinicalDetails, { initialClinicalDetails } from './useClinicalDetails';
import SymptomsFields from './SymptomsFields/SymptomsFields';
import BackgroundDiseasesFields from './BackgroundDiseasesFields';
import { resetClinicalDetails, setClinicalDetails } from 'redux/ClinicalDetails/ClinicalDetailsActionCreators';
import { setIsLoading } from 'redux/IsLoading/isLoadingActionCreators';
import { setFormState } from 'redux/Form/formActionCreators';
import useInvestigatedPersonInfo from '../../InvestigationInfo/InvestigatedPersonInfo/useInvestigatedPersonInfo';

const ClinicalDetails: React.FC<Props> = ({ id, isViewMode }: Props): JSX.Element => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const validationDate: Date = useSelector<StoreStateType, Date>(state => state.investigation.validationDate);
    const patientGender = useSelector<StoreStateType, string>(state => state.gender);
    const clinicalDetails = useSelector<StoreStateType, ClinicalDetailsData | null>(state => state.clinicalDetails.clinicalDetails);
    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);

    const clinicalDetailsIsNull = clinicalDetails === null;

    const methods = useForm({
        mode: 'all',
        defaultValues: initialClinicalDetails,
        resolver: yupResolver(ClinicalDetailsSchema(validationDate, patientGender))
    });

    const [symptoms, setSymptoms] = useState<string[]>([]);
    const [backgroundDiseases, setBackgroundDiseases] = useState<string[]>([]);
    const [didSymptomsDateChangeOccur, setDidSymptomsDateChangeOccur] = useState<boolean>(false);

    const { fetchClinicalDetails, saveClinicalDetailsAndDeleteContactEvents, isolationSources } =
        useClinicalDetails({ id, setSymptoms, setBackgroundDiseases, didSymptomsDateChangeOccur });
    const wasInstructedToBeInIsolationText = 'המאומת הונחה לשהות בבידוד בהתאם להנחיות משרד הבריאות';
    const handleSymptomCheck = (
        checkedSymptom: string,
        onChange: (newSymptoms: string[]) => void,
        selectedSymptoms: string[]
    ) => {
        if (selectedSymptoms.includes(checkedSymptom)) {
            onChange(selectedSymptoms.filter((symptom) => symptom !== checkedSymptom));
            dispatch(setClinicalDetails(ClinicalDetailsFields.SYMPTOMS, selectedSymptoms.filter((symptom) => symptom !== checkedSymptom)))
        } else {
            onChange([...selectedSymptoms, checkedSymptom]);
            dispatch(setClinicalDetails(ClinicalDetailsFields.SYMPTOMS, [...selectedSymptoms, checkedSymptom]))

        }
    };

    const { saveInvestigationInfo } = useInvestigatedPersonInfo();

    const handleBackgroundIllnessCheck = (
        checkedBackgroundIllness: string,
        onChange: (newBackgroundDiseases: string[]) => void,
        selectedBackgroundDiseases: string[]
    ) => {
        if (selectedBackgroundDiseases.includes(checkedBackgroundIllness)) {
            onChange(selectedBackgroundDiseases.filter((symptom) => symptom !== checkedBackgroundIllness));
            dispatch(setClinicalDetails(ClinicalDetailsFields.BACKGROUND_DESEASSES, selectedBackgroundDiseases.filter((symptom) => symptom !== checkedBackgroundIllness)))
        } else {
            onChange([...selectedBackgroundDiseases, checkedBackgroundIllness]);
            dispatch(setClinicalDetails(ClinicalDetailsFields.BACKGROUND_DESEASSES, [...selectedBackgroundDiseases, checkedBackgroundIllness]))
        };
    };

    const saveForm = (e: any) => {
        e.preventDefault();
        if (clinicalDetails && !isViewMode) {
            saveInvestigationInfo();
            saveClinicalDetailsAndDeleteContactEvents(clinicalDetails, id);
        }
        else if (isViewMode) {
            ClinicalDetailsSchema(validationDate, 'gender').isValid(clinicalDetails).then(valid => {
                setFormState(epidemiologyNumber, id, valid);
            });
        }
    }


    const addressFormFields: AddressFormFields = {
        cityField: {
            name: `${ClinicalDetailsFields.ISOLATION_ADDRESS}.${ClinicalDetailsFields.ISOLATION_CITY}`,
            testId: 'currentQuarantineCity'
        },
        streetField: {
            name: `${ClinicalDetailsFields.ISOLATION_ADDRESS}.${ClinicalDetailsFields.ISOLATION_STREET}`,
            testId: 'currentQuarantineStreet'
        },
        houseNumberField: {
            name: `${ClinicalDetailsFields.ISOLATION_ADDRESS}.${ClinicalDetailsFields.ISOLATION_HOUSE_NUMBER}`,
            testId: 'currentQuarantineHomeNumber'
        },
        apartmentField: {
            name: `${ClinicalDetailsFields.ISOLATION_ADDRESS}.${ClinicalDetailsFields.ISOLATION_APARTMENT}`,
            testId: 'currentQuarantineApartment'
        }
    }

    useEffect(() => {

        if (!clinicalDetails) {
            fetchClinicalDetails();
        }
        return () => { dispatch(resetClinicalDetails()) };
    }, []);

    useEffect(() => {
        if (clinicalDetails) {
            setIsLoading(true);
            for (const [key, value] of Object.entries(clinicalDetails)) {
                methods.setValue(key, value);
            }
            methods.trigger();
            setIsLoading(false);
        }
    }, [clinicalDetailsIsNull]);

    return (
        <div className={classes.form}>
            <FormProvider {...methods}>
                <form id={`form-${id}`} onSubmit={(e) => saveForm(e)}>
                    <Grid spacing={3} container>
                        <Grid item xs={12}>
                            <IsolationDatesFields
                                classes={classes}
                                clinicalDetails={clinicalDetails}
                                isolationSources={isolationSources}
                                isViewMode={isViewMode}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormRowWithInput fieldName='כתובת לבידוד:' labelLength={2}>
                                <AddressForm
                                    {...addressFormFields}
                                    isrequired={true}
                                    disabled={isViewMode}
                                    onBlur={() => {
                                        dispatch(setClinicalDetails(ClinicalDetailsFields.ISOLATION_ADDRESS, methods.getValues().isolationAddress))
                                    }}
                                />
                            </FormRowWithInput>
                        </Grid>
                        <Grid item xs={12}>
                            <Controller
                                name={ClinicalDetailsFields.WAS_INSTRUCTED_TO_BE_IN_ISOLATION}
                                control={methods.control}
                                render={(props) =>
                                    <FormControlLabel
                                        label={wasInstructedToBeInIsolationText}
                                        control={
                                            <Checkbox
                                                disabled={isViewMode}
                                                color='primary'
                                                checked={props.value}
                                                onChange={(event) => {
                                                    props.onChange(event.target.checked);
                                                    dispatch(setClinicalDetails(ClinicalDetailsFields.WAS_INSTRUCTED_TO_BE_IN_ISOLATION, event.target.checked));
                                                }}
                                            />
                                        }
                                    />
                                } />
                            <InlineErrorText
                                error={methods.errors[ClinicalDetailsFields.WAS_INSTRUCTED_TO_BE_IN_ISOLATION]}
                            />

                        </Grid>
                        <Grid item xs={12}>
                            <IsolationProblemFields
                                classes={classes}
                                isViewMode={isViewMode}
                                clinicalDetails={clinicalDetails}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <SymptomsFields
                                classes={classes}
                                handleSymptomCheck={handleSymptomCheck}
                                symptoms={symptoms}
                                didSymptomsDateChangeOccur={didSymptomsDateChangeOccur}
                                setDidSymptomsDateChangeOccur={setDidSymptomsDateChangeOccur}
                                isViewMode={isViewMode}
                                clinicalDetails={clinicalDetails}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <BackgroundDiseasesFields
                                classes={classes}
                                backgroundDiseases={backgroundDiseases}
                                handleBackgroundIllnessCheck={handleBackgroundIllnessCheck}
                                clinicalDetails={clinicalDetails}
                                isViewMode={isViewMode}
                            />
                        </Grid>
                        <Grid item xs={12} className={patientGender === Gender.MALE ? classes.hiddenIsPregnant : ''}>
                            <FormRowWithInput fieldName='בהריון:' labelLength={2}>
                                <Grid item xs={3}>
                                    <Controller
                                        name={ClinicalDetailsFields.IS_PREGNANT}
                                        control={methods.control}
                                        render={(props) => (
                                            <Toggle
                                                test-id='isPregnant'
                                                value={props.value}
                                                onChange={(e, value) => {
                                                    if (value !== null) {
                                                        props.onChange(value);
                                                        dispatch(setClinicalDetails(ClinicalDetailsFields.IS_PREGNANT, value));
                                                    }
                                                }}
                                                disabled={isViewMode}
                                            />
                                        )}
                                    />
                                    <InlineErrorText
                                        error={methods.errors[ClinicalDetailsFields.IS_PREGNANT]}
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
    isViewMode?: boolean;
}

export default ClinicalDetails;
