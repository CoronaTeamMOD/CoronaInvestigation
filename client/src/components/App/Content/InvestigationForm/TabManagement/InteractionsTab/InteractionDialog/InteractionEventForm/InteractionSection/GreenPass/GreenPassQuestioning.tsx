import React from 'react';
import {Grid} from '@material-ui/core';
import {Controller, useFormContext} from 'react-hook-form';

import FormInput from 'commons/FormInput/FormInput';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField';
import InteractionEventDialogFields from 'models/enums/InteractionsEventDialogContext/InteractionEventDialogFields';
    
import useStyles from './GreenPassStyles';

const GreenPassQuestioning = (props :Props) => {

    const { control } = useFormContext();

    const classes = useStyles();
    return (
        <Grid container>
            <FormInput xs={6} fieldName={'k'}>
                <Controller
                    name={InteractionEventDialogFields.PLACE_NAME}
                    control={control}
                    render={(props) => (
                        <AlphanumericTextField
                            name={props.name}
                            value={props.value}
                            onChange={(newValue: string) => props.onChange(newValue as string)}
                            onBlur={props.onBlur}
                            className={classes.field}
                        />
                    )}
                />
            </FormInput>
        </Grid>
    );
};

export default GreenPassQuestioning;

interface Props {
};