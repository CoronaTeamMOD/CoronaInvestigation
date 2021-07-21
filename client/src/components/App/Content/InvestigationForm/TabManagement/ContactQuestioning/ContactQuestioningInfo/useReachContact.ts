import { FormState, useFormContext } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import theme from 'styles/theme';
import ContactStatus from 'models/ContactStatus';
import InteractedContact from 'models/InteractedContact';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import ContactStatusCodes from 'models/enums/ContactStatusCodes';
import GroupedInteractedContact from 'models/ContactQuestioning/GroupedInteractedContact';
import { setInteractedContact } from 'redux/InteractedContacts/interactedContactsActionCreators';
import { useState } from 'react';
import { store } from 'redux/store';

const useReachContact = (props: Props) => {
    const { errors, getValues, formState } = useFormContext<GroupedInteractedContact>();
    const { saveContact, parsePerson, formValues, index } = props;
    const { alertWarning, alertError } = useCustomSwal();
    const dispatch = useDispatch();
    const [contactValid, setContactValid] = useState<boolean>(true);

    store.subscribe(() => {
        const formState = store.getState().interactedContacts.formState
        if (formState.size > 0 && contactValid != formState.get(formValues.id)?.isValid) {
            setContactValid(!!formState.get(formValues.id)?.isValid);
        }
    })

    const formHaveMissingFieldsText = `למגע זה ישנם שדות לא תקינים:`

    const formHasErrors = errors ? Boolean(errors) : false;
    const changeContactStatus = (
        contact: GroupedInteractedContact,
        event: React.ChangeEvent<{}>,
        selectedStatus: ContactStatus | null,
        onChange: (...event: any[]) => void,
        missingFieldsText: string
    ) => {

        const dispachUpdateStatus = (id: number, statusId: number, formState: FormState<GroupedInteractedContact>) => new Promise<void>((resolve, reject) => {
            dispatch(setInteractedContact(id, 'contactStatus', statusId, formState));
            resolve();
        });


        event.stopPropagation();
        const formHaveMissingFields = missingFieldsText !== '';
        if (selectedStatus?.id === ContactStatusCodes.COMPLETED) {
            if (contactValid ) {
                if (!formHaveMissingFields) {
                    alertWarning('האם אתה בטוח שתרצה להעביר את המגע לסטטוס הושלם?', {
                        text: 'לאחר העברת המגע, לא תהיה אפשרות לערוך שינויים',
                        showCancelButton: true,
                        cancelButtonText: 'בטל',
                        cancelButtonColor: theme.palette.error.main,
                        confirmButtonColor: theme.palette.primary.main,
                        confirmButtonText: 'כן, המשך',
                    }).then((result) => {
                        if (result.value) {
                            onChange(selectedStatus?.id);
                            dispachUpdateStatus(contact.id, getValues("contactStatus") as number, formState).then(() => {
                                saveContact(parsePerson(contact as GroupedInteractedContact));
                            })

                        }
                    });
                }
                if (formHaveMissingFields && missingFieldsText !== '') {
                    alertError('לא ניתן לשנות סטטוס להושלם', {
                        text: formHaveMissingFieldsText.concat(missingFieldsText),
                        confirmButtonColor: theme.palette.primary.main,
                        confirmButtonText: 'אוקיי',
                    }).then((result) => { });
                }
            } else {
                alertError('לא ניתן לשנות סטטוס להושלם', {
                    text: 'שים לב שלמגע זה ישנם שדות לא תקינים',
                    showCancelButton: false,
                    confirmButtonColor: theme.palette.primary.main,
                    confirmButtonText: 'אוקי',
                });
            }
        } else if (selectedStatus?.id) {
            onChange(selectedStatus?.id);
            dispachUpdateStatus(contact.id, getValues("contactStatus") as number, formState).then(() => {
                saveContact(parsePerson(contact as GroupedInteractedContact));
            });

        }

    };

    return {
        changeContactStatus,
    };
};



export default useReachContact;

interface Props {
    saveContact: (interactedContact: InteractedContact) => boolean;
    parsePerson: (person: GroupedInteractedContact) => InteractedContact;
    formValues: GroupedInteractedContact;
    index: number;
}
