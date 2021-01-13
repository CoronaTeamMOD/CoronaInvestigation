import React from 'react';
import { useSelector } from 'react-redux';
import StoreStateType from 'redux/storeStateType';
import { Controller, useFormContext } from 'react-hook-form';

import City from 'models/City';
import useFormStyles from 'styles/formStyles';
import FormInput from 'commons/FormInput/FormInput';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField';
import InteractionEventDialogFields from 'models/enums/InteractionsEventDialogContext/InteractionEventDialogFields';

import useStyles from './TransportationFormsStyles';

const BusEventForm: React.FC = (): JSX.Element => {
    const { control } = useFormContext();

    const formClasses = useFormStyles();
    const classes = useStyles();

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
