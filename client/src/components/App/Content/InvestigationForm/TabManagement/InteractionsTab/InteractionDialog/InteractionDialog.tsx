import {yupResolver} from '@hookform/resolvers';
import React, {useContext, useState} from 'react';
import {FormProvider, useForm,} from 'react-hook-form';
import {Dialog, DialogTitle, DialogContent, DialogActions, Button} from '@material-ui/core';

import Contact from 'models/Contact';
import InvolvedContact from 'models/InvolvedContact';
import PlaceSubType from 'models/PlaceSubType';
import {groupedInvestigationsContext} from 'commons/Contexts/GroupedInvestigationFormContext';
import InteractionEventDialogData, {OccuranceData} from 'models/Contexts/InteractionEventDialogData';
import InteractionEventDialogFields from 'models/enums/InteractionsEventDialogContext/InteractionEventDialogFields';
import InteractionEventContactFields from 'models/enums/InteractionsEventDialogContext/InteractionEventContactFields';
import PrimaryButton from 'commons/Buttons/PrimaryButton/PrimaryButton';
import {familyMembersContext} from 'commons/Contexts/FamilyMembersContext';
import useDuplicateContactId, {IdToCheck} from 'Utils/Contacts/useDuplicateContactId';

import useStyles from './InteractionDialogStyles';
import useInteractionsForm from './InteractionEventForm/useInteractionsForm';
import ContactsTabs from './InteractionEventForm/ContactsSection/ContactsTabs';
import InteractionEventSchema from './InteractionEventForm/InteractionSection/InteractionEventSchema';
import ContactTypeKeys from './InteractionEventForm/ContactsSection/ManualContactsForm/ContactForm/ContactTypeKeys';
import InteractionEventForm, {InteractionEventFormProps} from './InteractionEventForm/InteractionSection/InteractionEventForm';
import InteractionFormTabSwitchButton from './InteractionFormTabSwitchButton';
import {DevTool} from "@hookform/devtools";


