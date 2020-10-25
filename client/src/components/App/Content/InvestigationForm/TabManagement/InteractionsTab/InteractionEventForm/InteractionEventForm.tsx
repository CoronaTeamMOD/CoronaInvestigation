import React from 'react';
import { isValid } from 'date-fns';
import { yupResolver } from '@hookform/resolvers';
import { AddCircle as AddCircleIcon, Filter } from '@material-ui/icons';
import { Grid, Typography, Divider, IconButton, Button } from '@material-ui/core';
import { useForm, FormProvider, Controller, useFieldArray, useFormContext } from 'react-hook-form';
import _ from 'lodash'

import Contact from 'models/Contact';
import Toggle from 'commons/Toggle/Toggle';
import useFormStyles from 'styles/formStyles';
import PlaceSubType from 'models/PlaceSubType';
import TimePick from 'commons/DatePick/TimePick';
import FormInput from 'commons/FormInput/FormInput';
import { get } from 'Utils/auxiliaryFunctions/auxiliaryFunctions';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';
import PlacesTypesAndSubTypes from 'commons/Forms/PlacesTypesAndSubTypes/PlacesTypesAndSubTypes';
import InteractionEventDialogFields from 'models/enums/InteractionsEventDialogContext/InteractionEventDialogFields';
import InteractionEventContactFields from 'models/enums/InteractionsEventDialogContext/InteractionEventContactFields';

import PlaceTypeForm from './PlaceTypeForm';
import ContactForm from './ContactForm/ContactForm';
import useStyles from './InteractionEventFormStyles';
import useInteractionsForm from './useInteractionsForm';
import InteractionEventSchema from './InteractionEventSchema';

export const defaultContact: Contact = {
  firstName: '',
  lastName: '',
  phoneNumber: '',
  idNumber: '',
  contactType: -1,
  serialId: -1,
  extraInfo: ''
};

const addContactButton: string = 'הוסף מגע';

