import { ChevronRight } from '@material-ui/icons';
import { yupResolver } from '@hookform/resolvers';
import React, { useContext, useState } from 'react';
import { FormProvider, useForm, } from 'react-hook-form';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Tooltip } from '@material-ui/core';

import Contact from 'models/Contact';
import InvolvedContact from 'models/InvolvedContact';
import PlaceSubType from 'models/PlaceSubType';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';
import InteractionEventDialogFields from 'models/enums/InteractionsEventDialogContext/InteractionEventDialogFields';
import InteractionEventContactFields from 'models/enums/InteractionsEventDialogContext/InteractionEventContactFields';
import PrimaryButton from 'commons/Buttons/PrimaryButton/PrimaryButton';
import { familyMembersContext } from 'commons/Contexts/FamilyMembersContext';
import useDuplicateContactId, { IdToCheck } from 'Utils/Contacts/useDuplicateContactId';
import { get } from 'Utils/auxiliaryFunctions/auxiliaryFunctions';

import useStyles from './InteractionDialogStyles';
import useInteractionsForm from './InteractionEventForm/useInteractionsForm';
import ContactsTabs from './InteractionEventForm/ContactsSection/ContactsTabs';
import InteractionEventSchema from './InteractionEventForm/InteractionSection/InteractionEventSchema';
import ContactTypeKeys from './InteractionEventForm/InteractionSection/ContactForm/ContactTypeKeys';
import InteractionEventForm, { InteractionEventFormProps } from './InteractionEventForm/InteractionSection/InteractionEventForm';

