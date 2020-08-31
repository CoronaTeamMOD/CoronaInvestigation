import React from 'react';
import { Grid } from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';

import useClinicalDetails from './useClinicalDetails';
import { StartInvestigationDateVariablesConsumer } from '../../StartInvestigationDateVariables/StartInvestigationDateVariables';

const ClinicalDetails: React.FC = (): JSX.Element => {
    
    const [isInIsolation, setIsInIsolation] = React.useState<boolean>(false);
    
    const { isInIsolationToggle } = useClinicalDetails({ isInIsolation, setIsInIsolation });

    return (
        <div>
            <StartInvestigationDateVariablesConsumer>
                {ctxt => (
                    <Grid container>
                        <ToggleButtonGroup value={isInIsolation} exclusive onChange={isInIsolationToggle}>
                            <ToggleButton value={true}>
                                כן
                            </ToggleButton>
                            <ToggleButton value={false}>
                                לא
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Grid>
                )}
            </StartInvestigationDateVariablesConsumer>
        </div>
    )
}

export default ClinicalDetails;