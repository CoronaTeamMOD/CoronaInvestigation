import React from 'react';
import { Grid, Typography, Collapse } from '@material-ui/core';

import { Symptom } from 'models/Symptom';
import Toggle from 'commons/Toggle/Toggle';
import DatePick from 'commons/DatePick/DatePick';
import CustomCheckbox from 'commons/Checkbox/CustomCheckbox';

import { useStyles } from './ClinicalDetailsStyles';
import useClinicalDetails from './useClinicalDetails';
import { StartInvestigationDateVariablesConsumer } from '../../StartInvestiationDateVariables/StartInvestigationDateVariables';

const ClinicalDetails: React.FC = (): JSX.Element => {
    const classes = useStyles();

    const symptomss: Symptom[] = [
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
    ];

    const [isInIsolation, setIsInIsolation] = React.useState<boolean>(false);
    const [hasSymptoms, setHasSymptoms] = React.useState<boolean>(false);
    const [isUnkonwnDateChecked, setIsUnkonwnDateChecked] = React.useState<boolean>(false);
    const [symptoms, setSymptoms] = React.useState<Symptom[]>(symptomss);

    const { isInIsolationToggle, hasSymptomsToggle } = useClinicalDetails({ isInIsolation, setIsInIsolation, hasSymptoms, setHasSymptoms });

    const handleUnkonwnDateCheck = () => {
        setIsUnkonwnDateChecked(!isUnkonwnDateChecked);
    };

    const handleSymptonCheck = (symptom: Symptom) => {
        console.log(symptom)
        let i = [...symptoms];
        i[symptom.id].isChecked = !i[symptom.id].isChecked
        setSymptoms(i);
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
                            toggleValue={isInIsolation}
                            toggleChangeFunc={isInIsolationToggle}
                        />
                    </Grid>
                    <Grid item xs={2}>
                    </Grid>
                    <Grid item xs={10}>
                        <Collapse in={isInIsolation}>
                            <div className={classes.dates}>
                                <DatePick
                                    text={'מתאריך'}
                                />
                                <DatePick
                                    text={'עד'}
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
                            toggleValue={hasSymptoms}
                            toggleChangeFunc={hasSymptomsToggle}
                        />
                    </Grid>
                    <Grid item xs={2}>
                    </Grid>
                    <Grid item xs={10}>
                        <Collapse in={hasSymptoms}>
                            <div className={classes.dates}>
                                <DatePick
                                    text={'תאריך התחלת סימפטומים'}
                                />
                                <CustomCheckbox
                                    isChecked={isUnkonwnDateChecked}
                                    handleCheck={() => handleUnkonwnDateCheck()}
                                    text={'תאריך התחלת סימפטומים לא ידוע'}
                                />
                            </div>
                            <Typography>סימפטומים:</Typography>
                            <Grid container className={classes.smallGrid}>
                                {
                                    symptoms.map((symptom: Symptom) => (
                                        <Grid item xs={6}>
                                            <CustomCheckbox
                                                key={symptom.id}
                                                isChecked={symptom.isChecked}
                                                handleCheck={() => handleSymptonCheck(symptom)}
                                                text={symptom.name}
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
