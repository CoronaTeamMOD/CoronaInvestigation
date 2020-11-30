import {isValid} from 'date-fns';
import {yupResolver} from '@hookform/resolvers';
import React, {useEffect, useMemo, useState} from 'react';
import {AddCircle as AddCircleIcon} from '@material-ui/icons';
import {useForm, FormProvider, Controller, useFieldArray} from 'react-hook-form';
import {Grid, Typography, Divider, IconButton, Collapse, Checkbox, FormControlLabel} from '@material-ui/core';

import Contact from 'models/Contact';
import Toggle from 'commons/Toggle/Toggle';
import useFormStyles from 'styles/formStyles';
import PlaceSubType from 'models/PlaceSubType';
import TimePick from 'commons/DatePick/TimePick';
import FormInput from 'commons/FormInput/FormInput';
import {get} from 'Utils/auxiliaryFunctions/auxiliaryFunctions';
import placeTypesCodesHierarchy from 'Utils/placeTypesCodesHierarchy';
import {getOptionsByPlaceAndSubplaceType} from 'Utils/placeTypesCodesHierarchy';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';
import useDuplicateContactId, {IdToCheck} from 'Utils/vendor/useDuplicateContactId';
import PlacesTypesAndSubTypes from 'commons/Forms/PlacesTypesAndSubTypes/PlacesTypesAndSubTypes';
import InteractionEventDialogFields from 'models/enums/InteractionsEventDialogContext/InteractionEventDialogFields';
import InteractionEventContactFields from 'models/enums/InteractionsEventDialogContext/InteractionEventContactFields';

import AddressForm from './AddressForm/AddressForm';
import ContactForm from './ContactForm/ContactForm';
import useStyles from './InteractionEventFormStyles';
import useInteractionsForm from './useInteractionsForm';
import PlaceNameForm from './PlaceNameForm/PlaceNameForm';
import InteractionEventSchema from './InteractionEventSchema';
import BusinessContactForm from './BusinessContactForm/BusinessContactForm';

export const defaultContact: Contact = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    idNumber: '',
    contactType: -1,
    creationTime: new Date(),
    involvedContact: null,
};

const addContactButton: string = 'הוסף מגע';

