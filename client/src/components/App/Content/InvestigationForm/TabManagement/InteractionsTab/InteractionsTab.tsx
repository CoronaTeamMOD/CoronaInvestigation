import React from 'react';
import { format } from 'date-fns';
import { Card, Typography, Button } from '@material-ui/core';

import useStyles from './InteractionsTabStyles';
import useInteractionsTab from './useInteractionsTab';
import NewInteractionEventDialog from './NewInteractionEventDialog/NewInteractionEventDialog';
import { StartInvestigationDateVariablesConsumer } from '../../StartInvestigationDateVariables/StartInvestigationDateVariables';

const InteractionsTab: React.FC = (): JSX.Element => {
    const classes = useStyles({});
    const { getDatesToInvestigate } = useInteractionsTab();

    return (
        <StartInvestigationDateVariablesConsumer>
            {
                ctxt =>
                <> 
                    {
                        getDatesToInvestigate(ctxt)
                        .map(date => 
                            <Card key={date.getTime()} className={classes.investigatedDateCard}>
                                <Typography variant='body1'>{format(date, 'dd/MM/yyyy')}</Typography>
                                <Button variant='contained' 
                                color='primary'
                                className={classes.exitInvestigationButton}
                                onClick={() => {}}>
                                    צור מקום/מגע
                                </Button>
                            </Card>
                            )
                    }
                    <NewInteractionEventDialog isOpen={true}/>
                </>
            }
        </StartInvestigationDateVariablesConsumer>
    )
};

export default InteractionsTab;