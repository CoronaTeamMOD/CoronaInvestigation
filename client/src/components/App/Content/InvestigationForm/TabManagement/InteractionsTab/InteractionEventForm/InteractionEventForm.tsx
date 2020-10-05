import React from 'react';
import { useForm, FormProvider, Controller, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import { AddCircle as AddCircleIcon } from '@material-ui/icons';
import { Collapse, Grid, Typography, Divider, IconButton } from '@material-ui/core';

import Contact from 'models/Contact';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';
import Toggle from 'commons/Toggle/Toggle';
import TimePick from 'commons/DatePick/TimePick';
import FormInput from 'commons/FormInput/FormInput';
import PlacesTypesAndSubTypes from 'commons/Forms/PlacesTypesAndSubTypes/PlacesTypesAndSubTypes';
import placeTypesCodesHierarchy from 'Utils/placeTypesCodesHierarchy';
import get from 'Utils/auxiliaryFunctions/auxiliaryFunctions'
import useFormStyles from 'styles/formStyles';

import InteractionEventSchema from './InteractionEventSchema'
import ContactForm from './ContactForm/ContactForm';
import useStyles from './InteractionEventFormStyles';
import OfficeEventForm from '../InteractionEventForm/PlacesAdditionalForms/OfficeEventForm';
import SchoolEventForm from '../InteractionEventForm/PlacesAdditionalForms/SchoolEventForm';
import DefaultPlaceEventForm from '../InteractionEventForm/PlacesAdditionalForms/DefaultPlaceEventForm/DefaultPlaceEventForm';
import PrivateHouseEventForm from '../InteractionEventForm/PlacesAdditionalForms/PrivateHouseEventForm';
import TransportationEventForm from '../InteractionEventForm/PlacesAdditionalForms/TransportationAdditionalForms/TransportationEventForm';
import OtherPublicLocationForm from './PlacesAdditionalForms/OtherPublicLocationForm';
import MedicalLocationForm from './PlacesAdditionalForms/MedicalLocationForm';
import useInteractionsForm from './useInteractionsForm';
import InteractionEventDialogFields from '../InteractionsEventDialogContext/InteractionEventDialogFields';

export const defaultContact: Contact = {
  firstName: "",
  lastName: "",
  phoneNumber: "",
  id: "",
  contactType: -1,
};

const addContactButton: string = "הוסף מגע";

const InteractionEventForm: React.FC<Props> = (
  {
    intractionData,
    loadInteractions,
    closeNewDialog,
    closeEditDialog,
    interactionId
  }: Props): JSX.Element => {

  const { saveIntreactions } = useInteractionsForm({ interactionId, loadInteractions, closeNewDialog, closeEditDialog });
  const methods = useForm<InteractionEventDialogData>({
    defaultValues: intractionData,
    mode: 'all',
    resolver: yupResolver(InteractionEventSchema)
  });

  const placeType = methods.watch(InteractionEventDialogFields.PLACE_TYPE);
  const placeSubType = methods.watch(InteractionEventDialogFields.PLACE_SUB_TYPE);
  const interactionStartTime = methods.watch(InteractionEventDialogFields.START_TIME);
  const interationEndTime = methods.watch(InteractionEventDialogFields.END_TIME);
  const { fields, append } = useFieldArray<Contact>({ control: methods.control, name: InteractionEventDialogFields.CONTACTS });
  const contacts = fields;

  const classes = useStyles();
  const formClasses = useFormStyles();

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

  const handleTimeChange = (currentTime: Date, interactionDate: Date, fieldName: string) => {
    if (currentTime) {
      let newDate = new Date(interactionDate.getTime())
      newDate.setHours(currentTime.getHours())
      newDate.setMinutes(currentTime.getMinutes())
      if (newDate.getTime()) {
        methods.setValue(fieldName, newDate)
      }
    }
  }

  const onSubmit = (data: InteractionEventDialogData) => {
    saveIntreactions(data)
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
              onPlaceTypeChange={(newValue) => methods.setValue(InteractionEventDialogFields.PLACE_TYPE, newValue)}
              onPlaceSubTypeChange={(newValue) => methods.setValue(InteractionEventDialogFields.PLACE_SUB_TYPE, newValue)}
            />

            <Collapse in={placeType === privateHouse.code}>
              <PrivateHouseEventForm />
            </Collapse>

            <Collapse in={placeType === office.code}>
              <OfficeEventForm />
            </Collapse>

            <Collapse in={placeType === transportation.code}>
              <TransportationEventForm placeSubType={placeSubType} />
            </Collapse>

            <Collapse in={placeType === school.code}>
              <SchoolEventForm placeSubType={placeSubType} />
            </Collapse>

            <Collapse in={placeType === medical.code}>
              <MedicalLocationForm placeSubType={placeSubType} />
            </Collapse>

            <Collapse in={placeType === religion.code || placeType === geriatric.code}>
              <DefaultPlaceEventForm />
            </Collapse>

            <Collapse in={placeType === otherPublicPlaces.code}>
              <OtherPublicLocationForm placeSubType={placeSubType} />
            </Collapse>

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
                          interactionStartTime,
                          InteractionEventDialogFields.START_TIME)}
                        labelText={get(methods.errors, props.name) ? get(methods.errors, props.name).message : "משעה*"}
                        error={get(methods.errors, props.name)}
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
                        onChange={(newTime: Date) => handleTimeChange(newTime,
                          interationEndTime,
                          InteractionEventDialogFields.END_TIME)}
                        labelText={get(methods.errors, props.name) ? get(methods.errors, props.name).message : "עד שעה*"}
                        error={get(methods.errors, props.name)}
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
              {contacts.map((contact, index: number) => (
                <ContactForm key={index} updatedContactIndex={index} />
              ))}
              <Grid item>
                <IconButton
                  test-id="addContact"
                  onClick={() => append(defaultContact)}
                >
                  <AddCircleIcon color="primary" />
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

interface Props {
  intractionData?: InteractionEventDialogData;
  loadInteractions: () => void;
  closeNewDialog: () => void;
  closeEditDialog: () => void;
  interactionId?: number;
}
