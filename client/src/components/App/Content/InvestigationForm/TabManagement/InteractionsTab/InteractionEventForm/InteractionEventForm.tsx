import { format, parse } from 'date-fns';
import React, {useState, useContext} from 'react';
import { AddCircle as AddCircleIcon} from '@material-ui/icons';
import { Collapse, Grid, Typography, Divider, IconButton } from '@material-ui/core';
    
import Contact from 'models/Contact';
import Toggle from 'commons/Toggle/Toggle';
import useFormStyles from 'styles/formStyles';
import DatePick from 'commons/DatePick/DatePick';
import FormInput from 'commons/FormInput/FormInput';
import CircleSelect from 'commons/CircleSelect/CircleSelect';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';

import ContactForm from './ContactForm/ContactForm';
import useStyles from './InteractionEventFormStyles';
import OfficeEventForm from '../InteractionEventForm/PlacesAdditionalForms/OfficeEventForm';
import SchoolEventForm, { grades } from '../InteractionEventForm/PlacesAdditionalForms/SchoolEventForm';
import HospitalEventForm, { hospitals } from '../InteractionEventForm/PlacesAdditionalForms/HospitalEventForm';
import DefaultPlaceEventForm from '../InteractionEventForm/PlacesAdditionalForms/DefaultPlaceEventForm';
import PrivateHouseEventForm from '../InteractionEventForm/PlacesAdditionalForms/PrivateHouseEventForm';
import TransportationEventForm, { resetTransportationFormFields } from '../InteractionEventForm/PlacesAdditionalForms/TransportationAdditionalForms/TransportationEventForm';
import { InteractionEventDialogContext } from '../InteractionsEventDialogContext/InteractionsEventDialogContext';
import { initAddress } from 'models/Address';

const privateHouseLocationType : string = 'בית פרטי';
const officeLocationType : string = 'משרד';
export const transportationLocationType : string = 'תחבורה';
export const schoolLocationType : string = 'בית ספר';
export const hospitalLocationType : string = 'בית חולים';

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

export const locationTypes = [
    privateHouseLocationType,
    officeLocationType,
    transportationLocationType,
    schoolLocationType,
    hospitalLocationType,
].concat(otherLocationTypes);

export const defaultContact: Contact = {
    name: '',
    phoneNumber: '',
    id: '',
    needsToBeQuarantined: false,
    moreDetails: '',
};

const timeFormat : string = 'HH:mm';

const addContactButton: string = 'הוסף מגע';

const InteractionEventForm : React.FC = () : JSX.Element => {
    
    const { interactionEventDialogData, setInteractionEventDialogData } = useContext(InteractionEventDialogContext);
    const { locationType, startTime, endTime, externalizationApproval, contacts } = interactionEventDialogData;

    const classes = useStyles();
    const formClasses = useFormStyles();
    const [canAddContact, setCanAddContact] = useState<boolean>(false);

    React.useEffect(() => {
        const hasInvalidContact : boolean = contacts
            .some(contact => (!contact.id || !contact.name || !contact.phoneNumber));
        setCanAddContact(!hasInvalidContact);
    }, [contacts])
    
    const onContactAdd = () => {
        const updatedContacts = [...contacts, {...defaultContact}];
        setInteractionEventDialogData({...interactionEventDialogData, contacts: updatedContacts});
    }

    const onLocationTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const newLocationType = event.target.value as string;
        setInteractionEventDialogData({...interactionEventDialogData as InteractionEventDialogData, 
            locationType: newLocationType,
            locationSubType: '',
            locationName: newLocationType === hospitalLocationType ? hospitals[0] : undefined,
            grade: (newLocationType === schoolLocationType) ? grades[0] : undefined,
            locationAddress: initAddress,
            hospitalDepartment: undefined,
            ...resetTransportationFormFields
        });
    }
    
    const onStartTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInteractionEventDialogData({...interactionEventDialogData as InteractionEventDialogData, startTime: parse(event.target.value, timeFormat, startTime)});
    };

    const onEndTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInteractionEventDialogData({...interactionEventDialogData as InteractionEventDialogData, startTime: parse(event.target.value, timeFormat, endTime)});
    };

    const onExternalizationApprovalChange = (event: React.MouseEvent<HTMLElement, MouseEvent>, val: boolean) => 
        setInteractionEventDialogData({...interactionEventDialogData as InteractionEventDialogData, externalizationApproval: val});

    return (
        <>
            <Grid className={formClasses.form} container justify='flex-start'>
                <Grid className={formClasses.formRow} container justify='flex-start'>
                    <FormInput fieldName='סוג אתר'>
                        <CircleSelect
                            value={locationType}
                            onChange={onLocationTypeChange}
                            className={formClasses.formSelect}
                            options={locationTypes}
                        />
                    </FormInput>
                </Grid>
                {
                    locationType === privateHouseLocationType && 
                    <Collapse in={locationType === privateHouseLocationType}>
                        <PrivateHouseEventForm/>
                    </Collapse>
                }
                {
                    locationType === officeLocationType &&
                    <Collapse in={locationType === officeLocationType}>
                        <OfficeEventForm/>
                    </Collapse>
                }
                {
                    locationType === transportationLocationType &&
                    <Collapse in={locationType === transportationLocationType}>
                        <TransportationEventForm/>
                    </Collapse>
                }
                {
                    locationType === schoolLocationType &&
                    <Collapse in={locationType === schoolLocationType}>
                        <SchoolEventForm/>
                    </Collapse>
                }
                {
                    locationType === hospitalLocationType &&
                    <Collapse in={locationType === hospitalLocationType}>
                        <HospitalEventForm/>
                    </Collapse>
                }
                {
                    otherLocationTypes.includes(locationType) &&
                    <Collapse in={otherLocationTypes.includes(locationType)}>
                        <DefaultPlaceEventForm />
                    </Collapse>
                }
                <Grid className={formClasses.formRow} container justify='flex-start'>
                    <Grid item xs={6}>
                        <FormInput fieldName='משעה'>
                            <DatePick
                                type='time'
                                value={format(startTime, timeFormat)}
                                onChange={onStartTimeChange}/>
                        </FormInput>
                    </Grid>
                    <Grid item xs={6}>
                        <FormInput fieldName='עד שעה'>
                            <DatePick
                                type='time'
                                value={format(endTime, timeFormat)}
                                onChange={onEndTimeChange}
                            />
                        </FormInput>
                    </Grid>
                </Grid>
                <Grid className={formClasses.formRow} container justify='flex-start'>
                    <FormInput fieldName='האם מותר להחצנה'>
                        <Toggle
                            className={formClasses.formToggle}
                            value={externalizationApproval}
                            onChange={onExternalizationApprovalChange}/>
                        </FormInput>
                </Grid>
            </Grid>
            <Divider light={true}/>
            <Grid container className={formClasses.form + ' ' + classes.spacedOutForm}>
                <div className={classes.newContactFieldsContainer}>
                    {
                        contacts.map((contact: Contact, index: number) => 
                            <ContactForm updatedContactIndex={index}/>)
                    }
                    <Grid item>
                        <IconButton onClick={onContactAdd} disabled={!canAddContact}>
                            <AddCircleIcon color={!canAddContact ? 'disabled' : 'primary'}/>
                        </IconButton>
                        <Typography variant='caption' className={formClasses.fieldName + ' ' + classes.fieldNameNoWrap}>{addContactButton}</Typography>
                    </Grid>
                </div>
            </Grid>
        </>
    );
};

export default InteractionEventForm;