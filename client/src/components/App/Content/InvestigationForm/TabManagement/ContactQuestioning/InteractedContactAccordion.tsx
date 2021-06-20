import React from 'react';
import { ExpandMore } from '@material-ui/icons';
import { useFormContext } from 'react-hook-form';
import {
    Accordion, AccordionDetails, AccordionSummary,
    AccordionActions, Divider, Grid, Collapse
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
import InteractedContactFields from 'models/enums/InteractedContact';
import ContactQuestioningPersonal from './ContactQuestioningPersonal';
import ContactQuestioningClinical from './ContactQuestioningClinical';

const InteractedContactAccordion = (props: Props) => {

    const { errors, watch, ...methods } = useFormContext<FormInputs>();

    const classes = useStyles();

    const {
        interactedContact, index, contactStatuses, saveContact, parsePerson,
        isFamilyContact, familyRelationships, shouldDisable, isViewMode
    } = props;

    const watchCurrentStatus: number = watch(`form[${index}].${InteractedContactFields.CONTACT_STATUS}`);

    const formErrors = errors?.form && errors?.form[index];

    const getAccordionClasses = (): string => {
        let classesList: string[] = [];
        classesList.push(classes.accordion);

        const formHasErrors = formErrors
            ? Object.entries(formErrors)
                .some(([key, value]) => (
                    value !== undefined
                ))
            : false

        if (formHasErrors) {
            classesList.push(classes.errorAccordion);
        }
        return classesList.join(' ');
    };

    const formValues = interactedContact;

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
                            isViewMode={isViewMode}
                        />
                    </AccordionSummary>
                    {/* <Collapse in={true}>
bla bla bla
                    </Collapse> */}
                    <AccordionDetails>
                        <Grid container wrap='nowrap'>
                            <ContactQuestioningPersonal
                                index={index}
                                interactedContact={interactedContact}
                                control={methods.control}
                                formValues={formValues}
                                trigger={methods.trigger}
                                currentFormErrors={formErrors}
                                watch={watch}
                                isViewMode={isViewMode}
                            />
                            <Divider
                                orientation='vertical'
                                variant='middle'
                                light={true}
                            />
                            <ContactQuestioningClinical
                                watch={watch}
                                index={index}
                                familyRelationships={
                                    familyRelationships as FamilyRelationship[]
                                }
                                interactedContact={interactedContact}
                                isFamilyContact={isFamilyContact}
                                control={methods.control}
                                formValues={formValues}
                                formErrors={formErrors}
                                trigger={methods.trigger}
                                contactStatus={watchCurrentStatus}
                                isViewMode={isViewMode}
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
                                isViewMode={isViewMode}
                            />
                        </Grid>
                    </AccordionDetails>
                    <AccordionActions className={classes.accordionActions}>
                        {!isViewMode && (
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
                        )}
                    </AccordionActions>
                </Accordion>
            </div>
        )
    }, [JSON.stringify(formValues), formErrors, contactStatuses]);

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
    isViewMode?: boolean;
};