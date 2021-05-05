import {useSelector} from 'react-redux';
import React, {useEffect, useMemo} from 'react';
import {Grid, Divider, Collapse} from '@material-ui/core';
import {useFormContext, Controller} from 'react-hook-form';

import Toggle from 'commons/Toggle/Toggle';
import useFormStyles from 'styles/formStyles';
import StoreStateType from 'redux/storeStateType';
import FlattenedDBAddress from 'models/DBAddress';
import FormInput from 'commons/FormInput/FormInput';
import useContactEvent from 'Utils/ContactEvent/useContactEvent';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';
import AddressForm, {AddressFormFields} from 'commons/Forms/AddressForm/AddressForm';
import InteractionEventDialogFields from 'models/enums/InteractionsEventDialogContext/InteractionEventDialogFields';
import placeTypesCodesHierarchy, {getOptionsByPlaceAndSubplaceType} from 'Utils/ContactEvent/placeTypesCodesHierarchy';
import PlacesTypesAndSubTypes, {PlacesTypesAndSubTypesProps} from 'commons/Forms/PlacesTypesAndSubTypes/PlacesTypesAndSubTypes';

import PlaceNameForm from './PlaceNameForm/PlaceNameForm';
import GreenPassQuestioning from './GreenPass/GreenPassQuestioning';
import RepetitiveEventForm from './RepetitiveEventForm/RepetitiveEventForm';
import DetailsFieldsTitle from './InteractionDetailsFields/DetailsFieldsTitle';
import GoogleAddressForm from './InteractionLocationFields/AddressForm/AddressForm';
import InteractionDetailsFields from './InteractionDetailsFields/InteractionDetailsFields';
import BusinessContactForm from './InteractionLocationFields/BusinessContactForm/BusinessContactForm';

const ADDRESS_LABEL = 'מקום/כתובת';

const InteractionEventForm: React.FC<InteractionEventFormProps> = (
    {onPlaceSubTypeChange, isVisible, interactionData, isNewInteraction}: InteractionEventFormProps): JSX.Element => {

    const {control, watch, setValue } = useFormContext();
    const patientAddress = useSelector<StoreStateType, FlattenedDBAddress>(state => state.address);
    const {city, apartment, houseNum, street} = patientAddress;

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
            setValue(`${InteractionEventDialogFields.PRIVATE_HOUSE_ADDRESS}.${InteractionEventDialogFields.PRIVATE_HOUSE_APARTMENT}`, apartment);
        } else {
            setValue(`${InteractionEventDialogFields.PRIVATE_HOUSE_ADDRESS}.${InteractionEventDialogFields.PRIVATE_HOUSE_CITY}`, '');
            setValue(`${InteractionEventDialogFields.PRIVATE_HOUSE_ADDRESS}.${InteractionEventDialogFields.PRIVATE_HOUSE_STREET}`, '');
            setValue(`${InteractionEventDialogFields.PRIVATE_HOUSE_ADDRESS}.${InteractionEventDialogFields.PRIVATE_HOUSE_HOUSE_NUMBER}`, '');
            setValue(`${InteractionEventDialogFields.PRIVATE_HOUSE_ADDRESS}.${InteractionEventDialogFields.PRIVATE_HOUSE_APARTMENT}`, '');
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
        apartmentField: {
            name: `${InteractionEventDialogFields.PRIVATE_HOUSE_ADDRESS}.${InteractionEventDialogFields.PRIVATE_HOUSE_APARTMENT}`,
            testId: 'currentQuarantineApartment'
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
                <FormInput fieldName={ADDRESS_LABEL}>
                    <AddressForm
                        disabled={true}
                        {...addressFormFields}
                    />
                </FormInput>
            </Collapse>
            <Collapse in={isNamedLocation}>
                <PlaceNameForm nameFieldLabel={nameFieldLabel}/>
            </Collapse>
            <Collapse in={!!extraFields}>
                {extraFields?.map((fieldElement: React.FC) => React.createElement(fieldElement))}
            </Collapse>
            <Collapse in={placeType !== placeTypesCodesHierarchy.privateHouse.code}>
                <GreenPassQuestioning greenPassInformation={interactionData?.greenPass}/>
            </Collapse>
            {
                    <div>
                        <FormInput xs={7} isQuestion={true} fieldName='האם האירוע מחזורי'>
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
                                        <InteractionDetailsFields 
                                            interactionDate={interactionData.startTime} 
                                            defaultDate={true}
                                        />
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
