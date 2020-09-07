import React from 'react';

const getContactForm = () => {
    return (
        <div key='addContactFields'>
            jdjdjd
        </div>
    );
}

// import React, {useState, useContext} from 'react';
// import { parse, format, set } from 'date-fns';
// import { AddCircle as AddCircleIcon} from '@material-ui/icons';
// import { Collapse, Grid, Typography, Divider, IconButton } from '@material-ui/core';
    
// import Contact from 'models/Contact';
// import Toggle from 'commons/Toggle/Toggle';
// import DatePick from 'commons/DatePick/DatePick';
// import useFormStyles from 'styles/formStyles';
// import FormInput from 'commons/FormInput/FormInput';
// import CircleSelect from 'commons/CircleSelect/CircleSelect';
// import CircleTextField from 'commons/CircleTextField/CircleTextField';
// import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';

// import useStyles from './NewInteractionEventDialogStyles';
// import OfficeEventForm from './PlacesAdditionalForms/OfficeEventForm';
// import SchoolEventForm, { grades } from './PlacesAdditionalForms/SchoolEventForm';
// import DefaultPlaceEventForm from './PlacesAdditionalForms/DefaultPlaceEventForm';
// import PrivateHouseEventForm from './PlacesAdditionalForms/PrivateHouseEventForm';
// import HospitalEventForm, { hospitals } from './PlacesAdditionalForms/HospitalEventForm';
// import TransportationEventForm from './PlacesAdditionalForms/TransportationAdditionalForms/TransportationEventForm';
// import { initialDialogData, InteractionEventDialogContext
// } from '../InteractionsEventDialogContext/InteractionsEventDialogContext';

// const privateHouseLocationType : string = 'בית פרטי';
// const officeLocationType : string = 'משרד';
// const transportationLocationType : string = 'תחבורה';
// const schoolLocationType : string = 'בית ספר';
// const hospitalLocationType : string = 'בית חולים';

// export interface Props {
//     closeDialog: () => void,
//     eventDate?: Date
// }

// const otherLocationTypes = [
//     'טרם',
//     'מד"א',
//     'כנסייה',
//     'בית כנסת',
//     'מסגד',
//     'מקווה',
//     'בית עלמין',
//     'אולם אירועים',
//     'גן אירועים',
//     'בית מלון',
//     'מגרש ספורט',
//     'אולם ספורט',
//     'חדר כושר',
//     'מוזיאון/גלריה',
//     'גן ילדים',
//     'מוסד אקדמאי',
//     'מוסד רפואי',
//     'מוסד גריאטרי'
// ]

// const locationTypes = [
//     privateHouseLocationType,
//     officeLocationType,
//     transportationLocationType,
//     schoolLocationType,
//     hospitalLocationType,
// ].concat(otherLocationTypes);

// const defaultContact: Contact = {
//     name: '',
//     phoneNumber: '',
//     id: '',
//     needsToBeQuarantined: false,
//     moreDetails: '',
// };

// const defaultTime : string = '00:00';

// const contactedPersonPhone: string = 'מספר טלפון';
// const contactedPersonName: string = 'שם';
// const contactedPersonID: string = 'ת.ז';
// const addContactButton: string = 'הוסף מגע';

// const NewInteractionEventDialog : React.FC<Props> = (props: Props) : JSX.Element => {

//     const classes = useStyles();
//     const formClasses = useFormStyles();
//     const [canCreateEvent, setCanCreateEvent] = useState<boolean>(false);
//     const [interactionEventDialogData, setInteractionEventDialogData] = useState<InteractionEventDialogData>(initialDialogData);
//     const [locationType, setLocationType] = useState<string>(privateHouseLocationType);
//     const [canAddContact, setCanAddContact] = useState<boolean>(false);
//     const [allContacts, setAllContacts] = useState<Contact[]>([{...defaultContact}]);

//     const ctxt = useContext(InteractionEventDialogContext);

//     const updateContacts = (updatedContact: Contact, indexToUpdate: number) => {
//         const updatedContacts = [...allContacts];
//         updatedContacts.splice(indexToUpdate, 1, updatedContact);
//         setAllContacts(updatedContacts);
//     }

