import React, { useMemo, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip } from '@material-ui/core';

import theme from 'styles/theme';
import InvestigatorOption from 'models/InvestigatorOption';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';

import useStyles from './InvestigatorAllocationDialogStyles';
import InvestigatorsTable from './InvestigatorsTable/InvestigatorsTable';
import TransferInvestigationDialogNote from '../InvestigationTableFooter/TransferInvestigationsDialogs/TransferInvestigationDialogNote';

const title = 'הקצאת חקירה';
const unSelectedRow = -1;

const InvestigatorAllocationDialog: React.FC<Props> = (props) => {

    const { isOpen, setIsOpen, investigators, allocateInvestigationToInvestigator, groupIds, epidemiologyNumbers } = props;

    const [investigatorToAllocateIndex, setInvestigatorToAllocateIndex] = useState<number>(unSelectedRow);

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
        message += `לחוקר <b>${investigators[investigatorToAllocateIndex].value.userName}</b>?</p>`;
        return message;     
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
            if (result.value) {
                allocateInvestigationToInvestigator(groupIds, epidemiologyNumbers, investigators[investigatorToAllocateIndex]);
                setIsOpen(false);
            }
        })
    }
    
    return (
        <Dialog open={isOpen} maxWidth='md' classes={{paper: classes.dialog}} onClose={() => setIsOpen(false)}>
            <DialogTitle>
                <b>
                    {title}
                </b>
            </DialogTitle>
            <DialogContent>
                <InvestigatorsTable 
                    investigators={investigators.map((investigator: InvestigatorOption) => investigator.value)}
                    selectedRow={investigatorToAllocateIndex}
                    setSelectedRow={setInvestigatorToAllocateIndex}
                />
            </DialogContent>
            <TransferInvestigationDialogNote />
            <DialogActions>
                <Button
                    variant='contained'
                    color='default'
                    onClick={(event) => {
                        event.stopPropagation();
                        setIsOpen(false)
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
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    investigators: InvestigatorOption[];
    allocateInvestigationToInvestigator: (groupId: string[], epidemiologyNumber: number[], investigatorToAllocate: InvestigatorOption) => void;
    groupIds: string[];
    epidemiologyNumbers: number[];
}

export default InvestigatorAllocationDialog;
