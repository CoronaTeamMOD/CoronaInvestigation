import React from 'react';
import { useSelector } from 'react-redux';
import { Delete } from '@material-ui/icons';
import { differenceInYears, format } from 'date-fns';
import { Grid, Typography, IconButton, Tooltip } from '@material-ui/core';

import Contact from 'models/Contact';
import ContactType from 'models/ContactType';
import useFormStyles from 'styles/formStyles';
import StoreStateType from 'redux/storeStateType';
import FormInput from 'commons/FormInput/FormInput';
import InvolvedContact from 'models/InvolvedContact';
import ContactFieldName from 'models/enums/ContactFieldName';
import FamilyContactIcon from 'commons/Icons/FamilyContactIcon';
import useInvolvedContact from 'Utils/vendor/useInvolvedContact';

import useStyles from './ContactGridStyles';

const contactedBirthdate: string = 'תאריך לידה';
const contactedAge: string = 'גיל';
const contactedAdditionalPhone: string = 'טלפון משני';
const contactedIsolationCity: string = 'יישוב השהייה בבידוד';
const contactedFamilyRelationshop: string = 'קרבה משפחתית';

const noDataIndication = '---';
const birthDateFormat = 'dd/MM/yyyy';

const ContactGrid: React.FC<Props> = (props: Props): JSX.Element => {

    const { contact, onDeleteContactClick, isContactComplete } = props;

    const formClasses = useFormStyles();
    const classes = useStyles();

    const contactTypes = useSelector<StoreStateType, Map<number, ContactType>>(state => state.contactTypes);

    const { isInvolvedThroughFamily, shouldDisableDeleteContact } = useInvolvedContact();

    const CompletedQuestioningTooltip = ({ children }: { children: React.ReactElement }) => (
        isContactComplete ?
            <Tooltip title='המגע בסטטוס הושלם'>
                <span>{children}</span>
            </Tooltip>
            : children
    );

    const involvementReason = contact.involvedContact?.involvementReason || null;
    const isFamilyContact = isInvolvedThroughFamily(involvementReason);

    const familyContactsAdditionalFields = () => {
        const { birthDate, isolationAddress, additionalPhoneNumber, familyRelationship } = contact.involvedContact as InvolvedContact;
        return <>
            <FormInput xs={2} fieldName={contactedAdditionalPhone}>
                <Typography variant='caption'>
                    {additionalPhoneNumber || noDataIndication}
                </Typography>
            </FormInput>
            <FormInput xs={2} fieldName={contactedBirthdate}>
                <Typography variant='caption'>
                    {birthDate ? format(new Date(birthDate), birthDateFormat) : noDataIndication}
                </Typography>
            </FormInput>
            <FormInput xs={2} fieldName={contactedAge}>
                <Typography variant='caption'>
                    {birthDate ? differenceInYears(new Date(), new Date(birthDate)) : noDataIndication}
                </Typography>
            </FormInput>
            <FormInput xs={2} fieldName={contactedIsolationCity}>
                <Typography variant='caption'>
                    {isolationAddress?.city.displayName || noDataIndication}
                </Typography>
            </FormInput>
            <FormInput xs={2} fieldName={contactedFamilyRelationshop}>
                <Typography variant='caption'>
                    {familyRelationship?.displayName || noDataIndication}
                </Typography>
            </FormInput>
        </>
    }
    return (
        <>
            <Grid className={formClasses.formRow + ' ' + classes.fullWidthGrid} container justify='flex-start' key='addContactFields'>
                <Grid item xs={12} className={formClasses.formRow}>
                    {
                        isFamilyContact &&
                        <Grid item xs={2}>
                            <FamilyContactIcon />
                        </Grid>
                    }
                    <FormInput xs={2} fieldName={ContactFieldName.FIRST_NAME}>
                        <Typography variant='caption'>
                            {contact.firstName || noDataIndication}
                        </Typography>
                    </FormInput>
                    <FormInput xs={2} fieldName={ContactFieldName.LAST_NAME}>
                        <Typography variant='caption'>
                            {contact.lastName || noDataIndication}
                        </Typography>
                    </FormInput>
                    <FormInput xs={2} fieldName={ContactFieldName.IDENTIFICATION_TYPE}>
                        <Typography variant='caption'>
                            {contact.identificationType || noDataIndication}
                        </Typography>
                    </FormInput>
                    <FormInput xs={2} fieldName={ContactFieldName.IDENTIFICATION_NUMBER}>
                        <Typography variant='caption'>
                            {contact.identificationNumber || noDataIndication}
                        </Typography>
                    </FormInput>
                    <FormInput xs={2} fieldName={ContactFieldName.PHONE}>
                        <Typography variant='caption'>
                            {contact.phoneNumber || noDataIndication}
                        </Typography>
                    </FormInput>
                </Grid>
                <Grid item xs={12} className={formClasses.formRow}>
                    <FormInput xs={2} fieldName={ContactFieldName.CONTACT_TYPE}>
                        <Typography variant='caption'>
                            {contact.contactType ? contactTypes.get(+contact.contactType)?.displayName : noDataIndication}
                        </Typography>
                    </FormInput>
                    {
                        isFamilyContact ?
                            familyContactsAdditionalFields()
                            : contact.extraInfo &&
                            <FormInput xs={10} fieldName={ContactFieldName.EXTRA_INFO}>
                                <Typography variant='caption'>
                                    {contact.extraInfo}
                                </Typography>
                            </FormInput>
                    }
                </Grid>
            </Grid>
            <div className={classes.deleteIconDiv}>
                <CompletedQuestioningTooltip>
                    <IconButton
                        disabled={shouldDisableDeleteContact(isContactComplete, contact)}
                        test-id='deleteContactLocation'
                        onClick={() => {
                            contact.id && onDeleteContactClick(contact.id, contact.involvedContactId || null)
                        }}>
                        <Delete />
                    </IconButton>
                </CompletedQuestioningTooltip>
            </div>
        </>
    );
};

export default ContactGrid;

interface Props {
    contact: Contact;
    onDeleteContactClick: (contactedPersonId: number, involvedContactId: number | null) => void;
    isContactComplete: boolean;
};