//     const handleNameChange = (event: React.ChangeEvent<{ value: unknown }>, currentEditedContact: Contact) => {
//         const currContactIndex = allContacts.findIndex((contact: Contact) => contact.phoneNumber === currentEditedContact.phoneNumber);
//         currentEditedContact.name = event.target.value as string;
//         updateContacts(currentEditedContact, currContactIndex);
//         if(currentEditedContact.phoneNumber !== '' && currentEditedContact.name !== '') {
//             setCanAddContact(true);
//         }
//     }

//     const handlePhoneChange = (event: React.ChangeEvent<{ value: unknown }>, currentEditedContact: Contact) => {
//         const currContactIndex = allContacts.findIndex((contact) => contact.phoneNumber === currentEditedContact.phoneNumber);
//         currentEditedContact.phoneNumber = event.target.value as string;
//         updateContacts(currentEditedContact, currContactIndex);
//         if(currentEditedContact.phoneNumber !== '' && currentEditedContact.name !== '') {
//             setCanAddContact(true);
//         }
//     }


//     const handleIDChange = (event: React.ChangeEvent<{ value: unknown }>, currentEditedContact: Contact) => {
//         const currContactIndex = allContacts.findIndex((contact) => contact.phoneNumber === currentEditedContact.phoneNumber);
//         currentEditedContact.id = event.target.value as string;
//         updateContacts(currentEditedContact, currContactIndex);
//     }

//     const handleMoreDetailsChange = (event: React.ChangeEvent<{ value: unknown }>, currentEditedContact: Contact) => {
//         const currContactIndex = allContacts.findIndex((contact) => contact.phoneNumber === currentEditedContact.phoneNumber);
//         currentEditedContact.moreDetails = event.target.value as string;
//         updateContacts(currentEditedContact, currContactIndex);
//     }

//     const handleQuarantineToggleChange = (quarantineCondition: boolean, currentEditedContact: Contact) => {
//         const currContactIndex = allContacts.findIndex((contact) => contact.phoneNumber === currentEditedContact.phoneNumber);
//         currentEditedContact.needsToBeQuarantined = quarantineCondition;
//         updateContacts(currentEditedContact, currContactIndex);
//     }

//     const handleContactAdd = () => {
//         const updatedContacts = [...allContacts, {...defaultContact}];
//         setAllContacts(updatedContacts);
//         setCanAddContact(false);
//     }

//     const getContactForm = (singleContactInfo: Contact) => {
//         return (
//             <div className={classes.addContactFields} key='addContactFields'>
//                 <Typography variant='caption' className={formClasses.fieldName + ' ' + classes.fieldNameNoWrap}>{contactedPersonName + ': '}</Typography>
//                 <CircleTextField id='contactedPersonName' key='contactedPersonName'
//                                  className={classes.newContactField}
//                                  placeholder={contactedPersonName}
//                                  onBlur={(event) => {
//                                      handleNameChange(event, singleContactInfo)
//                                  }}
//                 />
//                 <Typography variant='caption' className={formClasses.fieldName + ' ' + classes.fieldNameNoWrap}>{contactedPersonPhone + ': '}</Typography>
//                 <CircleTextField id='contactedPersonPhone' key='contactedPersonPhone'
//                                  className={classes.newContactField}
//                                  placeholder={contactedPersonPhone}
//                                  onBlur={(event) => {
//                                      handlePhoneChange(event, singleContactInfo)
//                                  }}
//                                  required={false}
//                 />
//                 <Typography variant='caption' className={formClasses.fieldName + ' ' + classes.fieldNameNoWrap}>{contactedPersonID + ': '}</Typography>
//                 <CircleTextField  id='contactedPersonID'
//                                   className={classes.newContactField}
//                                   placeholder={contactedPersonID}
//                                   onBlur={(event) => {
//                                       handleIDChange(event, singleContactInfo)
//                                   }}
//                 />
//                 <Typography variant='caption' className={formClasses.fieldName + ' ' + classes.fieldNameNoWrap}>
//                     צריך בידוד?
//                 </Typography>
//                 <Toggle
//                     className={classes.toggle}
//                     value={singleContactInfo.needsToBeQuarantined}
//                     id='needsToBeQuarantinedToggle'
//                     onChange={(event, val) => {
//                         handleQuarantineToggleChange(val ,singleContactInfo)
//                     }}
//                 />
//                 <CircleTextField className={classes.moreContactDetails}
//                     placeholder={'פירוט נוסף על אופי המגע'}
//                     id='moreInfo'
//                     onBlur={(event) => {
//                         handleMoreDetailsChange(event, singleContactInfo)
//                     }}
//                 />
//             </div>
//         );
//     }

