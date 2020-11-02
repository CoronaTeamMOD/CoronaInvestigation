import React from 'react';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';
import { Autocomplete } from '@material-ui/lab';
import { Divider, Grid, TextField, Typography } from '@material-ui/core';

import ContactType from 'models/ContactType';
import ContactStatus from 'models/ContactStatus';
import StoreStateType from 'redux/storeStateType';
import PhoneDial from 'commons/PhoneDial/PhoneDial';
import InteractedContact from 'models/InteractedContact';
import InteractedContactFields from 'models/enums/InteractedContact';

import useStyles from './ContactQuestioningStyles';

const ContactQuestioningInfo: React.FC<Props> = (props: Props): JSX.Element => {
    const classes = useStyles({});
    
    const { interactedContact, updateInteractedContact, contactStatuses } = props;
    
    const contactTypes = useSelector<StoreStateType, Map<number, ContactType>>(state => state.contactTypes);
    
    const [contactStatusInput, setContactStatusInput] = React.useState<string>('');

    return (
        <>
            <Grid item xs={3} container>
                <div className={classes.reachContact}>
                    <Grid item xs={8} container>
                        <Autocomplete
                            className={classes.statusAutoComplete}
                            options={contactStatuses}
                            getOptionLabel={(option) => option.displayName}
                            inputValue={contactStatusInput}
                            value={contactStatuses.find((contactStatus: ContactStatus) => contactStatus.id === interactedContact.contactStatus)}
                            onChange={(event, selectedStatus) => {
                                updateInteractedContact(interactedContact, InteractedContactFields.CONTACT_STATUS, selectedStatus?.id);
                            }}
                            onInputChange={(event, newContactStatus) => {
                                setContactStatusInput(newContactStatus);
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
                <Divider variant='fullWidth' orientation='vertical' flexItem />
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
};
