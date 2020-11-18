import React from 'react';
import {Grid} from '@material-ui/core';
import FormInput from 'commons/FormInput/FormInput';
import {Controller, useFormContext} from 'react-hook-form';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField';
import InteractionEventDialogFields
    from 'models/enums/InteractionsEventDialogContext/InteractionEventDialogFields';
    
import useStyles from './DefaultPlaceEventFormStyles';

const DEFAULT_NAME_FIELD_LABEL = 'שם המוסד';

const PlaceNameForm = ({nameFieldLabel=DEFAULT_NAME_FIELD_LABEL}:Props) => {
    const { control } = useFormContext();

    const classes = useStyles();
    return (
        <Grid container>
            <FormInput xs={6} fieldName={nameFieldLabel}>
                <Controller
                    name={InteractionEventDialogFields.PLACE_NAME}
                    control={control}
                    render={(props) => (
                        <AlphanumericTextField
                            name={props.name}
                            value={props.value}
                            onChange={(newValue: string) => props.onChange(newValue as string)}
                            onBlur={props.onBlur}
                            className={classes.placeNameField}
                        />
                    )}
                />
            </FormInput>
            <FormInput xs={5} labelLength={3} fieldName='פירוט נוסף'>
                <Controller
                    name={InteractionEventDialogFields.PLACE_DESCRIPTION}
                    control={control}
                    render={(props) => (
                        <AlphanumericTextField
                            name={props.name}
                            value={props.value}
                            onChange={(newValue: string) => props.onChange(newValue as string)}
                            onBlur={props.onBlur}
                            className={classes.placeNameField}
                        />
                    )}
                />
            </FormInput>
        </Grid>
    );
};

export default PlaceNameForm;

interface Props {
    nameFieldLabel? :string
};