const InteractionEventForm: React.FC<Props> = (
    {interactions, interactionData, loadInteractions, closeNewDialog, closeEditDialog, isNewInteraction}: Props): JSX.Element => {

    const {saveInteractions} = useInteractionsForm({loadInteractions, closeNewDialog, closeEditDialog});
    const {checkDuplicateIdsForInteractions} = useDuplicateContactId();

    const [placeSubtypeName, setPlaceSubtypeName] = useState<string>('');
    const methods = useForm<InteractionEventDialogData>({
        defaultValues: interactionData,
        mode: 'all',
        resolver: yupResolver(InteractionEventSchema)
    });

    const initialInteractionDate = React.useRef<Date>(new Date(interactionData?.startTime as Date));
    const placeType = methods.watch(InteractionEventDialogFields.PLACE_TYPE);
    const placeSubType = methods.watch(InteractionEventDialogFields.PLACE_SUB_TYPE);
    const interactionStartTime = methods.watch(InteractionEventDialogFields.START_TIME);
    const interactionEndTime = methods.watch(InteractionEventDialogFields.END_TIME);
    const isUnknownTime = methods.watch(InteractionEventDialogFields.UNKNOWN_TIME);
    const locationAddress = methods.watch(InteractionEventDialogFields.LOCATION_ADDRESS);
    const placeName = methods.watch(InteractionEventDialogFields.PLACE_NAME);
    const placeDescription = methods.watch(InteractionEventDialogFields.PLACE_DESCRIPTION);

    const [startTime, setStartTime] = useState<Date | null>(isNewInteraction ? null : interactionStartTime);
    const [endTime, setEndTime] = useState<Date | null>(isNewInteraction ? null : interactionEndTime);

    const {fields, append} = useFieldArray<Contact>({
        control: methods.control,
        name: InteractionEventDialogFields.CONTACTS
    });
    const contacts = fields;
    const formConfig = useMemo(() => getOptionsByPlaceAndSubplaceType(placeType, placeSubType), [placeType, placeSubType]);

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
            methods.setError(fieldName, {type: 'manual', message: 'שעה לא תקינה'});
        }
    }

    const onSubmit = (data: InteractionEventDialogData) => {
        const interactionDataToSave = convertData(data);
        const allContactsIds: IdToCheck[] = interactions.map(interaction => interaction.contacts)
            .flat()
            .map((contact) => {
                return ({
                    id: contact[InteractionEventContactFields.ID],
                    serialId: contact[InteractionEventContactFields.SERIAL_ID]
                })
            });

        const newIds: IdToCheck[] = interactionDataToSave[InteractionEventDialogFields.CONTACTS].map((contact: Contact) => {
            return ({
                id: contact[InteractionEventContactFields.ID],
                serialId: contact[InteractionEventContactFields.SERIAL_ID]
            })
        });

        const contactsIdsToCheck: IdToCheck[] = allContactsIds.concat(newIds);
        if (!checkDuplicateIdsForInteractions(contactsIdsToCheck)) {
            saveInteractions(interactionDataToSave);
        }
    }

    const generatePlacenameByPlaceSubType = (input: string) => {
        if (!placeType) return '';
        if (placeType !== input) {
            return `${placeType} ${input}`.replace('/', ' או ');
        } else {
            return `${placeType}`;
        }
    };

    const externalizationErrorMessage = useMemo<string>(() => {
        const initialMessage = '*שים לב כי לא ניתן להחצין מקום אם ';
        const isPrivatePlace = placeType === placeTypesCodesHierarchy.privateHouse.code;
        const isTransportationPlace = placeType === placeTypesCodesHierarchy.transportation.code;
        const errors: string[] = [];

        if (isPrivatePlace) {
            errors.push('מדובר בבית פרטי')
        } else {
            if (isUnknownTime) {
                errors.push('הזמן אינו ידוע');
            }
            if (!isTransportationPlace && !(locationAddress && (placeName || placeDescription))) {
                errors.push('חסרה כתובת ובנוסף חסר שם המוסד או פירוט');
            }
        }
        if (errors.length === 0) {
            return '';
        } else {
            methods.setValue(InteractionEventDialogFields.EXTERNALIZATION_APPROVAL, null);
            return initialMessage.concat(errors.join(', '));
        }
    }, [placeType, isUnknownTime, locationAddress, placeName, placeDescription]);

    useEffect(() => {
        methods.setValue(InteractionEventDialogFields.START_TIME, isUnknownTime ? null : interactionData?.startTime);
        methods.setValue(InteractionEventDialogFields.END_TIME, isUnknownTime ? null : interactionData?.endTime);
    }, [isUnknownTime])

    const convertData = (data: InteractionEventDialogData) => {
        const name = data[InteractionEventDialogFields.PLACE_NAME];
        initialInteractionDate.current.setHours(0, 0, 0, 0);
        const startTimeToSave = isUnknownTime ? initialInteractionDate.current : data.startTime;
        const endTimeToSave = isUnknownTime ? initialInteractionDate.current : data.endTime;
        return {
            ...data,
            [InteractionEventDialogFields.START_TIME]: startTimeToSave,
            [InteractionEventDialogFields.END_TIME]: endTimeToSave,
            [InteractionEventDialogFields.ID]: methods.watch(InteractionEventDialogFields.ID),
            [InteractionEventDialogFields.PLACE_NAME]: Boolean(data[InteractionEventDialogFields.PLACE_NAME]) ?
                data[InteractionEventDialogFields.PLACE_NAME] : generatePlacenameByPlaceSubType(placeSubtypeName),
            [InteractionEventDialogFields.EXTERNALIZATION_APPROVAL]: Boolean(data[InteractionEventDialogFields.EXTERNALIZATION_APPROVAL]),
            [InteractionEventDialogFields.CONTACTS]: data[InteractionEventDialogFields.CONTACTS] ?
                data[InteractionEventDialogFields.CONTACTS].map((contact: Contact, index: number) => {
                    const serialId = methods.watch<string, number>(`${InteractionEventDialogFields.CONTACTS}[${index}].${InteractionEventContactFields.SERIAL_ID}`)
                    if (serialId) {
                        return {
                            ...contact,
                            [InteractionEventContactFields.SERIAL_ID]: serialId
                        }
                    } else {
                        return contact
                    }
                }) : []
        }
    }

    const onPlaceSubtypeChange = (newValue: PlaceSubType | null) => {
        if (newValue) {
            setPlaceSubtypeName(newValue?.displayName);
            methods.setValue(InteractionEventDialogFields.PLACE_SUB_TYPE, newValue.id, {shouldValidate: true});
        } else {
            setPlaceSubtypeName('');
            methods.setValue(InteractionEventDialogFields.PLACE_SUB_TYPE, null, {shouldValidate: true});
        }
    };

    const validateAndHandleSubmit = () => {
        return methods.handleSubmit(
            () => {
                const filTimeValidationMessage = 'יש למלא שעה';
                if (!isUnknownTime) {
                    if (!startTime) {
                        methods.setError(InteractionEventDialogFields.START_TIME, {
                            type: 'manual',
                            message: filTimeValidationMessage
                        });
                    }
                    if (!endTime) {
                        methods.setError(InteractionEventDialogFields.END_TIME, {
                            type: 'manual',
                            message: filTimeValidationMessage
                        });
                    }
                }
                if (Boolean(startTime && endTime) || isUnknownTime) {
                    onSubmit(methods.getValues())
                }
            })
    }

    const {
        hasAddress,
        isNamedLocation,
        isBusiness,
        nameFieldLabel = undefined,
        extraFields = [],
    } = formConfig;

    return (
        <FormProvider {...methods}>
            <form id='interactionEventForm' onSubmit={validateAndHandleSubmit()}>
                <Grid className={formClasses.form} container justify='space-between'>
                    <PlacesTypesAndSubTypes size='Dialog'
                                            placeTypeName={InteractionEventDialogFields.PLACE_TYPE}
                                            placeSubTypeName={InteractionEventDialogFields.PLACE_SUB_TYPE}
                                            placeType={placeType}
                                            placeSubType={placeSubType}
                                            onPlaceTypeChange={(newValue) => {
                                                methods.setValue(InteractionEventDialogFields.PLACE_TYPE, newValue, {shouldValidate: true});
                                                Boolean(placeName) &&
                                                methods.setValue(InteractionEventDialogFields.PLACE_NAME, '');
                                            }}
                                            onPlaceSubTypeChange={onPlaceSubtypeChange}
                    />

                    <Grid className={formClasses.formRow} container justify='flex-start'>
                        <FormInput xs={5} fieldName='משעה'>
                            <Controller
                                name={InteractionEventDialogFields.START_TIME}
                                control={methods.control}
                                render={(props) => (
                                    <TimePick
                                        disabled={isUnknownTime as boolean}
                                        testId='contactLocationStartTime'
                                        value={startTime}
                                        onChange={(newTime: Date) => {
                                            setStartTime(newTime)
                                            handleTimeChange(newTime, interactionStartTime, InteractionEventDialogFields.START_TIME)
                                        }
                                        }
                                        labelText={get(methods.errors, props.name) ? get(methods.errors, props.name).message : 'משעה*'}
                                        error={get(methods.errors, props.name)}
                                    />
                                )}
                            />
                        </FormInput>
                        <FormInput xs={4} fieldName='עד שעה'>
                            <Controller
                                name={InteractionEventDialogFields.END_TIME}
                                control={methods.control}
                                render={(props) => (
                                    <TimePick
                                        disabled={isUnknownTime as boolean}
                                        testId='contactLocationEndTime'
                                        value={endTime}
                                        onChange={(newTime: Date) => {
                                            setEndTime(newTime)
                                            handleTimeChange(newTime, interactionEndTime, InteractionEventDialogFields.END_TIME)
                                        }
                                        }
                                        labelText={get(methods.errors, props.name) ? get(methods.errors, props.name).message : 'עד שעה*'}
                                        error={get(methods.errors, props.name)}
                                    />
                                )}
                            />
                        </FormInput>
                        <FormInput xs={3}>
                            <Controller
                                name={InteractionEventDialogFields.UNKNOWN_TIME}
                                control={methods.control}
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
                    <Collapse in={hasAddress}>
                        <AddressForm/>
                    </Collapse>
                    <Collapse in={isNamedLocation}>
                        <PlaceNameForm nameFieldLabel={nameFieldLabel}/>
                    </Collapse>
                    <Collapse in={!!extraFields}>
                        {extraFields?.map((fieldElement: React.FC) => React.createElement(fieldElement))}
                    </Collapse>
                    <Grid className={formClasses.formRow} container justify='flex-start'>
                        <FormInput xs={7} fieldName='האם מותר להחצנה'>
                            <Controller
                                name={InteractionEventDialogFields.EXTERNALIZATION_APPROVAL}
                                control={methods.control}
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
                            color={methods.errors[InteractionEventDialogFields.EXTERNALIZATION_APPROVAL] ? 'error' : 'initial'}>
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
                <Grid
                    container
                    className={formClasses.form + ' ' + classes.spacedOutForm}
                >
                    <div className={classes.newContactFieldsContainer}>
                        {
                            contacts.map((contact, index: number) => (
                                <Grid key={index} item className={classes.contactedPersonContainer}>
                                    <ContactForm
                                        key={index}
                                        updatedContactIndex={index}
                                        contactStatus={contact.contactStatus}
                                        contactCreationTime={contact.creationTime}
                                    />
                                </Grid>
                            ))
                        }
                        <Grid item>
                            <IconButton
                                test-id='addContact'
                                onClick={() => append(defaultContact)}
                            >
                                <AddCircleIcon color='primary'/>
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
    interactions: InteractionEventDialogData[];
    interactionData?: InteractionEventDialogData;
    loadInteractions: () => void;
    closeNewDialog: () => void;
    closeEditDialog: () => void;
    isNewInteraction?: Boolean;
};
