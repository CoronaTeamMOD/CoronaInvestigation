import React from 'react';
import { ExpandMore } from '@material-ui/icons';
import { useFormContext } from 'react-hook-form';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Divider,
    Grid,
} from '@material-ui/core';

import ContactStatus from 'models/ContactStatus';
import InteractedContact from 'models/InteractedContact';
import FamilyRelationship from 'models/FamilyRelationship';
import PrimaryButton from 'commons/Buttons/PrimaryButton/PrimaryButton';

import useStyles from './ContactQuestioningStyles';
import ContactQuestioningInfo from './ContactQuestioningInfo';
import ContactQuestioningCheck from './ContactQuestioningCheck';
import ContactQuestioningPersonal from './ContactQuestioningPersonal';
import ContactQuestioningClinical from './ContactQuestioningClinical';

const InteractedContactAccordion = (props: Props) => {
    const {errors, ...methods} = useFormContext();
    const classes = useStyles();

    const {
        interactedContact,
        index,
        contactStatuses,
        saveContact,
        parsePerson,
        isFamilyContact,
        familyRelationships,
        shouldDisable,
    } = props;

    const getAccordionClasses = () : string => {
        let classesList : string[] = [];
        classesList.push(classes.accordion);

        const formErrors = errors.form ? (errors.form[index] ? errors.form[index] : {}) : {};
        const formHasErrors = Object.entries(formErrors)
            .some(([key, value]) => value !== undefined);
    
        if(formHasErrors) {
            classesList.push(classes.errorAccordion)
        }
        return classesList.join(" ")
    }


    return (
        <div key={interactedContact.id}>
            <Accordion
                className={getAccordionClasses()}
                style={{ borderRadius: '3vw' }}
            >
                <AccordionSummary
                    test-id='contactLocation'
                    expandIcon={<ExpandMore />}
                    aria-controls='panel1a-content'
                    id='panel1a-header'
                    dir='ltr'
                >
                    <ContactQuestioningInfo
                        index={index}
                        interactedContact={interactedContact}
                        contactStatuses={contactStatuses}
                        saveContact={saveContact}
                        parsePerson={parsePerson}
                    />
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container justify='space-evenly'>
                        <ContactQuestioningPersonal
                            index={index}
                            interactedContact={interactedContact}
                        />
                        <Divider
                            orientation='vertical'
                            variant='middle'
                            light={true}
                        />
                        <ContactQuestioningClinical
                            index={index}
                            familyRelationships={
                                familyRelationships as FamilyRelationship[]
                            }
                            interactedContact={interactedContact}
                            isFamilyContact={isFamilyContact}
                        />
                        <Divider
                            orientation='vertical'
                            variant='middle'
                            light={true}
                        />
                        <ContactQuestioningCheck
                            index={index}
                            interactedContact={interactedContact}
                        />
                    </Grid>
                </AccordionDetails>
                <PrimaryButton
                    disabled={shouldDisable(interactedContact.contactStatus)}
                    test-id='saveContact'
                    onClick={() => {
                        const currentParsedPerson = parsePerson(
                            methods.getValues().form[index],
                            index
                        );
                        saveContact(currentParsedPerson);
                    }}
                >
                    שמור מגע
                </PrimaryButton>
            </Accordion>
        </div>
    );
};

export default InteractedContactAccordion;

interface Props {
    interactedContact: InteractedContact;
    index: number;
    contactStatuses: ContactStatus[];
    saveContact: (interactedContact: InteractedContact) => boolean;
    parsePerson: (person: InteractedContact, index: number) => InteractedContact;
    isFamilyContact: boolean;
    familyRelationships: FamilyRelationship[];
    shouldDisable: (status?: string | number | undefined) => boolean;
}
