import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { Autocomplete } from '@material-ui/lab';
import StoreStateType from 'redux/storeStateType';
import { Grid, TextField } from '@material-ui/core';

import City from 'models/City';
import useFormStyles from 'styles/formStyles';
import FormInput from 'commons/FormInput/FormInput';
import { cityFilterOptions } from 'Utils/Address/AddressOptionsFilters';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField';
import InteractionEventDialogFields from 'models/enums/InteractionsEventDialogContext/InteractionEventDialogFields';

import useStyles from './TransportationFormsStyles';

const BusEventForm: React.FC = (): JSX.Element => {
    const { control } = useFormContext();

    const formClasses = useFormStyles();
    const classes = useStyles();
    const cities : Map<string, City> = useSelector<StoreStateType, Map<string, City>>(state => state.cities);

    return (
        <>
            <div className={formClasses.formRow}>
                    <FormInput xs={2} className={classes.mainTextItem} fieldName='קו'>
                        <Controller 
                            name={InteractionEventDialogFields.BUS_LINE}
                            control={control}
                            render={(props) => (
                                <AlphanumericTextField
                                    name={props.name}
                                    value={props.value}
                                    onChange={(newValue: string) => props.onChange(newValue as string)}
                                    onBlur={props.onBlur}
                                />
                            )}
                        />
                    </FormInput>
                    <FormInput xs={2} className={classes.secondaryTextItem} fieldName='חברה'>
                        <Controller 
                            name={InteractionEventDialogFields.BUS_COMPANY}
                            control={control}
                            render={(props) => (
                                <AlphanumericTextField
                                    name={props.name}
                                    value={props.value}
                                    onChange={(newValue: string) => props.onChange(newValue as string)}
                                    onBlur={props.onBlur}
                                />
                            )}
                        />
                    </FormInput>
            </div>
        </>
    );
};

export default BusEventForm;