const InteractionEventForm: React.FC<Props> = (
  { interactionData, loadInteractions, closeNewDialog, closeEditDialog, }: Props
): JSX.Element => {

  const { saveIntreactions } = useInteractionsForm({ loadInteractions, closeNewDialog, closeEditDialog });
  const [placeSubtypeName, setPlaceSubtypeName] = React.useState<string>('');
  const methods = useForm<InteractionEventDialogData>({
    defaultValues: interactionData,
    mode: 'all',
    resolver: yupResolver(InteractionEventSchema)
  });

  const [arrayToSave, setArrayToSave] = React.useState<any>([]);
  const [contactedPersonIdsToDelete, setContactedPersonIdsToDelete] = React.useState<number[]>([]);

  const contacts2 = methods.watch(InteractionEventDialogFields.CONTACTS);
  const placeType = methods.watch(InteractionEventDialogFields.PLACE_TYPE);
  const placeSubType = methods.watch(InteractionEventDialogFields.PLACE_SUB_TYPE);
  const grade = methods.watch(InteractionEventDialogFields.GRADE);
  const interactionStartTime = methods.watch(InteractionEventDialogFields.START_TIME);
  const interationEndTime = methods.watch(InteractionEventDialogFields.END_TIME);

  const { fields, append, remove } = useFieldArray<Contact>({ control: methods.control, name: InteractionEventDialogFields.CONTACTS });
  const contacts = fields;

  const classes = useStyles();
  const formClasses = useFormStyles();


  React.useEffect(() => {
    if (arrayToSave.length === 0) {
      setArrayToSave(contacts)
    }
  }, [])

  // React.useEffect(() => {
  //   console.log("CONTACTS2: ", contacts2)
  // }, [contacts2])

  // React.useEffect(() => {
  //   console.log("RUE CONTACTS: ", contacts)
  // }, [contacts, fields])

  const handleTimeChange = (currentTime: Date, interactionDate: Date, fieldName: string) => {
    if (isValid(currentTime)) {
      let newDate = new Date(interactionDate.getTime());

      newDate.setHours(currentTime.getHours());
      newDate.setMinutes(currentTime.getMinutes());

      if (newDate.getTime()) {
        methods.clearErrors(fieldName);
        methods.setValue(fieldName, newDate);
      }
    } else {
      methods.setError(fieldName, { type: 'manual', message: 'שעה לא תקינה' });
    }
  }

  const onSubmit = (data: InteractionEventDialogData) => {
    console.log("ON SUBMIT DATA: ", data)
    console.log("ON SUBMIT ATS: ", arrayToSave)
    const b = arrayToSave.map((a: any) => ({
      firstName: a.firstName,
      lastName: a.lastName
    }))
    console.log("ON SUBMIT B: ",b)
    console.log("ON SUBMIT DIFF: ", _.differenceWith(data.contacts, b, (a: any, b: any) => a.firstName === b.firstName && a.lastName === b.lastName))
    const interactionDataToSave = convertData(data);
    // console.log("IDTS: ", interactionDataToSave)
    saveIntreactions(interactionDataToSave, contactedPersonIdsToDelete);
  }

  const generatePlacenameByPlaceSubType = (input: string) => {
    if (!placeType) return '';
    if (placeType !== input) {
      return `${placeType} ${input}`;
    } else {
      return `${placeType}`;
    }
  };

  const convertData = (data: InteractionEventDialogData) => {
    const name = data[InteractionEventDialogFields.PLACE_NAME];
    // console.log("CCBU (contacts): ", contacts)
    // contacts
    // ?.map((contact: any, index: number) => {
    //   console.log("HIHIH: ", methods.watch<string, number>(`${InteractionEventDialogFields.CONTACTS}[${index}].${InteractionEventContactFields.SERIAL_ID}`))
    //   console.log("AC: ", contact.serialId)
    //   console.log("CI: ", contact.id)
    // })
    // console.log("CCBU (form contacts): ", data[InteractionEventDialogFields.CONTACTS])
    // data[InteractionEventDialogFields.CONTACTS]
    // ?.map((contact: any, index: number) => {
    //   console.log("HIHIH2222: ", methods.watch<string, number>(`${InteractionEventDialogFields.CONTACTS}[${index}].${InteractionEventContactFields.SERIAL_ID}`))
    //   console.log("AC2222: ", contact.serialId)
    //   console.log("CI22222: ", contact.id)
    // })

    // console.log("BF: ", contacts)
    // console.log("AF: ", contacts.filter((contact: any) => contact.serialId === -1))


    // console.log("FINAL REUSULT:")
    // const check = contacts
    // ?.map((contact: any, index: number) => {
    //   if (contact.serialId === -1) {
    //     return {
    //       ...data[InteractionEventDialogFields.CONTACTS][index]
    //     }
    //   }
    //   else return contact
    // })
    // console.log("CHECK: ", check)

    return {
      ...data,
      [InteractionEventDialogFields.ID]: methods.watch(InteractionEventDialogFields.ID),
      [InteractionEventDialogFields.PLACE_NAME]: name || generatePlacenameByPlaceSubType(placeSubtypeName),
      // ?.map((contact: Contact, index: number) => {
      //   const serialId = methods.watch<string, number>(`${InteractionEventDialogFields.CONTACTS}[${index}].${InteractionEventContactFields.SERIAL_ID}`)
      //   // if (serialId) {
      //   //   return {
      //   //     ...contact,
      //   //     [InteractionEventContactFields.SERIAL_ID]: serialId
      //   //   }
      //   // } else {
      //   //   return contact
      //   // }
      //   console.log("CHECK SI: ", serialId)
      //   return {
      //     firstName: contact.firstName,
      //     lastName: contact.lastName,
      //     phoneNumber: contact.phoneNumber,
      //     idNumber: contact.idNumber,
      //     contactType: contact.contactType,
      //     extraInfo: contact.extraInfo,
      //   }
    }
  }

  const onPlaceSubtypeChange = (newValue: PlaceSubType | null) => {
    if (newValue) {
      setPlaceSubtypeName(newValue?.displayName);
      methods.setValue(InteractionEventDialogFields.PLACE_SUB_TYPE, newValue.id);
    } else {
      setPlaceSubtypeName('');
      methods.setValue(InteractionEventDialogFields.PLACE_SUB_TYPE, null);
    }
  };

  const onContactedPersonDeleteClick = (contact: any, indexToRemove: number) => {
    let updatedContactedPersonIdsToDelete = contactedPersonIdsToDelete;
    contact.serialId && updatedContactedPersonIdsToDelete.push(contact.serialId);
    setContactedPersonIdsToDelete(updatedContactedPersonIdsToDelete);
    const newContacts :  Contact[] = methods.watch(InteractionEventDialogFields.CONTACTS);
    newContacts.splice(indexToRemove, 1);
    methods.setValue(InteractionEventDialogFields.CONTACTS, newContacts)
    remove(indexToRemove);
  }

  return (
    <FormProvider {...methods}>
      <Button onClick={() => console.log("ATS: ", arrayToSave)}>
        CHECK ATS!
      </Button>
      <form id='interactionEventForm' onSubmit={methods.handleSubmit(onSubmit)}>
        <Grid className={formClasses.form} container justify='flex-start'>
          <PlacesTypesAndSubTypes size='Dialog'
            placeTypeName={InteractionEventDialogFields.PLACE_TYPE}
            placeSubTypeName={InteractionEventDialogFields.PLACE_SUB_TYPE}
            placeType={placeType}
            placeSubType={placeSubType}
            onPlaceTypeChange={(newValue) => methods.setValue(InteractionEventDialogFields.PLACE_TYPE, newValue)}
            onPlaceSubTypeChange={onPlaceSubtypeChange}
          />

          <PlaceTypeForm grade={grade} placeType={placeType} placeSubType={placeSubType} />
          <Grid className={formClasses.formRow} container justify='flex-start'>
            <Grid item xs={6}>
              <FormInput fieldName='משעה'>
                <Controller
                  name={InteractionEventDialogFields.START_TIME}
                  control={methods.control}
                  render={(props) => (
                    <TimePick
                      testId='contactLocationStartTime'
                      value={props.value}
                      onChange={(newTime: Date) =>
                        handleTimeChange(newTime, interactionStartTime, InteractionEventDialogFields.START_TIME)
                      }
                      labelText={get(methods.errors, props.name) ? get(methods.errors, props.name).message : 'משעה*'}
                      error={get(methods.errors, props.name)}
                    />
                  )}
                />
              </FormInput>
            </Grid>
            <Grid item xs={6}>
              <FormInput fieldName='עד שעה'>
                <Controller
                  name={InteractionEventDialogFields.END_TIME}
                  control={methods.control}
                  render={(props) => (
                    <TimePick
                      testId='contactLocationEndTime'
                      value={props.value}
                      onChange={(newTime: Date) =>
                        handleTimeChange(newTime, interationEndTime, InteractionEventDialogFields.END_TIME)
                      }
                      labelText={get(methods.errors, props.name) ? get(methods.errors, props.name).message : 'עד שעה*'}
                      error={get(methods.errors, props.name)}
                    />
                  )}
                />
              </FormInput>
            </Grid>
          </Grid>
          <Grid className={formClasses.formRow} container justify='flex-start'>
            <FormInput fieldName='האם מותר להחצנה'>
              <Controller
                name={InteractionEventDialogFields.EXTERNALIZATION_APPROVAL}
                control={methods.control}
                render={(props) => (
                  <Toggle
                    test-id='allowExternalization'
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
        <Grid container className={formClasses.form + ' ' + classes.spacedOutForm}>
          <Button onClick={() => console.log("AC: ", contacts)}>
            CLICK ME!
          </Button>
          {
            contacts.map((contact, index: number) => (
              <Grid item className={classes.contactFormItem} key={contact.serialId === -1 ? contact.id : contact.serialId}>
                <ContactForm
                  updatedContactIndex={index}
                  onDeleteClick={() => onContactedPersonDeleteClick(contact, index)}
                  currentItem={contact}
                />
              </Grid>
            ))
          }
          <Grid item>
            <IconButton
              test-id='addContact'
              onClick={() => append(defaultContact)}
            >
              <AddCircleIcon color='primary' />
            </IconButton>
            <Typography
              variant='caption'
              className={formClasses.fieldName + ' ' + classes.fieldNameNoWrap}
            >
              {addContactButton}
            </Typography>
          </Grid>
        </Grid>
      </form>
    </FormProvider >
  );
};

export default InteractionEventForm;

interface Props {
  interactionData?: InteractionEventDialogData;
  loadInteractions: () => void;
  closeNewDialog: () => void;
  closeEditDialog: () => void;
};
