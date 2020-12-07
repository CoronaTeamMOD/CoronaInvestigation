import { Autocomplete } from '@material-ui/lab';
import { Controller, useFormContext } from 'react-hook-form';
import React, { useEffect, useMemo, useState } from 'react';
import { Grid, TextField, CircularProgress, Collapse } from '@material-ui/core';

import FormInput from 'commons/FormInput/FormInput';
import { get } from 'Utils/auxiliaryFunctions/auxiliaryFunctions';

import { OTHER } from './GroupedInvestigationsSchema'
import useStyles from './GroupedInvestigationsFormStyles';
import GroupedInvestigationsFields from './GroupedInvestigationsFields';
import useGroupedInvestigationsForm, { Reason } from './useGroupedInvestigationsForm';

const reasonTitle = 'בחר סיבה...'

const GroupedInvestigationsForm = ({ shouldDisable }: Props) => {

    const [isReasonsAutoCompleteOpen, setIsReasonsAutoCompleteOpen] = useState<boolean>(false);
    const [reasons, setReasons] = useState<Reason[]>([]);

    const { fetchReasons } = useGroupedInvestigationsForm({ setReasons });
    const { watch, control, setValue, errors } = useFormContext();

    const reasonsAutoCompleteLoaded = useMemo(() => {
        return isReasonsAutoCompleteOpen && reasons.length === 0
    }, [isReasonsAutoCompleteOpen, reasons])

    const classes = useStyles();

    const reason = watch(GroupedInvestigationsFields.REASON)?.id;

    useEffect(() => {
        if (reasonsAutoCompleteLoaded) {
            fetchReasons();
        }
    }, [reasonsAutoCompleteLoaded])

    useEffect(() => {
        if (reason !== OTHER) {
            setValue(GroupedInvestigationsFields.OTHER_REASON, '');
        }
    }, [reason])

    return (
        <Grid className={classes.container}>
            <Grid container justify='flex-start'>
                <FormInput xs={8} fieldName='סיבת קיבוץ'>
                    <Controller
                        name={GroupedInvestigationsFields.REASON}
                        control={control}
                        render={(props) => (
                            <Autocomplete
                                disabled={shouldDisable}
                                options={reasons}
                                getOptionLabel={(option) => option ? option?.displayName : option}
                                value={props.value}
                                onChange={(event, selectedReason) =>
                                    props.onChange(selectedReason || null)
                                }
                                onBlur={props.onBlur}
                                open={isReasonsAutoCompleteOpen}
                                onOpen={() => setIsReasonsAutoCompleteOpen(true)}
                                onClose={() => setIsReasonsAutoCompleteOpen(false)}
                                loading={reasonsAutoCompleteLoaded}
                                loadingText='טוען...'
                                renderInput={(params) =>
                                    <TextField
                                        {...params}
                                        test-id={props.name}
                                        placeholder={reasonTitle}
                                        error={Boolean(get(errors, props.name))}
                                        label={get(errors, props.name)?.message || reasonTitle}
                                        InputProps={{
                                            ...params.InputProps,
                                            startAdornment: (
                                                <>
                                                    {reasonsAutoCompleteLoaded ? <CircularProgress color='inherit' size={20} /> : null}
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
                                control={control}
                                render={(props) => (
                                    <TextField
                                        disabled={shouldDisable}
                                        test-id={props.name}
                                        value={props.value}
                                        onChange={(event) => props.onChange(event.target.value)}
                                        error={Boolean(get(errors, props.name))}
                                        label={get(errors, props.name)?.message || 'כתוב סיבה'}
                                    />
                                )}
                            />
                        </Grid>
                    </Collapse>
                </FormInput>
            </Grid>
        </Grid>
    );
};

interface Props {
    shouldDisable: boolean;
}
export default GroupedInvestigationsForm;
