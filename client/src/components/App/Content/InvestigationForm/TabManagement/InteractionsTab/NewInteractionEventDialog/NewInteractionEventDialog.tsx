import React, {useState} from 'react';
import { parse, format, set, startOfDay } from 'date-fns';
import { parseFromTimeZone } from 'date-fns-timezone';
import { AddCircle as AddCircleIcon} from '@material-ui/icons';
import { Dialog, DialogTitle, DialogContent, DialogActions, Collapse,
    Button, Grid, Typography, Divider, IconButton } from '@material-ui/core';
    
import Contact from 'models/Contact';
import Toggle from 'commons/Toggle/Toggle';
import DatePick from 'commons/DatePick/DatePick';
import useFormStyles from 'styles/formStyles';
import FormInput from 'commons/FormInput/FormInput';
import Address, { initAddress } from 'models/Address';
import CircleSelect from 'commons/CircleSelect/CircleSelect';
import CircleTextField from 'commons/CircleTextField/CircleTextField';
import PrimaryButton from 'commons/Buttons/PrimaryButton/PrimaryButton';

import useStyles from './NewInteractionEventDialogStyles';
import OfficeEventForm from '../InteractionEventForm/PlacesAdditionalForms/OfficeEventForm';
import SchoolEventForm, { grades } from '../InteractionEventForm/PlacesAdditionalForms/SchoolEventForm';
import DefaultPlaceEventForm from '../InteractionEventForm/PlacesAdditionalForms/DefaultPlaceEventForm';
import PrivateHouseEventForm from '../InteractionEventForm/PlacesAdditionalForms/PrivateHouseEventForm';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';
import HospitalEventForm, { hospitals } from '../InteractionEventForm/PlacesAdditionalForms/HospitalEventForm';
import TransportationEventForm from '../InteractionEventForm/PlacesAdditionalForms/TransportationAdditionalForms/TransportationEventForm';
import {
    InteractionEventDialogProvider,
    InteractionsEventDialogDataAndSet, initialDialogData
} from '../InteractionsEventDialogContext/InteractionsEventDialogContext';
import Interaction from 'models/Interaction';

import useNewInteractionEventDialog from './useNewInteractionEventDialog';

const privateHouseLocationType : string = 'בית פרטי';
const officeLocationType : string = 'משרד';
const transportationLocationType : string = 'תחבורה';
const schoolLocationType : string = 'בית ספר';
const hospitalLocationType : string = 'בית חולים';

export interface Props {
    closeDialog: () => void,
    isOpen: boolean,
    eventDate: Date,
    interactionToEdit?: Interaction
}

const otherLocationTypes = [
    'טרם',
    'מד"א',
    'כנסייה',
    'בית כנסת',
    'מסגד',
    'מקווה',
    'בית עלמין',
    'אולם אירועים',
    'גן אירועים',
    'בית מלון',
    'מגרש ספורט',
    'אולם ספורט',
    'חדר כושר',
    'מוזיאון/גלריה',
    'גן ילדים',
    'מוסד אקדמאי',
    'מוסד רפואי',
    'מוסד גריאטרי'
]

const locationTypes = [
    privateHouseLocationType,
    officeLocationType,
    transportationLocationType,
    schoolLocationType,
    hospitalLocationType,
].concat(otherLocationTypes);

const defaultContact: Contact = {
    name: '',
    phoneNumber: '',
    id: '',
    needsToBeQuarantined: false,
    moreDetails: '',
};

const defaultTime : string = '00:00';
const timeFormat : string = 'hh:mm';

const newContactEventTitle = 'יצירת מקום/מגע חדש';
const contactedPersonPhone: string = 'מספר טלפון';
const contactedPersonName: string = 'שם';
const contactedPersonID: string = 'ת.ז';
const addContactButton: string = 'הוסף מגע';

