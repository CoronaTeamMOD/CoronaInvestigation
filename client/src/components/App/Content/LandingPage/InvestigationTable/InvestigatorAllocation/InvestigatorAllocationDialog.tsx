import { SweetAlertResult } from 'sweetalert2';
import React, { useEffect, useMemo, useState } from 'react';
import { Button, Collapse, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip } from '@material-ui/core';

import InvestigatorOption from 'models/InvestigatorOption';
import { setIsLoading } from 'redux/IsLoading/isLoadingActionCreators';

import useStyles from './InvestigatorAllocationDialogStyles';
import InvestigatorsTable from './InvestigatorsTable/InvestigatorsTable';
import TransferInvestigationDialogNote from '../InvestigationTableFooter/TransferInvestigationsDialogs/TransferInvestigationDialogNote';

const unSelectedRow = '';
export const investigatorAllocationTitle = 'הקצאת חקירה';

const InvestigatorAllocationDialog: React.FC<Props> = (props) => {

    const { isOpen, handleCloseDialog, fetchInvestigators, allocateInvestigationToInvestigator, groupIds, epidemiologyNumbers, onSuccess, isGroupedContact } = props;

    const [investigatorToAllocateId, setInvestigatorToAllocateId] = useState<string>('');
    const [allInvestigators, setAllInvestigators] = useState<InvestigatorOption[] | undefined>(undefined);
    const [selectedInvestigator, setSelectedInvestigator] = useState<InvestigatorOption | undefined>(undefined);

    const classes = useStyles();

    const shouldButtonDisabled: boolean = useMemo(() => {
        return investigatorToAllocateId === unSelectedRow;
    }, [investigatorToAllocateId]);

    useEffect(() => {
        if (investigatorToAllocateId !== unSelectedRow && allInvestigators){
            setSelectedInvestigator(allInvestigators.find(investigator => investigator.id === investigatorToAllocateId))
        }
    }, [investigatorToAllocateId]);

    const closeDialog = () => {
        setInvestigatorToAllocateId(unSelectedRow);
        handleCloseDialog();
    };

    const loadInvestigators = () => {
        setIsLoading(true);
        fetchInvestigators().then((investigators) => {
            setAllInvestigators(investigators)
        }).finally(() => setIsLoading(false))
    };

    const handleClick = () => {
        if (selectedInvestigator) {
            allocateInvestigationToInvestigator(groupIds, epidemiologyNumbers, selectedInvestigator);
            onSuccess();
            closeDialog();
        }
    };

    return (
        <Dialog open={isOpen} fullWidth={true} maxWidth='md' classes={{ paper: classes.dialog }}
            onClose={() => closeDialog()}
            onEnter={() => loadInvestigators()}
        >
            <DialogTitle id='investigator-allocation-title'>
                <b>
                    {investigatorAllocationTitle}
                </b>
            </DialogTitle>
            <DialogContent>
                <Collapse in={allInvestigators !== undefined}>
                    <InvestigatorsTable
                        investigators={allInvestigators ? allInvestigators.map((investigator: InvestigatorOption) => investigator.value) : []}
                        selectedRow={investigatorToAllocateId}
                        setSelectedRow={setInvestigatorToAllocateId}
                    />
                </Collapse>
            </DialogContent>
            <TransferInvestigationDialogNote isGroupedContact={isGroupedContact}/>
            <DialogActions>
                <Button
                    id='cancel-button'
                    variant='contained'
                    color='default'
                    onClick={(event) => {
                        event.stopPropagation();
                        closeDialog();
                    }}
                >
                    ביטול
                </Button>
                <Tooltip title={shouldButtonDisabled ? 'לא נבחר חוקר' : ''}>
                    <span id='tool-tip'> {/* The span role is to wrap the button to make sure the tooltip work properly even if the button is disabled */}
                        <Button
                            id='submit-button'
                            form='investigatorAllocation'
                            variant='contained'
                            color='primary'
                            disabled={shouldButtonDisabled}
                            onClick={handleClick}
                        >
                            אישור
                        </Button>
                    </span>
                </Tooltip>
            </DialogActions>
        </Dialog>
    );
};

interface Props {
    isOpen: boolean;
    handleCloseDialog: () => void;
    fetchInvestigators: () => Promise<InvestigatorOption[]>;
    allocateInvestigationToInvestigator: (groupIds: string[], epidemiologyNumbers: number[], investigatorToAllocate: InvestigatorOption) => void;
    groupIds: string[];
    epidemiologyNumbers: number[];
    onSuccess: () => Promise<SweetAlertResult<any>>;
    isGroupedContact: boolean;
};

export default InvestigatorAllocationDialog;