import React, {useEffect, useState} from 'react';
import { SweetAlertResult } from 'sweetalert2';
import { Autocomplete } from '@material-ui/lab';
import { yupResolver } from '@hookform/resolvers';
import { FormProvider, Controller, useForm } from 'react-hook-form';
import { Button, DialogActions, TextField, Typography } from '@material-ui/core';

import Desk from 'models/Desk';

import useStyles from './TransferDialogsStyles';
import validationSchema from './TransferInvestigationDeskSchema';
import TransferInvestigationDialogNote from './TransferInvestigationDialogNote';
import TransferInvestigationInputsNames from './TransferInvestigationInputsNames';
import { useSelector } from 'react-redux';
import StoreStateType from 'redux/storeStateType';
import KeyValuePair from 'models/KeyValuePair';
import { TransferReasonCodes } from 'models/enums/TransferReasonCodes';

const defaultValues = {
    [TransferInvestigationInputsNames.DESK]: null,
    [TransferInvestigationInputsNames.REASON]: null,
    [TransferInvestigationInputsNames.OTHER_REASON]: ''
}

const tranferDeskFormName = 'transferDesk';

const TransferInvestigationDesk = (props: Props) => {

    const { allDesks, onClose, onConfirm, onSuccess, isGroupedContact } = props;
    const [allowGroupedContactAlert, setAllowGroupedContactAlert] = useState<boolean>(false);

    const classes = useStyles();

    const methods = useForm({
        mode: 'all',
        resolver: yupResolver(validationSchema),
        defaultValues
    });
    
    const allTransferReasons = useSelector<StoreStateType, KeyValuePair[]>(state => state.transferReason);
    const [selectedTransferReason, setSelectedTransferReason] = useState<KeyValuePair|null>(null);
    const onDialogConfirm = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        methods.handleSubmit((data) => {
            onConfirm(data[TransferInvestigationInputsNames.DESK], data[TransferInvestigationInputsNames.REASON], data[TransferInvestigationInputsNames.OTHER_REASON] || '');
            onSuccess();
            onClose();
        })()
    };

    return (
        <FormProvider {...methods}>
            <form id={tranferDeskFormName} onSubmit={(event) => onDialogConfirm(event)}>
                <div className={classes.inputRow}>
                    <Typography>לאן להעביר?</Typography>
                    <Controller
                        name={TransferInvestigationInputsNames.DESK}
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
                                        error={methods.errors[TransferInvestigationInputsNames.DESK]}
                                        label={methods.errors[TransferInvestigationInputsNames.DESK]?.message || 'בחר דסק'}
                                    />
                                }
                            />
                        }
                    />
                </div>
                <div className={classes.inputRow}>
                    <Typography>סיבת העברה:</Typography>
                    <Controller
                        name={TransferInvestigationInputsNames.REASON}
                        control={methods.control}
                        render={(props) =>
                        <Autocomplete
                                className={classes.input}
                                options={allTransferReasons}
                                getOptionLabel={(option) => option ? option.displayName : option}
                                value={props.value}
                                onChange={(event, selectedTransferReasonAction) => {
                                    props.onChange(selectedTransferReasonAction ? selectedTransferReasonAction : null);
                                    setSelectedTransferReason(selectedTransferReasonAction);
                                }}
                                onBlur={props.onBlur}
                                renderInput={(params) =>
                                    <TextField
                                        {...params}
                                        test-id='transfer-reason'
                                        placeholder='בחר סיבה'
                                        error={methods.errors[TransferInvestigationInputsNames.REASON]}
                                        label={methods.errors[TransferInvestigationInputsNames.REASON]?.message || 'בחר סיבה'}
                                    />
                                }
                            />
                        }
                    />
                    </div>
                    <div className={classes.inputRow}>
                    {
                        selectedTransferReason?.id == TransferReasonCodes.ANOTHER &&
                        <><Typography> פירוט סיבה:</Typography><Controller
                            name={TransferInvestigationInputsNames.OTHER_REASON}
                            control={methods.control}
                            render={(props) => <TextField
                                placeholder='כתוב סיבה'
                                className={classes.input}
                                test-id='transfer-reason'
                                value={props.value}
                                error={methods.errors[TransferInvestigationInputsNames.OTHER_REASON]}
                                label={methods.errors[TransferInvestigationInputsNames.OTHER_REASON]?.message || 'כתוב סיבה'}
                                onChange={(event) => props.onChange(event.target.value)} />} /></>
                    }
                </div>
                    <TransferInvestigationDialogNote 
                        isGroupedContact={isGroupedContact} 
                        allowGroupedContactAlert={allowGroupedContactAlert} 
                        setAllowGroupedContactAlert={setAllowGroupedContactAlert}
                    />
                    <DialogActions className={classes.dialogActions}>
                    <Button className={classes.button} variant='contained' onClick={onClose} color='default'>
                        ביטול
                    </Button>
                    <Button type='submit'
                        form={tranferDeskFormName}
                        disabled={isGroupedContact ? !methods.formState.isValid || !(isGroupedContact && allowGroupedContactAlert) : !methods.formState.isValid}
                        className={classes.button}
                        variant='contained'
                        color='primary'
                    >
                        אישור
                    </Button>
                </DialogActions>
            </form>
        </FormProvider>
    )
};

interface Props {
    allDesks: Desk[];
    onClose: () => void;
    onConfirm: (updatedDesk: Desk, transferReason: KeyValuePair, otherTransferReason:string) => void;
    onSuccess: () => Promise<SweetAlertResult<any>>;
    isGroupedContact: boolean;
};

export default TransferInvestigationDesk;