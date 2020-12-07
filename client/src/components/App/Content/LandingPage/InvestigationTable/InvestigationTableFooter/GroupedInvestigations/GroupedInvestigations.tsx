import React from 'react';
import { yupResolver } from '@hookform/resolvers';
import { useForm, FormProvider } from 'react-hook-form';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip } from '@material-ui/core';

import InvestigationTableRow from 'models/InvestigationTableRow';

import useGroupedInvestigations, { GroupForm } from './useGroupedInvestigations';
import validationSchema from './GroupedInvestigationsForm/GroupedInvestigationsSchema';
import GroupedInvestigationsForm from './GroupedInvestigationsForm/GroupedInvestigationsForm';
import GroupedInvestigationsTable from './GroupedInvestigationsTable/GroupedInvestigationsTable';
import GroupedInvestigationsFields from './GroupedInvestigationsForm/GroupedInvestigationsFields';
const title = 'קיבוץ חקירות'

const GroupedInvestigations: React.FC<Props> = ({ invetigationsToGroup, open, onClose, fetchTableData }: Props) => {
    const groupedInvestigation: InvestigationTableRow | undefined = invetigationsToGroup
        .find((investigation: InvestigationTableRow) => investigation.groupId !== null);
    const methods = useForm<GroupForm>({
        mode: 'all',
        resolver: yupResolver(validationSchema),
        defaultValues: {
            [GroupedInvestigationsFields.REASON]: groupedInvestigation ?
                { displayName: groupedInvestigation.groupReason, id: groupedInvestigation.reasonId } : null,
            [GroupedInvestigationsFields.OTHER_REASON]: groupedInvestigation ? groupedInvestigation.otherReason : ''
        }
    });

    const { onSubmit } = useGroupedInvestigations({ invetigationsToGroup, onClose, fetchTableData });

    return (
        <Dialog open={open}>
            <DialogTitle>
                <b>
                    {title}
                </b>
            </DialogTitle>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                    <DialogContent>
                        <GroupedInvestigationsTable invetigationsToGroup={invetigationsToGroup} />
                        <GroupedInvestigationsForm shouldDisable={Boolean(groupedInvestigation)} />
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={onClose}
                            variant='contained'
                            color='default'
                        >
                            ביטול
                        </Button>
                        <Tooltip title={!methods.formState.isValid ? 'יש לבחור סיבה' : ''}>
                            <span>
                                <Button
                                    type='submit'
                                    disabled={!methods.formState.isValid}
                                    variant='contained'
                                    color='primary'
                                >
                                    אישור
                                </Button>
                            </span>
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
    invetigationsToGroup: InvestigationTableRow[];
    fetchTableData: () => void;
}

export default GroupedInvestigations;