const InteractionDialog = (props: Props) => {
    const {isOpen, dialogTitle, loadInteractions, loadInvolvedContacts, interactions, onDialogClose, interactionData, isNewInteraction} = props;
    const [isAddingContacts, setIsAddingContacts] = React.useState(false);
    const [groupedInvestigationContacts, setGroupedInvestigationContacts] = useState<number[]>([]);
    const groupedInvestigationsContextState = useContext(groupedInvestigationsContext);
    groupedInvestigationsContextState.groupedInvestigationContacts = groupedInvestigationContacts;
    groupedInvestigationsContextState.setGroupedInvestigationContacts = setGroupedInvestigationContacts;

    const methods = useForm<InteractionEventDialogData>({
        defaultValues: interactionData,
        mode: 'all',
        resolver: yupResolver(InteractionEventSchema)
    });

    const classes = useStyles();
    const {familyMembers} = useContext(familyMembersContext);
    const [placeSubtypeName, setPlaceSubtypeName] = useState<string>('');
    const isUnknownTime = methods.watch(InteractionEventDialogFields.UNKNOWN_TIME);
    const placeType = methods.watch(InteractionEventDialogFields.PLACE_TYPE);
    const interactionStartTime = methods.watch(InteractionEventDialogFields.START_TIME);
    const interactionEndTime = methods.watch(InteractionEventDialogFields.END_TIME);
    const initialInteractionDate = React.useRef<Date>(new Date(interactionData?.startTime as Date));
    const {saveInteractions} = useInteractionsForm({
        loadInteractions,
        loadInvolvedContacts,
        onDialogClose,
        groupedInvestigationContacts
    });
    const {checkDuplicateIdsForInteractions} = useDuplicateContactId();

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

    const convertAdditionalOccurances = (data: OccuranceData) => ({
        ...data,
        externalizationApproval: Boolean(data.externalizationApproval),
        unknownTime:  Boolean(data.unknownTime),
    });

    const convertData = (data: InteractionEventDialogData) => {
        initialInteractionDate.current.setHours(0, 0, 0, 0);
        const startTimeToSave = isUnknownTime ? initialInteractionDate.current : data.startTime;
        const endTimeToSave = isUnknownTime ? initialInteractionDate.current : data.endTime;
        return {
            ...data,
            [InteractionEventDialogFields.START_TIME]: startTimeToSave,
            [InteractionEventDialogFields.END_TIME]: endTimeToSave,
            [InteractionEventDialogFields.UNKNOWN_TIME]: Boolean(data[InteractionEventDialogFields.UNKNOWN_TIME]),
            [InteractionEventDialogFields.ID]: methods.watch(InteractionEventDialogFields.ID),
            [InteractionEventDialogFields.PLACE_NAME]: Boolean(data[InteractionEventDialogFields.PLACE_NAME]) ?
                data[InteractionEventDialogFields.PLACE_NAME] : generatePlacenameByPlaceSubType(placeSubtypeName),
            [InteractionEventDialogFields.EXTERNALIZATION_APPROVAL]: Boolean(data[InteractionEventDialogFields.EXTERNALIZATION_APPROVAL]),
            [InteractionEventDialogFields.ADDITIONAL_OCCURRENCES]:
            data[InteractionEventDialogFields.ADDITIONAL_OCCURRENCES]?.map(convertAdditionalOccurances) || [],
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

    groupedInvestigationsContextState.allContactIds = interactions.map(interaction => interaction.contacts).flat().map((contact) => {
        return ({
            id: contact[InteractionEventContactFields.IDENTIFICATION_NUMBER],
            serialId: contact[InteractionEventContactFields.ID]
        })
    });

    const onSubmit = (data: InteractionEventDialogData) => {
        if (!data.contacts) {
            data.contacts = [];
        }
        addFamilyMemberContacts(data.contacts);

        const interactionDataToSave = convertData(data);

        const newIds: IdToCheck[] = interactionDataToSave[InteractionEventDialogFields.CONTACTS].map((contact: Contact) => {
            return ({
                id: contact[InteractionEventContactFields.IDENTIFICATION_NUMBER],
                serialId: contact[InteractionEventContactFields.ID]
            })
        });

        const contactsIdsToCheck: IdToCheck[] = groupedInvestigationsContextState.allContactIds;
        if (!checkDuplicateIdsForInteractions(contactsIdsToCheck)) {
            saveInteractions(interactionDataToSave);
        }
    };

    const onPlaceSubtypeChange = (newValue: PlaceSubType | null) => {
        if (newValue) {
            setPlaceSubtypeName(newValue?.displayName);
            methods.setValue(InteractionEventDialogFields.PLACE_SUB_TYPE, newValue.id, {shouldValidate: true});
        } else {
            setPlaceSubtypeName('');
            methods.setValue(InteractionEventDialogFields.PLACE_SUB_TYPE, null, {shouldValidate: true});
        }
    };

    const validateAndHandleSubmit = methods.handleSubmit(
        () => {
            const filTimeValidationMessage = 'יש למלא שעה';
            const repetitiveWithoutDatesSelectedErrorMessage = 'באירוע חזרתי יש לבחור מספר תאריכים';
            const repetitiveFieldMissingMessage = 'יש למלא האם מדובר באירוע חזרתי';

            const data = methods.getValues();
            const isRepetitiveFieldMissing = isNewInteraction && !(typeof data?.isRepetitive === 'boolean');
            const isRepetitiveInvalid = isRepetitiveFieldMissing
                || (data?.isRepetitive && !(data.additionalOccurrences && data.additionalOccurrences.length > 0));
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

            if (isRepetitiveInvalid) {
                methods.setError(InteractionEventDialogFields.IS_REPETITIVE, {
                    type: 'manual',
                    message: isRepetitiveFieldMissing
                        ? repetitiveFieldMissingMessage
                        : repetitiveWithoutDatesSelectedErrorMessage
                });
            }

            const canSubmit = (!!(interactionStartTime && interactionEndTime) || isUnknownTime) && !isRepetitiveInvalid;
            if (canSubmit) {
                delete data.privateHouseAddress;
                onSubmit(data);
            }
        })

    return (
        <FormProvider {...methods}>
            <DevTool control={methods.control}/>
            <Dialog classes={{paper: classes.dialogPaper}} open={isOpen} maxWidth={false}>
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
                        <ContactsTabs
                            isVisible={isAddingContacts}
                        />
                    </form>
                </DialogContent>
                <DialogActions className={`${classes.dialogFooter}`}>

                    <InteractionFormTabSwitchButton isAddingContacts={isAddingContacts}
                                                    setIsAddingContacts={setIsAddingContacts}
                                                    isNewInteraction={isNewInteraction}/>

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
