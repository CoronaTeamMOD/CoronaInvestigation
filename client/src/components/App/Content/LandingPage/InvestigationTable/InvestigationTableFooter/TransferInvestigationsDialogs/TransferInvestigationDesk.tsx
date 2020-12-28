import React from 'react';
import { SweetAlertResult } from 'sweetalert2';
import { Autocomplete } from '@material-ui/lab';
import { yupResolver } from '@hookform/resolvers';
import { FormProvider, Controller, useForm } from 'react-hook-form';
import { Button, DialogActions, TextField, Typography, useTheme } from '@material-ui/core';

import Desk from 'models/Desk';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';


import useStyles from './TransferDialogsStyles';
import validationSchema from './TransferInvestigationDeskSchema';
import TransferInvestigationDialogNote from './TransferInvestigationDialogNote';
import TransferInvestigationInputsNames from './TransferInvestigationInputsNames';

const defaultValues = {
    [TransferInvestigationInputsNames.DESK]: null,
    [TransferInvestigationInputsNames.REASON]: ''
}

const tranferDeskFormName = 'transferDesk';

const TransferInvestigationDesk = (props: Props) => {

    const { alertWarning } = useCustomSwal();

    const theme = useTheme();

    const { allDesks, onClose, onConfirm, onSuccess } = props;

    const methods = useForm({
        mode: 'all',
        resolver: yupResolver(validationSchema),
        defaultValues
    })

    const onDialogConfirm = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        methods.handleSubmit((data) => {
            alertWarning(`האם אתה בטוח שתרצה להעביר חקירות אלו לדסק ${data[TransferInvestigationInputsNames.DESK].deskName}`, {
                showCancelButton: true,
                cancelButtonText: 'בטל',
                cancelButtonColor: theme.palette.error.main,
                confirmButtonColor: theme.palette.primary.main,
                confirmButtonText: 'כן, המשך'
            }).then((result) => {
                if (result.value) {
                    onConfirm(data[TransferInvestigationInputsNames.DESK], data[TransferInvestigationInputsNames.REASON] || '');
                    onSuccess();
                    onClose();
                }
            })
        })()
    }


    const classes = useStyles();

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
                            <TextField
                                placeholder='כתוב סיבה'
                                className={classes.input}
                                test-id='transfer-reason'
                                value={props.value}
                                error={methods.errors[TransferInvestigationInputsNames.REASON]}
                                label={methods.errors[TransferInvestigationInputsNames.REASON]?.message || 'כתוב סיבה'}
                                onChange={(event) => props.onChange(event.target.value)}
                            />
                        }
                    />
                </div>
                <TransferInvestigationDialogNote />
                <DialogActions className={classes.dialogActions}>
                    <Button className={classes.button} variant='contained' onClick={onClose} color='default'>
                        ביטול
                    </Button>
                    <Button type='submit'
                        form={tranferDeskFormName}
                        disabled={!methods.formState.isValid}
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
}

interface Props {
    allDesks: Desk[];
    onClose: () => void;
    onConfirm: (updatedDesk: Desk, transferReason: string) => void;
    onSuccess: () => Promise<SweetAlertResult<any>>
}

export default TransferInvestigationDesk;