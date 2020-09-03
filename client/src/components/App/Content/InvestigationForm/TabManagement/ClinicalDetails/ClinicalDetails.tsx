import React from 'react';
import { format } from 'date-fns';
import { Grid, Typography, Collapse } from '@material-ui/core';

import { Check } from 'models/Check';
import Toggle from 'commons/Toggle/Toggle';
import DatePick from 'commons/DatePick/DatePick';
import CustomCheckbox from 'commons/Checkbox/CustomCheckbox';
import CircleSelect from 'commons/CircleSelect/CircleSelect';
import CircleTextField from 'commons/CircleTextField/CircleTextField';
import ClinicalDetailsFields from 'models/enums/ClinicalDetailsFields';
import ClinicalDetailsData from 'models/Contexts/ClinicalDetailsContextData';
import { ClinicalDetailsDataContextConsumer, ClinicalDetailsDataAndSet } from 'commons/Contexts/ClinicalDetailsContext';

import { useStyles } from './ClinicalDetailsStyles';
import useClinicalDetails from './useClinicalDetails';

const symptomsList: Check[] = [
    {
        id: 0,
        name: 'first',
    },
    {
        id: 1,
        name: 'second',
    },
    {
        id: 2,
        name: 'third',
    },
    {
        id: 3,
        name: 'fourth',
    },
    {
        id: 4,
        name: 'אחר',
    },
];

const backgroundIllnessesList: Check[] = [
    {
        id: 0,
        name: 'one',
    },
    {
        id: 1,
        name: 'two',
    },
    {
        id: 2,
        name: 'three',
    },
    {
        id: 3,
        name: 'four',
    },
    {
        id: 4,
        name: 'אחר',
    },

];

const hospitals: string[] = ['שיבא', 'איכילוב', 'אסף הרופא'];

let selectedSymptoms: string[] = [];
let selectedBackgroundIllnesses: string[] = [];

