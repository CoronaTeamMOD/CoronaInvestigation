import React from 'react';
import {Grid} from '@material-ui/core';
import {Controller, useFormContext} from 'react-hook-form';

import FormInput from 'commons/FormInput/FormInput';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField';
import InteractionEventDialogFields from 'models/enums/InteractionsEventDialogContext/InteractionEventDialogFields';
    
import useStyles from './DefaultPlaceEventFormStyles';

const DEFAULT_NAME_FIELD_LABEL = 'שם המוסד';

const PlaceNameForm = ({nameFieldLabel=DEFAULT_NAME_FIELD_LABEL, onPlaceNameChange}:Props) => {
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
                            onChange={(newValue: string) => {
                                props.onChange(newValue as string);
                                onPlaceNameChange(newValue);
                            }}
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
    onPlaceNameChange: (newPlaceName: string | null) => void;
};
