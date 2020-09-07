import React from 'react';

const getContactForm = () => {
    return (
        <div key='addContactFields'>
            jdjdjd
        </div>
    );
}

export default getContactForm;
// import React, {useState} from 'react';
// import { Typography } from '@material-ui/core';
    
// import Contact from 'models/Contact';
// import Toggle from 'commons/Toggle/Toggle';
// import useFormStyles from 'styles/formStyles';
// import CircleTextField from 'commons/CircleTextField/CircleTextField';

// import useStyles from './ContactFormStyles';

// const defaultContact: Contact = {
//     name: '',
//     phoneNumber: '',
//     id: '',
//     needsToBeQuarantined: false,
//     moreDetails: '',
// };

// const contactedPersonPhone: string = 'מספר טלפון';
// const contactedPersonName: string = 'שם';
// const contactedPersonID: string = 'ת.ז';

// const ContactForm : React.FC<Props> = (props: Props) : JSX.Element => {

//     const classes = useStyles();
//     const formClasses = useFormStyles();

//     const [allContacts, setAllContacts] = useState<Contact[]>([{...defaultContact}]);

//     const { singleContactInfo } = props;

//     const updateContacts = (updatedContact: Contact, indexToUpdate: number) => {
//         const updatedContacts = [...allContacts];
//         updatedContacts.splice(indexToUpdate, 1, updatedContact);
//         setAllContacts(updatedContacts);
//     }

//     const handleNameChange = newContactFieldsContainer(event: React.ChangeEvent<{ value: unknown }>, currentEditedContact: Contact) => {
//         const currContactIndex = allContacts.findIndex((contact: Contact) => contact.phoneNumber === currentEditedContact.phoneNumber);
//         currentEditedContact.name = event.target.value as string;
//         updateContacts(currentEditedContact, currContactIndex);
//     }

//     const handlePhoneChange = (event: React.ChangeEvent<{ value: unknown }>, currentEditedContact: Contact) => {
//         const currContactIndex = allContacts.findIndex((contact) => contact.phoneNumber === currentEditedContact.phoneNumber);
//         currentEditedContact.phoneNumber = event.target.value as string;
//         updateContacts(currentEditedContact, currContactIndex);
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

//     return (
//         <div className={classes.addContactFields} key='addContactFields'>
//             <Typography variant='caption' className={formClasses.fieldName + ' ' + classes.fieldNameNoWrap}>{contactedPersonName + ': '}</Typography>
//             <CircleTextField id='contactedPersonName' key='contactedPersonName'
//                                 className={classes.newContactField}
//                                 placeholder={contactedPersonName}
//                                 onBlur={(event) => {
//                                     handleNameChange(event, singleContactInfo)
//                                 }}
//             />
//             <Typography variant='caption' className={formClasses.fieldName + ' ' + classes.fieldNameNoWrap}>{contactedPersonPhone + ': '}</Typography>
//             <CircleTextField id='contactedPersonPhone' key='contactedPersonPhone'
//                                 className={classes.newContactField}
//                                 placeholder={contactedPersonPhone}
//                                 onBlur={(event) => {
//                                     handlePhoneChange(event, singleContactInfo)
//                                 }}
//                                 required={false}
//             />
//             <Typography variant='caption' className={formClasses.fieldName + ' ' + classes.fieldNameNoWrap}>{contactedPersonID + ': '}</Typography>
//             <CircleTextField  id='contactedPersonID'
//                                 className={classes.newContactField}
//                                 placeholder={contactedPersonID}
//                                 onBlur={(event) => {
//                                     handleIDChange(event, singleContactInfo)
//                                 }}
//             />
//             <Typography variant='caption' className={formClasses.fieldName + ' ' + classes.fieldNameNoWrap}>
//                 צריך בידוד?
//             </Typography>
//             <Toggle
//                 className={classes.toggle}
//                 value={singleContactInfo.needsToBeQuarantined}
//                 id='needsToBeQuarantinedToggle'
//                 onChange={(event, val) => {
//                     handleQuarantineToggleChange(val ,singleContactInfo)
//                 }}
//             />
//             <CircleTextField className={classes.moreContactDetails}
//                 placeholder={'פירוט נוסף על אופי המגע'}
//                 id='moreInfo'
//                 onBlur={(event) => {
//                     handleMoreDetailsChange(event, singleContactInfo)
//                 }}
//             />
//         </div>
//     );
// };

// export default ContactForm;

// interface Props {
//     singleContactInfo: Contact
// }