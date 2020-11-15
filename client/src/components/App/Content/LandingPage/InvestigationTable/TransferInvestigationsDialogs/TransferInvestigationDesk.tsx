import React, { useState } from 'react';
import { Autocomplete } from '@material-ui/lab';
import { TextField, Typography } from '@material-ui/core';

import Desk from 'models/Desk';

import useStyles from './TransferDialogsStyles';
import TransferInvestigationDialog from './TransferInvestigationDialog';

const defaultDesk : Desk = {id: -1, deskName: ''};

const TransferInvestigationDesk = (props: Props) => {

    const { allDesks, open, onClose, onConfirm } = props;

    const [transferDesk, setTransferDesk] = useState<Desk>(defaultDesk);
    const [transferReason, setTransferReason] = useState<string>();

    const onSelectedDeskChange = (event: React.ChangeEvent<{}>, selectedDesk: Desk | null) => setTransferDesk(selectedDesk || defaultDesk)

    const onTransferReasonChange = (event: React.ChangeEvent<HTMLInputElement>) => setTransferReason(event.target.value)

    const onDialogConfirm = () => onConfirm(transferDesk, transferReason || '')

    const classes = useStyles();

    return (
        <TransferInvestigationDialog open={open} onClose={onClose} onConfirm={onDialogConfirm}>
            <>
                <div className={classes.inputRow}>
                    <Typography>לאן להעביר?</Typography>
                    <Autocomplete
                        className={classes.input}
                        options={allDesks}
                        getOptionLabel={(option) => option.deskName}
                        onChange={onSelectedDeskChange}
                        value={transferDesk}
                        renderInput={(params) =>
                            <TextField
                                placeholder='בחר דסק'
                                test-id='transfer-desk'
                                {...params}
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
    allDesks: Desk[];
    onClose: () => void;
    onConfirm: (updatedDesk: Desk, transferReason: string) => void;
}

export default TransferInvestigationDesk;