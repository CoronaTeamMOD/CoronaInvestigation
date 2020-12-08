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

    const { open, invetigationsToGroup, allGroupedInvestigations, onClose, fetchTableData, fetchInvestigationsByGroupId } = props

    const methods = useForm<GroupForm>({
        mode: 'all',
        resolver: yupResolver(validationSchema),
        defaultValues: {
            [GroupedInvestigationsFields.REASON]: null,
            [GroupedInvestigationsFields.OTHER_REASON]: ''
        }
    });
    
    const groupedInvestigation = useMemo(() => {
        return invetigationsToGroup.find((investigation: InvestigationTableRow) => investigation.groupId);
    }, [invetigationsToGroup]);
    
    const title = groupedInvestigation ? 'הוספת חקירות לקיבוץ' : 'קיבוץ חקירות'

    const investigationsToDisplay: InvestigationTableRow[] = useMemo(() => {
        if (groupedInvestigation) {
            const groupedInvestigations = allGroupedInvestigations.get(groupedInvestigation.groupId)
                ?.filter((investigation: InvestigationTableRow) => investigation.epidemiologyNumber !== groupedInvestigation.epidemiologyNumber);
            const investigationsToDisplayUpdateMode = groupedInvestigations && invetigationsToGroup.concat(groupedInvestigations);
            return investigationsToDisplayUpdateMode ? investigationsToDisplayUpdateMode: [];
        } else {
            return invetigationsToGroup;
        }
    }, [groupedInvestigation, invetigationsToGroup, allGroupedInvestigations])

    useEffect(() => {
        if (groupedInvestigation) {
            methods.reset({
                [GroupedInvestigationsFields.REASON]: { displayName: groupedInvestigation?.groupReason, id: groupedInvestigation?.reasonId },
                [GroupedInvestigationsFields.OTHER_REASON]: groupedInvestigation?.otherReason
            })
        }
    }, [groupedInvestigation])

    const { onSubmit } = useGroupedInvestigations({ invetigationsToGroup, onClose, fetchTableData, fetchInvestigationsByGroupId});

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
                        <GroupedInvestigationsTable investigationsToDisplay={investigationsToDisplay} />
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
    invetigationsToGroup: InvestigationTableRow[];
    allGroupedInvestigations: Map<string, InvestigationTableRow[]>
    onClose: () => void;
    fetchTableData: () => void;
    fetchInvestigationsByGroupId: (groupId: string) => void;
}

export default GroupedInvestigations;
