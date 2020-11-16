import React, { useState } from 'react';
import { Autocomplete } from '@material-ui/lab';
import { yupResolver } from '@hookform/resolvers';
import { TextField, Typography } from '@material-ui/core';
import { FormProvider, Controller, useForm } from 'react-hook-form';

import Desk from 'models/Desk';

import useStyles from './TransferDialogsStyles';
import validationSchema from './TransferInvestigationDeskSchema';
import TransferInvestigationDialog from './TransferInvestigationDialog';
import TransferInvestigationDeskInputsNames from './TransferInvestigationDeskInputsNames';

const defaultDesk : Desk = {id: -1, deskName: ''};
const defaultValues = {
    [TransferInvestigationDeskInputsNames.DESK]: null,
    [TransferInvestigationDeskInputsNames.REASON]: ''
}

const tranferDeskFormName = 'transferDesk';

const TransferInvestigationDesk = (props: Props) => {

    const { allDesks, open, onClose, onConfirm } = props;

    const [transferDesk, setTransferDesk] = useState<Desk>(defaultDesk);
    const [transferReason, setTransferReason] = useState<string>();

    const methods = useForm({
        mode: 'all',
        resolver: yupResolver(validationSchema),
        defaultValues
    })

    const onDialogConfirm = () => (
        methods.handleSubmit((data) => {
            onConfirm(data[TransferInvestigationDeskInputsNames.DESK], data[TransferInvestigationDeskInputsNames.REASON] || '');
        })()
    );

    const classes = useStyles();

    const isDataValid = React.useMemo<boolean>(() => (
        validationSchema.isValidSync(methods.getValues())
    ), [methods.getValues()]);

    return (
        <FormProvider {...methods}>
            <TransferInvestigationDialog 
                formName={tranferDeskFormName} 
                title='העברת חקירות' 
                isConfirmDisabled={!isDataValid} 
                open={open} 
                onClose={onClose} 
                onConfirm={onDialogConfirm}
            >
                <>
                    <div className={classes.inputRow}>
                        <Typography>לאן להעביר?</Typography>
                        <Controller
                            name={TransferInvestigationDeskInputsNames.DESK}
                            control={methods.control}
                            render={(props) => 
                                <Autocomplete
                                    className={classes.input}
                                    options={allDesks}
                                    getOptionLabel={(option) => option ? option.deskName : option}
                                    value={props.value}
                                    onChange={(event, selectedDesk) => {
                                        props.onChange(selectedDesk ? selectedDesk : null)
                                    }}
                                    onBlur={props.onBlur}
                                    renderInput={(params) =>
                                        <TextField
                                            {...params}
                                            test-id='transfer-desk'
                                            placeholder='בחר דסק'
                                            error={methods.errors[TransferInvestigationDeskInputsNames.DESK]}
                                            label={methods.errors[TransferInvestigationDeskInputsNames.DESK]?.message || 'בחר דסק'}
                                        />
                                    }
                                />
                            }
                        />
                    </div>
                    <div className={classes.inputRow}>
                        <Typography>סיבת העברה:</Typography>
                        <Controller
                            name={TransferInvestigationDeskInputsNames.REASON}
                            control={methods.control}
                            render={(props) => 
                                <TextField
                                    placeholder='כתוב סיבה'
                                    className={classes.input}
                                    test-id='transfer-reason'
                                    value={transferReason}
                                    error={methods.errors[TransferInvestigationDeskInputsNames.REASON]}
                                    label={methods.errors[TransferInvestigationDeskInputsNames.REASON]?.message || 'כתוב סיבה'}
                                    onChange={(event) => props.onChange(event.target.value)}
                                />
                            }
                        />
                    </div>
                </>
            </TransferInvestigationDialog>
        </FormProvider>
    )
}

interface Props {
    open: boolean;
    allDesks: Desk[];
    onClose: () => void;
    onConfirm: (updatedDesk: Desk, transferReason: string) => void;
}

export default TransferInvestigationDesk;