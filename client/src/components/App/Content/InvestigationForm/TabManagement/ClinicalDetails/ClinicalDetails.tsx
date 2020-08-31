import React from 'react';
import { Grid, Typography, Collapse, TextField } from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';

import { useStyle } from './ClinicalDetailsStyles';
import useClinicalDetails from './useClinicalDetails';
import { StartInvestigationDateVariablesConsumer } from '../../StartInvestiationDateVariables/StartInvestigationDateVariables';

const ClinicalDetails: React.FC = (): JSX.Element => {

    const classes = useStyle();
    
    const [isInIsolation, setIsInIsolation] = React.useState<boolean>(false);
    
    const { isInIsolationToggle } = useClinicalDetails({ isInIsolation, setIsInIsolation });

    return (
        <div>
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
                            <ToggleButtonGroup value={isInIsolation} exclusive onChange={isInIsolationToggle}>
                                <ToggleButton value={true}>
                                    כן
                                </ToggleButton>
                                <ToggleButton value={false}>
                                    לא
                                </ToggleButton>
                            </ToggleButtonGroup>
                            <br />
                            <Collapse style={{display: 'flex', flexDirection:'row'}} in={isInIsolation}>
                                <Typography>
                                    מתאריך: 
                                    <TextField
                                        id="date"
                                        type="date"
                                        defaultValue="2017-05-24"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </Typography>
                                <Typography>
                                    עד: 
                                    <TextField
                                        id="date"
                                        type="date"
                                        defaultValue="2017-05-24"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </Typography>
                            </Collapse>
                        </Grid>
                    </Grid>
                )}
            </StartInvestigationDateVariablesConsumer>
        </div>
    )
}

export default ClinicalDetails;