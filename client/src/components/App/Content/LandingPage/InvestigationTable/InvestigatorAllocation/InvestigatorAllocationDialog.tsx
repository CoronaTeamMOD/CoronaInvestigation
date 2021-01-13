import { SweetAlertResult } from 'sweetalert2';
import React, { useMemo, useState } from 'react';
import { Button, Collapse, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip } from '@material-ui/core';

import theme from 'styles/theme';
import InvestigatorOption from 'models/InvestigatorOption';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import { get } from 'Utils/auxiliaryFunctions/auxiliaryFunctions';
import { setIsLoading } from 'redux/IsLoading/isLoadingActionCreators';

import useStyles from './InvestigatorAllocationDialogStyles';
import InvestigatorsTable from './InvestigatorsTable/InvestigatorsTable';
import TransferInvestigationDialogNote from '../InvestigationTableFooter/TransferInvestigationsDialogs/TransferInvestigationDialogNote';
import { TableHeadersNames } from './InvestigatorsTable/InvestigatorsTableHeaders';

const title = 'הקצאת חקירה';
const unSelectedRow = -1;

const InvestigatorAllocationDialog: React.FC<Props> = (props) => {

    const { isOpen, handleCloseDialog, fetchInvestigators, allocateInvestigationToInvestigator, groupIds, epidemiologyNumbers, onSuccess } = props;

    const [investigatorToAllocateIndex, setInvestigatorToAllocateIndex] = useState<number>(unSelectedRow);
    const [allInvestigators, setAllInvestigators] = useState<InvestigatorOption[] | undefined>(undefined);
    const classes = useStyles();
    const { alertWarning } = useCustomSwal();

    const shouldButtonDisabled: boolean = useMemo(() => {
        return investigatorToAllocateIndex === unSelectedRow;
    }, [investigatorToAllocateIndex])

    const createAlertMessage = () => {
        let message = '<p>האם אתה בטוח שתרצה להעביר ';
        if ((groupIds.length && groupIds[0]) || epidemiologyNumbers.length > 1) {
            message += 'את כל החקירות ';
        } else if (epidemiologyNumbers.length === 1) {
            message += `את חקירה מספר <b>${epidemiologyNumbers[0]}</b> `;
        }
        message += allInvestigators && `לחוקר <b>${get(allInvestigators[investigatorToAllocateIndex].value, TableHeadersNames.userName)}</b>?</p>`;
        return message;
    }

    const closeDialog = () => {
        setInvestigatorToAllocateIndex(unSelectedRow);
        handleCloseDialog();
    }

    const loadInvestigators = () => {
        setIsLoading(true);
        fetchInvestigators().then((investigators) => {
            setAllInvestigators(investigators)
        }).finally(() => setIsLoading(false))
    }

    const handleClick = () => {
        const alertMessage = createAlertMessage();
        alertWarning(alertMessage, {
            showCancelButton: true,
            cancelButtonText: 'בטל',
            cancelButtonColor: theme.palette.error.main,
            confirmButtonColor: theme.palette.primary.main,
            confirmButtonText: 'כן, המשך',
        })
            .then(result => {
                if (result.value && allInvestigators) {
                    allocateInvestigationToInvestigator(groupIds, epidemiologyNumbers, allInvestigators[investigatorToAllocateIndex]);
                    onSuccess();
                    closeDialog();
                }
            })
    }

    return (
        <Dialog open={isOpen} fullWidth={true} maxWidth='md' classes={{ paper: classes.dialog }}
            onClose={() => closeDialog()}
            onEnter={() => loadInvestigators()}
        >
            <DialogTitle>
                <b>
                    {title}
                </b>
            </DialogTitle>
            <DialogContent>
                <Collapse in={allInvestigators !== undefined}>
                    <InvestigatorsTable
                        investigators={allInvestigators ? allInvestigators.map((investigator: InvestigatorOption) => investigator.value) : []}
                        selectedRow={investigatorToAllocateIndex}
                        setSelectedRow={setInvestigatorToAllocateIndex}
                    />
                </Collapse>
            </DialogContent>
            <TransferInvestigationDialogNote />
            <DialogActions>
                <Button
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
                    <span> {/* The span role is to wrap the button to make sure the tooltip work properly even if the button is disabled */}
                        <Button
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
    onSuccess: () => Promise<SweetAlertResult<any>>
}

export default InvestigatorAllocationDialog;
