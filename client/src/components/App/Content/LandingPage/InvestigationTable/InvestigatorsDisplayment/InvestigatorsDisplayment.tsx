import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';

import InvestigatorOption from 'models/InvestigatorOption';

import InvestigatorsTable from './InvestigatorsTable/InvestigatorsTable';

const title = 'הקצאת חקירה';

const InvestigatorsDisplayment: React.FC<Props> = ({ investigators }) => {
    return (
        <Dialog open={true}>
            <DialogTitle>
                <b>
                    {title}
                </b>
            </DialogTitle>
            <DialogContent>
                <InvestigatorsTable 
                    investigators={investigators.map((investigator: InvestigatorOption) => investigator.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button
                    variant='contained'
                    color='default'
                >
                    ביטול
                </Button>    
                <Button
                    type='submit'
                    variant='contained'
                    color='primary'
                >
                    אישור
                </Button>         
            </DialogActions>
        </Dialog>
    );
};

interface Props {
    investigators: InvestigatorOption[];
}

export default InvestigatorsDisplayment;
