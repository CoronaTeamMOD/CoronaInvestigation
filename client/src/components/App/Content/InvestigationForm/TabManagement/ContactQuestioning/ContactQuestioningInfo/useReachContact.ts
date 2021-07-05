import { useFormContext } from 'react-hook-form';

import theme from 'styles/theme';
import ContactStatus from 'models/ContactStatus';
import InteractedContact from 'models/InteractedContact';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import ContactStatusCodes from 'models/enums/ContactStatusCodes';
import GroupedInteractedContact from 'models/ContactQuestioning/GroupedInteractedContact';

const useReachContact = (props: Props) => {
    const { errors, getValues } = useFormContext();
    const { saveContact, parsePerson, formValues, index } = props;
    const { alertWarning , alertError } = useCustomSwal();
    const formHaveMissingFieldsText = `למגע זה ישנם שדות לא תקינים:`

    const formHasErrors = errors.form; // ? Boolean(errors.form[index]) : false;
    const changeContactStatus = (
        event: React.ChangeEvent<{}>,
        selectedStatus: ContactStatus | null,
        onChange: (...event: any[]) => void,
        missingFieldsText: string
    ) => {
        event.stopPropagation();
        const formHaveMissingFields = missingFieldsText!=='';
        if (selectedStatus?.id === ContactStatusCodes.COMPLETED) {
            if (!formHasErrors) {
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
                            let contactedPerson = getValues().form;
                            saveContact(parsePerson(contactedPerson, index));
                        }
                    });
                }
                if (formHaveMissingFields && missingFieldsText !== '') {
                    alertError('לא ניתן לשנות סטטוס להושלם', {
                        text: formHaveMissingFieldsText.concat(missingFieldsText),
                        confirmButtonColor: theme.palette.primary.main,
                        confirmButtonText: 'אוקיי',
                    }).then((result) => {}); 
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
            saveContact(parsePerson(formValues, index));
        }
    };

    return {
        changeContactStatus,
    };
};

export default useReachContact;

interface Props {
    saveContact: (interactedContact: InteractedContact) => boolean;
    parsePerson: (person: GroupedInteractedContact, index: number) => InteractedContact;
    formValues: GroupedInteractedContact;
    index: number;
}
