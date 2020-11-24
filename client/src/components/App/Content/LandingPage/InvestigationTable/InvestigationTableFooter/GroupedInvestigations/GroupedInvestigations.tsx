import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';

import InvestigationTableRow from 'models/InvestigationTableRow';

import GroupedInvestigationsForm from './GroupedInvestigationsForm/GroupedInvestigationsForm'
import GroupedInvestigationsTable from './GroupedInvestigationsTable/GroupedInvestigationsTable'

const title = 'קיבוץ חקירות'

const GroupedInvestigations: React.FC<Props> = ({ invetigationsToGroup, open, onClose }: Props) => {
    return (
        <form>
            <Dialog open={open}>
                <DialogTitle>
                    <b>
                        {title}
                    </b>
                </DialogTitle>
                <DialogContent>
                    <GroupedInvestigationsTable invetigationsToGroup={invetigationsToGroup} />
                    <GroupedInvestigationsForm />
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={onClose}
                        variant='contained'
                        color='default'
                    >
                        ביטול
                    </Button>
                    <Button
                        type='submit' 
                        form='groupedInvestigations'
                        variant='contained' 
                        color='primary'
                    >
                        אישור
                    </Button>
                </DialogActions>
            </Dialog>
        </form>
    );
};

interface Props {
    open: boolean;
    onClose: () => void;
    invetigationsToGroup: InvestigationTableRow[]
}

export default GroupedInvestigations;
