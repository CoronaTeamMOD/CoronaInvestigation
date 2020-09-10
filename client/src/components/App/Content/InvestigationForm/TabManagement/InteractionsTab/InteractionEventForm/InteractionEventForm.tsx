import { format, parse } from 'date-fns';
import React, {useState, useContext} from 'react';
import { AddCircle as AddCircleIcon} from '@material-ui/icons';
import { Collapse, Grid, Typography, Divider, IconButton } from '@material-ui/core';
    
import Contact from 'models/Contact';
import Toggle from 'commons/Toggle/Toggle';
import useFormStyles from 'styles/formStyles';
import { timeFormat } from 'Utils/displayUtils';
import DatePick from 'commons/DatePick/DatePick';
import FormInput from 'commons/FormInput/FormInput';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';
import PlacesTypesAndSubTypes from 'commons/Forms/PlacesTypesAndSubTypes/PlacesTypesAndSubTypes';

import ContactForm from './ContactForm/ContactForm';
import useStyles from './InteractionEventFormStyles';
import OfficeEventForm from '../InteractionEventForm/PlacesAdditionalForms/OfficeEventForm';
import SchoolEventForm from '../InteractionEventForm/PlacesAdditionalForms/SchoolEventForm';
import { hospitals } from '../InteractionEventForm/PlacesAdditionalForms/HospitalEventForm';
import DefaultPlaceEventForm from '../InteractionEventForm/PlacesAdditionalForms/DefaultPlaceEventForm';
import PrivateHouseEventForm from '../InteractionEventForm/PlacesAdditionalForms/PrivateHouseEventForm';
import TransportationEventForm from '../InteractionEventForm/PlacesAdditionalForms/TransportationAdditionalForms/TransportationEventForm';
import { InteractionEventDialogContext, initialDialogData } from '../InteractionsEventDialogContext/InteractionsEventDialogContext';
import OtherPublicLocationForm from './PlacesAdditionalForms/OtherPublicLocationForm';
import MedicalLocationForm, { hospitalPlaceType } from './PlacesAdditionalForms/MedicalLocationForm';

const privateHousePlaceType : string = 'בית פרטי';
const officePlaceType : string = 'משרד';
const transportationPlaceType : string = 'תחבורה';
const schoolPlaceType : string = 'מוסד חינוכי';
const medicalPlaceType : string = 'מוסד רפואי';
const religionPlaceType : string = 'אתר דת';
const geriatricPlaceType : string = 'מוסד גריאטרי';
const otherPublicPlaceType : string = 'מקומות ציבוריים נוספים';

export const defaultContact: Contact = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    id: '',
    contactType: '',
};

const addContactButton: string = 'הוסף מגע';

const InteractionEventForm : React.FC = () : JSX.Element => {
    
    const { interactionEventDialogData, setInteractionEventDialogData } = useContext(InteractionEventDialogContext);
    const { placeType, startTime, endTime, externalizationApproval, contacts, placeSubType, id, investigationId } = interactionEventDialogData;

    const classes = useStyles();
    const formClasses = useFormStyles();
    const [canAddContact, setCanAddContact] = useState<boolean>(false);

    React.useEffect(() => {
        const hasInvalidContact : boolean = contacts
            .some(contact => (!contact.id || !contact.firstName  || !contact.lastName || !contact.phoneNumber));
        setCanAddContact(!hasInvalidContact);
    }, [contacts])
    
    const onContactAdd = () => {
        const updatedContacts = [...contacts, {...defaultContact}];
        setInteractionEventDialogData({...interactionEventDialogData, contacts: updatedContacts});
    }

    const onPlaceTypeChange = (newPlaceType: string) => {
        setInteractionEventDialogData(
        {
            ...initialDialogData(startTime, endTime, contacts, investigationId),
            id,
            placeType: newPlaceType,
            externalizationApproval
        });
    }

    const onPlaceSubTypeChange = (newPlaceSubType: number) => {
        setInteractionEventDialogData(
        {
            ...initialDialogData(startTime, endTime, contacts, investigationId),
                id,
                placeType,
                placeSubType: newPlaceSubType,
                placeName: newPlaceSubType === hospitalPlaceType ? hospitals[0] : undefined,
                externalizationApproval
        });
    }
    
    const onStartTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInteractionEventDialogData({...interactionEventDialogData as InteractionEventDialogData, startTime: parse(event.target.value, timeFormat, startTime)});
    };

    const onEndTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInteractionEventDialogData({...interactionEventDialogData as InteractionEventDialogData, endTime: parse(event.target.value, timeFormat, endTime)});
    };

    const onExternalizationApprovalChange = (event: React.MouseEvent<HTMLElement, MouseEvent>, val: boolean) => 
        setInteractionEventDialogData({...interactionEventDialogData as InteractionEventDialogData, externalizationApproval: val});

    return (
        <>
            <Grid className={formClasses.form} container justify='flex-start'>
                <PlacesTypesAndSubTypes 
                placeType={placeType}
                placeSubType={placeSubType}
                onPlaceTypeChange={onPlaceTypeChange}
                onPlaceSubTypeChange={onPlaceSubTypeChange}/>
                {
                    placeType === privateHousePlaceType && 
                    <Collapse in={placeType === privateHousePlaceType}>
                        <PrivateHouseEventForm/>
                    </Collapse>
                }
                {
                    placeType === officePlaceType &&
                    <Collapse in={placeType === officePlaceType}>
                        <OfficeEventForm/>
                    </Collapse>
                }
                {
                    placeType === transportationPlaceType &&
                    <Collapse in={placeType === transportationPlaceType}>
                        <TransportationEventForm/>
                    </Collapse>
                }
                {
                    placeType === schoolPlaceType &&
                    <Collapse in={placeType === schoolPlaceType}>
                        <SchoolEventForm/>
                    </Collapse>
                }
                {
                    placeType === medicalPlaceType &&
                    <Collapse in={placeType === medicalPlaceType}>
                        <MedicalLocationForm />
                    </Collapse>
                }
                {
                    placeType === religionPlaceType &&
                    <Collapse in={placeType === religionPlaceType}>
                        <DefaultPlaceEventForm />
                    </Collapse>
                }
                {
                    placeType === geriatricPlaceType &&
                    <Collapse in={placeType === geriatricPlaceType}>
                        <DefaultPlaceEventForm />
                    </Collapse>
                }
                {
                    placeType === otherPublicPlaceType &&
                    <Collapse in={placeType === otherPublicPlaceType}>
                        <OtherPublicLocationForm/>
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