import React from 'react';
import { format } from 'date-fns';
import { Grid, Typography, Collapse } from '@material-ui/core';

import Check from 'models/Check';
import Toggle from 'commons/Toggle/Toggle';
import DatePick from 'commons/DatePick/DatePick';
import CustomCheckbox from 'commons/Checkbox/CustomCheckbox';
import CircleSelect from 'commons/CircleSelect/CircleSelect';
import CircleTextField from 'commons/CircleTextField/CircleTextField';
import ClinicalDetailsFields from 'models/enums/ClinicalDetailsFields';
import ClinicalDetailsData from 'models/Contexts/ClinicalDetailsContextData';
import { clinicalDetailsDataContext } from 'commons/Contexts/ClinicalDetailsContext';

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

const ClinicalDetails: React.FC = (): JSX.Element => {
    const classes = useStyles();

    const [isInIsolation, setIsInIsolation] = React.useState<boolean>(false);
    const [hasSymptoms, setHasSymptoms] = React.useState<boolean>(false);
    const [isUnkonwnDateChecked, setIsUnkonwnDateChecked] = React.useState<boolean>(false);
    const [hasBackgroundIllnesses, setHasBackgroundIllnesses] = React.useState<boolean>(false);
    const [wasHospitalized, setWasHospitalized] = React.useState<boolean>(false);
    const [otherSymptom, setOtherSymptom] = React.useState<string>('');
    const [otherBackgroundIllness, setOtherBackgroundIllness] = React.useState<string>('');
    const [selectedSymptoms, setSelectedSymptoms] = React.useState<string[]>([]);
    const [selectedBackgroundIllnesses, setSelectedBackgroundIllnesses] = React.useState<string[]>([]);
    const { isInIsolationToggle, hasSymptomsToggle, hasBackgroundIllnessesToggle, wasHospitalizedToggle } = useClinicalDetails(
        {
            setIsInIsolation, setHasSymptoms, setHasBackgroundIllnesses, setWasHospitalized
        });

    const handleUnkonwnDateCheck = () => {
        setIsUnkonwnDateChecked(!isUnkonwnDateChecked);
    };

    const updateClinicalDetails = (fieldToUpdate: ClinicalDetailsFields, updatedValue: any) => {
        context.setClinicalDetailsData({...context.clinicalDetailsData as ClinicalDetailsData, [fieldToUpdate]: updatedValue});
    };

    const handleSymptomCheck = (symptom: Check) => {
        if (selectedSymptoms.find(checkedName => checkedName === symptom.name)) {
            setSelectedSymptoms(selectedSymptoms.filter((checkedSymptom) => checkedSymptom !== symptom.name));
        } else {
            selectedSymptoms.push(symptom.name);
        };

        updateClinicalDetails(ClinicalDetailsFields.SYMPTOMS, selectedSymptoms)
    };

    const handleBackgroundIllnessCheck = (backgroundIllness: Check) => {
        if (selectedBackgroundIllnesses.find(checkedName => checkedName === backgroundIllness.name)) {
            setSelectedBackgroundIllnesses(selectedBackgroundIllnesses.filter((checkedBackgroundIllness) => checkedBackgroundIllness !== backgroundIllness.name));
        } else {
            selectedBackgroundIllnesses.push(backgroundIllness.name);
        };

        updateClinicalDetails(ClinicalDetailsFields.BACKGROUND_ILLNESSES, selectedBackgroundIllnesses)
    };

    const context = React.useContext(clinicalDetailsDataContext);

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
                                datePickerType='date'
                                text={'מתאריך'}
                                value={context.clinicalDetailsData?.isolationStartDate !== null ? format(context.clinicalDetailsData?.isolationStartDate as Date, 'yyyy-MM-dd') : 'yyyy-MM-dd'}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => (
                                    updateClinicalDetails(ClinicalDetailsFields.ISOLATION_START_DATE, new Date(event.target.value))
                                )}
                            />
                            <DatePick
                                datePickerType='date'
                                text={'עד'}
                                value={format(context.clinicalDetailsData?.isolationEndDate as Date, 'yyyy-MM-dd')}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => (
                                    updateClinicalDetails(ClinicalDetailsFields.ISOLATION_END_DATE, new Date(event.target.value))
                                )}
                            />
                        </div>
                    </Collapse>
                </Grid>
                <Typography>
                    <b>
                        כתובת לבידוד נוכחי:
                        </b>
                </Typography>
                <CircleTextField
                    size='small'
                    placeholder='כתובת'
                    className={classes.textField}
                    value={context.clinicalDetailsData?.isolationAddress}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => (
                        updateClinicalDetails(ClinicalDetailsFields.ISOLATION_ADDRESS, event.target.value)
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
                    value={context.clinicalDetailsData?.isIsolationProblem}
                    onChange={() => updateClinicalDetails(ClinicalDetailsFields.IS_ISOLATION_PROBLEM, !context.clinicalDetailsData?.isIsolationProblem)}
                />
                <Collapse in={context.clinicalDetailsData?.isIsolationProblem}>
                    <CircleTextField
                        value={context.clinicalDetailsData?.isIsolationProblemMoreInfo}
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
                                datePickerType='date'
                                value={!isUnkonwnDateChecked ? format(context.clinicalDetailsData?.symptomsStartDate as Date, 'yyyy-MM-dd') : 'yyyy-MM-dd'}
                                text={'תאריך התחלת סימפטומים'}
                                disabled={isUnkonwnDateChecked}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => (
                                    updateClinicalDetails(ClinicalDetailsFields.SYMPTOMS_START_DATE, isUnkonwnDateChecked ? null : new Date(event.target.value))
                                )}
                            />
                            <CustomCheckbox
                                checkboxElements={[{
                                    value: isUnkonwnDateChecked, text: 'תאריך התחלת סימפטומים לא ידוע',
                                    onChange: () => (handleUnkonwnDateCheck())
                                }]}
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
                            <Typography style={{ marginTop: '0.7%' }}>
                                <b>
                                    בית חולים:
                                    </b>
                            </Typography>
                            <CircleSelect
                                options={hospitals}
                                value={context.clinicalDetailsData?.hospital}
                                onChange={(event: React.ChangeEvent<{ value: unknown }>) => (
                                    updateClinicalDetails(ClinicalDetailsFields.HOSPITAL, event.target.value)
                                )}
                            />
                        </div>
                        <div className={classes.dates}>
                            <DatePick
                                datePickerType='date'
                                text={'מתאריך'}
                                value={format(context.clinicalDetailsData?.hospitalizationStartDate as Date, 'yyyy-MM-dd')}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => (
                                    updateClinicalDetails(ClinicalDetailsFields.HOSPITALIZATION_START_DATE, new Date(event.target.value))
                                )}
                            />
                            <DatePick
                                datePickerType='date'
                                text={'עד'}
                                value={format(context.clinicalDetailsData?.hospitalizationEndDate as Date, 'yyyy-MM-dd')}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => (
                                    updateClinicalDetails(ClinicalDetailsFields.HOSPITALIZATION_END_DATE, new Date(event.target.value))
                                )}
                            />
                        </div>
                    </Collapse>
                </Grid>
            </Grid>
        </div>
    );
};

export default ClinicalDetails;
