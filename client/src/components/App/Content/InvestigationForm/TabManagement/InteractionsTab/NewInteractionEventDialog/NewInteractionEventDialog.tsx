import React, {useState} from 'react';
import { AddCircle as AddCircleIcon} from '@material-ui/icons';
import { Dialog, DialogTitle, DialogContent, DialogActions,
    Button, Grid, Typography, Select, MenuItem, Divider, IconButton } from '@material-ui/core';

import Contact from 'models/Contact';
import Toggle from 'commons/Toggle/Toggle';
import DatePick from 'commons/DatePick/DatePick';
import CircleTextField from 'commons/CircleTextField/CircleTextField';
import InteractionEventVariables from 'models/InteractionEventVariables';

import useStyles from './NewInteractionEventDialogStyles';
import useFormStyles from 'styles/formStyles';
import PrimaryButton from 'commons/Buttons/PrimaryButton/PrimaryButton';

export interface Props {
    isOpen: boolean,
    eventId: number,
    onCancel: (eventId: number) => void;
    onCreateEvent: (interactionEventVariables: InteractionEventVariables) => void;
}

const selectData = [
    'מקום 1',
    'מקום 2',
    'מקום 3',
    'מקום 4',
    'מקום 5'
];

const defaultContact: Contact = {
    name: '',
    phoneNumber: '',
    id: '',
    needsToBeQuarantined: false,
    moreDetails: '',
};

const defaultTime : string = '00:00';
const newContactEventTitle = 'יצירת מקום/מגע חדש';
const contactedPersonPhone: string = 'מספר טלפון';
const contactedPersonName: string = 'שם';
const contactedPersonID: string = 'ת.ז';
const addContactButton: string = 'הוסף מגע';

