import React, { useEffect } from 'react';
import { ExpandMore } from '@material-ui/icons';
import { DeepMap, FieldError, FormProvider, useForm, useFormContext } from 'react-hook-form';
import {
    Accordion, AccordionDetails, AccordionSummary,
    AccordionActions, Divider, Grid, Collapse
} from '@material-ui/core';
import { yupResolver } from '@hookform/resolvers';

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

import ContactQuestioningSchema from './ContactSection/Schemas/ContactQuestioningSchema';
import StoreStateType from 'redux/storeStateType';
import { useSelector } from 'react-redux';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';

const InteractedContactAccordion = (props: Props) => {

    const methods = useForm<GroupedInteractedContact>({
        mode: 'all',
        resolver: yupResolver(ContactQuestioningSchema),
    });


    const classes = useStyles();

    const {
        interactedContact, index, contactStatuses, saveContact, parsePerson,
        isFamilyContact, familyRelationships, shouldDisable, isViewMode
    } = props;

    const watchCurrentStatus: number = methods.watch(InteractedContactFields.CONTACT_STATUS);

    const { alertWarning } = useCustomSwal();
    
    const generateBackgroundColorClass = (colorCode: Number | any) => {
        switch (colorCode) {
            case '1':
                return classes.red;
            case '2':
                return classes.orange;
            case '3':
                return classes.green;
            case '4':
                return classes.yellow;
            default:
                return classes.white;
        }
    }

    const getAccordionClasses = (): string => {
        let classesList: string[] = [];
        classesList.push(classes.accordion);

        const colorCode = interactedContact.colorCode;
        classesList.push(generateBackgroundColorClass(colorCode))

        return classesList.join(' ');
    };

    useEffect(() => {
        if (watchCurrentStatus) {
            methods.trigger();
        }
    }, [watchCurrentStatus]);

    const formValues = interactedContact;

    const saveContactClicked = () => {
        const currentParsedPerson = parsePerson(
            interactedContact
        );
        saveContact(currentParsedPerson);
        if (methods.errors) {
            if ((methods.errors as DeepMap<InteractedContact, FieldError>)[InteractedContactFields.IDENTIFICATION_TYPE]) {
                alertWarning('שים לב במקרה של נתוני זיהוי כפולים, סוג הזיהוי לא יישמר לבסיס הנתונים. ');
            }
            else if ((methods.errors as DeepMap<InteractedContact, FieldError>)[InteractedContactFields.IDENTIFICATION_NUMBER]) {
                alertWarning('שים לב במקרה של נתוני זיהוי כפולים, מספר תעודה לא יישמר לבסיס הנתונים. ');
            }
        }
    };
    const getAccordion =
        () => {
            return (
                <FormProvider {...methods}>
                    <form
                        id={`form-${interactedContact.id}`} >

                        <Accordion
                            className={getAccordionClasses()}
                            style={{ borderRadius: '3vw' }}
                            TransitionProps={{ unmountOnExit: true }}
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
                            <AccordionDetails>
                                <Grid container wrap='nowrap'>
                                    <ContactQuestioningPersonal
                                        interactedContact={interactedContact}
                                        isViewMode={isViewMode}
                                    />
                                    <Divider
                                        orientation='vertical'
                                        variant='middle'
                                        light={true}
                                    />
                                    <ContactQuestioningClinical
                                        familyRelationships={
                                            familyRelationships as FamilyRelationship[]
                                        }
                                        interactedContact={interactedContact}
                                        isFamilyContact={isFamilyContact}
                                        isViewMode={isViewMode}
                                    />
                                    <Divider
                                        orientation='vertical'
                                        variant='middle'
                                        light={true}
                                    />
                                    <ContactQuestioningCheck
                                        interactedContact={interactedContact}
                                        isViewMode={isViewMode}
                                    />
                                </Grid>
                            </AccordionDetails>
                            <AccordionActions className={classes.accordionActions}>
                                {!isViewMode && (
                                    <PrimaryButton
                                        disabled={shouldDisable(watchCurrentStatus)}
                                        test-id='saveContact'
                                        onClick={() => saveContactClicked()}
                                    >
                                        שמור מגע
                                    </PrimaryButton>
                                )}
                            </AccordionActions>
                        </Accordion>
                    </form>
                </FormProvider>
            )
        }

    return (
        getAccordion()
    );
};

export default InteractedContactAccordion;

interface Props {
    interactedContact: GroupedInteractedContact;
    index: number;
    contactStatuses: ContactStatus[];
    saveContact: (interactedContact: InteractedContact) => boolean;
    parsePerson: (person: GroupedInteractedContact) => InteractedContact;
    isFamilyContact: boolean;
    familyRelationships: FamilyRelationship[];
    shouldDisable: (status?: string | number | undefined) => boolean;
    isViewMode?: boolean;
};