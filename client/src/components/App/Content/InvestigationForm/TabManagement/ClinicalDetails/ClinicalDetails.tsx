import React from 'react';
import { Grid, Typography, Collapse } from '@material-ui/core';

import Toggle from 'commons/Toggle/Toggle';
import DatePick from 'commons/DatePick/DatePick';
import CustomCheckbox from 'commons/Checkbox/CustomCheckbox';

import { useStyles } from './ClinicalDetailsStyles';
import useClinicalDetails from './useClinicalDetails';
import { StartInvestigationDateVariablesConsumer } from '../../StartInvestiationDateVariables/StartInvestigationDateVariables';

const ClinicalDetails: React.FC = (): JSX.Element => {
    const classes = useStyles();
    
    const [isInIsolation, setIsInIsolation] = React.useState<boolean>(false);
    const [hasSymptoms, setHasSymptoms] = React.useState<boolean>(false);
    const [isUnkonwnDateChecked, setIsUnkonwnDateChecked] = React.useState<boolean>(false);
    
    const { isInIsolationToggle, hasSymptomsToggle } = useClinicalDetails({ isInIsolation, setIsInIsolation, hasSymptoms, setHasSymptoms });

    const handleUnkonwnDateCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsUnkonwnDateChecked(!isUnkonwnDateChecked);
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
                        <Collapse in={hasSymptoms}>
                            <div className={classes.dates}>
                                <DatePick
                                    text={'תאריך התחלת סימפטומים'}
                                />
                            </div>
                            <CustomCheckbox
                                isChecked={isUnkonwnDateChecked}
                                handleCheck={handleUnkonwnDateCheck}
                                text={'תאריך התחלת סימפטומים לא ידוע'}
                            />
                        </Collapse>
                    </Grid>
                </Grid>
            )}
        </StartInvestigationDateVariablesConsumer>
    );
};

export default ClinicalDetails;
