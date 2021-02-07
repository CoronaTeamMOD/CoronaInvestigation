import React, {useEffect} from 'react';
import {Controller, useFormContext} from 'react-hook-form';
import {Collapse, Grid, Typography} from '@material-ui/core';

import InteractionEventDialogFields
    from 'models/enums/InteractionsEventDialogContext/InteractionEventDialogFields';
import placeTypesCodesHierarchy from 'Utils/ContactEvent/placeTypesCodesHierarchy';
import FormInput from 'commons/FormInput/FormInput';
import Toggle from 'commons/Toggle/Toggle';
import useFormStyles from 'styles/formStyles';

import useStyles from './InteractionExternalizationFormStyles';
import repetitiveFieldTools from '../../RepetitiveEventForm/hooks/repetitiveFieldTools';

const ExternalizationForm = ({occurrenceIndex}: {occurrenceIndex?: number}) => {
    const {errors, control, setValue, watch} = useFormContext();
    const formClasses = useFormStyles();
    const classes = useStyles();

    const {generateFieldName} = repetitiveFieldTools(occurrenceIndex);

    const placeType = watch(InteractionEventDialogFields.PLACE_TYPE);
    const locationAddress = watch(InteractionEventDialogFields.LOCATION_ADDRESS);
    const placeName = watch(InteractionEventDialogFields.PLACE_NAME);
    const placeDescription = watch(generateFieldName(InteractionEventDialogFields.PLACE_DESCRIPTION));
    const isUnknownTime = watch(generateFieldName(InteractionEventDialogFields.UNKNOWN_TIME));

    const externalizationFieldName = generateFieldName(InteractionEventDialogFields.EXTERNALIZATION_APPROVAL);

    const externalizationErrorMessage = React.useMemo<string>(() => {
        const initialMessage = '*שים לב כי לא ניתן להחצין מקום אם ';
        const isPrivatePlace = placeType === placeTypesCodesHierarchy.privateHouse.code;
        const isTransportationPlace = placeType === placeTypesCodesHierarchy.transportation.code;
        const externalizationErrors: string[] = [];

        if (isPrivatePlace) {
            externalizationErrors.push('מדובר בבית פרטי')
        } else {
            if (isUnknownTime) {
                externalizationErrors.push('הזמן אינו ידוע');
            }
            if (!isTransportationPlace && !(locationAddress && (placeName || placeDescription))) {
                externalizationErrors.push('חסרה כתובת ובנוסף חסר שם המוסד או פירוט');
            }
        }
        if (externalizationErrors.length === 0) {
            return '';
        } else {
            setValue(externalizationFieldName, null);
            return initialMessage.concat(externalizationErrors.join(', '));
        }
    }, [placeType, isUnknownTime, locationAddress, placeName, placeDescription]);

    useEffect(() => {
        if (externalizationErrorMessage) {
            setValue(externalizationFieldName, null)
        }
    }, [externalizationErrorMessage]);

    return (
        <>
            <Grid className={formClasses.formRow} container justify='flex-start'>
                <FormInput xs={7} fieldName='האם מותר להחצנה'>
                    <Controller
                        name={externalizationFieldName}
                        control={control}
                        render={(props) => (
                            <Toggle
                                test-id='allowExternalization'
                                disabled={externalizationErrorMessage !== ''}
                                value={externalizationErrorMessage !== '' ? null : props.value}
                                onChange={(event, value: boolean) => value !== null && props.onChange(value as boolean)}
                                className={formClasses.formToggle}
                            />
                        )}
                    />
                </FormInput>
                {
                    !Boolean(externalizationErrorMessage) &&
                    <Typography
                        color={errors[externalizationFieldName] ? 'error' : 'initial'}>
                        חובה לבחור החצנה
                    </Typography>
                }
            </Grid>
            <Grid item xs={12}>
                <Collapse in={Boolean(externalizationErrorMessage)}>
                    <Typography className={classes.externalizationErrorMessage}>
                        <b>{externalizationErrorMessage}</b>
                    </Typography>
                </Collapse>
            </Grid>
        </>
    );
};

export default ExternalizationForm;