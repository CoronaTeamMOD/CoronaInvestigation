import React, { useState } from 'react';
import { Autocomplete } from '@material-ui/lab';
import { yupResolver } from '@hookform/resolvers';
import { TextField, Typography } from '@material-ui/core';
import { useForm, FormProvider, Controller } from 'react-hook-form';

import InvestigatorOption from 'models/InvestigatorOption';

import useStyles from './TransferDialogsStyles';
import validationSchema from './TransferInvestigationInvestigatorSchema';
import TransferInvestigationDialog from './TransferInvestigationDialog';
import TransferInvestigationInvestigatorInputNames from './TransferInvestigationInvestigatorInputNames';

const transferInvestigatorFormName = 'transferInvestigator';

const TransferInvestigationDesk = (props: Props) => {

    const { allInvestigators, open, onClose, onConfirm } = props;

    const classes = useStyles();
    
    const methods = useForm({
        mode: 'all',
        resolver: yupResolver(validationSchema),
        defaultValues: {
            [TransferInvestigationInvestigatorInputNames.INVESTIGATOR]: null,
            [TransferInvestigationInvestigatorInputNames.REASON]: ''
        }
    });
    
    const onDialogConfirm = () => (
        methods.handleSubmit((data) => {
            onConfirm(data[TransferInvestigationInvestigatorInputNames.INVESTIGATOR], data[TransferInvestigationInvestigatorInputNames.REASON] || '');
        })()
    );

    return (
        <FormProvider {...methods}>
            <TransferInvestigationDialog 
                formName={transferInvestigatorFormName} 
                title='העברת חקירות' 
                isConfirmDisabled={!methods.formState.isValid} 
                open={open} 
                onClose={onClose} 
                onConfirm={onDialogConfirm}
            >
                <>
                    <div className={classes.inputRow}>
                        <Typography>למי להעביר?</Typography>
                        <Controller
                            name={TransferInvestigationInvestigatorInputNames.INVESTIGATOR}
                            control={methods.control}
                            render={(props) => 
                                <Autocomplete
                                    className={classes.input}
                                    options={allInvestigators}
                                    getOptionLabel={(option) => option ? option.value.userName : option}
                                    value={props.value}
                                    onChange={(event, selectedInvestigator) => 
                                        props.onChange(selectedInvestigator ? selectedInvestigator : null)
                                    }
                                    onBlur={props.onBlur}
                                    renderInput={(params) =>
                                        <TextField
                                            {...params}
                                            placeholder='בחר חוקר'
                                            error={methods.errors[TransferInvestigationInvestigatorInputNames.INVESTIGATOR]}
                                            label={methods.errors[TransferInvestigationInvestigatorInputNames.INVESTIGATOR]?.message || 'בחר חוקר'}
                                        />
                                    }
                                />
                            }
                        />
                    </div>
                    <div className={classes.inputRow}>
                        <Typography>סיבת העברה:</Typography>
                        <Controller
                            name={TransferInvestigationInvestigatorInputNames.REASON}
                            control={methods.control}
                            render={(props) =>
                                <TextField
                                    value={props.value}
                                    placeholder='כתוב סיבה'
                                    className={classes.input}
                                    test-id='transfer-reason'
                                    error={methods.errors[TransferInvestigationInvestigatorInputNames.REASON]}
                                    label={methods.errors[TransferInvestigationInvestigatorInputNames.REASON]?.message || 'כתוב סיבה'}
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
    allInvestigators: InvestigatorOption[];
    onClose: () => void;
    onConfirm: (updatedIvestigator: InvestigatorOption, transferReason: string) => void;
}

export default TransferInvestigationDesk;