import { useSelector } from 'react-redux';
import {DevTool} from '@hookform/devtools';
import {yupResolver} from '@hookform/resolvers';
import {FormProvider, useForm,} from 'react-hook-form';
import React, {useContext, useMemo, useState} from 'react';
import {Dialog, DialogTitle, DialogContent, DialogActions, Button, Tooltip} from '@material-ui/core';

import theme from 'styles/theme';
import Contact from 'models/Contact';
import PlaceSubType from 'models/PlaceSubType';
import StoreStateType from 'redux/storeStateType';
import InvolvedContact from 'models/InvolvedContact';
import GreenPassQuestion from 'models/GreenPassQuestion';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import PrimaryButton from 'commons/Buttons/PrimaryButton/PrimaryButton';
import {ContactBankContextProvider , ContactBankOption} from 'commons/Contexts/ContactBankContext';
import {GroupedInvestigationsContextProvider} from 'commons/Contexts/GroupedInvestigationFormContext';
import {familyMembersContext, FamilyMembersDataContextProvider} from 'commons/Contexts/FamilyMembersContext';
import InteractionEventDialogData, {DateData, OccuranceData} from 'models/Contexts/InteractionEventDialogData';
import InteractionEventDialogFields from 'models/enums/InteractionsEventDialogContext/InteractionEventDialogFields';
import InteractionEventContactFields from 'models/enums/InteractionsEventDialogContext/InteractionEventContactFields';
import placeTypesCodesHierarchy, {getOptionsByPlaceAndSubplaceType} from 'Utils/ContactEvent/placeTypesCodesHierarchy';

import useStyles from './InteractionDialogStyles';
import useInteractionsForm from './InteractionEventForm/useInteractionsForm';
import InteractionFormTabSwitchButton from './InteractionFormTabSwitchButton';
import ContactsTabs from './InteractionEventForm/ContactsSection/ContactsTabs';
import InteractionEventSchema from './InteractionEventForm/InteractionSection/InteractionEventSchema';
import ContactTypeKeys from './InteractionEventForm/ContactsSection/ManualContactsForm/ContactForm/ContactTypeKeys';
import repetitiveFieldTools from './InteractionEventForm/InteractionSection/RepetitiveEventForm/hooks/repetitiveFieldTools';
import InteractionEventForm, {InteractionEventFormProps} from './InteractionEventForm/InteractionSection/InteractionEventForm';

const filTimeValidationMessage = 'יש למלא שעה';
const repetitiveWithoutDatesSelectedErrorMessage = 'שים לב שלא ניתן לשמור אירוע מחזורי עם תאריך אחד בלבד';
const repetitiveFieldMissingMessage = 'יש למלא האם מדובר באירוע מחזורי';

