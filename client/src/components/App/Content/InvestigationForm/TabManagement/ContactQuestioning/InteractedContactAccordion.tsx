import React, { useEffect } from 'react';
import { ExpandMore } from '@material-ui/icons';
import { useFormContext } from 'react-hook-form';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    AccordionActions,
    Divider,
    Grid,
} from '@material-ui/core';

import ContactStatus from 'models/ContactStatus';
import InteractedContact from 'models/InteractedContact';
import FamilyRelationship from 'models/FamilyRelationship';
import PrimaryButton from 'commons/Buttons/PrimaryButton/PrimaryButton';
import GroupedInteractedContact from 'models/ContactQuestioning/GroupedInteractedContact';

import useStyles from './ContactQuestioningStyles';
import { FormInputs } from './ContactQuestioningInterfaces';
import ContactQuestioningInfo from './ContactQuestioningInfo';
import ContactQuestioningCheck from './ContactQuestioningCheck';
import ContactQuestioningPersonal from './ContactQuestioningPersonal';
import ContactQuestioningClinical from './ContactQuestioningClinical';
import InteractedContactFields from 'models/enums/InteractedContact';

const InteractedContactAccordion = (props: Props) => {
    const {errors, watch, ...methods} = useFormContext<FormInputs>();

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

    const watchCurrentStatus: number = watch(`form[${index}].${InteractedContactFields.CONTACT_STATUS}`)

    const formErrors = errors?.form && errors?.form[index];

    const getAccordionClasses = () : string => {
        let classesList : string[] = [];
        classesList.push(classes.accordion);
        
        const formHasErrors = formErrors 
            ? Object.entries(formErrors)
                .some(([key, value]) => (
                    value !== undefined
                ))
            : false
    
        if(formHasErrors) {
            classesList.push(classes.errorAccordion);
        }
        return classesList.join(" ");
    }

    const formValues = methods.getValues().form
        ? methods.getValues().form[index]
        : interactedContact;

    const getAccordion = React.useMemo(() => {
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
                                control={methods.control}
                                formValues={formValues}
                                trigger={methods.trigger}
                                currentFormErrors={formErrors}
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
                                control={methods.control}
                                formValues={formValues}
                                formErrors={formErrors}
                            />
                            <Divider
                                orientation='vertical'
                                variant='middle'
                                light={true}
                            />
                            <ContactQuestioningCheck
                                index={index}
                                interactedContact={interactedContact}
                                formErrors={formErrors}
                                control={methods.control}
                                contactStatus={watchCurrentStatus}
                            />
                        </Grid>
                    </AccordionDetails>
                    <AccordionActions className={classes.accordionActions}>
                        <PrimaryButton
                            disabled={shouldDisable(watchCurrentStatus)}
                            test-id='saveContact'
                            onClick={() => {
                                const currentParsedPerson = parsePerson(
                                    methods.getValues().form[index] as GroupedInteractedContact,
                                    index
                                );
                                saveContact(currentParsedPerson);
                            }}
                        >
                            שמור מגע
                        </PrimaryButton>
                    </AccordionActions>
                </Accordion>
            </div>
        )
    } , [JSON.stringify(formValues)]);

    return (
        getAccordion
    );
};

export default InteractedContactAccordion;

interface Props {
    interactedContact: GroupedInteractedContact;
    index: number;
    contactStatuses: ContactStatus[];
    saveContact: (interactedContact: InteractedContact) => boolean;
    parsePerson: (person: GroupedInteractedContact, index: number) => InteractedContact;
    isFamilyContact: boolean;
    familyRelationships: FamilyRelationship[];
    shouldDisable: (status?: string | number | undefined) => boolean;
}
