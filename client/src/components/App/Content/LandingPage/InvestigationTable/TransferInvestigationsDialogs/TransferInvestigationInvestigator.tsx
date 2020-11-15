import React, { useState } from 'react';
import { Autocomplete } from '@material-ui/lab';
import { TextField, Typography } from '@material-ui/core';

import InvestigatorOption from 'models/InvestigatorOption';

import useStyles from './TransferDialogsStyles';
import TransferInvestigationDialog from './TransferInvestigationDialog';

const TransferInvestigationDesk = (props: Props) => {

    const { allInvestigators, open, onClose, onConfirm } = props;

    const [transferInvestigator, setTransferInvestigator] = useState<InvestigatorOption>();
    const [transferReason, setTransferReason] = useState<string>();

    const onSelectedInvestigatorChange = (event: React.ChangeEvent<{}>, selectedInvestigator: InvestigatorOption | null) => setTransferInvestigator(selectedInvestigator || undefined)

    const onTransferReasonChange = (event: React.ChangeEvent<HTMLInputElement>) => setTransferReason(event.target.value)

    const onDialogConfirm = () => onConfirm(transferInvestigator, transferReason || '')

    const classes = useStyles();

    return (
        <TransferInvestigationDialog open={open} onClose={onClose} onConfirm={onDialogConfirm}>
            <>
                <div className={classes.inputRow}>
                    <Typography>למי להעביר?</Typography>
                    <Autocomplete
                        className={classes.input}
                        options={allInvestigators}
                        getOptionLabel={(option) => option.value.userName}
                        inputValue={transferInvestigator?.value.userName || ''}
                        onChange={onSelectedInvestigatorChange}
                        onInputChange={(event, selectedInvestigatorName) => {
                            if (event?.type !== 'blur' && selectedInvestigatorName) {
                                onSelectedInvestigatorChange(event, null);
                            }
                        }}
                        renderInput={(params) =>
                            <TextField
                                {...params}
                                placeholder='בחר חוקר'
                            />
                        }
                    />
                </div>
                <div className={classes.inputRow}>
                    <Typography>סיבת העברה:</Typography>
                    <TextField
                        placeholder='כתוב סיבה'
                        className={classes.input}
                        test-id='transfer-reason'
                        value={transferReason}
                        onChange={onTransferReasonChange}
                    />
                </div>
            </>
        </TransferInvestigationDialog>
    )
}

interface Props {
    open: boolean;
    allInvestigators: InvestigatorOption[];
    onClose: () => void;
    onConfirm: (updatedIvestigator: InvestigatorOption | undefined, transferReason: string) => void;
}

export default TransferInvestigationDesk;