//     const onLocationTypeChange = (event: React.ChangeEvent<{ value: string }>) => {
//         ctxt.setInteractionEventDialogData({...ctxt.interactionEventDialogData as InteractionEventDialogData, locationType: event.target.value});
//     }
    
//     const onStartTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => setStartTime(parse(event.target.value, 'hh:mm', new Date()));
//     const onEndTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => setEndTime(parse(event.target.value, 'hh:mm', new Date()));
//     const onExternalizationApprovalChange = (event: React.MouseEvent<HTMLElement, MouseEvent>, val: boolean) => setExternalizationApproval(val);

//     return (
//         <>
//             <Grid className={formClasses.form} container justify='flex-start'>
//                 <div className={formClasses.formRow}>
//                     <FormInput fieldName='סוג אתר'>
//                         <CircleSelect
//                             value={locationType}
//                             onChange={onLocationTypeChange}
//                             className={classes.formSelect}
//                             options={locationTypes}
//                         />
//                     </FormInput>
//                 </div>
//             <Collapse in={locationType === privateHouseLocationType}>
//                 <PrivateHouseEventForm/>
//             </Collapse>
//             <Collapse in={locationType === officeLocationType}>
//                 <OfficeEventForm/>
//             </Collapse>
//             <Collapse in={locationType === transportationLocationType}>
//                 <TransportationEventForm onSubTypeChange={resetLocationForm}/>
//             </Collapse>
//             <Collapse in={locationType === schoolLocationType}>
//                 <SchoolEventForm/>
//             </Collapse>
//             <Collapse in={locationType === hospitalLocationType}>
//                 <HospitalEventForm/>
//             </Collapse>
//             <Collapse in={otherLocationTypes.includes(locationType)}>
//                 <DefaultPlaceEventForm />
//             </Collapse>
//             <Grid className={formClasses.formRow} container justify='flex-start'>
//                 <Grid item xs={6}>
//                     <FormInput fieldName='משעה'>
//                         <DatePick
//                             type='time'
//                             value={startTime ? format(startTime, 'hh:mm') : defaultTime}
//                             onChange={onStartTimeChange}/>
//                     </FormInput>
//                 </Grid>
//                 <Grid item xs={6}>
//                     <FormInput fieldName='עד שעה'>
//                         <DatePick
//                             type='time'
//                             value={endTime ? format(endTime, 'hh:mm') : defaultTime}
//                             onChange={onEndTimeChange}
//                         />
//                     </FormInput>
//                 </Grid>
//             </Grid>
//             <FormInput fieldName='האם מותר להחצנה'>
//                 <Toggle
//                     className={classes.toggle}
//                     value={externalizationApproval}
//                     onChange={onExternalizationApprovalChange}/>
//             </FormInput>
//         </Grid>
//         <Divider light={true}/>
//         <Grid container className={formClasses.form + ' ' + classes.spacedOutForm} xs={2}>
//             <div className={classes.newContactFieldsContainer}>
//                 {
//                     allContacts.map((contact: Contact) => { return getContactForm(contact) })
//                 }
//                 <Grid item direction={'row'}>
//                     <IconButton onClick={handleContactAdd} disabled={!canAddContact}>
//                         <AddCircleIcon color={!canAddContact ? 'disabled' : 'primary'}/>
//                     </IconButton>
//                     <Typography variant='caption' className={formClasses.fieldName + ' ' + classes.fieldNameNoWrap}>{addContactButton}</Typography>
//                 </Grid>
//             </div>
//         </Grid>
//         </>
//     );
// };

// export default NewInteractionEventDialog;