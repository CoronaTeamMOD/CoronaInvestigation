import React from 'react';
import { Collapse, FormControl, Grid, InputLabel, MenuItem, Select } from '@material-ui/core';
import { Controller, useFormContext } from 'react-hook-form';

import Toggle from 'commons/Toggle/Toggle';
import DatePick from 'commons/DatePick/DatePick';
import InlineErrorText from 'commons/InlineErrorText/InlineErrorText';
import IsolationSource from 'models/IsolationSource';
import FormRowWithInput from 'commons/FormRowWithInput/FormRowWithInput';
import ClinicalDetailsFields from 'models/enums/ClinicalDetailsFields';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField';

import { ClinicalDetailsClasses } from './ClinicalDetailsStyles';

const IsolationDatesFields: React.FC<Props> = (props: Props): JSX.Element => {
    const { classes, watchIsInIsolation, watchIsolationStartDate, watchIsolationEndDate, isolationSources } = props;
    const { control, errors, trigger } = useFormContext();

    React.useEffect(() => {
        trigger(ClinicalDetailsFields.ISOLATION_START_DATE);
        trigger(ClinicalDetailsFields.ISOLATION_END_DATE);
    }, [watchIsolationStartDate, watchIsolationEndDate]);

    return (
        <>
            <FormRowWithInput fieldName='בוצע בידוד לפני הבדיקה:' labelLength={2}>
                <Grid item xs={3}>
                    <Controller
                        name={ClinicalDetailsFields.IS_IN_ISOLATION}
                        control={control}
                        render={(props) => (
                            <Toggle
                                test-id='isInQuarantine'
                                value={props.value}
                                onChange={(e, value) => {
                                    if (value !== null) {
                                        props.onChange(value)
                                    }
                                }}
                            />
                        )}
                    />
                    <InlineErrorText 
                        error={errors[ClinicalDetailsFields.IS_IN_ISOLATION]}
                    />
                </Grid>
            </FormRowWithInput>
            <Collapse in={watchIsInIsolation}>
                <Grid container alignItems='center' spacing={3}>
                    <Grid item xs={2} className={classes.clinicalDetailsStub}/>
                    <Grid item xs={3}>
                        <Controller
                            name={ClinicalDetailsFields.ISOLATION_START_DATE}
                            control={control}
                            render={(props) => (
                                <div>
                                    <DatePick
                                        maxDate={new Date()}
                                        onBlur={props.onBlur}
                                        testId='quarantinedFromDate'
                                        labelText={errors[ClinicalDetailsFields.ISOLATION_START_DATE] ? errors[ClinicalDetailsFields.ISOLATION_START_DATE].message : '* מתאריך'}
                                        helperText={null}
                                        value={props.value}
                                        onChange={(newDate: Date) => {
                                            props.onChange(newDate);
                                        }}
                                        error={errors[ClinicalDetailsFields.ISOLATION_START_DATE] ? true : false}
                                    />
                                </div>
                            )}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <Controller
                            name={ClinicalDetailsFields.ISOLATION_END_DATE}
                            control={control}
                            render={(props) => (
                                <DatePick
                                    onBlur={props.onBlur}
                                    testId='quarantinedUntilDate'
                                    labelText={errors[ClinicalDetailsFields.ISOLATION_END_DATE] ? errors[ClinicalDetailsFields.ISOLATION_END_DATE].message : '* עד'}
                                    helperText={null}
                                    value={props.value}
                                    onChange={(newDate: Date) => {
                                        props.onChange(newDate);
                                    }}
                                    error={errors[ClinicalDetailsFields.ISOLATION_END_DATE] ? true : false}
                                />
                            )}
                        />
                    </Grid>
                </Grid>
            </Collapse>
            <Collapse in={watchIsInIsolation}>
                <FormRowWithInput fieldName='מקור עדכון על הצורך בבידוד:'>
                    <>
                        <Grid item xs={3}>
                            <Controller
                                name={ClinicalDetailsFields.ISOLATION_SOURCE}
                                control={control}
                                render={(props) => (
                                    <FormControl error={errors[ClinicalDetailsFields.ISOLATION_SOURCE]? true : false} variant='outlined' fullWidth>
                                        <InputLabel shrink={!!props.value}>בחר אחת מהאופציות</InputLabel>
                                        <Select
                                            label={errors[ClinicalDetailsFields.ISOLATION_SOURCE]? errors[ClinicalDetailsFields.ISOLATION_SOURCE].message : '* בחר אחת מהאופציות'}
                                            name={ClinicalDetailsFields.ISOLATION_SOURCE}
                                            value={props.value === null? '' : props.value}
                                            onChange={(event) => props.onChange(event.target.value === ''? null : event.target.value)}
                                        >
                                            {
                                                isolationSources.map((isolationSource: IsolationSource) => (
                                                    <MenuItem
                                                        key={isolationSource.id}
                                                        value={isolationSource.id}>
                                                        {isolationSource.description}
                                                    </MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <Controller
                                name={ClinicalDetailsFields.ISOLATION_SOURCE_DESC}
                                control={control}
                                render={(props) => {
                                    return (
                                        <AlphanumericTextField
                                        {...props}
                                        placeholder='פירוט נוסף'
                                        />
                                    )
                                }}
                            />
                        </Grid>
                    </>
                </FormRowWithInput>
            </Collapse>
        </>
    );
};

interface Props {
    classes: ClinicalDetailsClasses;
    watchIsInIsolation: boolean;
    watchIsolationStartDate: Date;
    watchIsolationEndDate: Date;
    isolationSources: IsolationSource[];
};

export default IsolationDatesFields;
