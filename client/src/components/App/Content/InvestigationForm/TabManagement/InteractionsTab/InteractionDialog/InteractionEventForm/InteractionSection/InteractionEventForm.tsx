import {isValid} from 'date-fns';
import { useSelector } from 'react-redux';
import React, {useEffect, useMemo, useState} from 'react';
import {useFormContext, Controller } from 'react-hook-form';
import {Grid, Typography, Divider, Collapse, Checkbox, FormControlLabel} from '@material-ui/core';

import Toggle from 'commons/Toggle/Toggle';
import useFormStyles from 'styles/formStyles';
import TimePick from 'commons/DatePick/TimePick';
import StoreStateType from 'redux/storeStateType';
import FlattenedDBAddress from 'models/DBAddress';
import FormInput from 'commons/FormInput/FormInput';
import {get} from 'Utils/auxiliaryFunctions/auxiliaryFunctions';
import useContactEvent from 'Utils/ContactEvent/useContactEvent';
import FormRowWithInput from 'commons/FormRowWithInput/FormRowWithInput';
import placeTypesCodesHierarchy from 'Utils/ContactEvent/placeTypesCodesHierarchy';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';
import AddressForm, { AddressFormFields } from 'commons/Forms/AddressForm/AddressForm';
import {getOptionsByPlaceAndSubplaceType} from 'Utils/ContactEvent/placeTypesCodesHierarchy';
import InteractionEventDialogFields from 'models/enums/InteractionsEventDialogContext/InteractionEventDialogFields';
import PlacesTypesAndSubTypes, {PlacesTypesAndSubTypesProps} from 'commons/Forms/PlacesTypesAndSubTypes/PlacesTypesAndSubTypes';

import useStyles from './InteractionEventFormStyles';
import GoogleAddressForm from './AddressForm/AddressForm';
import PlaceNameForm from './PlaceNameForm/PlaceNameForm';
import BusinessContactForm from './BusinessContactForm/BusinessContactForm';

const ADDRESS_LABEL = 'כתובת';

