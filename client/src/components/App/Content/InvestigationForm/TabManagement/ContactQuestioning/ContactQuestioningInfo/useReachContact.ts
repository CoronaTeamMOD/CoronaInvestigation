import { useFormContext } from 'react-hook-form';

import theme from 'styles/theme';
import ContactStatus from 'models/ContactStatus';
import InteractedContact from 'models/InteractedContact';
import ContactStatusCodes from 'models/enums/ContactStatusCodes';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';

const useReachContact = (props: Props) => {
    const { errors } = useFormContext();
    const { saveContact, parsePerson, formValues, index } = props;
    const { alertWarning , alertError } = useCustomSwal();

    const formHasErrors = errors.form ? Boolean(errors.form[index]) : false;

    const changeContactStatus = (
        event: React.ChangeEvent<{}>,
        selectedStatus: ContactStatus | null,
        onChange: (...event: any[]) => void
    ) => {
        event.stopPropagation();

        if (selectedStatus?.id === ContactStatusCodes.COMPLETED) {
            if (!formHasErrors) {
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
                        saveContact(parsePerson(formValues, index));
                    }
                });
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
    parsePerson: (person: InteractedContact, index: number) => InteractedContact;
    formValues: InteractedContact;
    index: number;
}
