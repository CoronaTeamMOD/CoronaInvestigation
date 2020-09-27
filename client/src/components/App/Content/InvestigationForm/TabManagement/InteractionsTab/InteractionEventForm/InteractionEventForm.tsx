import React, { useState, useContext, useEffect } from 'react';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import { AddCircle as AddCircleIcon } from '@material-ui/icons';
import { Collapse, Grid, Typography, Divider, IconButton} from '@material-ui/core';

import Contact from 'models/Contact';
import Toggle from 'commons/Toggle/Toggle';
import TimePick from 'commons/DatePick/TimePick';
import FormInput from 'commons/FormInput/FormInput';
import PlacesTypesAndSubTypes from 'commons/Forms/PlacesTypesAndSubTypes/PlacesTypesAndSubTypes';
import placeTypesCodesHierarchy from 'Utils/placeTypesCodesHierarchy';
import useFormStyles from 'styles/formStyles';

import ContactForm from './ContactForm/ContactForm';
import useStyles from './InteractionEventFormStyles';
import OfficeEventForm from '../InteractionEventForm/PlacesAdditionalForms/OfficeEventForm';
import SchoolEventForm from '../InteractionEventForm/PlacesAdditionalForms/SchoolEventForm';
import DefaultPlaceEventForm from '../InteractionEventForm/PlacesAdditionalForms/DefaultPlaceEventForm';
import PrivateHouseEventForm from '../InteractionEventForm/PlacesAdditionalForms/PrivateHouseEventForm';
import TransportationEventForm from '../InteractionEventForm/PlacesAdditionalForms/TransportationAdditionalForms/TransportationEventForm';
import {
  InteractionEventDialogContext,
  initialDialogData,
} from '../InteractionsEventDialogContext/InteractionsEventDialogContext';
import OtherPublicLocationForm from './PlacesAdditionalForms/OtherPublicLocationForm';
import MedicalLocationForm from './PlacesAdditionalForms/MedicalLocationForm';
import useSchema from './useSchema';
import InteractionEventDialogFields from '../InteractionsEventDialogContext/InteractionEventDialogFields';

export const defaultContact: Contact = {
  firstName: "",
  lastName: "",
  phoneNumber: "",
  id: "",
  contactType: "",
};

const addContactButton: string = "הוסף מגע";
const { schema } = useSchema();