const NewInteractionEventDialog : React.FC<Props> = (props: Props) : JSX.Element => {
    const { eventDate, closeDialog, interactionToEdit, isOpen } = props;
    const { createNewInteractionEvent } = useNewInteractionEventDialog({closeDialog});

    const defaultDate = new Date(startOfDay(eventDate).toUTCString());

    const classes = useStyles();
    const formClasses = useFormStyles();
    const [interactionEventDialogData, setInteractionEventDialogData] = useState<InteractionEventDialogData>(initialDialogData);
    const [canAddContact, setCanAddContact] = useState<boolean>(false);
    const [allContacts, setAllContacts] = useState<Contact[]>([{...defaultContact}]);
    const [locationType, setLocationType] = useState<string>(privateHouseLocationType);
    const [startTime, setStartTime] = useState<Date>(defaultDate);
    const [endTime, setEndTime] = useState<Date>(defaultDate);
    const [externalizationApproval, setExternalizationApproval] = useState<boolean>(false);
    const [investigationId, setInvestigationId] = useState<number>();
    const [locationName, setLocationName] = useState<string>();
    const [locationAddress, setLocationAddress] = useState<Address>(initAddress);
    const [trainLine, setTrainLine] = useState<string>();
    const [busLine, setBusLine] = useState<string>();
    const [flightNumber, setFlightNumber] = useState<string>();
    const [airline, setAirline] = useState<string>();
    const [busCompany, setBusCompany] = useState<string>();
    const [boardingStation, setBoardingStation] = useState<string>();
    const [boardingCountry, setBoardingCountry] = useState<string>();
    const [boardingCity, setBoardingCity] = useState<string>();
    const [endStation, setEndStation] = useState<string>();
    const [endCountry, setEndCountry] = useState<string>();
    const [endCity, setEndCity] = useState<string>();
    const [grade, setGrade] = useState<string | undefined>(grades[0]);
    const [buisnessContactName, setBuisnessContactName] = useState<string>();
    const [buisnessContactNumber, setBuisnessContactNumber] = useState<string>();
    const [hospitalDepartment, setHospitalDepartment] = useState<string>();

    const updateContacts = (updatedContact: Contact, indexToUpdate: number) => {
        const updatedContacts = [...allContacts];
        updatedContacts.splice(indexToUpdate, 1, updatedContact);
        setAllContacts(updatedContacts);
    }

    const handleNameChange = (event: React.ChangeEvent<{ value: unknown }>, currentEditedContact: Contact) => {
        const currContactIndex = allContacts.findIndex((contact: Contact) => contact.phoneNumber === currentEditedContact.phoneNumber);
        currentEditedContact.name = event.target.value as string;
        updateContacts(currentEditedContact, currContactIndex);
        if(currentEditedContact.phoneNumber !== '' && currentEditedContact.name !== '') {
            setCanAddContact(true);
        }
    }

    const handlePhoneChange = (event: React.ChangeEvent<{ value: unknown }>, currentEditedContact: Contact) => {
        const currContactIndex = allContacts.findIndex((contact) => contact.phoneNumber === currentEditedContact.phoneNumber);
        currentEditedContact.phoneNumber = event.target.value as string;
        updateContacts(currentEditedContact, currContactIndex);
        if(currentEditedContact.phoneNumber !== '' && currentEditedContact.name !== '') {
            setCanAddContact(true);
        }
    }


    const handleIDChange = (event: React.ChangeEvent<{ value: unknown }>, currentEditedContact: Contact) => {
        const currContactIndex = allContacts.findIndex((contact) => contact.phoneNumber === currentEditedContact.phoneNumber);
        currentEditedContact.id = event.target.value as string;
        updateContacts(currentEditedContact, currContactIndex);
    }

    const handleMoreDetailsChange = (event: React.ChangeEvent<{ value: unknown }>, currentEditedContact: Contact) => {
        const currContactIndex = allContacts.findIndex((contact) => contact.phoneNumber === currentEditedContact.phoneNumber);
        currentEditedContact.moreDetails = event.target.value as string;
        updateContacts(currentEditedContact, currContactIndex);
    }

    const handleQuarantineToggleChange = (quarantineCondition: boolean, currentEditedContact: Contact) => {
        const currContactIndex = allContacts.findIndex((contact) => contact.phoneNumber === currentEditedContact.phoneNumber);
        currentEditedContact.needsToBeQuarantined = quarantineCondition;
        updateContacts(currentEditedContact, currContactIndex);
    }

    const handleContactAdd = () => {
        const updatedContacts = [...allContacts, {...defaultContact}];
        setAllContacts(updatedContacts);
        setCanAddContact(false);
    }

    const getContactForm = (singleContactInfo: Contact) => {
        return (
            <div className={classes.addContactFields} key='addContactFields'>
                <Typography variant='caption' className={formClasses.fieldName + ' ' + classes.fieldNameNoWrap}>{contactedPersonName + ': '}</Typography>
                <CircleTextField id='contactedPersonName' key='contactedPersonName'
                                 className={classes.newContactField}
                                 placeholder={contactedPersonName}
                                 onBlur={(event) => {
                                     handleNameChange(event, singleContactInfo)
                                 }}
                />
                <Typography variant='caption' className={formClasses.fieldName + ' ' + classes.fieldNameNoWrap}>{contactedPersonPhone + ': '}</Typography>
                <CircleTextField id='contactedPersonPhone' key='contactedPersonPhone'
                                 className={classes.newContactField}
                                 placeholder={contactedPersonPhone}
                                 onBlur={(event) => {
                                     handlePhoneChange(event, singleContactInfo)
                                 }}
                                 required={false}
                />
                <Typography variant='caption' className={formClasses.fieldName + ' ' + classes.fieldNameNoWrap}>{contactedPersonID + ': '}</Typography>
                <CircleTextField  id='contactedPersonID'
                                  className={classes.newContactField}
                                  placeholder={contactedPersonID}
                                  onBlur={(event) => {
                                      handleIDChange(event, singleContactInfo)
                                  }}
                />
                <Typography variant='caption' className={formClasses.fieldName + ' ' + classes.fieldNameNoWrap}>
                    צריך בידוד?
                </Typography>
                <Toggle
                    className={classes.toggle}
                    value={singleContactInfo.needsToBeQuarantined}
                    id='needsToBeQuarantinedToggle'
                    onChange={(event, val) => {
                        handleQuarantineToggleChange(val ,singleContactInfo)
                    }}
                />
                <CircleTextField className={classes.moreContactDetails}
                    placeholder={'פירוט נוסף על אופי המגע'}
                    id='moreInfo'
                    onBlur={(event) => {
                        handleMoreDetailsChange(event, singleContactInfo)
                    }}
                />
            </div>
        );
    }

    React.useEffect(() => {
        if (interactionToEdit) {
            setStartTime(interactionToEdit.startTime);
            setEndTime(interactionToEdit.endTime);
            setLocationName(interactionToEdit.locationName);
            setLocationType(interactionToEdit.locationType);
            setLocationAddress(interactionToEdit.locationAddress);
            setExternalizationApproval(interactionToEdit.externalizationApproval);
        }
    }, []);

    React.useEffect(() => {
        resetLocationForm()
    }, [locationType]);

    const interactionEventDialogDataVariables: InteractionsEventDialogDataAndSet = React.useMemo(() => ({
        interactionEventDialogData,
        setInteractionEventDialogData,
    }),
        [interactionEventDialogData, setInteractionEventDialogData]);

    const resetLocationForm = () => {
        setLocationName(locationTypes[+locationType] === hospitalLocationType ? hospitals[0] : undefined);
        setLocationAddress(initAddress);
        setTrainLine(undefined);
        setBusLine(undefined);
        setBusCompany(undefined);
        setAirline(undefined);
        setFlightNumber(undefined);
        setGrade(grades[0]);
        setBoardingStation(undefined);
        setBoardingCountry(undefined);
        setBoardingCity(undefined);
        setEndStation(undefined);
        setEndCountry(undefined);
        setEndCity(undefined);
        setBuisnessContactName(undefined);
        setBuisnessContactNumber(undefined);
        setHospitalDepartment(undefined);
    }

    const onLocationTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => setLocationType(event.target.value as string)
    
    const onStartTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const timeSplit = event.target.value.split(':');
        const newStartTime = set(startTime, { hours: +timeSplit[0], minutes: +timeSplit[1]});
        setStartTime(newStartTime);
    };

    const onEndTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const timeSplit = event.target.value.split(':');
        const newEndTime = set(endTime, { hours: +timeSplit[0], minutes: +timeSplit[1]});
        setEndTime(newEndTime);
    };

    const onExternalizationApprovalChange = (event: React.MouseEvent<HTMLElement, MouseEvent>, val: boolean) => setExternalizationApproval(val);

    const onConfirm = () => createNewInteractionEvent({
        locationType,
        startTime,
        endTime,
        externalizationApproval,
        investigationId,
        locationName,
        locationAddress,
        trainLine,
        busLine,
        airline,
        flightNumber,
        busCompany,
        grade: locationType === schoolLocationType ? grade : undefined,
        boardingStation,
        boardingCountry,
        boardingCity,
        endStation,
        endCountry,
        endCity,
        buisnessContactName,
        buisnessContactNumber,
        hospitalDepartment
    })

    const getDisplayTime = (date: Date) => {
        if (date.getHours() === 0) {
            if (date.getMinutes() === 0) return defaultTime;
            return defaultTime.replace(':00', `:${date.getMinutes()}`);
        } 
        return format(date, timeFormat);
    }

    return (
        <Dialog classes={{paper: classes.dialogPaper}} open={isOpen} maxWidth={false}>
            <DialogTitle className={classes.dialogTitleWrapper}>
                {newContactEventTitle}
            </DialogTitle>
            <InteractionEventDialogProvider value={interactionEventDialogDataVariables}>
                <DialogContent>
                    <Grid className={formClasses.form} container justify='flex-start'>
                        <div className={formClasses.formRow}>
                            <FormInput fieldName='סוג אתר'>
                                <CircleSelect
                                    value={locationType}
                                    onChange={onLocationTypeChange}
                                    className={classes.formSelect}
                                    options={locationTypes}
                                />
                            </FormInput>
                        </div>
                        <Collapse in={locationType === privateHouseLocationType}>
                            <PrivateHouseEventForm/>
                        </Collapse>
                        <Collapse in={locationType === officeLocationType}>
                            <OfficeEventForm/>
                        </Collapse>
                        <Collapse in={locationType === transportationLocationType}>
                            <TransportationEventForm onSubTypeChange={resetLocationForm}/>
                        </Collapse>
                        <Collapse in={locationType === schoolLocationType}>
                            <SchoolEventForm/>
                        </Collapse>
                        <Collapse in={locationType === hospitalLocationType}>
                            <HospitalEventForm/>
                        </Collapse>
                        <Collapse in={otherLocationTypes.includes(locationType)}>
                            <DefaultPlaceEventForm />
                        </Collapse>
                        <div className={formClasses.formRow}>
                            <Grid item xs={6}>
                                <FormInput fieldName='משעה'>
                                    <DatePick
                                        type='time'
                                        value={getDisplayTime(startTime)}
                                        onChange={onStartTimeChange}/>
                                </FormInput>
                            </Grid>
                            <Grid item xs={6}>
                                <FormInput fieldName='עד שעה'>
                                    <DatePick
                                        type='time'
                                        value={getDisplayTime(endTime)}
                                        onChange={onEndTimeChange}
                                    />
                                </FormInput>
                            </Grid>
                        </div>
                        <div className={formClasses.formRow}>
                            <FormInput fieldName='האם מותר להחצנה'>
                                <Toggle
                                    className={classes.toggle}
                                    value={externalizationApproval}
                                    onChange={onExternalizationApprovalChange}/>
                                </FormInput>
                        </div>
                    </Grid>
                    <Divider light={true}/>
                    <Grid container className={formClasses.form + ' ' + classes.spacedOutForm}>
                        <div className={classes.newContactFieldsContainer}>
                            {
                                allContacts.map((contact: Contact) => { return getContactForm(contact) })
                            }
                            <Grid item>
                                <IconButton onClick={handleContactAdd} disabled={!canAddContact}>
                                    <AddCircleIcon color={!canAddContact ? 'disabled' : 'primary'}/>
                                </IconButton>
                                <Typography variant='caption' className={formClasses.fieldName + ' ' + classes.fieldNameNoWrap}>{addContactButton}</Typography>
                            </Grid>
                        </div>
                    </Grid>
                </DialogContent>
            </InteractionEventDialogProvider>
            <DialogActions className={classes.dialogFooter}>
                <Button 
                    onClick={() => closeDialog()}
                    color='default' 
                    className={classes.cancelButton}>
                    בטל
                </Button>
                <PrimaryButton 
                    id='createContact'
                    onClick={() => onConfirm()}>
                    צור מקום/מגע
                </PrimaryButton>
            </DialogActions>
        </Dialog>
    );
};

export default NewInteractionEventDialog;