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
import placeTypesCodesHierarchy from 'Utils/placeTypesCodesHierarchy';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';
import PlacesTypesAndSubTypes from 'commons/Forms/PlacesTypesAndSubTypes/PlacesTypesAndSubTypes';

import ContactForm from './ContactForm/ContactForm';
import useStyles from './InteractionEventFormStyles';
import OfficeEventForm from '../InteractionEventForm/PlacesAdditionalForms/OfficeEventForm';
import SchoolEventForm from '../InteractionEventForm/PlacesAdditionalForms/SchoolEventForm';
import DefaultPlaceEventForm from '../InteractionEventForm/PlacesAdditionalForms/DefaultPlaceEventForm';
import PrivateHouseEventForm from '../InteractionEventForm/PlacesAdditionalForms/PrivateHouseEventForm';
import TransportationEventForm from '../InteractionEventForm/PlacesAdditionalForms/TransportationAdditionalForms/TransportationEventForm';
import { InteractionEventDialogContext, initialDialogData } from '../InteractionsEventDialogContext/InteractionsEventDialogContext';
import OtherPublicLocationForm from './PlacesAdditionalForms/OtherPublicLocationForm';
import MedicalLocationForm from './PlacesAdditionalForms/MedicalLocationForm';

export const defaultContact: Contact = {
    firstName: '',
    lastName: '',
    phoneNumber: {number: '', isValid: true},
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

    const { geriatric, school, medical, office, otherPublicPlaces, privateHouse, religion, transportation } = placeTypesCodesHierarchy;

    React.useEffect(() => {
        const hasInvalidContact : boolean = contacts
            .some(contact => (!contact.firstName || !contact.lastName || !contact.phoneNumber));
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
                    placeType === privateHouse.code &&
                    <Collapse in={placeType === privateHouse.code}>
                        <PrivateHouseEventForm/>
                    </Collapse>
                }
                {
                    placeType === office.code &&
                    <Collapse in={placeType === office.code}>
                        <OfficeEventForm/>
                    </Collapse>
                }
                {
                    placeType === transportation.code &&
                    <Collapse in={placeType === transportation.code}>
                        <TransportationEventForm/>
                    </Collapse>
                }
                {
                    placeType === school.code &&
                    <Collapse in={placeType === school.code}>
                        <SchoolEventForm/>
                    </Collapse>
                }
                {
                    placeType === medical.code &&
                    <Collapse in={placeType === medical.code}>
                        <MedicalLocationForm />
                    </Collapse>
                }
                {
                    placeType === religion.code &&
                    <Collapse in={placeType === religion.code}>
                        <DefaultPlaceEventForm />
                    </Collapse>
                }
                {
                    placeType === geriatric.code &&
                    <Collapse in={placeType === geriatric.code}>
                        <DefaultPlaceEventForm />
                    </Collapse>
                }
                {
                    placeType === otherPublicPlaces.code &&
                    <Collapse in={placeType === otherPublicPlaces.code}>
                        <OtherPublicLocationForm/>
                    </Collapse>
                }
                <Grid className={formClasses.formRow} container justify='flex-start'>
                    <Grid item xs={6}>
                        <FormInput fieldName='משעה'>
                            <DatePick
                                required
                                test-id='contactLocationStartTime'
                                type='time'
                                value={format(startTime, timeFormat)}
                                onChange={onStartTimeChange}/>
                        </FormInput>
                    </Grid>
                    <Grid item xs={6}>
                        <FormInput fieldName='עד שעה'>
                            <DatePick
                                required
                                test-id='contactLocationEndTime'
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
                            test-id='allowExternalization'
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
                        <IconButton test-id='addContact' onClick={onContactAdd} disabled={!canAddContact}>
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