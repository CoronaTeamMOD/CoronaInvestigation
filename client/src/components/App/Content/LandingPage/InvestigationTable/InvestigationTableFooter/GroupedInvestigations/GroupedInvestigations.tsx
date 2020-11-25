import React from 'react';
import { yupResolver } from '@hookform/resolvers';
import { useForm, FormProvider } from 'react-hook-form';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip } from '@material-ui/core';

import InvestigationTableRow from 'models/InvestigationTableRow';

import validationSchema from './GroupedInvestigationsForm/GroupedInvestigationsSchema';
import GroupedInvestigationsForm from './GroupedInvestigationsForm/GroupedInvestigationsForm';
import GroupedInvestigationsTable from './GroupedInvestigationsTable/GroupedInvestigationsTable';
import GroupedInvestigationsFields from './GroupedInvestigationsForm/GroupedInvestigationsFields';

const title = 'קיבוץ חקירות'

const GroupedInvestigations: React.FC<Props> = ({ invetigationsToGroup, open, onClose }: Props) => {

    const methods = useForm({
        mode: 'all',
        resolver: yupResolver(validationSchema),
        defaultValues: {
            [GroupedInvestigationsFields.REASON]: null,
            [GroupedInvestigationsFields.OTHER_REASON]: ''
        }
    });

    return (
        <Dialog open={open}>
            <DialogTitle>
                <b>
                    {title}
                </b>
            </DialogTitle>
            <FormProvider {...methods}>
                <form>
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
                        <Tooltip open={!methods.formState.isValid} title='יש לבחור סיבה'>
                            <Button
                                disabled={!methods.formState.isValid}
                                variant='contained' 
                                color='primary'
                            >
                                אישור
                            </Button>
                        </Tooltip>
                    </DialogActions>
                </form>
            </FormProvider>
        </Dialog>
    );
};

interface Props {
    open: boolean;
    onClose: () => void;
    invetigationsToGroup: InvestigationTableRow[]
}

export default GroupedInvestigations;