const InteractionEventForm: React.FC = (): JSX.Element => {
  const methods = useForm({
    defaultValues: initialDialogData( new Date(), new Date(), [], -1),
    mode: "onBlur",
    resolver: yupResolver(schema)
  });

  console.log(methods.getValues());
  console.log(methods.errors);

  const formData = methods.getValues();
  const placeType = methods.watch(InteractionEventDialogFields.PLACE_TYPE);
  const placeSubType = methods.watch(InteractionEventDialogFields.PLACE_SUB_TYPE);

  console.log(placeType)
  const {
    interactionEventDialogData,
    setInteractionEventDialogData,
  } = useContext(InteractionEventDialogContext);
  const {
    startTime,
    endTime,
    externalizationApproval,
    contacts,
    id,
    investigationId,
  } = interactionEventDialogData;

  const classes = useStyles();
  const formClasses = useFormStyles();
  const [canAddContact, setCanAddContact] = useState<boolean>(false);

  const {
    geriatric,
    school,
    medical,
    office,
    otherPublicPlaces,
    privateHouse,
    religion,
    transportation,
  } = placeTypesCodesHierarchy;

  React.useEffect(() => {
    const hasInvalidContact: boolean = contacts.some(
      (contact) =>
        !contact.firstName || !contact.lastName || !contact.phoneNumber
    );
    setCanAddContact(!hasInvalidContact);
  }, [contacts]);

  const onContactAdd = () => {
    const updatedContacts = [...contacts, { ...defaultContact }];
    setInteractionEventDialogData({
      ...interactionEventDialogData,
      contacts: updatedContacts,
    });
  };
  
  const handleTimeChange = (currentTime : Date, interactionDate : Date, fieldName: string) => {
    if(currentTime) {
      let newDate = new Date(interactionDate.getTime())
      newDate.setHours(currentTime.getHours())
      newDate.setMinutes(currentTime.getMinutes())
      if(newDate.getTime()) {
        methods.setValue(fieldName, newDate)
      }
    }
  }

  const onSubmit = (data: any) => {
    console.log(data);
  }

  return (
    <>
    <FormProvider {...methods}>
      <form id="interactionEventForm" onSubmit={methods.handleSubmit(onSubmit)}>
        <Grid className={formClasses.form} container justify="flex-start">
          <PlacesTypesAndSubTypes
            control={methods.control}
            placeTypeName={InteractionEventDialogFields.PLACE_TYPE}
            placeSubTypeName={InteractionEventDialogFields.PLACE_SUB_TYPE}
            placeType={placeType}
            placeSubType={placeSubType}
          />
          {placeType === privateHouse.code && (
            <Collapse in={placeType === privateHouse.code}>
              <PrivateHouseEventForm />
            </Collapse>
          )}
          {placeType === office.code && (
            <Collapse in={placeType === office.code}>
              <OfficeEventForm />
            </Collapse>
          )}
          {placeType === transportation.code && (
            <Collapse in={placeType === transportation.code}>
              <TransportationEventForm placeSubType={placeSubType} />
            </Collapse>
          )}
          {placeType === school.code && (
            <Collapse in={placeType === school.code}>
              <SchoolEventForm placeSubType={placeSubType} />
            </Collapse>
          )}
          {placeType === medical.code && (
            <Collapse in={placeType === medical.code}>
              <MedicalLocationForm placeSubType={placeSubType} />
            </Collapse>
          )}
          {(placeType === religion.code || placeType === geriatric.code) && (
            <Collapse in={placeType === religion.code || placeType === geriatric.code}>
              <DefaultPlaceEventForm />
            </Collapse>
          )}
          {placeType === otherPublicPlaces.code && (
            <Collapse in={placeType === otherPublicPlaces.code}>
              <OtherPublicLocationForm placeSubType={placeSubType} />
            </Collapse>
          )}
          <Grid className={formClasses.formRow} container justify="flex-start">
            <Grid item xs={6}>
              <FormInput fieldName="משעה">
                <Controller 
                  name={InteractionEventDialogFields.START_TIME}
                  control={methods.control}
                  render={(props) => (
                    <TimePick
                      test-id="contactLocationStartTime"
                      value={props.value}
                      onChange={(newTime: Date) => handleTimeChange(newTime, 
                                                                    formData[InteractionEventDialogFields.START_TIME],
                                                                    InteractionEventDialogFields.START_TIME)}
                      required
                      labelText="משעה"
                    />
                  )}
                />
              </FormInput>
            </Grid>
            <Grid item xs={6}>
              <FormInput fieldName="עד שעה">
                <Controller 
                  name={InteractionEventDialogFields.END_TIME}
                  control={methods.control}
                  render={(props) => (
                    <TimePick
                      test-id="contactLocationEndTime"
                      value={props.value}
                      onChange={(newTime:Date) => handleTimeChange(newTime, 
                                                                   formData[InteractionEventDialogFields.END_TIME],
                                                                   InteractionEventDialogFields.END_TIME)}
                      required
                      labelText="עד שעה"
                    />
                  )}
                />
              </FormInput>
            </Grid>
          </Grid>
          <Grid className={formClasses.formRow} container justify="flex-start">
            <FormInput fieldName="האם מותר להחצנה">
              <Controller 
                name={InteractionEventDialogFields.EXTERNALIZATION_APPROVAL}
                control={methods.control}
                render={(props) => (
                  <Toggle
                    test-id="allowExternalization"
                    value={props.value}
                    onChange={(event, value: boolean) => props.onChange(value as boolean)}
                    className={formClasses.formToggle}       
                  />
                )}
              />
            </FormInput>
          </Grid>
        </Grid>
        <Divider light={true} />
        <Grid
          container
          className={formClasses.form + " " + classes.spacedOutForm}
        >
          <div className={classes.newContactFieldsContainer}>
            {contacts.map((contact: Contact, index: number) => (
              <ContactForm updatedContactIndex={index} />
            ))}
            <Grid item>
              <IconButton
                test-id="addContact"
                onClick={onContactAdd}
                disabled={!canAddContact}
              >
                <AddCircleIcon color={!canAddContact ? "disabled" : "primary"} />
              </IconButton>
              <Typography
                variant="caption"
                className={formClasses.fieldName + " " + classes.fieldNameNoWrap}
              >
                {addContactButton}
              </Typography>
            </Grid>
          </div>
        </Grid>
      </form>
    </FormProvider>
     
    </>
  );
};

export default InteractionEventForm;
