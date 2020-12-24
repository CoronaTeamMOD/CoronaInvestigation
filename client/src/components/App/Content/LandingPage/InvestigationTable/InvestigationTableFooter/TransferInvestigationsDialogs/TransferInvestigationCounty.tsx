import React from 'react';
import { Autocomplete } from '@material-ui/lab';
import { yupResolver } from '@hookform/resolvers';
import { FormProvider, Controller, useForm } from 'react-hook-form';
import { Button, DialogActions, TextField, Typography, useTheme } from '@material-ui/core';

import County from 'models/County';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';

import useStyles from './TransferDialogsStyles';
import validationSchema from './TransferInvestigationCountySchema';
import TransferInvestigationInputsNames from './TransferInvestigationInputsNames';

const defaultValues = {
    [TransferInvestigationInputsNames.COUNTY]: null,
    [TransferInvestigationInputsNames.REASON]: ''
}

const tranferCountyFormName = 'transferCounty';

const TransferInvestigationCounty = (props: Props) => {

    const { alertWarning } = useCustomSwal();

    const theme = useTheme();

    const { allCounties, onClose, onConfirm } = props;

    const methods = useForm({
        mode: 'all',
        resolver: yupResolver(validationSchema),
        defaultValues
    })

    const onDialogConfirm = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        methods.handleSubmit((data) => {
            alertWarning(`האם אתה בטוח שתרצה להעביר חקירות אלו לנפת ${data[TransferInvestigationInputsNames.COUNTY].displayName}`, {
                showCancelButton: true,
                cancelButtonText: 'בטל',
                cancelButtonColor: theme.palette.error.main,
                confirmButtonColor: theme.palette.primary.main,
                confirmButtonText: 'כן, המשך'
            }).then((result) => {
                if (result.value) {
                    onConfirm(data[TransferInvestigationInputsNames.COUNTY], data[TransferInvestigationInputsNames.REASON] || '');
                }
            })
        })()
    }

    const classes = useStyles();

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
                <div>
                     <Typography variant='body2'> שים לב, הפעולה תתבצע רק על חקירות השייכות לנפתך </Typography>
                </div>
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
}

interface Props {
    allCounties: County[];
    onClose: () => void;
    onConfirm: (updatedCounty: County, transferReason: string) => void;
}

export default TransferInvestigationCounty;