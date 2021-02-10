import {useSelector} from 'react-redux';
import React, {useEffect, useMemo,} from 'react';
import {useFormContext, Controller} from 'react-hook-form';
import {Grid, Divider, Collapse, Typography} from '@material-ui/core';

import StoreStateType from 'redux/storeStateType';
import FlattenedDBAddress from 'models/DBAddress';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';
import InteractionEventDialogFields from 'models/enums/InteractionsEventDialogContext/InteractionEventDialogFields';
import Toggle from 'commons/Toggle/Toggle';
import FormInput from 'commons/FormInput/FormInput';
import FormRowWithInput from 'commons/FormRowWithInput/FormRowWithInput';
import AddressForm, {AddressFormFields} from 'commons/Forms/AddressForm/AddressForm';
import PlacesTypesAndSubTypes, {PlacesTypesAndSubTypesProps} from 'commons/Forms/PlacesTypesAndSubTypes/PlacesTypesAndSubTypes';
import useContactEvent from 'Utils/ContactEvent/useContactEvent';
import {getOptionsByPlaceAndSubplaceType} from 'Utils/ContactEvent/placeTypesCodesHierarchy';
import {getDatesToInvestigate} from 'Utils/ClinicalDetails/symptomsUtils';
import useFormStyles from 'styles/formStyles';

import GoogleAddressForm from './InteractionLocationFields/AddressForm/AddressForm';
import PlaceNameForm from './PlaceNameForm/PlaceNameForm';
import BusinessContactForm from './InteractionLocationFields/BusinessContactForm/BusinessContactForm';
import InteractionDetailsFields from './InteractionDetailsFields/InteractionDetailsFields';
import RepetitiveEventForm from './RepetitiveEventForm/RepetitiveEventForm';
import DetailsFieldsTitle from './InteractionDetailsFields/DetailsFieldsTitle';

const ADDRESS_LABEL = 'כתובת';

const InteractionEventForm: React.FC<InteractionEventFormProps> = (
    {onPlaceSubTypeChange, isVisible, interactionData, isNewInteraction}: InteractionEventFormProps): JSX.Element => {

    const {control, watch, setValue, errors} = useFormContext();
    const patientAddress = useSelector<StoreStateType, FlattenedDBAddress>(state => state.address);
    const {city, floor, houseNum, street} = patientAddress;

    const placeType = watch(InteractionEventDialogFields.PLACE_TYPE);
    const placeSubType = watch(InteractionEventDialogFields.PLACE_SUB_TYPE);
    const isRepetitive = watch(InteractionEventDialogFields.IS_REPETITIVE);
    const isUnknownTime = watch(InteractionEventDialogFields.UNKNOWN_TIME);
    const placeName = watch(InteractionEventDialogFields.PLACE_NAME);


    const {isPatientHouse} = useContactEvent();

    const formConfig = useMemo(() => getOptionsByPlaceAndSubplaceType(placeType, placeSubType), [placeType, placeSubType]);
    const isSubTypePatientHouse = useMemo(() => isPatientHouse(placeSubType), [placeSubType]);

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
                <PlaceNameForm nameFieldLabel={nameFieldLabel}/>
            </Collapse>
            <Collapse in={!!extraFields}>
                {extraFields?.map((fieldElement: React.FC) => React.createElement(fieldElement))}
            </Collapse>

            {
                    <div>
                        <FormInput xs={7} fieldName='האם האירוע מחזורי ?'>
                            <Controller
                                name={InteractionEventDialogFields.IS_REPETITIVE}
                                control={control}
                                render={(props) => (
                                    <Toggle
                                        disabled={!isNewInteraction}
                                        value={props.value}
                                        onChange={(event, value) => value !== null && props.onChange(value)}
                                        className={formClasses.formToggle}
                                    />
                                )}
                            />
                        </FormInput>
                        {
                            (interactionData && typeof isRepetitive === 'boolean') && (
                                (isNewInteraction && isRepetitive)
                                    ? <RepetitiveEventForm selectedDate={interactionData.startTime}/>
                                    : <>
                                        <DetailsFieldsTitle date={interactionData.startTime}/>
                                        <InteractionDetailsFields interactionDate={interactionData.startTime}/>
                                    </>
                            )
                        }
                    </div>
            }

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
