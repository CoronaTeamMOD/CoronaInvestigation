import React from 'react';
import { useSelector } from 'react-redux';
import { SweetAlertResult } from 'sweetalert2';
import { Autocomplete } from '@material-ui/lab';
import { yupResolver } from '@hookform/resolvers';
import { FormProvider, Controller, useForm } from 'react-hook-form';
import { Button, DialogActions, TextField, Typography } from '@material-ui/core';

import County from 'models/County';
import StoreStateType from 'redux/storeStateType';

import useStyles from './TransferDialogsStyles';
import validationSchema from './TransferInvestigationCountySchema';
import TransferInvestigationDialogNote from './TransferInvestigationDialogNote';
import TransferInvestigationInputsNames from './TransferInvestigationInputsNames';

const defaultValues = {
    [TransferInvestigationInputsNames.COUNTY]: null,
    [TransferInvestigationInputsNames.REASON]: ''
}

const tranferCountyFormName = 'transferCounty';

const TransferInvestigationCounty = (props: Props) => {

    const { onClose, onConfirm, onSuccess, isGroupedContact } = props;

    const classes = useStyles();

    const methods = useForm({
        mode: 'all',
        resolver: yupResolver(validationSchema),
        defaultValues
    });

    const allCounties = useSelector<StoreStateType, County[]>(state => state.county.allCounties);

    const onDialogConfirm = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        methods.handleSubmit((data) => {
            onConfirm(data[TransferInvestigationInputsNames.COUNTY], data[TransferInvestigationInputsNames.REASON] || '');
            onSuccess();
            onClose();         
        })()
    };

    return (
        <FormProvider {...methods}>
            <form id={tranferCountyFormName} onSubmit={(event) => onDialogConfirm(event)}>
                <div className={classes.inputRow}>
                    <Typography>לאן להעביר?</Typography>
                    <Controller
                        name={TransferInvestigationInputsNames.COUNTY}
                        control={methods.control}
                        render={(props) =>
                            <Autocomplete
                                className={classes.input}
                                options={allCounties}
                                getOptionLabel={(option) => option ? option.displayName : option}
                                value={props.value}
                                onChange={(event, selectedCounty) => {
                                    props.onChange(selectedCounty ? selectedCounty : null)
                                }}
                                onBlur={props.onBlur}
                                renderInput={(params) =>
                                    <TextField
                                        {...params}
                                        test-id='transfer-desk'
                                        placeholder='בחר נפה'
                                        error={methods.errors[TransferInvestigationInputsNames.COUNTY]}
                                        label={methods.errors[TransferInvestigationInputsNames.COUNTY]?.message || 'בחר נפה'}
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
               <TransferInvestigationDialogNote isGroupedContact={isGroupedContact}/>
                <DialogActions className={classes.dialogActions}>
                    <Button className={classes.button} variant='contained' onClick={onClose} color='default'>
                        ביטול
                    </Button>
                    <Button type='submit'
                        form={tranferCountyFormName}
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
};

interface Props {
    onClose: () => void;
    onConfirm: (updatedCounty: County, transferReason: string) => void;
    onSuccess: () => Promise<SweetAlertResult<any>>;
    isGroupedContact: boolean;
}

export default TransferInvestigationCounty;