const InteractionDialog = (props: Props) => {
    const { isOpen, dialogTitle, loadInteractions, loadInvolvedContacts, interactions, onDialogClose, interactionData, isNewInteraction } = props;
    const [isAddingContacts, setIsAddingContacts] = React.useState(false);

    const methods = useForm<InteractionEventDialogData>({
        defaultValues: interactionData,
        mode: 'all',
        resolver: yupResolver(InteractionEventSchema)
    });

    const classes = useStyles();
    const { familyMembers } = useContext(familyMembersContext);
    const [placeSubtypeName, setPlaceSubtypeName] = useState<string>('');
    const hebrewActionName = isNewInteraction ? 'יצירת' : 'עריכת';
    const isUnknownTime = methods.watch(InteractionEventDialogFields.UNKNOWN_TIME);
    const placeType = methods.watch(InteractionEventDialogFields.PLACE_TYPE);
    const interactionStartTime = methods.watch(InteractionEventDialogFields.START_TIME);
    const interactionEndTime = methods.watch(InteractionEventDialogFields.END_TIME);
    const initialInteractionDate = React.useRef<Date>(new Date(interactionData?.startTime as Date));
    const { saveInteractions } = useInteractionsForm({ loadInteractions, loadInvolvedContacts, onDialogClose });
    const { checkDuplicateIdsForInteractions } = useDuplicateContactId();

    const isContinueToContactsEnable = (): boolean | undefined => {
        return !Boolean(get(methods.errors, InteractionEventDialogFields.PLACE_TYPE)) && !Boolean(get(methods.errors, InteractionEventDialogFields.PLACE_SUB_TYPE))
    }
    const addFamilyMemberContacts = (contacts: Contact[]) => {
        familyMembers.forEach((familyMember: InvolvedContact) => {
            if (familyMember.selected) {
                const familyContact: Contact = {
                    firstName: familyMember.firstName,
                    lastName: familyMember.lastName,
                    phoneNumber: familyMember.phoneNumber,
                    identificationNumber: familyMember.identificationNumber,
                    contactType: ContactTypeKeys.CONTACT_TYPE_TIGHT,
                    involvedContactId: familyMember.id,
                    familyRelationship: familyMember.familyRelationship?.id,
                    identificationType: familyMember.identificationType
                };

                contacts.push(familyContact);
            }
        });
    };

    const generatePlacenameByPlaceSubType = (input: string) => {
        if (!placeType) return '';
        if (placeType !== input) {
            return `${placeType} ${input}`.replace('/', ' או ');
        } else {
            return `${placeType}`;
        }
    };

    const convertData = (data: InteractionEventDialogData) => {
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
                    const serialId = methods.watch<string, number>(`${InteractionEventDialogFields.CONTACTS}[${index}].${InteractionEventContactFields.ID}`)
                    if (serialId) {
                        return {
                            ...contact,
                            [InteractionEventContactFields.ID]: serialId
                        }
                    } else {
                        return contact
                    }
                }) : []
        }
    };

    const onSubmit = (data: InteractionEventDialogData) => {
        if (!data.contacts) {
            data.contacts = [];
        }
        addFamilyMemberContacts(data.contacts);

        const interactionDataToSave = convertData(data);
        const allContactsIds: IdToCheck[] = interactions.map(interaction => interaction.contacts).flat().map((contact) => {
            return ({
                id: contact[InteractionEventContactFields.IDENTIFICATION_NUMBER],
                serialId: contact[InteractionEventContactFields.ID]
            })
        });

        const newIds: IdToCheck[] = interactionDataToSave[InteractionEventDialogFields.CONTACTS].map((contact: Contact) => {
            return ({
                id: contact[InteractionEventContactFields.IDENTIFICATION_NUMBER],
                serialId: contact[InteractionEventContactFields.ID]
            })
        });

        const contactsIdsToCheck: IdToCheck[] = allContactsIds.concat(newIds);
        if (!checkDuplicateIdsForInteractions(contactsIdsToCheck)) {
            saveInteractions(interactionDataToSave);
        }
    };
    const onPlaceSubtypeChange = (newValue: PlaceSubType | null) => {
        if (newValue) {
            setPlaceSubtypeName(newValue?.displayName);
            methods.setValue(InteractionEventDialogFields.PLACE_SUB_TYPE, newValue.id, { shouldValidate: true });
        } else {
            setPlaceSubtypeName('');
            methods.setValue(InteractionEventDialogFields.PLACE_SUB_TYPE, null, { shouldValidate: true });
        }
    };

    const validateAndHandleSubmit = methods.handleSubmit(
        () => {
            const filTimeValidationMessage = 'יש למלא שעה';
            if (!isUnknownTime) {
                if (!interactionStartTime) {
                    methods.setError(InteractionEventDialogFields.START_TIME, {
                        type: 'manual',
                        message: filTimeValidationMessage
                    });
                }
                if (!interactionEndTime) {
                    methods.setError(InteractionEventDialogFields.END_TIME, {
                        type: 'manual',
                        message: filTimeValidationMessage
                    });
                }
            }
            if (Boolean(interactionStartTime && interactionEndTime) || isUnknownTime) {
                onSubmit(methods.getValues())
            }
        })

    return (
        <FormProvider {...methods}>
            <Dialog classes={{ paper: classes.dialogPaper }} open={isOpen} maxWidth={false}>
                <DialogTitle className={classes.dialogTitleWrapper}>
                    {dialogTitle}
                </DialogTitle>
                <DialogContent>

                    <form id='interactionEventForm' onSubmit={validateAndHandleSubmit}>
                        <InteractionEventForm
                            isVisible={!isAddingContacts}
                            interactionData={interactionData}
                            isNewInteraction={isNewInteraction}
                            onPlaceSubTypeChange={onPlaceSubtypeChange}
                        />
                        <ContactsTabs isVisible={isAddingContacts} />
                    </form>
                </DialogContent>
                <DialogActions className={`${classes.dialogFooter}`}   >
                    {
                        <Tooltip title={isContinueToContactsEnable() ? '' : 'לא ניתן לעבור ליצירת מגעים מבלי להזין "סוג אתר/תת סוג'}>
                            <div>
                                <Button disabled={!isContinueToContactsEnable()} variant='text' className={classes.changeEventSubFormButton}
                                    onClick={async () => {
                                        await methods.trigger()
                                        isContinueToContactsEnable() && setIsAddingContacts(!isAddingContacts)
                                    }}>
                                    <ChevronRight />
                                    {isAddingContacts ? `חזרה ל${hebrewActionName} מקום` : `המשך ל${hebrewActionName} מגעים`}
                                </Button>
                            </div>
                        </Tooltip>

                    }
                    <div>
                        <Button
                            onClick={onDialogClose}
                            color='default'
                            className={classes.cancelButton}>
                            בטל
                    </Button>
                        <PrimaryButton
                            form='interactionEventForm'
                            type='submit'
                            id='createContact'
                        >
                            {`${isNewInteraction ? 'צור' : 'ערוך'} מקום ומגעים`}
                    </PrimaryButton>
                    </div>
                </DialogActions>
            </Dialog>
        </FormProvider>
    );
};

export default InteractionDialog;

interface Props {
    isOpen: boolean;
    dialogTitle: string;
    interactionData?: InteractionEventFormProps['interactionData'];
    isNewInteraction: InteractionEventFormProps['isNewInteraction'];
    onDialogClose: () => void;
    loadInteractions: () => void;
    loadInvolvedContacts: () => void;
    interactions: InteractionEventDialogData[];
    testIds: Record<DialogTestIds, string>;
};

type DialogTestIds = 'cancelButton' | 'submitButton';
