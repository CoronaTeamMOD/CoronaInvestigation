import React, { useState, useContext } from "react";
import { AddCircle as AddCircleIcon } from "@material-ui/icons";
import {
    Collapse,
    Grid,
    Typography,
    Divider,
    IconButton,
} from "@material-ui/core";

import Contact from "models/Contact";
import Toggle from "commons/Toggle/Toggle";
import useFormStyles from "styles/formStyles";
import TimePick from "commons/DatePick/TimePick";
import FormInput from "commons/FormInput/FormInput";
import {
    defaultOptions,
    FormOptions,
    getOptionsByPlaceAndSubplaceType,
    getPlaceConfigByCode,
} from 'Utils/placeTypesCodesHierarchy';
import InteractionEventDialogData from "models/Contexts/InteractionEventDialogData";
import PlacesTypesAndSubTypes from "commons/Forms/PlacesTypesAndSubTypes/PlacesTypesAndSubTypes";
import ContactForm from "./ContactForm/ContactForm";
import useStyles from "./InteractionEventFormStyles";
import {
    InteractionEventDialogContext,
    initialDialogData,
} from "../InteractionsEventDialogContext/InteractionsEventDialogContext";
import AddressForm from "./AddressForm/AddressForm";
import BusinessContactForm from "./BusinessContactForm/BusinessContactForm";
import PlaceNameForm from "./PlaceNameForm/PlaceNameForm";

export const defaultContact: Contact = {
    firstName: '',
    lastName: '',
    phoneNumber: { number: '', isValid: true },
    id: '',
    contactType: '',
};

const addContactButton: string = 'הוסף מגע';

const InteractionEventForm: React.FC = (): JSX.Element => {

    const { interactionEventDialogData, setInteractionEventDialogData } = useContext(InteractionEventDialogContext);
    const { placeType, startTime, endTime, externalizationApproval, contacts, placeSubType, id, investigationId, locationAddress } = interactionEventDialogData;

    const classes = useStyles();
    const formClasses = useFormStyles();
    const [canAddContact, setCanAddContact] = useState<boolean>(false);

    const formConfig: (FormOptions | {}) = getOptionsByPlaceAndSubplaceType(placeType, placeSubType);

    React.useEffect(() => {
        const hasInvalidContact: boolean = contacts
            .some(contact => (!contact.firstName || !contact.lastName || !contact.phoneNumber));
        setCanAddContact(!hasInvalidContact);
    }, [contacts])

  const onContactAdd = () => {
    const updatedContacts = [...contacts, { ...defaultContact }];
    setInteractionEventDialogData({
      ...interactionEventDialogData,
      contacts: updatedContacts,
    });
  };

    const onPlaceTypeChange = (newPlaceType: string) => {
        const resetData = initialDialogData(startTime, endTime, contacts, investigationId);
        setInteractionEventDialogData(
        {
            ...resetData,
            // @ts-ignore
            locationAddress: getPlaceConfigByCode(newPlaceType)?.hasAddress ? locationAddress : resetData.locationAddress,
            id,
            placeType: newPlaceType,
            externalizationApproval
        });
    }

    const onPlaceSubTypeChange = (newPlaceSubType: number, placeSubTypeDispalyName?: string) => {
        const resetData = initialDialogData(startTime, endTime, contacts, investigationId);
        const newSubplaceOptions = getOptionsByPlaceAndSubplaceType(placeType, placeSubType);

        setInteractionEventDialogData(
            {
                ...resetData,
                id,
                placeType,
                placeSubType: newPlaceSubType,
                externalizationApproval,
                // @ts-ignore
                locationAddress: newSubplaceOptions?.hasAddress ? locationAddress : resetData.locationAddress,
                // @ts-ignore
                placeName: (newSubplaceOptions?.isNamedLocation && placeSubTypeDispalyName) ? `${placeType} - ${placeSubTypeDispalyName}` : undefined
        });
    }



  const onExternalizationApprovalChange = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    val: boolean
  ) =>
    setInteractionEventDialogData({
      ...(interactionEventDialogData as InteractionEventDialogData),
      externalizationApproval: val,
    });


    const {
    // @ts-ignore
        hasAddress = defaultOptions.hasAddress,
        // @ts-ignore
        isNamedLocation = defaultOptions.isNamedLocation,
        // @ts-ignore
        isBusiness = defaultOptions.isBusiness,
        // @ts-ignore
        nameFieldLabel,
        // @ts-ignore
        extraFields = []
    } = formConfig;

    return (
        <>
            <Grid className={formClasses.form} container justify='flex-start'>
                <PlacesTypesAndSubTypes
                placeType={placeType}
                placeSubType={placeSubType}
                onPlaceTypeChange={onPlaceTypeChange}
                onPlaceSubTypeChange={onPlaceSubTypeChange}/>
                    <Collapse in={hasAddress}>
                        <AddressForm/>
                    </Collapse>

                    <Collapse in={isNamedLocation}>
                        <PlaceNameForm nameFieldLabel={nameFieldLabel}/>
                    </Collapse>

                    <Collapse in={isBusiness}>
                        <BusinessContactForm/>
                    </Collapse>

                    <Collapse in={extraFields}>
                        {extraFields.map((fieldElement: React.FC) => React.createElement(fieldElement))}
                    </Collapse>
                <Grid className={formClasses.formRow} container justify='flex-start'>
                    <Grid item xs={6}>
                        <FormInput fieldName='משעה'>
                            <TimePick
                                required
                                test-id="contactLocationStartTime"
                                labelText="משעה"
                                value={startTime}
                                onChange={(newStartTime: Date) => {
                                    setInteractionEventDialogData({
                                        ...(interactionEventDialogData as InteractionEventDialogData),
                                        startTime: newStartTime,
                                    });
                                }}
                            />
                        </FormInput>
                    </Grid>
                    <Grid item xs={6}>
                        <FormInput fieldName='עד שעה'>
                            <TimePick
                                required
                                test-id="contactLocationEndTime"
                                labelText="עד שעה"
                                value={endTime}
                                onChange={(newEndTime: Date) => {
                                    setInteractionEventDialogData({
                                        ...(interactionEventDialogData as InteractionEventDialogData),
                                        endTime: newEndTime,
                                    });
                                }}
                            />
                        </FormInput>
                    </Grid>
                </Grid>
                <Grid className={formClasses.formRow} container justify="flex-start">
                    <FormInput fieldName="האם מותר להחצנה">
                        <Toggle
                            test-id="allowExternalization"
                            className={formClasses.formToggle}
                            value={externalizationApproval}
                            onChange={onExternalizationApprovalChange}
                        />
                    </FormInput>
                </Grid>
            </Grid>
            <Divider light={true} />
            <Grid container className={formClasses.form + ' ' + classes.spacedOutForm}>
                <div className={classes.newContactFieldsContainer}>
                    {
                        contacts.map((contact: Contact, index: number) =>
                            <ContactForm updatedContactIndex={index} />)
                    }
                    <Grid item>
                        <IconButton test-id='addContact' onClick={onContactAdd} disabled={!canAddContact}>
                            <AddCircleIcon color={!canAddContact ? 'disabled' : 'primary'} />
                        </IconButton>
                        <Typography variant='caption' className={formClasses.fieldName + ' ' + classes.fieldNameNoWrap}>{addContactButton}</Typography>
                    </Grid>
                </div>
            </Grid>
        </>
    );
};

export default InteractionEventForm;