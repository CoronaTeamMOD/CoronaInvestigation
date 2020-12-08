import React, { useEffect, useMemo } from 'react';
import { yupResolver } from '@hookform/resolvers';
import { useForm, FormProvider } from 'react-hook-form';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip } from '@material-ui/core';

import InvestigationTableRow from 'models/InvestigationTableRow';

import useGroupedInvestigations, { GroupForm } from './useGroupedInvestigations';
import validationSchema from './GroupedInvestigationsForm/GroupedInvestigationsSchema';
import GroupedInvestigationsForm from './GroupedInvestigationsForm/GroupedInvestigationsForm';
import GroupedInvestigationsTable from './GroupedInvestigationsTable/GroupedInvestigationsTable';
import GroupedInvestigationsFields from './GroupedInvestigationsForm/GroupedInvestigationsFields';

const GroupedInvestigations: React.FC<Props> = ({ invetigationsToGroup, open, onClose }: Props) => {

    const groupedInvestigation = invetigationsToGroup.find((investigation: InvestigationTableRow) => investigation.groupId !== null);
    const title = groupedInvestigation ? 'הוספת חקירות לקיבוץ' : 'קיבוץ חקירות'

    const methods = useForm<GroupForm>({
        mode: 'all',
        resolver: yupResolver(validationSchema),
        defaultValues: {
            [GroupedInvestigationsFields.REASON]: groupedInvestigation ?
                { displayName: groupedInvestigation.groupReason, id: groupedInvestigation.reasonId } : null,
            [GroupedInvestigationsFields.OTHER_REASON]: groupedInvestigation ? groupedInvestigation.otherReason : ''
        }
    });

    useEffect(() => {
        methods.reset({
            [GroupedInvestigationsFields.REASON]: groupedInvestigation ?
                { displayName: groupedInvestigation.groupReason, id: groupedInvestigation.reasonId } : null,
            [GroupedInvestigationsFields.OTHER_REASON]: groupedInvestigation ? groupedInvestigation.otherReason : ''
        })
    }, [groupedInvestigation])

    const { onSubmit } = useGroupedInvestigations({ invetigationsToGroup, onClose });

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
}

export default GroupedInvestigations;
