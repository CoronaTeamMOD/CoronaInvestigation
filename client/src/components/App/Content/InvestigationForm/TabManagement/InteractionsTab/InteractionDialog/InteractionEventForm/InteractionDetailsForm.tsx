import React, {useState} from 'react';
import {FormProvider, useForm} from 'react-hook-form';
import {yupResolver} from "@hookform/resolvers";
import InteractionEventForm, {InteractionEventFormProps} from './InteractionSection/InteractionEventForm';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';
import PlaceSubType from 'models/PlaceSubType';
import InteractionEventSchema from './InteractionSection/InteractionEventSchema';
import InteractionEventContactFields
    from 'models/enums/InteractionsEventDialogContext/InteractionEventContactFields';
import InteractionEventDialogFields
    from 'models/enums/InteractionsEventDialogContext/InteractionEventDialogFields';
import Contact from 'models/Contact';
import useDuplicateContactId, {IdToCheck} from 'Utils/vendor/useDuplicateContactId';

import useInteractionsForm from './useInteractionsForm';
import ContactsTabs from './ContactsSection/ContactsTabs';

const InteractionDetailsForm = (props: Props) => {
    const  { interactions, interactionData, loadInteractions, onDialogClose,isAddingContacts,isNewInteraction } = props;
    const initialInteractionDate = React.useRef<Date>(new Date(interactionData?.startTime as Date));
    const { saveInteractions } = useInteractionsForm({ loadInteractions, onDialogClose});
    const { checkDuplicateIdsForInteractions } = useDuplicateContactId();

    const methods = useForm<InteractionEventDialogData>({
        defaultValues: interactionData,
        mode: 'all',
        resolver: yupResolver(InteractionEventSchema)
    });

    const [placeSubtypeName, setPlaceSubtypeName] = useState<string>('');

    const onPlaceSubtypeChange = (newValue: PlaceSubType | null) => {
        if (newValue) {
            setPlaceSubtypeName(newValue?.displayName);
            methods.setValue(InteractionEventDialogFields.PLACE_SUB_TYPE, newValue.id, { shouldValidate: true });
        } else {
            setPlaceSubtypeName('');
            methods.setValue(InteractionEventDialogFields.PLACE_SUB_TYPE, null, { shouldValidate: true });
        }
    };

    const isUnknownTime = methods.watch(InteractionEventDialogFields.UNKNOWN_TIME);
    const placeType = methods.watch(InteractionEventDialogFields.PLACE_TYPE);
    const interactionStartTime = methods.watch(InteractionEventDialogFields.START_TIME);
    const interactionEndTime = methods.watch(InteractionEventDialogFields.END_TIME);

    const generatePlacenameByPlaceSubType = (input: string) => {
        if (!placeType) return '';
        if (placeType !== input) {
            return `${placeType} ${input}`.replace('/', ' או ');
        } else {
            return `${placeType}`;
        }
    };

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
            <form id='interactionEventForm' onSubmit={validateAndHandleSubmit}>
                <InteractionEventForm
                    isVisible={!isAddingContacts}
                    interactionData={interactionData}
                    isNewInteraction={isNewInteraction}
                    onPlaceSubTypeChange={onPlaceSubtypeChange}
                />

                <ContactsTabs isVisible={isAddingContacts}/>
            </form>
        </FormProvider>
    );
};

interface Props {
    isAddingContacts: boolean;
    interactions: InteractionEventDialogData[];
    loadInteractions: () => void;
    onDialogClose: () => void;
    interactionData?: InteractionEventFormProps['interactionData'];
    isNewInteraction?: InteractionEventFormProps['isNewInteraction'];
}

export default InteractionDetailsForm;