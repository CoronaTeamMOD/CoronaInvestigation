import { Autocomplete } from '@material-ui/lab';
import { yupResolver } from '@hookform/resolvers';
import { Controller, useForm } from 'react-hook-form';
import React, { useEffect, useMemo, useState } from 'react';
import { Grid, TextField, CircularProgress, Collapse } from '@material-ui/core';

import FormInput from 'commons/FormInput/FormInput';

import useStyles from './GroupedInvestigationsFormStyles';
import { get } from 'Utils/auxiliaryFunctions/auxiliaryFunctions';
import validationSchema, { OTHER } from './GroupedInvestigationsSchema';
import GroupedInvestigationsFields from './GroupedInvestigationsFields';

import useGroupedInvestigationsForm, { Reason } from './useGroupedInvestigationsForm';

const GroupedInvestigationsForm : React.FC<Props> = () => {

    const [isReasonsAutoCompleteOpen, setIsReasonsAutoCompleteOpen] = useState<boolean>(false);
    const [reasons, setReasons] = useState<Reason[]>([]);

    const { fetchReasons } = useGroupedInvestigationsForm({ setReasons });

    const reasonsAutoCompleteLoading = useMemo(() => {
        return isReasonsAutoCompleteOpen && reasons.length === 0
    }, [isReasonsAutoCompleteOpen, reasons])

    const classes = useStyles();

    const methods = useForm({
        mode: 'all',
        resolver: yupResolver(validationSchema),
        defaultValues: {
            [GroupedInvestigationsFields.REASON]: null,
            [GroupedInvestigationsFields.OTHER_REASON]: ''
        }
    });

    const reason = methods.watch(GroupedInvestigationsFields.REASON)?.id;

    useEffect(() => {
        if (reasonsAutoCompleteLoading) {
            fetchReasons();
        }
    }, [reasonsAutoCompleteLoading])

    useEffect(() => {
        if (reason?.id === OTHER) {
            methods.setValue(GroupedInvestigationsFields.OTHER_REASON, '');
        }
    }, [reason])

    const onSubmit = () => {
        console.log('hey');
    }

    return (
        <Grid className={classes.container}>
            <form id='groupedInvestigations' onSubmit={methods.handleSubmit(onSubmit)}>
                <Grid container justify='flex-start'>
                    <FormInput xs={8} fieldName='סיבת קיבוץ'>
                        <Controller 
                            name={GroupedInvestigationsFields.REASON}
                            control={methods.control}
                            render={(props) => (
                                  <Autocomplete 
                                    options={reasons}
                                    getOptionLabel={(option) => option ? option?.displayName : option}
                                    value={props.value}
                                    onChange={(event, selectedReason) => 
                                        props.onChange(selectedReason ? selectedReason : null)
                                    }
                                    onBlur={props.onBlur}
                                    open={isReasonsAutoCompleteOpen}
                                    onOpen={() => setIsReasonsAutoCompleteOpen(true)}
                                    onClose={() => setIsReasonsAutoCompleteOpen(false)}
                                    loading={reasonsAutoCompleteLoading}
                                    renderInput={(params) =>
                                        <TextField
                                            {...params}
                                            test-id={props.name}
                                            placeholder='בחר סיבה...'
                                            error={Boolean(get(methods.errors, props.name))}
                                            label={get(methods.errors, props.name)?.message || 'בחר סיבה'}
                                            InputProps={{
                                                ...params.InputProps,
                                                startAdornment: (
                                                    <>
                                                        {reasonsAutoCompleteLoading ? <CircularProgress color='inherit' size={20} /> : null}
                                                        {params.InputProps.startAdornment}
                                                    </>
                                                )
                                            }}
                                        />
                                    }
                                />
                            )}
                        />
                        <Collapse in={reason === OTHER}>
                            <Grid className={classes.otherReason}>
                                <Controller
                                    name={GroupedInvestigationsFields.OTHER_REASON}
                                    control={methods.control}
                                    render={(props) => (
                                        <TextField 
                                            test-id={props.name}
                                            value={props.value}
                                            onChange={(event) => props.onChange(event.target.value)}
                                            error={Boolean(get(methods.errors, props.name))}
                                            label={get(methods.errors, props.name)?.message || 'כתוב סיבה'}
                                        />
                                    )}
                                />
                            </Grid>
                        </Collapse>
                    </FormInput>
                </Grid>
            </form>
        </Grid>
    );
};

interface Props {

}

export default GroupedInvestigationsForm;