const InteractionEventForm: React.FC<InteractionEventFormProps> = (
    { onPlaceSubTypeChange, isVisible, interactionData, isNewInteraction }: InteractionEventFormProps): JSX.Element => {
    
    const {control, watch, clearErrors, setValue, errors, setError} = useFormContext();
    const patientAddress = useSelector<StoreStateType, FlattenedDBAddress>(state => state.address);
    
    const { city, floor, houseNum, street } = patientAddress;

    const placeType = watch(InteractionEventDialogFields.PLACE_TYPE);
    const placeSubType = watch(InteractionEventDialogFields.PLACE_SUB_TYPE);
    const interactionStartTime = watch(InteractionEventDialogFields.START_TIME);
    const interactionEndTime = watch(InteractionEventDialogFields.END_TIME);
    const isUnknownTime = watch(InteractionEventDialogFields.UNKNOWN_TIME);
    const locationAddress = watch(InteractionEventDialogFields.LOCATION_ADDRESS);
    const placeName = watch(InteractionEventDialogFields.PLACE_NAME);
    const placeDescription = watch(InteractionEventDialogFields.PLACE_DESCRIPTION);

    const [startTime, setStartTime] = useState<Date | null>(isNewInteraction ? null : interactionStartTime);
    const [endTime, setEndTime] = useState<Date | null>(isNewInteraction ? null : interactionEndTime);

    const { isPatientHouse } = useContactEvent();

    const formConfig = useMemo(() => getOptionsByPlaceAndSubplaceType(placeType, placeSubType), [placeType, placeSubType]);
    const isSubTypePatientHouse = useMemo(() => isPatientHouse(placeSubType), [placeSubType]);

    const classes = useStyles();
    const formClasses = useFormStyles();

    useEffect(() => {
        if (isSubTypePatientHouse) {
            setValue(`${InteractionEventDialogFields.PRIVATE_HOUSE_ADDRESS}.${InteractionEventDialogFields.PRIVATE_HOUSE_CITY}`, city);
            setValue(`${InteractionEventDialogFields.PRIVATE_HOUSE_ADDRESS}.${InteractionEventDialogFields.PRIVATE_HOUSE_STREET}`, street);
            setValue(`${InteractionEventDialogFields.PRIVATE_HOUSE_ADDRESS}.${InteractionEventDialogFields.PRIVATE_HOUSE_HOUSE_NUMBER}`, houseNum);
            setValue(`${InteractionEventDialogFields.PRIVATE_HOUSE_ADDRESS}.${InteractionEventDialogFields.PRIVATE_HOUSE_FLOOR}`, floor);
        } else {
            setValue(`${InteractionEventDialogFields.PRIVATE_HOUSE_ADDRESS}.${InteractionEventDialogFields.PRIVATE_HOUSE_CITY}`, '');
            setValue(`${InteractionEventDialogFields.PRIVATE_HOUSE_ADDRESS}.${InteractionEventDialogFields.PRIVATE_HOUSE_STREET}`, '');
            setValue(`${InteractionEventDialogFields.PRIVATE_HOUSE_ADDRESS}.${InteractionEventDialogFields.PRIVATE_HOUSE_HOUSE_NUMBER}`, '');
            setValue(`${InteractionEventDialogFields.PRIVATE_HOUSE_ADDRESS}.${InteractionEventDialogFields.PRIVATE_HOUSE_FLOOR}`, '');
        }
    }, [isSubTypePatientHouse]);

    const handleTimeChange = (currentTime: Date, interactionDate: Date, fieldName: string) => {
        if (isValid(currentTime)) {
            let newDate = new Date(interactionDate.getTime());

            newDate.setHours(currentTime.getHours());
            newDate.setMinutes(currentTime.getMinutes());

            if (newDate.getTime()) {
                clearErrors(fieldName);
                setValue(fieldName, newDate);
            }
        } else {
            setError(fieldName, {type: 'manual', message: 'שעה לא תקינה'});
        }
    }

    const externalizationErrorMessage = useMemo<string>(() => {
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
            if (!isTransportationPlace && !(locationAddress && (placeName && placeDescription))) {
                externalizationErrors.push('חסרה כתובת ובנוסף חסר שם המוסד ופירוט');
            }
        }
        if (externalizationErrors.length === 0) {
            return '';
        } else {
            setValue(InteractionEventDialogFields.EXTERNALIZATION_APPROVAL, null);
            return initialMessage.concat(externalizationErrors.join(', '));
        }
    }, [placeType, isUnknownTime, locationAddress, placeName, placeDescription]);

    useEffect(() => {
        setValue(InteractionEventDialogFields.START_TIME, isUnknownTime ? null : interactionData?.startTime);
        setValue(InteractionEventDialogFields.END_TIME, isUnknownTime ? null : interactionData?.endTime);
    }, [isUnknownTime]);

    const onPlaceTypeChange = (newPlaceType: string) => {
        setValue(InteractionEventDialogFields.PLACE_TYPE, newPlaceType, {shouldValidate: true});
        Boolean(placeName) && setValue(InteractionEventDialogFields.PLACE_NAME, '');
    };

    const {
        hasAddress,
        isNamedLocation,
        isBusiness,
        nameFieldLabel = undefined,
        extraFields = [],
    } = formConfig;

    const addressFormFields: AddressFormFields = {
        cityField: {
            name: `${InteractionEventDialogFields.PRIVATE_HOUSE_ADDRESS}.${InteractionEventDialogFields.PRIVATE_HOUSE_CITY}`, 
            testId: 'currentQuarantineCity'
        },
        streetField: {
            name: `${InteractionEventDialogFields.PRIVATE_HOUSE_ADDRESS}.${InteractionEventDialogFields.PRIVATE_HOUSE_STREET}`, 
            testId: 'currentQuarantineStreet'
        },
        houseNumberField: {
            name: `${InteractionEventDialogFields.PRIVATE_HOUSE_ADDRESS}.${InteractionEventDialogFields.PRIVATE_HOUSE_HOUSE_NUMBER}`, 
            testId: 'currentQuarantineHomeNumber'
        },
        floorField: {
            name: `${InteractionEventDialogFields.PRIVATE_HOUSE_ADDRESS}.${InteractionEventDialogFields.PRIVATE_HOUSE_FLOOR}`, 
            testId: 'currentQuarantineFloor'
        }
    }

    return (
        <Grid className={isVisible ? formClasses.form : formClasses.hidden} container justify='space-between'>
            <PlacesTypesAndSubTypes size='Dialog'
                                    placeTypeName={InteractionEventDialogFields.PLACE_TYPE}
                                    placeSubTypeName={InteractionEventDialogFields.PLACE_SUB_TYPE}
                                    onPlaceTypeChange={onPlaceTypeChange}
                                    onPlaceSubTypeChange={onPlaceSubTypeChange}
            />

            <Grid className={formClasses.formRow} container justify='flex-start'>
                <FormInput xs={5} fieldName='משעה'>
                    <Controller
                        name={InteractionEventDialogFields.START_TIME}
                        control={control}
                        render={(props) => (
                            <TimePick
                                disabled={isUnknownTime as boolean}
                                testId='contactLocationStartTime'
                                value={startTime}
                                onChange={(newTime: Date) => {
                                    setStartTime(newTime)
                                    handleTimeChange(newTime, interactionStartTime, InteractionEventDialogFields.START_TIME)
                                }}
                                labelText={get(errors, props.name) ? get(errors, props.name).message : 'משעה*'}
                                error={get(errors, props.name)}
                            />
                        )}
                    />
                </FormInput>
                <FormInput xs={4} fieldName='עד שעה'>
                    <Controller
                        name={InteractionEventDialogFields.END_TIME}
                        control={control}
                        render={(props) => (
                            <TimePick
                                disabled={isUnknownTime as boolean}
                                testId='contactLocationEndTime'
                                value={endTime}
                                onChange={(newTime: Date) => {
                                    setEndTime(newTime);
                                    handleTimeChange(newTime, interactionEndTime, InteractionEventDialogFields.END_TIME)
                                }}
                                labelText={get(errors, props.name) ? get(errors, props.name).message : 'עד שעה*'}
                                error={get(errors, props.name)}
                            />
                        )}
                    />
                </FormInput>
                <FormInput xs={3}>
                    <Controller
                        name={InteractionEventDialogFields.UNKNOWN_TIME}
                        control={control}
                        render={(props) =>
                            <FormControlLabel
                                label='זמן לא ידוע'
                                control={
                                    <Checkbox
                                        color='primary'
                                        checked={props.value}
                                        onChange={(event) => props.onChange(event.target.checked)}
                                    />
                                }
                            />
                        }
                    />
                </FormInput>
            </Grid>
            <Collapse in={hasAddress && !isSubTypePatientHouse}>
                <GoogleAddressForm/>
            </Collapse>
            <Collapse in={isSubTypePatientHouse}>
                <FormRowWithInput labelLength={2} fieldName={ADDRESS_LABEL}>
                    <AddressForm
                        disabled={true}
                        {...addressFormFields}
                    />
                </FormRowWithInput>
            </Collapse>
            <Collapse in={isNamedLocation}>
                <PlaceNameForm nameFieldLabel={nameFieldLabel} />
            </Collapse>
            <Collapse in={!!extraFields}>
                {extraFields?.map((fieldElement: React.FC) => React.createElement(fieldElement))}
            </Collapse>
            <Grid className={formClasses.formRow} container justify='flex-start'>
                <FormInput xs={7} fieldName='האם מותר להחצנה'>
                    <Controller
                        name={InteractionEventDialogFields.EXTERNALIZATION_APPROVAL}
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
                {!Boolean(externalizationErrorMessage) &&
                <Typography
                    color={errors[InteractionEventDialogFields.EXTERNALIZATION_APPROVAL] ? 'error' : 'initial'}>
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
            <Divider light={true}/>
            <Collapse in={isBusiness}>
                <BusinessContactForm/>
            </Collapse>
            <Divider light={true}/>
        </Grid>
    );
};

export default InteractionEventForm;

export interface InteractionEventFormProps {
    onPlaceSubTypeChange: PlacesTypesAndSubTypesProps['onPlaceSubTypeChange'];
    interactionData?: InteractionEventDialogData;
    isNewInteraction?: Boolean;
    isVisible: boolean;
};