const ClinicalDetails: React.FC = (): JSX.Element => {
    const classes = useStyles();

    const [isInIsolation, setIsInIsolation] = React.useState<boolean>(false);
    const [hasSymptoms, setHasSymptoms] = React.useState<boolean>(false);
    const [isUnkonwnDateChecked, setIsUnkonwnDateChecked] = React.useState<boolean>(false);
    const [hasBackgroundIllnesses, setHasBackgroundIllnesses] = React.useState<boolean>(false);
    const [wasHospitalized, setWasHospitalized] = React.useState<boolean>(false);
    const [otherSymptom, setOtherSymptom] = React.useState<string>('');
    const [otherBackgroundIllness, setOtherBackgroundIllness] = React.useState<string>('');
    const { isInIsolationToggle, hasSymptomsToggle, hasBackgroundIllnessesToggle, wasHospitalizedToggle } = useClinicalDetails(
        {
            setIsInIsolation, setHasSymptoms, setHasBackgroundIllnesses, setWasHospitalized
        });

    const handleUnkonwnDateCheck = () => {
        setIsUnkonwnDateChecked(!isUnkonwnDateChecked);
    };

    const updateClinicalDetails = (context: ClinicalDetailsDataAndSet, fieldToUpdate: ClinicalDetailsFields, updatedValue: any) => {
        context.setClinicalDetailsData({...context.clinicalDetailsData as ClinicalDetailsData, [fieldToUpdate]: updatedValue});
    };

    const handleSymptomCheck = (symptom: Check) => {
        if (selectedSymptoms.find(checkedName => checkedName === symptom.name)) {
            selectedSymptoms = selectedSymptoms.filter((checkedSymptom) => checkedSymptom !== symptom.name);
        } else {
            selectedSymptoms.push(symptom.name);
        };
    };

    const handleBackgroundIllnessCheck = (backgroundIllness: Check) => {
        if (selectedBackgroundIllnesses.find(checkedName => checkedName === backgroundIllness.name)) {
            selectedBackgroundIllnesses = selectedBackgroundIllnesses.filter((checkedBackgroundIllness) => checkedBackgroundIllness !== backgroundIllness.name);
        } else {
            selectedBackgroundIllnesses.push(backgroundIllness.name);
        };
    };

    return (
        <ClinicalDetailsDataContextConsumer>
            {ctxt => (
                <Grid spacing={3} className={classes.form} container justify='flex-start' alignItems='center'>
                    {/* האם שהית בבידוד */}
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
                                    datePickerType='date'
                                    text={'מתאריך'}
                                    value={ctxt.clinicalDetailsData?.isolationStartDate !== null ?  format(ctxt.clinicalDetailsData?.isolationStartDate as Date, 'yyyy-MM-dd') : 'yyyy-MM-dd'}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => (
                                        updateClinicalDetails(ctxt as ClinicalDetailsDataAndSet, ClinicalDetailsFields.ISOLATION_START_DATE, new Date(event.target.value))
                                    )}
                                />
                                <DatePick
                                    datePickerType='date'
                                    text={'עד'}
                                    value={format(ctxt.clinicalDetailsData?.isolationEndDate as Date, 'yyyy-MM-dd')}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => (
                                        updateClinicalDetails(ctxt as ClinicalDetailsDataAndSet, ClinicalDetailsFields.ISOLATION_END_DATE, new Date(event.target.value))
                                    )}
                                />
                            </div>
                        </Collapse>
                    </Grid>
                    {/* כתובת לבידוד נוכחי */}
                    <Typography>
                        <b>
                            כתובת לבידוד נוכחי:
                        </b>
                    </Typography>
                    <CircleTextField
                        size='small'
                        placeholder='כתובת'
                        className={classes.textField}
                        value={ctxt.clinicalDetailsData?.isolationAddress}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => (
                            updateClinicalDetails(ctxt as ClinicalDetailsDataAndSet, ClinicalDetailsFields.ISOLATION_ADDRESS, event.target.value)
                        )}
                    />
                    <Grid item xs={12}>
                    </Grid>
                    {/* האם בעייתי לקיים בידוד */}
                    <Grid item xs={2}>
                        <Typography>
                            <b>
                                האם בעייתי לקיים בידוד:
                            </b>
                        </Typography>
                    </Grid>
                        <Toggle
                            value={ctxt.clinicalDetailsData?.isIsolationProblem}
                            onChange={() => updateClinicalDetails(ctxt as ClinicalDetailsDataAndSet, ClinicalDetailsFields.IS_ISOLATION_PROBLEM, !ctxt.clinicalDetailsData?.isIsolationProblem)}
                        />
                        <Collapse in={ctxt.clinicalDetailsData?.isIsolationProblem}>
                            <CircleTextField
                                value={ctxt.clinicalDetailsData?.isIsolationProblemMoreInfo}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => (
                                    updateClinicalDetails(ctxt as ClinicalDetailsDataAndSet, ClinicalDetailsFields.IS_ISOLATION_PROBLEM_MORE_INFO, event.target.value)
                                )}
                                size='small'
                                className={classes.textField}
                                placeholder='הכנס סיבה:'
                            />
                        </Collapse>
                    <Grid item xs={12}>
                    </Grid>
                    {/* האם יש סימפטומים */}
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
                                    datePickerType='date'
                                    value={(!isUnkonwnDateChecked && ctxt.clinicalDetailsData?.symptomsStartDate !== null) ? format(ctxt.clinicalDetailsData?.symptomsStartDate as Date, 'yyyy-MM-dd') : 'yyyy-MM-dd'}
                                    text={'תאריך התחלת סימפטומים'}
                                    disabled={isUnkonwnDateChecked}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => (
                                        updateClinicalDetails(ctxt as ClinicalDetailsDataAndSet, ClinicalDetailsFields.SYMPTOMS_START_DATE, isUnkonwnDateChecked ? null : new Date(event.target.value))
                                    )}
                                />
                                <CustomCheckbox
                                    checkboxElements={[{value: isUnkonwnDateChecked, text: 'תאריך התחלת סימפטומים לא ידוע',
                                    onChange: () => (handleUnkonwnDateCheck())}]}
                                />
                            </div>
                            <Typography>סימפטומים:</Typography>
                            <Grid container className={classes.smallGrid}>
                                {
                                    symptomsList.map((symptom: Check) => (
                                        <Grid item xs={6}>
                                            <CustomCheckbox
                                            key={symptom.id}
                                                checkboxElements={[{
                                                    key: symptom.id,
                                                    value: symptomsList.find((chosenSymptom) => chosenSymptom.name === symptom.name),
                                                    text: symptom.name,
                                                    onChange: () => {
                                                        handleSymptomCheck(symptom)
                                                        updateClinicalDetails(ctxt as ClinicalDetailsDataAndSet, ClinicalDetailsFields.SYMPTOMS, selectedSymptoms)
                                                    }
                                                }]}
                                            />
                                        </Grid>
                                    ))
                                }
                                <CircleTextField
                                    size='small'
                                    className={classes.otherTextField}
                                    placeholder='הזן סימפטום...'
                                    value={otherSymptom}
                                    onChange={(event: React.ChangeEvent<{ value: unknown }>) => (
                                        setOtherSymptom(event.target.value as string)
                                    )}
                                />
                            </Grid>
                        </Collapse>
                    </Grid>
                    {/* האם יש לך מחלות רקע */}
                    <Grid item xs={2}>
                        <Typography>
                            <b>
                                האם יש לך מחלות רקע:
                            </b>
                        </Typography>
                    </Grid>
                    <Grid item xs={10}>
                        <Toggle
                            value={hasBackgroundIllnesses}
                            onChange={hasBackgroundIllnessesToggle}
                        />
                    </Grid>
                    <Grid item xs={2}>
                    </Grid>
                    <Grid item xs={10}>
                        <Collapse in={hasBackgroundIllnesses}>
                            <Grid container className={classes.smallGrid}>
                                {
                                    backgroundIllnessesList.map((backgroundIllness: Check) => (
                                        <Grid item xs={6}>
                                            <CustomCheckbox
                                                checkboxElements={[{
                                                    key: backgroundIllness.id,
                                                    value: backgroundIllnessesList.find((chosenBackgroundIllness) => chosenBackgroundIllness.name === backgroundIllness.name),
                                                    text: backgroundIllness.name,
                                                    onChange: () => {
                                                        handleBackgroundIllnessCheck(backgroundIllness)
                                                        updateClinicalDetails(ctxt as ClinicalDetailsDataAndSet, ClinicalDetailsFields.BACKGROUND_ILLNESSES, selectedBackgroundIllnesses)
                                                    }
                                                    
                                                }]}
                                            />
                                            
                                        </Grid>
                                    ))
                                }
                                <CircleTextField
                                    size='small'
                                    className={classes.otherTextField}
                                    placeholder='הזן מחלת רקע...'
                                    value={otherBackgroundIllness}
                                    onChange={(event: React.ChangeEvent<{ value: unknown }>) => setOtherBackgroundIllness(event.target.value as string)}
                                />
                            </Grid>
                        </Collapse>
                    </Grid>
                    {/* האם אושפז */}
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
                                <Typography style={{marginTop: '0.7%'}}>
                                    <b>
                                        בית חולים:
                                    </b>
                                </Typography>
                                <CircleSelect
                                    options={hospitals}
                                    value={ctxt.clinicalDetailsData?.hospital}
                                    onChange={(event: React.ChangeEvent<{ value: unknown }>) => (
                                        updateClinicalDetails(ctxt as ClinicalDetailsDataAndSet, ClinicalDetailsFields.HOSPITAL, event.target.value)
                                    )}
                                />
                            </div>
                            <div className={classes.dates}>
                                <DatePick
                                    datePickerType='date'
                                    text={'מתאריך'}
                                    value={format(ctxt.clinicalDetailsData?.hospitalizationStartDate as Date, 'yyyy-MM-dd')}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => (
                                        updateClinicalDetails(ctxt as ClinicalDetailsDataAndSet, ClinicalDetailsFields.HOSPITALIZATION_START_DATE, new Date(event.target.value))
                                    )}
                                />
                                <DatePick
                                    datePickerType='date'
                                    text={'עד'}
                                    value={format(ctxt.clinicalDetailsData?.hospitalizationEndDate as Date, 'yyyy-MM-dd')}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => (
                                        updateClinicalDetails(ctxt as ClinicalDetailsDataAndSet, ClinicalDetailsFields.HOSPITALIZATION_END_DATE, new Date(event.target.value))
                                    )}
                                />
                            </div>
                        </Collapse>
                    </Grid>
                </Grid>
            )}
        </ClinicalDetailsDataContextConsumer>
    );
};

export default ClinicalDetails;
