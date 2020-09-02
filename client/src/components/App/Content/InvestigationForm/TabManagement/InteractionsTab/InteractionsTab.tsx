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
    const [newInteractionEventDate, setNewInteractionEventDate] = React.useState<Date>();

    const { getDatesToInvestigate } = useInteractionsTab();

    const onDateClick = (date: Date) => setNewInteractionEventDate(date);
    const onDialogClose = () => setNewInteractionEventDate(undefined);

    return (
        <StartInvestigationDateVariablesConsumer>
            {
                ctxt =>
                <> 
                    {
                        getDatesToInvestigate(ctxt)
                        .map((date: Date) => 
                            <Card key={date.getTime()} className={classes.investigatedDateCard}>
                                <Typography variant='body1'>{format(date, 'dd/MM/yyyy')}</Typography>
                                <PrimaryButton onClick={() => onDateClick(date)}>
                                    צור מקום/מגע
                                </PrimaryButton>
                            </Card>
                            )
                    }
                    {
                        newInteractionEventDate && <NewInteractionEventDialog 
                            isOpen={newInteractionEventDate !== undefined} 
                            closeDialog={onDialogClose}/>
                    }
                </>
            }
        </StartInvestigationDateVariablesConsumer>
    )
};

export default InteractionsTab;