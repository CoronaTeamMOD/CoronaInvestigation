import React from 'react';
import { useForm, FormProvider, Controller, useFieldArray } from 'react-hook-form';
import { isValid } from 'date-fns';
import { yupResolver } from '@hookform/resolvers';
import { AddCircle as AddCircleIcon } from '@material-ui/icons';
import { Grid, Typography, Divider, IconButton } from '@material-ui/core';

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
  id: '',
  contactType: -1,
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

  const placeType = methods.watch(InteractionEventDialogFields.PLACE_TYPE);
  const placeSubType = methods.watch(InteractionEventDialogFields.PLACE_SUB_TYPE);
  const grade = methods.watch(InteractionEventDialogFields.GRADE);
  const interactionStartTime = methods.watch(InteractionEventDialogFields.START_TIME);
  const interationEndTime = methods.watch(InteractionEventDialogFields.END_TIME);

  const { fields, append } = useFieldArray<Contact>({control: methods.control, name: InteractionEventDialogFields.CONTACTS});
  const contacts = fields;

  const classes = useStyles();
  const formClasses = useFormStyles();

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
        methods.setError(fieldName, { type: 'manual', message: 'שעה לא תקינה'});
    }
  }

  const onSubmit = (data: InteractionEventDialogData) => {
    const interactionDataToSave = convertData(data);
    saveIntreactions(interactionDataToSave);
  }

  const generatePlacenameByPlaceSubType = (input :string) => {
    if (!placeType) return '';
    if (placeType !== input) {
      return `${placeType} ${input}`;
    } else {
      return `${placeType}`;
    }
  };

  const convertData = (data: InteractionEventDialogData) => {
    const name = data[InteractionEventDialogFields.PLACE_NAME];
    return  {
      ...data,
      [InteractionEventDialogFields.ID]: methods.watch(InteractionEventDialogFields.ID),
      [InteractionEventDialogFields.PLACE_NAME]: name || generatePlacenameByPlaceSubType(placeSubtypeName),
      [InteractionEventDialogFields.CONTACTS]: data[InteractionEventDialogFields.CONTACTS]
        ?.map((contact: Contact, index: number) => {
          const serialId = methods.watch<string, number>(`${InteractionEventDialogFields.CONTACTS}[${index}].${InteractionEventContactFields.SERIAL_ID}`)
          if (serialId) {
            return {
              ...contact,
              [InteractionEventContactFields.SERIAL_ID]: serialId
            }
          } else {
            return contact
          }
      })
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

  return (
      <FormProvider {...methods}>
        <form id='interactionEventForm' onSubmit={methods.handleSubmit(onSubmit)}>
          <Grid className={formClasses.form} container justify='flex-start'>
            <PlacesTypesAndSubTypes
              placeTypeName={InteractionEventDialogFields.PLACE_TYPE}
              placeSubTypeName={InteractionEventDialogFields.PLACE_SUB_TYPE}
              placeType={placeType}
              placeSubType={placeSubType}
              onPlaceTypeChange={(newValue) => methods.setValue(InteractionEventDialogFields.PLACE_TYPE, newValue)}
              onPlaceSubTypeChange={onPlaceSubtypeChange}
            />

            <PlaceTypeForm grade={grade} placeType={placeType} placeSubType={placeSubType}/>
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
          <Grid
            container
            className={formClasses.form + ' ' + classes.spacedOutForm}
          >
            <div className={classes.newContactFieldsContainer}>
              {
                contacts.map((contact, index: number) => (
                  <ContactForm
                    key={index}
                    updatedContactIndex={index}
                  />
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
            </div>
          </Grid>
        </form>
      </FormProvider>
  );
};

export default InteractionEventForm;

interface Props {
  interactionData?: InteractionEventDialogData;
  loadInteractions: () => void;
  closeNewDialog: () => void;
  closeEditDialog: () => void;
};
