import React from 'react';
import { format } from 'date-fns';
import { Card, Typography } from '@material-ui/core';

import PrimaryButton from 'commons/Buttons/PrimaryButton/PrimaryButton';

import useStyles from './InteractionsTabStyles';
import useInteractionsTab from './useInteractionsTab';
import NewInteractionEventDialog from './NewInteractionEventDialog/NewInteractionEventDialog';
import { StartInvestigationDateVariablesConsumer } from '../../StartInvestigationDateVariables/StartInvestigationDateVariables';

const InteractionsTab: React.FC = (): JSX.Element => {
    const classes = useStyles({});
    const [newInteractionEventId, setNewInteractionEventId] = React.useState<number>();

    const { getDatesToInvestigate, createNewInteractionEvent, cancleNewInteractionEvent, confirmNewInteractionEvent } = 
        useInteractionsTab({
            setNewInteractionEventId
        });

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
                                <PrimaryButton onClick={() => createNewInteractionEvent(date)}>
                                    צור מקום/מגע
                                </PrimaryButton>
                            </Card>
                            )
                    }
                    {
                        newInteractionEventId && <NewInteractionEventDialog 
                            isOpen={newInteractionEventId !== undefined} 
                            onCancle={cancleNewInteractionEvent}
                            onCreateEvent={confirmNewInteractionEvent}
                            eventId={newInteractionEventId}/>
                    }
                </>
            }
        </StartInvestigationDateVariablesConsumer>
    )
};

export default InteractionsTab;