import theme from 'styles/theme';
import ContactStatus from 'models/ContactStatus';
import InteractedContact from 'models/InteractedContact';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import { COMPLETE_STATUS } from 'Utils/Contacts/useContactFields';

const useReachContact = (props: Props) => {
    const { saveContact, parsePerson, formValues, index } = props;
    const { alertWarning } = useCustomSwal();

    const changeContactStatus = (
        event: React.ChangeEvent<{}>,
        selectedStatus: ContactStatus | null,
        onChange: (...event: any[]) => void
    ) => {
        event.stopPropagation();
        if (selectedStatus?.id === COMPLETE_STATUS) {
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