const NewInteractionEventDialog : React.FC<Props> = (props: Props) : JSX.Element => {
    const { isOpen, eventId, onCancel, onCreateEvent } = props;

    const classes = useStyles();
    const formClasses = useFormStyles();
    const [canCreateEvent, setCanCreateEvent] = useState<boolean>(false);
    const [placeType, setPlaceType] = useState<string>(selectData[0]);
    const [eventStartTime, setEventStartTime] = useState<string>();
    const [eventEndTime, setEventEndTime] = useState<string>();
    const [canBeExported, setCanBeExported] = useState<boolean>(false);
    const [canAddContact, setCanAddContact] = useState<boolean>(false);
    const [allContacts, setAllContacts] = useState<Contact[]>([{...defaultContact}]);

    const spliceAndUpdateTheContacts = (updatedContact: Contact, indexToUpdate: number) => {
        const updatedContacts = [...allContacts];
        updatedContacts.splice(indexToUpdate, 1, updatedContact);
        setAllContacts(updatedContacts);
    }

    const handleNameChange = (event: React.ChangeEvent<{ value: unknown }>, currentEditedContact: Contact) => {
        const currContactIndex = allContacts.findIndex((contact: Contact) => contact.phoneNumber === currentEditedContact.phoneNumber);
        currentEditedContact.name = event.target.value as string;
        spliceAndUpdateTheContacts(currentEditedContact, currContactIndex);
        if(currentEditedContact.phoneNumber !== '' && currentEditedContact.name !== '') {
            setCanAddContact(true);
        }
    }

    const handlePhoneChange = (event: React.ChangeEvent<{ value: unknown }>, currentEditedContact: Contact) => {
        const currContactIndex = allContacts.findIndex((contact) => contact.phoneNumber === currentEditedContact.phoneNumber);
        currentEditedContact.phoneNumber = event.target.value as string;
        spliceAndUpdateTheContacts(currentEditedContact, currContactIndex);
        if(currentEditedContact.phoneNumber !== '' && currentEditedContact.name !== '') {
            setCanAddContact(true);
        }
    }

    const handleIDChange = (event: React.ChangeEvent<{ value: unknown }>, currentEditedContact: Contact) => {
        const currContactIndex = allContacts.findIndex((contact) => contact.phoneNumber === currentEditedContact.phoneNumber);
        currentEditedContact.id = event.target.value as string;
        spliceAndUpdateTheContacts(currentEditedContact, currContactIndex);
    }

    const handleMoreDetailsChange = (event: React.ChangeEvent<{ value: unknown }>, currentEditedContact: Contact) => {
        const currContactIndex = allContacts.findIndex((contact) => contact.phoneNumber === currentEditedContact.phoneNumber);
        currentEditedContact.moreDetails = event.target.value as string;
        spliceAndUpdateTheContacts(currentEditedContact, currContactIndex);
    }

    const handleQuarantineToggleChange = (quarantineCondition: boolean, currentEditedContact: Contact) => {
        const currContactIndex = allContacts.findIndex((contact) => contact.phoneNumber === currentEditedContact.phoneNumber);
        currentEditedContact.needsToBeQuarantined = quarantineCondition;
        spliceAndUpdateTheContacts(currentEditedContact, currContactIndex);
    }

    const handleContactAdd = () => {
        const updatedContacts = [...allContacts, {...defaultContact}];
        setAllContacts(updatedContacts);
        setCanAddContact(false);
    }

    const getContactForm = (singleContactInfo: Contact) => {
        return (
            <div className={classes.singleNewContactForm}>
                <div className={classes.addContactFields}>
                    <Typography variant={'caption'} className={classes.fieldName}>{contactedPersonName + ': '}</Typography>
                    <CircleTextField id={'contactedPersonName'}
                                     className={classes.newContactField}
                                     value={singleContactInfo.name}
                                     placeholder={contactedPersonName}
                                     onChange={(event) => {
                                         handleNameChange(event, singleContactInfo)
                                     }}
                    />
                    <Typography variant={'caption'} className={classes.fieldName}>{contactedPersonPhone + ': '}</Typography>
                    <CircleTextField id={'contactedPersonPhone'}
                                     className={classes.newContactField}
                                     value={singleContactInfo.phoneNumber}
                                     placeholder={contactedPersonPhone}
                                     onChange={(event) => {
                                         handlePhoneChange(event, singleContactInfo)
                                     }}
                                     required={false}
                    />
                    <Typography variant={'caption'} className={classes.fieldName}>{contactedPersonID + ': '}</Typography>
                    <CircleTextField  id={'contactedPersonID'}
                                      className={classes.newContactField}
                                      value={singleContactInfo.id}
                                      placeholder={contactedPersonID}
                                      onChange={(event) => {
                                          handleIDChange(event, singleContactInfo)
                                      }}
                    />
                    <Typography variant='caption' className={classes.fieldName}>
                        צריך בידוד?
                    </Typography>
                    <Toggle
                        className={classes.toggle}
                        value={singleContactInfo.needsToBeQuarantined}
                        onChange={(event, val) => () => {
                            handleQuarantineToggleChange(val ,singleContactInfo)
                        }}
                    />
                </div>
                <CircleTextField className={classes.moreContactDetails}
                                 value={singleContactInfo.moreDetails}
                                 placeholder={'פירוט נוסף על אופי המגע'}
                                 onChange={(event) => {
                                     handleMoreDetailsChange(event, singleContactInfo)
                                 }}/>
            </div>
        );
    }

    React.useEffect(() => {
        setCanCreateEvent(eventStartTime !== undefined && eventEndTime !== undefined);
    }, [eventStartTime, eventEndTime]);

    return (
        <Dialog classes={{paper: classes.dialogPaper}} open={isOpen} maxWidth={false}>
            <DialogTitle className={classes.dialogTitleWrapper}>
                {newContactEventTitle}
            </DialogTitle>
            <DialogContent className={classes.allDialogContent}>
                <Grid className={classes.form} container justify='flex-start'>
                    <div className={classes.rowDiv}>
                        <Grid item xs={3}>
                            <Typography variant='caption' className={classes.fieldName}>
                                סוג אתר:
                            </Typography>
                        </Grid>
                        <Grid item xs={9}>
                            <Select
                                value={placeType}
                                onChange={(event: React.ChangeEvent<any>) => setPlaceType(event.target.value)}
                                className={classes.placeTypeSelect}
                            >
                                {
                                    selectData.map((placeName: string) => (
                                        <MenuItem key={placeName} value={placeName}>{placeName}</MenuItem>
                                    ))
                                }
                            </Select>
                        </Grid>
                    </div>
                    <div className={formClasses.rowDiv}>
                        <Grid item xs={3}>
                            <Typography variant='caption' className={formClasses.fieldName}>
                                משעה:
                            </Typography>
                        </Grid>
                        <Grid item xs={9}>
                            <DatePick
                                datePickerType='time'
                                value={eventStartTime || defaultTime}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEventStartTime(event.target.value as string)}
                            />
                        </Grid>
                    </div>
                    <div className={formClasses.rowDiv}>
                        <Grid item xs={3}>
                            <Typography variant='caption' className={formClasses.fieldName}>
                                עד שעה:
                            </Typography>
                        </Grid>
                        <Grid item xs={9}>
                            <DatePick
                                datePickerType='time'
                                value={eventEndTime || defaultTime}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEventEndTime(event.target.value)}/>
                        </Grid>
                    </div>
                    <div className={formClasses.rowDiv}>
                        <Grid item xs={3}>
                            <Typography variant='caption' className={formClasses.fieldName}>
                                האם מותר להחצנה?
                            </Typography>
                        </Grid>
                        <Grid item xs={9}>
                            <Toggle
                                className={classes.toggle}
                                value={canBeExported}
                                onChange={(event, val) => setCanBeExported(val)}/>
                        </Grid>
                    </div>
                </Grid>
                <Divider light={true}/>
                <Grid container className={classes.form} xs={2}>
                    <div className={classes.newContactFieldsContainer}>
                        {
                            allContacts.map((contact: Contact) => { return getContactForm(contact) })
                        }
                        <Grid item direction={'row'}>
                            <IconButton onClick={handleContactAdd} disabled={!canAddContact}>
                                <AddCircleIcon color={!canAddContact ? 'disabled' : 'primary'}/>
                            </IconButton>
                            <Typography variant={'caption'} className={classes.fieldName}>{addContactButton}</Typography>
                        </Grid>
                    </div>
                </Grid>
            </DialogContent>
            <DialogActions className={classes.dialogFooter}>
                <Button
                    onClick={() => onCancel(eventId)}
                    color='default'
                    className={classes.cancelButton}>
                    בטל
                </Button>
                <PrimaryButton 
                    disabled={!canCreateEvent}
                    onClick={() => onCreateEvent({canBeExported, eventEndTime, eventStartTime, placeType})}>
                    צור מקום/מגע
                </PrimaryButton>
            </DialogActions>
        </Dialog>
    );
};

export default NewInteractionEventDialog;