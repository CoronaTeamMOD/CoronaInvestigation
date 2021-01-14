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

const GroupedInvestigations: React.FC<Props> = (props: Props) => {

    const { open, investigationsToGroup, allGroupedInvestigations, onClose, fetchTableData, fetchInvestigationsByGroupId } = props

    const methods = useForm<GroupForm>({
        mode: 'all',
        resolver: yupResolver(validationSchema),
        defaultValues: {
            [GroupedInvestigationsFields.REASON]: null,
            [GroupedInvestigationsFields.OTHER_REASON]: ''
        }
    });
    
    const groupedInvestigation = useMemo(() => {
        return investigationsToGroup.find((investigation: InvestigationTableRow) => investigation.groupId);
    }, [investigationsToGroup]);
    
    const title = groupedInvestigation ? 'הוספת חקירות לקיבוץ' : 'קיבוץ חקירות'

    const investigationsToDisplay: InvestigationTableRow[] = useMemo(() => {
        if (groupedInvestigation) {
            const groupedInvestigations = allGroupedInvestigations.get(groupedInvestigation.groupId);
            const investigationsWithoutGroupIds = investigationsToGroup.filter(
                (investigation: InvestigationTableRow) => !investigation.groupId
            );
            const investigationsToDisplayUpdateMode = groupedInvestigations && groupedInvestigations.concat(investigationsWithoutGroupIds);
            return investigationsToDisplayUpdateMode ? investigationsToDisplayUpdateMode : [];
        } else {
            return investigationsToGroup;
        }
    }, [groupedInvestigation, investigationsToGroup, allGroupedInvestigations]);

    useEffect(() => {
        if (groupedInvestigation) {
            methods.reset({
                [GroupedInvestigationsFields.REASON]: { displayName: groupedInvestigation?.groupReason, id: groupedInvestigation?.reasonId },
                [GroupedInvestigationsFields.OTHER_REASON]: groupedInvestigation?.otherReason
            })
        }
    }, [groupedInvestigation])

    const { onSubmit } = useGroupedInvestigations({ investigationsToGroup, onClose, fetchTableData, fetchInvestigationsByGroupId});

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
                        <GroupedInvestigationsTable investigations={investigationsToDisplay} />
                        <GroupedInvestigationsForm shouldDisable={groupedInvestigation !== undefined} />
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
    investigationsToGroup: InvestigationTableRow[];
    allGroupedInvestigations: Map<string, InvestigationTableRow[]>
    onClose: () => void;
    fetchTableData: () => void;
    fetchInvestigationsByGroupId: (groupId: string) => void;
}

export default GroupedInvestigations;