const InteractionDialog = (props: Props) => {
    const {isOpen, dialogTitle, loadInteractions, loadInvolvedContacts, interactions, onDialogClose, interactionData, isNewInteraction} = props;
    const [isAddingContacts, setIsAddingContacts] = React.useState(false);
    const [groupedInvestigationContacts, setGroupedInvestigationContacts] = useState<number[]>([]);
    const [contactBank, setContactBank] = useState<Map<number, ContactBankOption>>(new Map());
    
    const { alertWarning } = useCustomSwal();

    const methods = useForm<InteractionEventDialogData>({
        defaultValues: interactionData,
        mode: 'all',
        resolver: yupResolver(InteractionEventSchema)
    });

    const greenPassQuestions = useSelector<StoreStateType, GreenPassQuestion[]>(state => state.greenPass.greenPassQuestions);
    const greenPassFields = greenPassQuestions.map((greenPassQuestion) => `${InteractionEventDialogFields.IS_GREEN_PASS}-${greenPassQuestion.id}`);
    const isGreenPass = methods.watch(greenPassFields);

    const classes = useStyles();
    const {familyMembers} = useContext(familyMembersContext);
    const [placeSubtypeName, setPlaceSubtypeName] = useState<string>('');
    const isUnknownTime = methods.watch(InteractionEventDialogFields.UNKNOWN_TIME);
    const placeType = methods.watch(InteractionEventDialogFields.PLACE_TYPE);
    const interactionStartTime = methods.watch(InteractionEventDialogFields.START_TIME);
    const interactionEndTime = methods.watch(InteractionEventDialogFields.END_TIME);
    const isRepetitive = methods.watch(InteractionEventDialogFields.IS_REPETITIVE);
    const additionalOccurrences = methods.watch(InteractionEventDialogFields.ADDITIONAL_OCCURRENCES, []);
    const initialInteractionDate = React.useRef<Date>(new Date(interactionData?.startTime as Date));

    const isRepetitiveFieldInvalid = useMemo(() => {
            const isRepetitiveFieldMissing = isNewInteraction && !(typeof isRepetitive === 'boolean');
            const missingAdditionalDate = isNewInteraction && isRepetitive && !(additionalOccurrences && additionalOccurrences.length > 0);

            return {
                RepetitiveFieldMissingMessage: isRepetitiveFieldMissing ? repetitiveFieldMissingMessage : '',
                missingAdditionalDateMessage: missingAdditionalDate ? repetitiveWithoutDatesSelectedErrorMessage : '',
                invalid: isRepetitiveFieldMissing || missingAdditionalDate
            }
        },
        [isRepetitive, isNewInteraction,additionalOccurrences]);
    const isPlaceTypeSelected = Boolean(placeType)
    const isGreenPassInvalid = useMemo(() => {
        return (placeType !== placeTypesCodesHierarchy.privateHouse.code && Object.values(isGreenPass).some((answer) => answer === undefined));
    },
    [isGreenPass]);

    const {saveInteractions} = useInteractionsForm({
        loadInteractions,
        loadInvolvedContacts,
        onDialogClose,
        groupedInvestigationContacts,
        contactBank
    });

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

    const convertGreenPassQuestions = (data: InteractionEventDialogData) => {
        let greenPass = [];
        if (data[InteractionEventDialogFields.PLACE_TYPE] !== placeTypesCodesHierarchy.privateHouse.code) {
            for (let field of Object.keys(data)) {
                if (field.includes(InteractionEventDialogFields.IS_GREEN_PASS)) {
                    let questionId = parseInt(field.slice(12));
                    let answerId = +(data as any)[field];
                    greenPass.push({questionId, answerId});
                }
            }
        }
        return greenPass;
    };

    const convertData = (data: InteractionEventDialogData) => {
        const { isNamedLocation } = getOptionsByPlaceAndSubplaceType(data.placeType, data.placeSubType);
        initialInteractionDate.current.setHours(0, 0, 0, 0);
        const startTimeToSave = isUnknownTime ? initialInteractionDate.current : data.startTime;
        const endTimeToSave = isUnknownTime ? initialInteractionDate.current : data.endTime;

        return {
            ...data,
            [InteractionEventDialogFields.START_TIME]: startTimeToSave,
            [InteractionEventDialogFields.END_TIME]: endTimeToSave,
            [InteractionEventDialogFields.UNKNOWN_TIME]: Boolean(data[InteractionEventDialogFields.UNKNOWN_TIME]),
            [InteractionEventDialogFields.ID]: methods.watch(InteractionEventDialogFields.ID),
            [InteractionEventDialogFields.PLACE_NAME]: 
                isNamedLocation && Boolean(data[InteractionEventDialogFields.PLACE_NAME])
                    ? data[InteractionEventDialogFields.PLACE_NAME]
                    : generatePlacenameByPlaceSubType(placeSubtypeName),
            [InteractionEventDialogFields.EXTERNALIZATION_APPROVAL]: Boolean(data[InteractionEventDialogFields.EXTERNALIZATION_APPROVAL]),
            [InteractionEventDialogFields.ADDITIONAL_OCCURRENCES]:
            data[InteractionEventDialogFields.ADDITIONAL_OCCURRENCES]?.map(convertAdditionalOccurances) || [],
            [InteractionEventDialogFields.CONTACTS]: data[InteractionEventDialogFields.CONTACTS]?.map((contact: Contact, index: number) => {
                    const serialId = methods.watch<string, number>(`${InteractionEventDialogFields.CONTACTS}[${index}].${InteractionEventContactFields.ID}`)
                    if (serialId) {
                        return {
                            ...contact,
                            [InteractionEventContactFields.ID]: serialId
                        }
                    } else {
                        return contact
                    }
                }) || [],
            [InteractionEventDialogFields.IS_GREEN_PASS]: convertGreenPassQuestions(data),
        }
    };

    const fireRepetitiveContactWarning = () =>
        alertWarning('שים לב כי לא הוזנו עד כה מגעים לאירועים מחזוריים\n' +
            'ותצטרך להוסיף אותם בנפרד לכל תאריך שיצרת בו אירוע ', {
            showCancelButton: true,
            cancelButtonText: 'בטל',
            cancelButtonColor: theme.palette.error.main,
            confirmButtonColor: theme.palette.primary.main,
            confirmButtonText: 'אישור',
        });

    const onSubmit = (data: InteractionEventDialogData) => {
        if (!data.contacts) {
            data.contacts = [];
        }
        addFamilyMemberContacts(data.contacts);

        const interactionDataToSave = convertData(data);

        if (isNewInteraction && data.isRepetitive) {
            fireRepetitiveContactWarning()
                .then(result => {
                    if (result.value) {
                        saveInteractions(interactionDataToSave)
                    }
                })
        } else {
            saveInteractions(interactionDataToSave)
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

    const getAndSetDateErrors =(data:DateData, index?:number) => {
        const {generateFieldName} = repetitiveFieldTools(index);

        if (!data.unknownTime) {
            if (!data.startTime) {
                methods.setError(generateFieldName(InteractionEventDialogFields.START_TIME), {
                    type: 'manual',
                    message: filTimeValidationMessage
                });
            }
            if (!data.endTime) {
                methods.setError(generateFieldName(InteractionEventDialogFields.END_TIME), {
                    type: 'manual',
                    message: filTimeValidationMessage
                });
            }
        }

        return (!data.unknownTime && (!data.startTime || !data.endTime));
    };

    const getPersonMap = () => {
        const allInteractionPersons = interactions.flatMap(interaction => interaction.contacts);
        const personMap = new Map<number,Contact>();
        allInteractionPersons.forEach(person => {
            const {personInfo} = person;
            personInfo && personMap.set(personInfo, person);
        });
        return personMap;
    }

    const getExistingPersonInfos = () => {
        return interactionData?.contacts.map(contact => contact.personInfo);
    };

    const contactBankProviderState = {
        contactBank, 
        setContactBank, 
        existingEventPersonInfos : getExistingPersonInfos()
    };

    const getEventContactIds = () => {
        const ids = interactions.map(interaction => interaction.contacts).flat().map((contact) => 
                contact[InteractionEventContactFields.IDENTIFICATION_NUMBER]
        );
        return ids;
    };

    const groupedInvestigationProviderState = {
        groupedInvestigationContacts, 
        setGroupedInvestigationContacts,
        eventContactIds : getEventContactIds()
    };

    const getEventFamilyMembersIds = () => {
        return interactionData?.contacts.map(contact => contact.identificationNumber);
    };

    const familyMembersDataProviderState = {
        familyMembers, 
        eventFamilyMembersIds : getEventFamilyMembersIds()
    };

    const validateAndHandleSubmit = methods.handleSubmit(() => {
        const datesHaveError =
            getAndSetDateErrors({unknownTime: isUnknownTime,startTime: interactionStartTime, endTime: interactionEndTime })
            || additionalOccurrences?.map((occurence, index) => getAndSetDateErrors(occurence, index)).some(Boolean);

        const canSubmit = !(datesHaveError || isRepetitiveFieldInvalid.invalid);

        if (canSubmit) {
            const data = methods.getValues();
            delete data.privateHouseAddress;
            onSubmit(data);
        }
    });

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
                        <GroupedInvestigationsContextProvider value={groupedInvestigationProviderState}>
                            <FamilyMembersDataContextProvider value={familyMembersDataProviderState}>
                                <ContactBankContextProvider value={contactBankProviderState}>
                                    <ContactsTabs
                                        isVisible={isAddingContacts}
                                        existingPersons={getPersonMap()}
                                    />
                                </ContactBankContextProvider>
                            </FamilyMembersDataContextProvider>
                        </GroupedInvestigationsContextProvider>
                    </form>
                </DialogContent>
                <DialogActions className={`${classes.dialogFooter}`}>

                    <InteractionFormTabSwitchButton isAddingContacts={isAddingContacts}
                                                    setIsAddingContacts={setIsAddingContacts}
                                                    isNewInteraction={isNewInteraction}/>

                    <div className={classes.footerActionButtons}>
                        <Button
                            onClick={onDialogClose}
                            color='default'
                            className={classes.cancelButton}>
                            בטל
                        </Button>
                        <Tooltip title={
                            isRepetitiveFieldInvalid.RepetitiveFieldMissingMessage || isRepetitiveFieldInvalid.missingAdditionalDateMessage
                        }>
                            <div>
                                <PrimaryButton disabled={isRepetitiveFieldInvalid.invalid || isGreenPassInvalid || !isPlaceTypeSelected}
                                               form='interactionEventForm'
                                               type='submit'
                                               id='createContact'>
                                    {`${isNewInteraction ? 'צור' : 'ערוך'} מקום ומגעים`}
                                </PrimaryButton>
                            </div>
                        </Tooltip>
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