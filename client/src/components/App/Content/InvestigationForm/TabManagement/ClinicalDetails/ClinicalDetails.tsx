import React from 'react';
import { Grid, Typography, Collapse } from '@material-ui/core';

import { Check } from 'models/Check';
import Toggle from 'commons/Toggle/Toggle';
import DatePick from 'commons/DatePick/DatePick';
import CustomCheckbox from 'commons/Checkbox/CustomCheckbox';

import { useStyles } from './ClinicalDetailsStyles';
import useClinicalDetails from './useClinicalDetails';
import { StartInvestigationDateVariablesConsumer } from '../../StartInvestiationDateVariables/StartInvestigationDateVariables';

const ClinicalDetails: React.FC = (): JSX.Element => {
    const classes = useStyles();

    const symptomList: Check[] = [
        {
            id: 0,
            name: 'first',
            isChecked: false
        },
        {
            id: 1,
            name: 'second',
            isChecked: false
        },
        {
            id: 2,
            name: 'third',
            isChecked: false
        },
        {
            id: 3,
            name: 'fourth',
            isChecked: false
        },
        {
            id: 4,
            name: 'אחר',
            isChecked: false
        },
    ];

    const backgroundIllnessesList: Check[] = [
        {
            id: 0,
            name: 'first',
            isChecked: false
        },
        {
            id: 1,
            name: 'second',
            isChecked: false
        },
        {
            id: 2,
            name: 'third',
            isChecked: false
        },
        {
            id: 3,
            name: 'fourth',
            isChecked: false
        },
        {
            id: 4,
            name: 'אחר',
            isChecked: false
        },
    ];

    const [isInIsolation, setIsInIsolation] = React.useState<boolean>(false);
    const [hasSymptoms, setHasSymptoms] = React.useState<boolean>(false);
    const [isUnkonwnDateChecked, setIsUnkonwnDateChecked] = React.useState<boolean>(false);
    const [hasBackgroundIllnesses, setHasBackgroundIllnesses] = React.useState<boolean>(false);
    const [symptoms, setSymptoms] = React.useState<Check[]>(symptomList);
    const [backgroundIllnesses, setBackgroundIllnesses] = React.useState<Check[]>(backgroundIllnessesList);
    const [eventStartTime, setEventStartTime] = React.useState<string>('');

    const { isInIsolationToggle, hasSymptomsToggle, hasBackgroundIllnessesToggle } = useClinicalDetails({ setIsInIsolation, setHasSymptoms, setHasBackgroundIllnesses });

    const handleUnkonwnDateCheck = () => {
        setIsUnkonwnDateChecked(!isUnkonwnDateChecked);
    };

    const handleChecklistCheck = (checkId: number, checkList: Check[]) => {
        let updatedSymptoms = [...checkList];
        updatedSymptoms[checkId].isChecked = !updatedSymptoms[checkId].isChecked;
        //setSymptoms(updatedSymptoms);
        //setBackgroundIllnesses(updatedackgroundIllnesses);
    };

    return (
        <StartInvestigationDateVariablesConsumer>
            {ctxt => (
                <Grid className={classes.form} container justify='flex-start' alignItems='center'>
                    {/* Is In Isolation row */}
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
                                    value={new Date()}
                                    defaultValue=''
                                    text={'מתאריך'}
                                />
                                <DatePick
                                    datePickerType='date'
                                    value={new Date()}
                                    defaultValue=''
                                    text={'עד'}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEventStartTime(event.target.value)}
                                />
                            </div>
                        </Collapse>
                    </Grid>
                    <br />
                    <br />
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
                                    value={new Date()}
                                    defaultValue=''
                                    text={'תאריך התחלת סימפטומים'}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEventStartTime(event.target.value)}
                                />
                                <CustomCheckbox
                                    checkboxElements={[{value: isUnkonwnDateChecked, text: 'תאריך התחלת סימפטומים לא ידוע', onChange: () => (handleUnkonwnDateCheck())}]}
                                />
                            </div>
                            <Typography>סימפטומים:</Typography>
                            <Grid container className={classes.smallGrid}>
                                {
                                    symptoms.map((symptom: Check) => (
                                        <Grid item xs={6}>
                                            <CustomCheckbox
                                                checkboxElements={[{
                                                    key: symptom.id,
                                                    value: symptom.isChecked,
                                                    text: symptom.name,
                                                    onChange: () => (handleChecklistCheck(symptom.id, symptoms))
                                                }]}
                                            />
                                        </Grid>
                                    ))
                                }
                            </Grid>
                        </Collapse>
                    </Grid>
                    <br />
                    <br />
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
                            <Typography>סימפטומים:</Typography>
                            <Grid container className={classes.smallGrid}>
                                {
                                    backgroundIllnesses.map((backgroundIllness: Check) => (
                                        <Grid item xs={6}>
                                            <CustomCheckbox
                                                checkboxElements={[{
                                                    key: backgroundIllness.id,
                                                    value: backgroundIllness.isChecked,
                                                    text: backgroundIllness.name,
                                                    onChange: () => (handleChecklistCheck(backgroundIllness.id, backgroundIllnesses))
                                                }]}
                                            />
                                        </Grid>
                                    ))
                                }
                            </Grid>
                        </Collapse>
                    </Grid>
                </Grid>
            )}
        </StartInvestigationDateVariablesConsumer>
    );
};

export default ClinicalDetails;
