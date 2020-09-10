import React from 'react';
import { format } from 'date-fns';
import { Autocomplete } from '@material-ui/lab';
import { Grid, Typography, Collapse } from '@material-ui/core';

import { useSelector } from 'react-redux';
import Toggle from 'commons/Toggle/Toggle';
import DBAddress from 'models/enums/DBAddress';
import DatePick from 'commons/DatePick/DatePick';
import StoreStateType from 'redux/storeStateType';
import CustomCheckbox from 'commons/CheckBox/CustomCheckbox';
import CircleTextField from 'commons/CircleTextField/CircleTextField';
import ClinicalDetailsFields from 'models/enums/ClinicalDetailsFields';
import ClinicalDetailsData from 'models/Contexts/ClinicalDetailsContextData';
import { clinicalDetailsDataContext } from 'commons/Contexts/ClinicalDetailsContext';

import { useStyles } from './ClinicalDetailsStyles';
import useClinicalDetails from './useClinicalDetails';

const dateFormat = 'yyyy-MM-dd';

const ClinicalDetails: React.FC = (): JSX.Element => {
    const classes = useStyles();

    const [symptoms, setSymptoms] = React.useState<string[]>([]);
    const [backgroundDiseases, setBackgroundDiseases] = React.useState<string[]>([]);
    const [isInIsolation, setIsInIsolation] = React.useState<boolean>(false);
    const [hasSymptoms, setHasSymptoms] = React.useState<boolean>(false);
    const [isUnkonwnDateChecked, setIsUnkonwnDateChecked] = React.useState<boolean>(false);
    const [hasBackgroundDiseases, setHasBackgroundDiseases] = React.useState<boolean>(false);
    const [wasHospitalized, setWasHospitalized] = React.useState<boolean>(false);
    const [otherSymptom, setOtherSymptom] = React.useState<string>('');
    const [selectedSymptoms, setSelectedSymptoms] = React.useState<string[]>([]);
    const [selectedBackgroundDiseases, setSelectedBackgroundDiseases] = React.useState<string[]>([]);
    const [isOtherSymptomChecked, setIsOtherSymptomChecked] = React.useState<boolean>(false);
    const [isOtherBackgroundIllnessChecked, setIsOtherBackgroundIllnessChecked] = React.useState<boolean>(false);
    const [otherBackgroundIllness, setOtherBackgroundIllness] = React.useState<string>('');

    const patientGender = useSelector<StoreStateType, string>(state => state.gender);
    const context = React.useContext(clinicalDetailsDataContext);

    const { isInIsolationToggle, hasSymptomsToggle, hasBackgroundDeseasesToggle, wasHospitalizedToggle } = useClinicalDetails({
        setIsInIsolation, setHasSymptoms, setHasBackgroundDiseases, setWasHospitalized, setSymptoms, setBackgroundDiseases, context
    });


    React.useEffect(() => {
        updateClinicalDetails(ClinicalDetailsFields.SYMPTOMS, selectedSymptoms);
    }, [selectedSymptoms]);

    React.useEffect(() => {
        updateClinicalDetails(ClinicalDetailsFields.BACKGROUND_DESEASSES, selectedBackgroundDiseases);
    }, [selectedBackgroundDiseases]);

    const handleUnkonwnDateCheck = () => {
        setIsUnkonwnDateChecked(!isUnkonwnDateChecked);
        updateClinicalDetails(ClinicalDetailsFields.SYMPTOMS_START_DATE, null);
    };

    const updateClinicalDetails = (fieldToUpdate: ClinicalDetailsFields, updatedValue: any) => {
        context.setClinicalDetailsData({...context.clinicalDetailsData as ClinicalDetailsData, [fieldToUpdate]: updatedValue});
    };

    const updateIsolationAddress = (fieldToUpdate: ClinicalDetailsFields, updatedValue: any) => {
        context.setClinicalDetailsData({
            ...context.clinicalDetailsData as ClinicalDetailsData,
            isolationAddress: {
                ...context.clinicalDetailsData.isolationAddress as DBAddress,
                [fieldToUpdate]: updatedValue
            }
        })
    };

    const checkIfOtherField = (checkedField: string) => (
        checkedField === 'אחר'
    );

    const handleSymptomCheck = (checkedSymptom: string) => {
        if (selectedSymptoms.includes(checkedSymptom)) {
            setSelectedSymptoms(selectedSymptoms.filter((symptom) => symptom !== checkedSymptom));
            if (checkIfOtherField(checkedSymptom)) {
                setIsOtherSymptomChecked(false);
            }
        } else {
            selectedSymptoms.push(checkedSymptom);
            if (checkIfOtherField(checkedSymptom)) {
                setIsOtherSymptomChecked(true);
            }
        }
    };

    const handleBackgroundIllnessCheck = (backgroundIllness: string) => {
        if (selectedBackgroundDiseases.find(checkedBackgroundIllness => checkedBackgroundIllness === backgroundIllness)) {
            setSelectedBackgroundDiseases(selectedBackgroundDiseases.filter((checkedBackgroundIllness) => checkedBackgroundIllness !== backgroundIllness));
            if (checkIfOtherField(backgroundIllness))
                setIsOtherBackgroundIllnessChecked(false);
        } else {
            selectedBackgroundDiseases.push(backgroundIllness);
            if (checkIfOtherField(backgroundIllness))
                setIsOtherBackgroundIllnessChecked(true);
        };
    };
    
    React.useEffect(() => {
        setIsInIsolation(new Date(context.clinicalDetailsData.isolationStartDate as Date) !== null || new Date(context.clinicalDetailsData.isolationEndDate as Date) !== null);
        setHasSymptoms(new Date(context.clinicalDetailsData.symptomsStartDate as Date) !== null);
        setWasHospitalized(new Date(context.clinicalDetailsData.hospitalizationStartDate as Date) !== null || new Date(context.clinicalDetailsData.hospitalizationEndDate as Date) !== null && context.clinicalDetailsData.hospital !== '');
    }, [])

    return (
        <div>
            <Grid spacing={3} className={classes.form} container justify='flex-start' alignItems='center'>
                <Grid item xs={2}>
                    <Typography>
                        <b>
                            האם שהית בבידוד:
                        </b>
                    </Typography>
                </Grid>
                <Grid item xs={10}>
                    <Toggle
                        value={isInIsolation}
                        onChange={isInIsolationToggle}
                    />
                </Grid>
                <Grid item xs={2}>
                </Grid>
                <Grid item xs={10}>
                    <Collapse in={isInIsolation}>
                        <div className={classes.dates}>
                            <DatePick
                                type='date'
                                lableText='מתאריך'
                                value={context.clinicalDetailsData.isolationStartDate !== null ? format(context.clinicalDetailsData.isolationStartDate as Date, dateFormat) : dateFormat}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => (
                                    updateClinicalDetails(ClinicalDetailsFields.ISOLATION_START_DATE, new Date(event.target.value))
                                )}
                            />
                            <DatePick
                                type='date'
                                lableText='עד'
                                value={context.clinicalDetailsData.isolationEndDate !== null ? format(context.clinicalDetailsData.isolationEndDate as Date, dateFormat) : dateFormat}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => (
                                    updateClinicalDetails(ClinicalDetailsFields.ISOLATION_END_DATE, new Date(event.target.value))
                                )}
                            />
                        </div>
                    </Collapse>
                </Grid>
                <Typography>
                    <b>
                        כתובת לאשפוז ביתי:
                    </b>
                </Typography>
                <Autocomplete
                    options={['first', 'second', 'third']}
                    getOptionLabel={(option) => option}
                    inputValue={context.clinicalDetailsData.isolationAddress.city}
                    onInputChange={(event, newInputValue) => {
                        updateIsolationAddress(ClinicalDetailsFields.ISOLATION_CITY, newInputValue)
                    }}
                    renderInput={(params) =>
                        <CircleTextField
                            {...params}
                            placeholder='עיר'
                            className={classes.textField}
                        />
                    }
                />
                <Autocomplete
                    options={['אחר', 'שתיים', 'שלוש']}
                    getOptionLabel={(option) => option}
                    inputValue={context.clinicalDetailsData.isolationAddress.street}
                    onInputChange={(event, newInputValue) => {
                        updateIsolationAddress(ClinicalDetailsFields.ISOLATION_STREET, newInputValue)
                    }}
                    renderInput={(params) =>
                        <CircleTextField
                            {...params}
                            placeholder='רחוב'
                            className={classes.textField}
                        />
                    }
                />
                <CircleTextField
                    size='small'
                    placeholder='קומה'
                    className={classes.textField}
                    value={context.clinicalDetailsData.isolationAddress.floor}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => (
                        updateIsolationAddress(ClinicalDetailsFields.ISOLATION_FLOOR, event.target.value)
                    )}
                />
                <CircleTextField
                    size='small'
                    placeholder='מספר הבית'
                    className={classes.textField}
                    value={context.clinicalDetailsData.isolationAddress.houseNum}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => (
                        updateIsolationAddress(ClinicalDetailsFields.ISOLATION_HOUSE_NUMBER, event.target.value)
                    )}
                />
                <Grid item xs={12}>
                </Grid>
                <Grid item xs={2}>
                    <Typography>
                        <b>
                            האם בעייתי לקיים בידוד:
                        </b>
                    </Typography>
                </Grid>
                <Toggle
                    value={context.clinicalDetailsData.isIsolationProblem}
                    onChange={() => updateClinicalDetails(ClinicalDetailsFields.IS_ISOLATION_PROBLEM, !context.clinicalDetailsData.isIsolationProblem)}
                />
                <Collapse in={context.clinicalDetailsData.isIsolationProblem}>
                    <CircleTextField
                        value={context.clinicalDetailsData.isIsolationProblemMoreInfo}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => (
                            updateClinicalDetails(ClinicalDetailsFields.IS_ISOLATION_PROBLEM_MORE_INFO, event.target.value)
                        )}
                        size='small'
                        className={classes.textField}
                        placeholder='הכנס סיבה:'
                    />
                </Collapse>
                <Grid item xs={12}>
                </Grid>
                <Grid item xs={2}>
                    <Typography>
                        <b>
                            האם יש סימפטומים:
                        </b>
                    </Typography>
                </Grid>
                <Grid item xs={10}>
                    <Toggle
                        value={hasSymptoms}
                        onChange={hasSymptomsToggle}
                    />
                </Grid>
                <Grid item xs={2}>
                </Grid>
                <Grid item xs={10}>
                    <Collapse in={hasSymptoms}>
                        <div className={classes.dates}>
                            <DatePick
                                type='date'
                                value={(!isUnkonwnDateChecked && context.clinicalDetailsData.symptomsStartDate !== null) ? format(context.clinicalDetailsData.symptomsStartDate as Date, dateFormat) : dateFormat}
                                lableText='תאריך התחלת סימפטומים'
                                disabled={isUnkonwnDateChecked}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => (
                                    updateClinicalDetails(ClinicalDetailsFields.SYMPTOMS_START_DATE, new Date(event.target.value))
                                )}
                            />
                            <CustomCheckbox
                                checkboxElements={[{
                                    value: isUnkonwnDateChecked, labelText: 'תאריך התחלת סימפטומים לא ידוע',
                                    onChange: () => (handleUnkonwnDateCheck())
                                }]}
                            />
                        </div>
                        {
                            symptoms.length > 0 ?
                                <Typography>סימפטומים:</Typography> : <></>
                        }
                        <Grid container className={classes.smallGrid}>
                            {
                                symptoms.map((symptom: string) => (
                                    <Grid item xs={6} key={symptom}>
                                        <CustomCheckbox
                                            key={symptom}
                                            checkboxElements={[{
                                                key: symptom,
                                                value: symptoms.find((chosenSymptom) => chosenSymptom === symptom),
                                                labelText: symptom,
                                                onChange: () => {
                                                    handleSymptomCheck(symptom)
                                                }
                                            }]}
                                        />
                                    </Grid>
                                ))
                            }
                            <Collapse in={isOtherSymptomChecked}>
                                <CircleTextField
                                    size='small'
                                    className={classes.otherTextField}
                                    placeholder='הזן סימפטום...'
                                    value={otherSymptom}
                                    onBlur={(event: React.ChangeEvent<{ value: unknown }>) => (
                                        setOtherSymptom(event.target.value as string)
                                    )}
                                />
                            </Collapse>
                        </Grid>
                    </Collapse>
                </Grid>
                <Grid item xs={2}>
                    <Typography>
                        <b>
                            האם יש לך מחלות רקע:
                        </b>
                    </Typography>
                </Grid>
                <Grid item xs={10}>
                    <Toggle
                        value={hasBackgroundDiseases}
                        onChange={hasBackgroundDeseasesToggle}
                    />
                </Grid>
                <Grid item xs={2}>
                </Grid>
                <Grid item xs={10}>
                    <Collapse in={hasBackgroundDiseases}>
                        <Grid container className={classes.smallGrid}>
                            {
                                backgroundDiseases.map((backgroundIllness: string) => (
                                    <Grid item xs={6} key={backgroundIllness}>
                                        <CustomCheckbox
                                            key={backgroundIllness}
                                            checkboxElements={[{
                                                key: backgroundIllness,
                                                value: backgroundDiseases.find((chosenBackgroundIllness) => chosenBackgroundIllness === backgroundIllness),
                                                labelText: backgroundIllness,
                                                onChange: () => {
                                                    handleBackgroundIllnessCheck(backgroundIllness)
                                                }

                                            }]}
                                        />

                                    </Grid>
                                ))
                            }
                            <Collapse in={isOtherBackgroundIllnessChecked}>
                                <CircleTextField
                                    size='small'
                                    className={classes.otherTextField}
                                    placeholder='הזן מחלת רקע...'
                                    value={otherBackgroundIllness}
                                    onBlur={(event: React.ChangeEvent<{ value: unknown }>) => (
                                        setOtherBackgroundIllness(event.target.value as string)
                                    )}
                                />
                            </Collapse>
                        </Grid>
                    </Collapse>
                </Grid>
                <Grid item xs={2}>
                    <Typography>
                        <b>
                            האם אושפז:
                        </b>
                    </Typography>
                </Grid>
                <Grid item xs={10}>
                    <Toggle
                        value={wasHospitalized}
                        onChange={wasHospitalizedToggle}
                    />
                </Grid>
                <Grid item xs={2}>
                </Grid>
                <Grid item xs={10}>
                    <Collapse in={wasHospitalized}>
                        <div className={classes.dates}>
                            <Typography>
                                <b>
                                    בית חולים:
                                </b>
                            </Typography>
                            <CircleTextField
                                value={context.clinicalDetailsData.hospital}
                                onChange={(event: React.ChangeEvent<{ value: unknown }>) => (
                                    updateClinicalDetails(ClinicalDetailsFields.HOSPITAL, event.target.value)
                                )}
                            />
                        </div>
                        <div className={classes.dates}>
                            <DatePick
                                type='date'
                                lableText='מתאריך'
                                value={context.clinicalDetailsData.hospitalizationStartDate !== null ? format(context.clinicalDetailsData.hospitalizationStartDate as Date, dateFormat) : dateFormat}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => (
                                    updateClinicalDetails(ClinicalDetailsFields.HOSPITALIZATION_START_DATE, new Date(event.target.value))
                                )}
                            />
                            <DatePick
                                type='date'
                                lableText='עד'
                                value={context.clinicalDetailsData.hospitalizationEndDate !== null ? format(context.clinicalDetailsData.hospitalizationEndDate as Date, dateFormat) : dateFormat}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => (
                                    updateClinicalDetails(ClinicalDetailsFields.HOSPITALIZATION_END_DATE, new Date(event.target.value))
                                )}
                            />
                        </div>
                    </Collapse>
                </Grid>
                {patientGender === 'female' ?
                    <>
                        <Grid item xs={2}>
                            <Typography>
                                <b>
                                    האם בהריון:
                                </b>
                            </Typography>
                        </Grid>
                        <Toggle
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
