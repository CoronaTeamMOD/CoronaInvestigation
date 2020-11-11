import React from 'react';
import {format} from 'date-fns';
import {useSelector} from 'react-redux';
import {Autocomplete} from '@material-ui/lab';
import {Divider, Grid, TextField, Typography} from '@material-ui/core';

import axios from 'Utils/axios';
import theme from 'styles/theme';
import ContactType from 'models/ContactType';
import ContactStatus from 'models/ContactStatus';
import StoreStateType from 'redux/storeStateType';
import PhoneDial from 'commons/PhoneDial/PhoneDial';
import InteractedContact from 'models/InteractedContact';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import InteractedContactFields from 'models/enums/InteractedContact';
import useContactFields, {COMPLETE_STATUS} from 'Utils/vendor/useContactFields';

import useStyles from './ContactQuestioningStyles';

const ContactQuestioningInfo: React.FC<Props> = (props: Props): JSX.Element => {
    const classes = useStyles({});

    const {interactedContact, updateInteractedContact, contactStatuses, saveContact, checkForDuplicateIds} = props;

    const {alertWarning} = useCustomSwal();

    const contactTypes = useSelector<StoreStateType, Map<number, ContactType>>(state => state.contactTypes);

    const [contactStatusInput, setContactStatusInput] = React.useState<string>('');
    const {isFieldDisabled} = useContactFields(interactedContact.contactStatus);

    const setPreviousContactStatus = () => {
        const previousStatusName = contactStatuses.find((contactStatus: ContactStatus) => contactStatus.id === interactedContact.contactStatus);
        setContactStatusInput(previousStatusName?.displayName || '');
    }

    const changeContactStatus = (event: React.ChangeEvent<{}>, selectedStatus: ContactStatus | null) => {
        event.stopPropagation();
        if (selectedStatus?.id === COMPLETE_STATUS) {
            alertWarning('האם אתה בטוח שתרצה להעביר את המגע לסטטוס הושלם?', {
                text: 'לאחר העברת המגע, לא תהיה אפשרות לערוך שינויים',
                showCancelButton: true,
                cancelButtonText: 'בטל',
                cancelButtonColor: theme.palette.error.main,
                confirmButtonColor: theme.palette.primary.main,
                confirmButtonText: 'כן, המשך'
            }).then((result) => {
                if (result.value) {
                    if (!interactedContact.identificationNumber || checkForDuplicateIds(interactedContact.identificationNumber, interactedContact.id)) {
                        updateInteractedContact(interactedContact, InteractedContactFields.CONTACT_STATUS, selectedStatus?.id);
                        saveContact({...interactedContact, contactStatus: selectedStatus?.id});
                    } else {
                        alertWarning(`שים לב, מספר זיהוי ${interactedContact.identificationNumber} חוזר על עצמו, אנא בצע את השינויים הנדרשים`);
                        setPreviousContactStatus();

                    }
                } else {
                    setPreviousContactStatus();
                }
            });
        } else if (selectedStatus?.id) {
            updateInteractedContact(interactedContact, InteractedContactFields.CONTACT_STATUS, selectedStatus?.id);
            saveContact({...interactedContact, contactStatus: selectedStatus?.id});
        }
    }

    return (
        <>
            <Grid item xs={3} container>
                <div className={classes.reachContact}>
                    <Grid item xs={8} container>
                        <Autocomplete
                            disabled={isFieldDisabled}
                            className={classes.statusAutoComplete}
                            options={contactStatuses}
                            getOptionLabel={(option) => option.displayName}
                            inputValue={contactStatusInput}
                            value={contactStatuses.find((contactStatus: ContactStatus) => contactStatus.id === interactedContact.contactStatus)}
                            onChange={changeContactStatus}
                            onInputChange={(event, newContactStatus) => {
                                if (event?.type !== 'blur') {
                                    setContactStatusInput(newContactStatus);
                                }
                            }}
                            renderInput={(params) =>
                                <TextField
                                    {...params}
                                    placeholder='סטטוס'
                                    onClick={(event) => event.stopPropagation()}
                                />
                            }
                        />
                    </Grid>
                    <Grid container item xs={2}>
                        <span onClick={(event) => event.stopPropagation()}>
                            <PhoneDial
                                phoneNumber={interactedContact.phoneNumber}
                            />
                        </span>
                    </Grid>
                </div>
                <Divider variant='fullWidth' orientation='vertical' flexItem/>
            </Grid>
            <Grid container item xs={10} direction='row-reverse' alignItems='center' justify='space-between'>
                <Typography variant='body2'>
                    <b>שם פרטי:</b> {interactedContact.firstName}
                </Typography>
                <Typography variant='body2'>
                    <b>שם משפחה:</b> {interactedContact.lastName}
                </Typography>
                <Typography variant='body2'>
                    <b>מספר טלפון:</b> {interactedContact.phoneNumber ? interactedContact.phoneNumber : 'אין מספר'}
                </Typography>
                <Typography variant='body2'>
                    <b>תאריך המגע:</b> {format(new Date(interactedContact.contactDate), 'dd/MM/yyyy')}
                </Typography>
                {
                    interactedContact.contactType &&
                    <Typography variant='body2'>
                        <b>סוג מגע:</b> {contactTypes.get(+interactedContact.contactType)?.displayName}
                    </Typography>
                }
                {
                    interactedContact.extraInfo &&
                    <Typography variant='body2'>
                        <b>פירוט אופי המגע:</b> {interactedContact.extraInfo}
                    </Typography>
                }
            </Grid>
        </>
    )
};

export default ContactQuestioningInfo;

interface Props {
    interactedContact: InteractedContact;
    updateInteractedContact: (interactedContact: InteractedContact, fieldToUpdate: InteractedContactFields, value: any) => void;
    contactStatuses: ContactStatus[];
    saveContact: (interactedContact: InteractedContact) => void;
    checkForDuplicateIds: (idToCheck: string, interactedContactId: number) => boolean;
}
